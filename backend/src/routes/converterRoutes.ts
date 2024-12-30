import { Router } from 'express';
import { ConverterController } from '../controllers/converterController';

const router = Router();
const converterController = new ConverterController();

// JSON conversion routes
router.post('/json-to-csv', converterController.jsonToCsv);
router.post('/json-to-xml', converterController.jsonToXml);
router.post('/json-to-yaml', converterController.jsonToYaml);

export default router; 