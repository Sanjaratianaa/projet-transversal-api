const mongoose = require("mongoose");
const Conge = require("../../models/utilisateur/Conge");

// Create a new Conge
exports.createConge = async (req, res) => {
    try {
        const data = req.body;
        data.mecanicien = req.user.idPersonne;

        const today = new Date();
        const dateHeureDebut = new Date(data.dateHeureDebut); // Conversion en Date
        const dateHeureFin = new Date(data.dateHeureFin); // Conversion en Date

        console.log(dateHeureDebut + " < ? " + today);

        if (dateHeureDebut < today)
            throw new Error(`La date et l'heure de début sont invalides. Elles doivent être postérieures ou égales à la date et l'heure actuelles.`);

        if (dateHeureFin < today)
            throw new Error(`La date et l'heure de fin sont invalides. Elles doivent être postérieures ou égales à la date et l'heure actuelles.`);

        if (dateHeureFin < dateHeureDebut)
            throw new Error(`La date et l'heure de début sont invalides. Elles doivent être antérieures ou égales à la date et l'heure de fin.`);

        const congeSave = new Conge(data);
        congeSave.etat = "en attente";
        await congeSave.save();

        const conge = await Conge.findById(congeSave._id)
            .populate("mecanicien")
            .populate("validateur")
            .sort({ dateHeureDemande: -1 });

        console.log(conge);

        res.status(201).json(conge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Conge
exports.getAllConge = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "mécanicien")
            query = {
                $or: [
                    { mecanicien: req.user.idPersonne },
                    {
                        mecanicien: { $ne: req.user.idPersonne },
                        etat: { $in: ["en attente", "validé"] },
                    },
                ],
            };

        const congeList = await Conge.find(query)
            .populate("mecanicien")
            .populate("validateur")
            .sort({ dateHeureDemande: -1 })
            .lean();
        res.json(congeList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a Conge by ID
exports.getCongeById = async (req, res) => {
    try {
        const conge = await Conge.findById(req.params.id)
            .populate('mecanicien')
            .populate("validateur");
        if (!conge) {
            return res.status(404).json({ message: "Conge not found" });
        }
        res.json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateConge = async (req, res) => {
    try {
        const conge = await Conge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('mecanicien')
            .populate("validateur");

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        res.json(conge);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// function globale
async function getConge(query, res) {
    try {
        const conge = await Conge.find(query)
            .populate('mecanicien')
            .populate("validateur")
            .sort({ dateHeureDemande: -1 });
        res.status(200).json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des congés.",
        });
    }
}

// prendre conge par etat
exports.getListCongeByEtat = async (req, res) => {
    try {
        var query = {};
        if (req.user.role.libelle == "mécanicien")
            query = { mecanicien: req.user.idPersonne };

        const etat = req.params.etat;
        const etatsValides = ["en attente", "validé", "rejeté", "annulé"];
        if (!etatsValides.includes(etat)) {
            throw new Error("État du congé invalide.");
        }
        query.etat = etat;
        await getConge(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur lors de la récupération des congés.",
        });
    }
};

// prendre conge par mecanicien
exports.getListCongeByMecanicien = async (req, res) => {
    try {
        const mecanicienId = req.user.idPersonne;
        var query = {};
        if (req.user.role.libelle == "mécanicien")
            query = { mecanicien: mecanicienId };

        if (!mongoose.Types.ObjectId.isValid(mecanicienId)) {
            throw new Error("ID de mecanicien invalide.");
        }

        await getConge(query, res); // Utiliser la fonction utilitaire
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                error.message,
        });
    }
};

exports.modifierConge = async (req, res) => {
    try {
        const congeId = req.params.id;
        const action = req.body.action;
        const commentaire = req.body.commentaire;

        if (!mongoose.Types.ObjectId.isValid(congeId)) {
            throw new Error("ID de congés invalide.");
        }

        let updates = {};
        let hasUpdates = false;

        const actionsValides = ['validé', 'rejeté', 'annulé'];

        if (!actionsValides.includes(action)) {
            throw new Error(`Action invalide : ${action}.`);
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
                const conge = await Conge.findById(congeId);
                const today = new Date();
                const dateHeureDebut = conge.dateHeureDebut; // Conversion en Date
                const dateHeureFin = conge.dateHeureFin; // Conversion en Date

                console.log(dateHeureDebut + " < ? " + today);
                console.log(dateHeureFin + " < ? " + today);

                const formattedDateDebut = new Intl.DateTimeFormat('fr-FR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(new Date(dateHeureDebut));

                const formattedDateFin = new Intl.DateTimeFormat('fr-FR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }).format(new Date(dateHeureDebut));

                if (dateHeureDebut < today)
                    throw new Error(`La demande de  congés n'est plus valide, car la date et l'heure debut (${formattedDateDebut}) demandées sont déjà passées.`);

                if (dateHeureFin < today)
                    throw new Error(`La demande de  congés n'est plus valide, car la date et l'heure fin (${formattedDateFin}) demandées sont déjà passées.`);

                updates.etat = "validé";
                updates.validateur = req.user.idPersonne;
                updates.remarque = commentaire;
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
        }


        // Mettre à jour le congés (seulement s'il y a des mises à jour)
        let congeMisAJour;
        if (hasUpdates) {
            congeMisAJour = await Conge.findByIdAndUpdate(
                congeId,
                updates,
                { new: true },
            );

            if (!congeMisAJour) {
                throw new Error("Conge non trouvé.");
            }
        }
        await getConge({ _id: congeId }, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};