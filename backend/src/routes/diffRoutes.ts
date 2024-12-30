import { Router } from 'express';
import { DiffController } from '../controllers/diffController';

const router = Router();
const diffController = new DiffController();

router.post('/compute', diffController.computeDiff);
router.post('/inline', diffController.computeInlineDiff);

export default router; 