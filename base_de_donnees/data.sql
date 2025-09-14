/c mesfactures

INSERT INTO "Role" (libelle, etat) VALUES
('Admin', 'Actif'),
('Utilisateur', 'Actif'),
('Comptable', 'Actif');

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