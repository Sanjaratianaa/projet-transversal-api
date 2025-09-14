create database mesfactures;

-- ===============================
--   Projet MesFactures - PostgreSQL
-- ===============================

-- ==============
-- Utilisateurs & Rôles
-- ==============
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenoms VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(50),
    langue VARCHAR(20),
    date_creation TIMESTAMP DEFAULT NOW(),
    statut VARCHAR(50)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL
);

CREATE TABLE user_roles (
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    id_role INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_role)
);

CREATE TABLE role_permissions (
    id_role INT REFERENCES roles(id) ON DELETE CASCADE,
    id_perm INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (id_role, id_perm)
);

CREATE TABLE historique_actions (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type_action VARCHAR(100),
    date_action TIMESTAMP DEFAULT NOW(),
    details TEXT
);

-- ==============
-- Factures & Dépenses
-- ==============
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('revenu','depense'))
);

CREATE TABLE factures (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    fournisseur VARCHAR(100),
    type_facture VARCHAR(50),
    montant DECIMAL(12,2),
    date_emission DATE,
    date_echeance DATE,
    statut VARCHAR(50),
    moyen_paiement VARCHAR(50)
);

CREATE TABLE depenses (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    id_cat INT REFERENCES categories(id),
    description TEXT,
    montant DECIMAL(12,2),
    date_depense DATE,
    type_depense VARCHAR(50),
    statut VARCHAR(50)
);

-- ==============
-- Revenus & Prêts
-- ==============
CREATE TABLE revenus (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    source VARCHAR(100),
    montant DECIMAL(12,2),
    date_revenu DATE,
    mode VARCHAR(50)
);

CREATE TABLE prets (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    crediteur VARCHAR(100),
    montant DECIMAL(12,2),
    taux_interet DECIMAL(5,2),
    date_pret DATE,
    echeance DATE,
    statut VARCHAR(50)
);

CREATE TABLE remboursements (
    id SERIAL PRIMARY KEY,
    id_pret INT REFERENCES prets(id) ON DELETE CASCADE,
    montant DECIMAL(12,2),
    date_remb DATE,
    statut VARCHAR(50)
);

-- ==============
-- Objectifs & Recommandations
-- ==============
CREATE TABLE objectifs (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    libelle VARCHAR(150),
    montant_total DECIMAL(12,2),
    montant_actuel DECIMAL(12,2) DEFAULT 0,
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(50)
);

CREATE TABLE recommandations (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    description TEXT,
    type VARCHAR(50),
    date_creation TIMESTAMP DEFAULT NOW()
);

-- ==============
-- Notifications & Sauvegarde
-- ==============
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50),
    message TEXT,
    date_notif TIMESTAMP DEFAULT NOW(),
    statut VARCHAR(50)
);

CREATE TABLE parametres_notif (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    canal VARCHAR(50), -- sms, email, push
    frequence VARCHAR(50)
);

CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50), -- mobile, web, desktop
    statut VARCHAR(50),
    last_sync TIMESTAMP
);

CREATE TABLE sauvegardes (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    date_save TIMESTAMP DEFAULT NOW(),
    type VARCHAR(50) -- locale, cloud
);

-- ==============
-- Gamification
-- ==============
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100),
    description TEXT
);

CREATE TABLE user_badges (
    id_user INT REFERENCES utilisateurs(id) ON DELETE CASCADE,
    id_badge INT REFERENCES badges(id) ON DELETE CASCADE,
    date_obtention DATE,
    PRIMARY KEY (id_user, id_badge)
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES utilisateurs(id),
    id_cat INT REFERENCES categories(id),
    montant_limite DECIMAL(12,2),
    periode VARCHAR(20) -- mensuel, annuel
);

CREATE TABLE fichiers (
    id SERIAL PRIMARY KEY,
    id_facture INT REFERENCES factures(id),
    chemin_fichier TEXT,
    type_mime VARCHAR(50)
);