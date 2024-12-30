import { Router } from 'express';
import { RegexController } from '../controllers/regexController';

const router = Router();
const regexController = new RegexController();

router.post('/test', regexController.testRegex);
router.post('/validate', regexController.validatePattern);
router.get('/common-patterns', regexController.getCommonPatterns);

export default router; 