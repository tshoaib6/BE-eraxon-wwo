import express from 'express';
import { createDigitalRemembranceBook, getDigitalRemembranceBookByRecordId } from '../controllers/digitalRemembranceBook.controller';
import { uploadImagesMiddleware } from '../middleware/uploadBookImages';

const router = express.Router();

router.post('/:recordId/digital-remembrance-book', uploadImagesMiddleware, createDigitalRemembranceBook);
router.get('/digital-remembrance-book/:recordId', getDigitalRemembranceBookByRecordId);

export default router;
