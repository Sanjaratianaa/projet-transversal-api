/c mesfactures

INSERT INTO "Role" (libelle, etat) VALUES
('Admin', 'Actif'),
('Utilisateur', 'Actif'),
('Comptable', 'Actif');

INSERT INTO "Utilisateur" (nom, prenoms, email, "motDePasse", telephone, langue, statut)
VALUES
('Rakoto', 'Layah', 'layah@gmail.com', '$2b$10$fMCi3IqISY/HH5DC9StsiuMnUFlOKVcRDzVxebpP01aghit7WgSuO', '0341234567', 'fr', 'Active'),
('Rabe', 'Hery', 'hery@gmail.com', '$2b$10$abcdefgHIJKLMNOPQRSTUVWX', '0339876543', 'fr', 'Active'),
('Andrian', 'Mina', 'mina@gmail.com', '$2b$10$abcdefgHIJKLMNOPQRSTUVWX', '0325556667', 'fr', 'Active'),
('Rasoa', 'Tiana', 'tiana@gmail.com', '$2b$10$abcdefgHIJKLMNOPQRSTUVWX', '0311122334', 'fr', 'Inactive'),
('Rakotomalala', 'Faly', 'faly@gmail.com', '$2b$10$abcdefgHIJKLMNOPQRSTUVWX', '0329988776', 'fr', 'Active');

INSERT INTO "UtilisateurRole" (utilisateurId, roleId) VALUES
(1, 2),  -- Layah est un Utilisateur
(2, 2),  -- Hery est un Utilisateur
(3, 2),  -- Mina est un Utilisateur
(4, 2),  -- Tiana est un Utilisateur
(5, 1);  -- Faly est un Admin

-- Insertion des catégories de revenu
-- Insertion des catégories de revenus
INSERT INTO "Categorie" (libelle, type) VALUES
('Salaire', 'revenu'),
('Prime', 'revenu'),
('Freelance', 'revenu'),
('Investissements', 'revenu'),
('Dividendes', 'revenu'),
('Intérêts bancaires', 'revenu'),
('Location immobilière', 'revenu'),
('Vente d''objets', 'revenu'),
('Remboursements', 'revenu'),
('Allocations familiales', 'revenu'),
('Pension de retraite', 'revenu'),
('Indemnités chômage', 'revenu'),
('Bourses d''études', 'revenu'),
('Cadeaux en argent', 'revenu'),
('Revenus exceptionnels', 'revenu'),
('Revenus agricoles', 'revenu'),
('Droits d''auteur', 'revenu'),
('Commissions', 'revenu'),
('Revenus de crypto-monnaies', 'revenu'),
('Revenus de formations', 'revenu');

-- Insertion des catégories de dépenses
INSERT INTO "Categorie" (libelle, type) VALUES
('Alimentation', 'depense'),
('Logement', 'depense'),
('Transport', 'depense'),
('Sante', 'depense'),
('Education', 'depense'),
('Vetements', 'depense'),
('Loisirs', 'depense'),
('Restaurant', 'depense'),
('Assurances', 'depense'),
('Impots', 'depense'),
('Epargne', 'depense'),
('Credits', 'depense'),
('Energie', 'depense'),
('Internet/Telephone', 'depense'),
('Abonnements', 'depense'),
('Cadeaux', 'depense'),
('Voyage', 'depense'),
('Animaux', 'depense'),
('Entretien maison', 'depense'),
('Frais bancaires', 'depense'),
('Produits de beauté', 'depense'),
('Sport', 'depense'),
('Culture', 'depense'),
('Essence', 'depense'),
('Parking', 'depense'),
('Reparations', 'depense'),
('Medecin', 'depense'),
('Pharmacie', 'depense'),
('Courses', 'depense'),
('Depenses exceptionnelles', 'depense');

INSERT INTO "Objectif" ("utilisateurId", "libelle", "montantTotal", "montantActuel", "dateDebut", "dateFin", "statut")
VALUES
(1, 'Voyage à Madagascar', 1500000.00, 500000.00, '2025-09-01', '2025-09-30', 'En cours'),
(1, 'Nouvel ordinateur', 2500000.00, 1250000.00, '2025-09-05', '2025-10-05', 'En cours'),
(1, 'Formation React', 500000.00, 200000.00, '2025-09-10', '2025-09-20', 'En cours'),
(1, 'Réparations maison', 800000.00, 0.00, '2025-09-12', '2025-09-30', 'En attente');
