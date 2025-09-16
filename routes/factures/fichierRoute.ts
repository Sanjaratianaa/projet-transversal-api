import { Router } from 'express';
import multer, { StorageEngine } from "multer";
import { Request } from "express";
import {
  uploadFichiersController,
  getFichiersByFactureController,
  deleteFichierController
} from '../../controllers/factures/fichier.controller';

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = Router();

router.post('/upload', upload.single('file'), uploadFichiersController);
router.get('/facture/:factureId', getFichiersByFactureController);
router.delete('/:id', deleteFichierController);

export default router;
