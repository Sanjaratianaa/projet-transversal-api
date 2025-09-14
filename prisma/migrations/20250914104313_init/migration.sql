-- CreateTable
CREATE TABLE "public"."Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100),
    "prenoms" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "motDePasse" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(50),
    "langue" VARCHAR(20),
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" VARCHAR(50),

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,
    "etat" VARCHAR(50),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UtilisateurRole" (
    "utilisateurId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UtilisateurRole_pkey" PRIMARY KEY ("utilisateurId","roleId")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "public"."HistoriqueAction" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "typeAction" VARCHAR(100),
    "dateAction" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "HistoriqueAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categorie" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Facture" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "fournisseur" VARCHAR(100),
    "typeFacture" VARCHAR(50),
    "montant" DECIMAL(12,2),
    "dateEmission" TIMESTAMP(3),
    "dateEcheance" TIMESTAMP(3),
    "statut" VARCHAR(50),
    "moyenPaiement" VARCHAR(50),

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Depense" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "categorieId" INTEGER,
    "description" TEXT,
    "montant" DECIMAL(12,2),
    "dateDepense" TIMESTAMP(3),
    "typeDepense" VARCHAR(50),
    "statut" VARCHAR(50),

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Revenu" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "source" VARCHAR(100),
    "montant" DECIMAL(12,2),
    "dateRevenu" TIMESTAMP(3),
    "mode" VARCHAR(50),

    CONSTRAINT "Revenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pret" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "crediteur" VARCHAR(100),
    "montant" DECIMAL(12,2),
    "tauxInteret" DECIMAL(5,2),
    "datePret" TIMESTAMP(3),
    "echeance" TIMESTAMP(3),
    "statut" VARCHAR(50),

    CONSTRAINT "Pret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Remboursement" (
    "id" SERIAL NOT NULL,
    "pretId" INTEGER NOT NULL,
    "montant" DECIMAL(12,2),
    "dateRemb" TIMESTAMP(3),
    "statut" VARCHAR(50),

    CONSTRAINT "Remboursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Objectif" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "libelle" VARCHAR(150),
    "montantTotal" DECIMAL(12,2),
    "montantActuel" DECIMAL(12,2) DEFAULT 0,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "statut" VARCHAR(50),

    CONSTRAINT "Objectif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Recommandation" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50),
    "dateCreation" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recommandation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "type" VARCHAR(50),
    "message" TEXT,
    "dateNotif" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "statut" VARCHAR(50),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParametreNotif" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "canal" VARCHAR(50),
    "frequence" VARCHAR(50),

    CONSTRAINT "ParametreNotif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Device" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "type" VARCHAR(50),
    "statut" VARCHAR(50),
    "lastSync" TIMESTAMP(3),

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sauvegarde" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "dateSave" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "type" VARCHAR(50),

    CONSTRAINT "Sauvegarde_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Badge" (
    "id" SERIAL NOT NULL,
    "libelle" VARCHAR(100),
    "description" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserBadge" (
    "utilisateurId" INTEGER NOT NULL,
    "badgeId" INTEGER NOT NULL,
    "dateObtention" TIMESTAMP(3),

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("utilisateurId","badgeId")
);

-- CreateTable
CREATE TABLE "public"."Budget" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "categorieId" INTEGER,
    "montantLimite" DECIMAL(12,2),
    "periode" VARCHAR(20),

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fichier" (
    "id" SERIAL NOT NULL,
    "factureId" INTEGER NOT NULL,
    "cheminFichier" TEXT,
    "typeMime" VARCHAR(50),

    CONSTRAINT "Fichier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "public"."Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "public"."UtilisateurRole" ADD CONSTRAINT "UtilisateurRole_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UtilisateurRole" ADD CONSTRAINT "UtilisateurRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriqueAction" ADD CONSTRAINT "HistoriqueAction_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Facture" ADD CONSTRAINT "Facture_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Depense" ADD CONSTRAINT "Depense_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Depense" ADD CONSTRAINT "Depense_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "public"."Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Revenu" ADD CONSTRAINT "Revenu_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pret" ADD CONSTRAINT "Pret_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Remboursement" ADD CONSTRAINT "Remboursement_pretId_fkey" FOREIGN KEY ("pretId") REFERENCES "public"."Pret"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Objectif" ADD CONSTRAINT "Objectif_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recommandation" ADD CONSTRAINT "Recommandation_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParametreNotif" ADD CONSTRAINT "ParametreNotif_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Device" ADD CONSTRAINT "Device_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sauvegarde" ADD CONSTRAINT "Sauvegarde_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBadge" ADD CONSTRAINT "UserBadge_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "public"."Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "public"."Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Budget" ADD CONSTRAINT "Budget_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "public"."Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fichier" ADD CONSTRAINT "Fichier_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "public"."Facture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
