// services/simulation.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SimulationData {
  salaire_net: number;
  duree_salaire: number;
  taux_salaire: number;
  capacite_emprunt: number;
  duree_emprunt: number;
  taux_emprunt: number;
  nom_simulation?: string;
}

export interface SimulationResult {
  // Résultats salaire
  quotite_cessible: number;
  montant_max_salaire: number;
  net_cav_salaire: number;
  frais_ht_salaire: number;
  taxe_salaire: number;
  frais_ttc_salaire: number;
  fond_emprunteur_salaire: number;
  // Résultats emprunt
  montant_max_emprunt: number;
  net_cav_emprunt: number;
  frais_ht_emprunt: number;
  taxes_emprunt: number;
  frais_ttc_emprunt: number;
  fond_solidarite_emprunt: number;
  // Tableau final
  table_emprunt: number;
  table_duree: number;
  table_taux: number;
  table_echeance: number;
  table_taux_fd_ht: number;
  table_fd_ht: number;
  table_fd_ttc: number;
  table_fse: number;
  table_net_cav: number;
  table_total_interet: number;
  table_total_ci: number;
}

// Calculs financiers repris de votre JavaScript
export function calculateSalarySimulation(salaire_net: number, duree_salaire: number, taux_salaire: number) {
  const tauxRate = (taux_salaire / 100) / 12;
  
  const quotite_cessible = salaire_net / 3;
  const montant_max_salaire = (quotite_cessible * (1 - Math.pow(1 + tauxRate, -duree_salaire))) / tauxRate;
  const frais_ht_salaire = montant_max_salaire * 1.75 / 100;
  const taxe_salaire = frais_ht_salaire * 20 / 100;
  const frais_ttc_salaire = frais_ht_salaire + taxe_salaire;
  const fond_emprunteur_salaire = montant_max_salaire * 1 / 100;
  const net_cav_salaire = montant_max_salaire - frais_ttc_salaire - fond_emprunteur_salaire;
  
  return {
    quotite_cessible,
    montant_max_salaire,
    net_cav_salaire,
    frais_ht_salaire,
    taxe_salaire,
    frais_ttc_salaire,
    fond_emprunteur_salaire
  };
}

export function calculateCapacitySimulation(capacite_emprunt: number, duree_emprunt: number, taux_emprunt: number) {
  const tauxRate = (taux_emprunt / 100) / 12;
  
  const montant_max_emprunt = (capacite_emprunt * (1 - Math.pow(1 + tauxRate, -duree_emprunt))) / tauxRate;
  const frais_ht_emprunt = montant_max_emprunt * 1.75 / 100;
  const taxes_emprunt = frais_ht_emprunt * 20 / 100;
  const frais_ttc_emprunt = frais_ht_emprunt + taxes_emprunt;
  const fond_solidarite_emprunt = montant_max_emprunt * 1 / 100;
  const net_cav_emprunt = montant_max_emprunt - frais_ttc_emprunt - fond_solidarite_emprunt;
  
  return {
    montant_max_emprunt,
    net_cav_emprunt,
    frais_ht_emprunt,
    taxes_emprunt,
    frais_ttc_emprunt,
    fond_solidarite_emprunt
  };
}

export function calculateTableSimulation(
  table_emprunt: number, 
  table_duree: number, 
  table_taux: number, 
  table_taux_fd_ht: number
) {
  const tauxRate = (table_taux / 100) / 12;
  const table_echeance = (table_emprunt * tauxRate) / (1 - Math.pow(1 + tauxRate, -table_duree));
  const table_fd_ht = table_emprunt * table_taux_fd_ht / 100;
  const table_fd_ttc = table_fd_ht * 1.20;
  const table_fse = table_emprunt * 1 / 100;
  const table_net_cav = table_emprunt - table_fd_ttc - table_fse;
  const table_total_interet = table_echeance * table_duree - table_emprunt;
  const table_total_ci = table_echeance * table_duree;
  
  return {
    table_echeance,
    table_fd_ht,
    table_fd_ttc,
    table_fse,
    table_net_cav,
    table_total_interet,
    table_total_ci
  };
}

export function generateEcheancier(montant: number, duree: number, taux: number) {
  const echeancier = [];
  const tauxMensuel = (taux / 100) / 12;
  const mensualite = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
  
  let capitalRestant = montant;
  const dateDebut = new Date();
  
  for (let i = 1; i <= duree; i++) {
    const interet = capitalRestant * tauxMensuel;
    const capital = mensualite - interet;
    capitalRestant -= capital;
    
    const dateEcheance = new Date(dateDebut);
    dateEcheance.setMonth(dateEcheance.getMonth() + i);
    
    echeancier.push({
      numero_echeance: i,
      date_echeance: dateEcheance,
      montant_echeance: mensualite,
      capital: capital,
      interet: interet,
      capital_restant: Math.max(capitalRestant, 0)
    });
  }
  
  return echeancier;
}

// CRUD Services
export async function createSimulation(userId: number, data: SimulationData) {
  // Calculs automatiques
  const salaryCalc = calculateSalarySimulation(data.salaire_net, data.duree_salaire, data.taux_salaire);
  const capacityCalc = calculateCapacitySimulation(data.capacite_emprunt, data.duree_emprunt, data.taux_emprunt);
  
  const tableCalc = calculateTableSimulation(
    salaryCalc.montant_max_salaire,
    data.duree_salaire,
    data.taux_salaire,
    1.75
  );
  
  const simulation = await prisma.simulationPret.create({
    data: {
      id_user: userId,
      nom_simulation: data.nom_simulation || `Simulation du ${new Date().toLocaleDateString('fr-FR')}`,
      
      // Données d'entrée
      salaire_net: data.salaire_net,
      duree_salaire: data.duree_salaire,
      taux_salaire: data.taux_salaire,
      capacite_emprunt: data.capacite_emprunt,
      duree_emprunt: data.duree_emprunt,
      taux_emprunt: data.taux_emprunt,
      
      // Résultats calculés
      ...salaryCalc,
      ...capacityCalc,
      
      // Tableau final
      table_emprunt: salaryCalc.montant_max_salaire,
      table_duree: data.duree_salaire,
      table_taux: data.taux_salaire,
      table_taux_fd_ht: 1.75,
      ...tableCalc
    }
  });
  
  // Génération de l'échéancier
  const echeancier = generateEcheancier(
    salaryCalc.montant_max_salaire,
    data.duree_salaire,
    data.taux_salaire
  );
  
  await prisma.echeancierPret.createMany({
    data: echeancier.map(item => ({
      id_simulation: simulation.id,
      ...item
    }))
  });
  
  return simulation;
}

export async function getAllSimulations() {
  return prisma.simulationPret.findMany({
    orderBy: { date_creation: 'desc' },
    include: {
      utilisateur: {
        select: { nom: true, prenoms: true }
      }
    }
  });
}

export async function getSimulationsByUser(userId: number) {
  return prisma.simulationPret.findMany({
    where: { id_user: userId },
    orderBy: { date_creation: 'desc' },
    include: {
      utilisateur: {
        select: { nom: true, prenoms: true }
      }
    }
  });
}

export async function getSimulationById(id: number) {
  return prisma.simulationPret.findUnique({
    where: { id },
    include: {
      EcheancierPret: {
        orderBy: { numero_echeance: 'asc' }
      },
      utilisateur: {
        select: { nom: true, prenoms: true }
      }
    }
  });
}

export async function updateSimulation(id: number, data: Partial<SimulationData>) {
  return prisma.simulationPret.update({
    where: { id },
    data: {
      ...data,
      date_modification: new Date()
    }
  });
}

export async function deleteSimulation(id: number) {
  // L'échéancier sera supprimé automatiquement grâce à la cascade
  return prisma.simulationPret.delete({
    where: { id }
  });
}

export async function getSimulationStats(userId?: number) {
  const whereClause = userId ? { id_user: userId } : {};
  
  const simulations = await prisma.simulationPret.findMany({
    where: whereClause,
    select: {
      montant_max_salaire: true,
      table_echeance: true,
      table_total_interet: true,
      date_creation: true
    }
  });
  
  return {
    total_simulations: simulations.length,
    montant_moyen: simulations.reduce((sum, sim) => sum + Number(sim.montant_max_salaire), 0) / simulations.length || 0,
    echeance_moyenne: simulations.reduce((sum, sim) => sum + Number(sim.table_echeance), 0) / simulations.length || 0,
    interet_total_moyen: simulations.reduce((sum, sim) => sum + Number(sim.table_total_interet), 0) / simulations.length || 0
  };
}