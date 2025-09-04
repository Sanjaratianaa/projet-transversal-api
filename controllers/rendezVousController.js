const mongoose = require("mongoose");
const RendezVous = require("../models/RendezVous");
const PrixPieceController = require('./prix/prixPieceController'); 
const PromotionController = require('./promotionController');
const GestionStock = require('../models/stock/GestionStock');
const {getResteStock} = require("./stock/gestionStockController");

// Create a new RendezVous
exports.createRendezVous = async (req, res) => {
    try {
        const data = req.body;
        data.client = req.user.idPersonne;

        const today = new Date();
        const dateToCheck = new Date(data.dateRendezVous); // Conversion en Date

        console.log(dateToCheck + " < ? " + today);

        if (dateToCheck < today)
            throw new Error(
                `Date et heure du rendez-vous invalide. La Date et heure du rendez-vous doit être supérieure ou égale à la date et heure du jour.`,
            );

        if (
            !data.client ||
            !data.voiture ||
            !data.services ||
            !data.dateRendezVous
        ) {
            throw new Error(
                "Les champs client, voiture et date du Rendez-vous sont obligatoires.",
            );
        }

        for(const service of data.services) {
            const remise = await PromotionController.getPromotionDuJour(service.sousSpecialite, data.dateRendezVous);
            service.remise = remise;
        }

        const rendezVousSave = new RendezVous(data);
        rendezVousSave.etat = "en attente";
        await rendezVousSave.save();

        const rendezVous = await RendezVous.findById(rendezVousSave._id)
            .populate("client")
            .populate({
                path: "voiture",
                populate: [
                    { path: "marque" },
                    { path: "modele" },
                    { path: "categorie" },
                    { path: "typeTransmission" },
                ],
            })
            .populate({
                path: "services",
                populate: [
                    {
                        path: "sousSpecialite",
                        model: "SousService",
                        populate: {
                            path: "service",
                            model: "Service",
                        },
                    },
                    { path: "mecanicien", model: "Personne" },
                ],
            })
            .sort({ dateHeureDemande: -1 });

        console.log(rendezVous);

        res.status(201).json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all RendezVous
exports.getAllRendezVous = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "client")
            query = {
                $or: [
                    { client: req.user.idPersonne },
                    {
                        client: { $ne: req.user.idPersonne },
                        etat: { $in: ["en attente", "validé"] },
                    },
                ],
            };
        else if (req.user.role.libelle == "mécanicien")
            query = { etat: { $in: ["en attente", "validé"] } };

        const rendezVousList = await RendezVous.find(query)
            .populate("client")
            .populate({
                path: "voiture",
                populate: [
                    { path: "marque" },
                    { path: "modele" },
                    { path: "categorie" },
                    { path: "typeTransmission" },
                ],
            })
            .populate({
                path: "services",
                populate: [
                    {
                        path: "sousSpecialite",
                        model: "SousService",
                        populate: {
                            path: "service",
                            model: "Service",
                        },
                    },
                    { path: "mecanicien", model: "Personne" },
                ],
            })
            .populate("validateur")
            .populate({
                path: "piecesAchetees",
                populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
            })
            .sort({ dateHeureDemande: -1 })
            .lean();
        res.json(rendezVousList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a RendezVous by ID
exports.getRendezVousById = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findById(req.params.id)
            .populate('client')
            .populate({
                path: 'voiture',
                populate: [
                    { path: 'marque' },
                    { path: 'modele' },
                    { path: 'categorie' },
                    { path: 'typeTransmission' }
                ]
            })
            .populate({
                path: 'services',
                populate: [
                    {
                        path: 'sousSpecialite',
                        model: 'SousService',
                        populate: {
                            path: 'service',
                            model: 'Service'
                        }
                    },
                    { path: 'mecanicien', model: 'Personne' }
                ]
            })
            .populate('validateur')
            .populate({
                path: "piecesAchetees",
                populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
            });
        if (!rendezVous) {
            return res.status(404).json({ message: "RendezVous not found" });
        }
        res.json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update a RendezVous
// exports.updateRendezVous = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateData = req.body;

//         const rendezVous = await RendezVous.findById(id);

//         if (!rendezVous) {
//             return res.status(404).json({ message: 'Rendez-vous not found' });
//         }

//         const topLevelFields = ['client', 'voiture', 'dateHeureDemande', 'dateRendezVous', 'heureDebut', 'heureFin', 'remarque', 'validateur', 'etat'];

//         for (const key of topLevelFields) {
//             if (updateData.hasOwnProperty(key)) {
//                 rendezVous.set(key, updateData[key]);
//             }
//         }

//         if (updateData.services && Array.isArray(updateData.services)) {
//             updateData.services.forEach(serviceUpdate => {
//                 if (serviceUpdate._id) {
//                     const serviceToUpdate = rendezVous.services.id(serviceUpdate._id);
//                     if (serviceToUpdate) {
//                         Object.assign(serviceToUpdate, serviceUpdate);
//                         console.log(`Updated service with _id: ${serviceUpdate._id}`);
//                     } else {
//                         console.warn(`Service with _id ${serviceUpdate._id} provided but not found in RendezVous ${id}. Skipping update for this item.`);
//                     }
//                 } else {
//                     rendezVous.services.push(serviceUpdate);
//                     console.log('Added new service:', serviceUpdate);
//                 }
//             });
//         }

//         if (updateData.addPiecesAchetees && Array.isArray(updateData.addPiecesAchetees)) {
//             const piecesToAdd = updateData.addPiecesAchetees.filter(p => typeof p === 'object' && p !== null);
//             if (piecesToAdd.length > 0) {
//                 rendezVous.piecesAchetees.push(...piecesToAdd);
//                 console.log(`Added ${piecesToAdd.length} items to piecesAchetees.`);
//             }
//         }

//         const savedRendezVous = await rendezVous.save();

//         const populatedRendezVous = await RendezVous.findById(savedRendezVous._id)
//             .populate('client')
//             .populate({
//                 path: 'voiture',
//                 populate: [
//                     { path: 'marque' },
//                     { path: 'modele' },
//                     { path: 'categorie' },
//                     { path: 'typeTransmission' }
//                 ]
//             })
//             .populate({
//                 path: 'services',
//                 populate: [
//                     {
//                         path: 'sousSpecialite',
//                         model: 'SousService',
//                         populate: {
//                             path: 'service',
//                             model: 'Service'
//                         }
//                     },
//                     { path: 'mecanicien', model: 'Personne' }
//                 ]
//             })
//             .populate('validateur')
//             .populate({
//                 path: "piecesAchetees",
//                 populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
//             });

//         res.json(populatedRendezVous);

//     } catch (error) {
//         console.error("Error updating RendezVous:", error);
//         if (error.name === 'ValidationError') {
//              return res.status(400).json({ message: "Validation Error", errors: error.errors });
//         }
//         res.status(400).json({ message: error.message || "An error occurred during the update." });
//     }
// };

// Update a RendezVous
exports.updateRendezVous = async (req, res) => {
    try {
        const rendezVous = await RendezVous.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('client')
            .populate({
                path: 'voiture',
                populate: [
                    { path: 'marque' },
                    { path: 'modele' },
                    { path: 'categorie' },
                    { path: 'typeTransmission' }
                ]
            })
            .populate({
                path: 'services',
                populate: [
                    {
                        path: 'sousSpecialite',
                        model: 'SousService',
                        populate: {
                            path: 'service',
                            model: 'Service'
                        }
                    },
                    { path: 'mecanicien', model: 'Personne' }
                ]
            })
            .populate('validateur')
            .populate({
                path: "piecesAchetees",
                populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
            });

        if (!rendezVous) {
            return res.status(404).json({ message: 'Rendez-vous not found' });
        }

        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// function globale
async function getRendezVous(query, res) {
    try {
        const rendezVous = await RendezVous.find(query)
            .populate("client")
            .populate({
                path: "voiture",
                populate: [
                    { path: "marque" },
                    { path: "modele" },
                    { path: "categorie" },
                    { path: "typeTransmission" },
                ],
            })
            .populate({
                path: "services",
                populate: [
                    {
                        path: "sousSpecialite",
                        model: "SousService",
                        populate: {
                            path: "service",
                            model: "Service",
                        },
                    },
                    { path: "mecanicien", model: "Personne" },
                ],
            })
            .populate("validateur")
            .populate({
                path: "piecesAchetees",
                populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
            })
            .sort({ dateHeureDemande: -1 });
        res.status(200).json(rendezVous);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des rendez-vous.",
        });
    }
}

// prendre rendezVous par etat
exports.getListRendezVousByEtat = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "client")
            query = { client: req.user.idPersonne };

        const etat = req.params.etat;
        const etatsValides = ["en attente", "validé", "rejeté", "annulé"];
        if (!etatsValides.includes(etat)) {
            return res
                .status(400)
                .json({ message: "État de rendez-vous invalide." });
        }
        query.etat = etat;
        await getRendezVous(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des rendez-vous.",
        });
    }
};

// prendre rendezVous par client
exports.getListRendezVousByClient = async (req, res) => {
    try {
        const clientId = req.user.idPersonne;
        var query = {};
        if (req.user.role.libelle == "client") query = { client: clientId };

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "ID de client invalide." });
        }

        await getRendezVous(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                "Erreur serveur lors de la récupération des rendez-vous pour un client.",
        });
    }
};

// prendre rendezVous par mecanicien
exports.getListRendezVousByMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.idPersonne;

        var query = {};
        if (req.user.role.libelle == "client") query = { client: req.user.idPersonne, etat: { $in: ["en attente", "validé", "terminé"] }};
        else if (req.user.role.libelle == "mécanicien") query = { "services.mecanicien": req.user.idPersonne };

        if (!mongoose.Types.ObjectId.isValid(mecanicienId)) {
            return res
                .status(400)
                .json({ message: "ID de mécanicien invalide." });
        }

        await getRendezVous(query, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                "Erreur serveur lors de la récupération des rendez-vous par mécanicien.",
        });
    }
};

exports.modifierRendezVous = async (req, res) => {
    try {
        const rendezVousId = req.params.id;
        const actions = req.body.actions;

        if (!mongoose.Types.ObjectId.isValid(rendezVousId)) {
            throw new Error("ID de rendez-vous invalide.");
        }

        if (!Array.isArray(actions)) {
            throw new Error("Les actions doivent être un tableau.");
        }

        let updates = {};
        let hasUpdates = false;

        for (const actionObj of actions) {
            const action = actionObj.action;
            const { nouveauMecanicienId, commentaire, services } = actionObj;

            const actionsValides = ['validé', 'rejeté', 'assignerMecanicien', 'annulé'];

            if (!actionsValides.includes(action)) {
                return res
                    .status(400)
                    .json({ message: `Action invalide : ${action}.` });
            }

            switch (action) {
                case 'annulé':
                    if (!commentaire) {
                        throw new Error("La raison de l'annulation est obligatoire.");
                    }
                    updates.etat = 'annulé';
                    updates.remarque = commentaire;
                    hasUpdates = true;
                    break;

                case 'validé':
                    const rendezVous = await RendezVous.findById(rendezVousId);
                    const today = new Date();
                    const dateToCheck = rendezVous.dateRendezVous; // Conversion en Date

                    console.log(dateToCheck + " < ? " + today);

                    const formattedDate = new Intl.DateTimeFormat('fr-FR', { 
                        weekday: 'long', 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                    }).format(new Date(dateToCheck));

                    if (dateToCheck < today)
                        throw new Error(`La demande de  rendez-vous n'est plus valide, car la date et l'heure (${formattedDate}) demandées sont déjà passées.`);

                    if (!services) {
                        throw new Error(
                            "L'assignation d'au moins un mécanicien est obligatoire pour poursuivre.",
                        );
                    }

                    for (const service of services) {
                        service.mecanicien = service.mecanicien.personne._id;
                    }

                    updates.etat = "validé";
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
                    updates.services = services;
                    hasUpdates = true;
                    break;

                case "rejeté":
                    if (!commentaire) {
                        throw new Error("La raison du rejet est obligatoire.");
                    }
                    updates.etat = "rejeté";
                    updates.validateur = req.user.idPersonne;
                    updates.remarque = commentaire;
                    hasUpdates = true;
                    break;

                case "assignerMecanicien":
                    if (!mongoose.Types.ObjectId.isValid(nouveauMecanicienId)) {
                        return res
                            .status(400)
                            .json({ message: "ID de mécanicien invalide." });
                    }
                    updates["services.$[].mecanicien"] = nouveauMecanicienId;
                    hasUpdates = true;
                    break;
            }
        }

        // Mettre à jour le rendez-vous (seulement s'il y a des mises à jour)
        let rendezVousMisAJour;
        if (hasUpdates) {
            rendezVousMisAJour = await RendezVous.findByIdAndUpdate(
                rendezVousId,
                updates,
                { new: true },
            );

            if (!rendezVousMisAJour) {
                throw new Error("Rendez-vous non trouvé.");
            }
        }
        await getRendezVous({ _id: rendezVousId }, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ajout d'un piece
exports.addPieceRendezVous = async (req, res) => {
    try {
        const pieceData = {
            ...req.body,
        };

        if (pieceData.quantite < 0)
            throw new Error(`Quantité invalide. Le quantité doit etre superieur à zero.`);
        
        const reste = await getResteStock(pieceData.piece, pieceData.marquePiece, pieceData.marqueVoiture, pieceData.modeleVoiture, pieceData.typeTransmission);
        if(Number(reste) < pieceData.quantite) {
            throw new Error(`L'achat du piece ne peut pas etre effectué. Le reste en stocks est ${reste}.`);
        }

        const prix = await PrixPieceController.getPrixPiece(pieceData.piece, pieceData.marquePiece, pieceData.marqueVoiture, pieceData.modeleVoiture, pieceData.typeTransmission);

        pieceData.prixUnitaire = prix;
        pieceData.prixTotal = prix * pieceData.quantite;

        console.log(pieceData);

        const _rendezVous = await RendezVous.findById(req.params.id);

        if(_rendezVous.piecesAchetees == null) 
            _rendezVous.piecesAchetees = [];
        _rendezVous.piecesAchetees.push(pieceData);

        const gestionStockData = pieceData;
        gestionStockData.sortie = pieceData.quantite;  
        gestionStockData.manager = req.user.id;

        const gestionStockSave = new GestionStock(gestionStockData);
        await gestionStockSave.save();

        const rendezVous = await RendezVous.findByIdAndUpdate(
            req.params.id,
            _rendezVous,
            { new: true }
        )
            .populate('client')
            .populate({
                path: 'voiture',
                populate: [
                    { path: 'marque' },
                    { path: 'modele' },
                    { path: 'categorie' },
                    { path: 'typeTransmission' }
                ]
            })
            .populate({
                path: 'services',
                populate: [
                    {
                        path: 'sousSpecialite',
                        model: 'SousService',
                        populate: {
                            path: 'service',
                            model: 'Service'
                        }
                    },
                    { path: 'mecanicien', model: 'Personne' }
                ]
            })
            .populate('validateur')
            .populate({
                path: "piecesAchetees",
                populate: ["piece", "marqueVoiture", "modeleVoiture", "typeTransmission"],
            });

        if (!rendezVous) {
            return res.status(404).json({ message: 'Rendez-vous not found' });
        }

        res.json(rendezVous);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
