import { Router } from 'express';
import { JsonController } from '../controllers/jsonController';

const router = Router();
const jsonController = new JsonController();

// JSON formatting routes
router.post('/format', jsonController.formatJson);
router.post('/escape', jsonController.escapeJson);
router.post('/unescape', jsonController.unescapeJson);

export default router; 