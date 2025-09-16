import { Router } from 'express';
import multer from 'multer';
import {
  uploadFichiersController,
  getFichiersByFactureController,
  deleteFichierController
} from '../../controllers/factures/fichier.controller';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier pour stocker
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });
const router = Router();

router.post('/upload', upload.single('file'), uploadFichiersController);
router.get('/facture/:factureId', getFichiersByFactureController);
router.delete('/:id', deleteFichierController);

export default router;
