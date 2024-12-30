import { Router } from 'express';
import { StringController } from '../controllers/stringController';

const router = Router();
const stringController = new StringController();

router.post('/escape', stringController.escapeString);
router.post('/unescape', stringController.unescapeString);
router.post('/validate-base64', stringController.validateBase64);

export default router; 