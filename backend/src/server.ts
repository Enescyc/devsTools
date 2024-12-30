import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { JsonController } from './controllers/jsonController';
import { TextController } from './controllers/textController';
import { EncoderController } from './controllers/encoderController';
import { HashController } from './controllers/hashController';
import { UuidController } from './controllers/uuidController';
import { TextFormatter } from './services/textFormatter';
import { EncoderService } from './services/encoderService';
import { HashService } from './services/hashService';
import { UuidService } from './services/uuidService';
import { errorHandler } from './middleware/errorHandler';
import jsonRoutes from './routes/jsonRoutes';
import converterRoutes from './routes/converterRoutes';
import regexRoutes from './routes/regexRoutes';
import diffRoutes from './routes/diffRoutes';
import stringRoutes from './routes/stringRoutes';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(json());

// Initialize services and controllers
const textFormatter = new TextFormatter();
const encoderService = new EncoderService();
const hashService = new HashService();
const uuidService = new UuidService();

const textController = new TextController(textFormatter);
const encoderController = new EncoderController(encoderService);
const hashController = new HashController(hashService);
const uuidController = new UuidController(uuidService);

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// JSON routes
app.use('/api/json', jsonRoutes);

// Converter routes
app.use('/api/convert', converterRoutes);

// Text routes
app.post('/api/text/convert', textController.convertCase);

// Encoder routes
app.post('/api/encode', encoderController.encode);
app.post('/api/decode', encoderController.decode);

// Hash routes
app.post('/api/hash', hashController.generateHash);

// UUID routes
app.post('/api/uuid/generate', uuidController.generate);
app.post('/api/uuid/validate', uuidController.validate);
app.post('/api/uuid/info', uuidController.getInfo);
app.post('/api/uuid/bulk', uuidController.generateBulk);
app.post('/api/uuid/timestamp', uuidController.getTimestamp);
app.post('/api/uuid/sequential', uuidController.generateSequential);

// Regex routes
app.use('/api/regex', regexRoutes);

// Diff routes
app.use('/api/diff', diffRoutes);

// String routes
app.use('/api/string', stringRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 