import { Request, Response } from 'express';
import { IEncoderService } from '../services/encoderService';
import { AppError } from '../middleware/errorHandler';

type EncodingType = 'base64' | 'url' | 'html';

export class EncoderController {
  constructor(private encoderService: IEncoderService) {}

  encode = async (req: Request, res: Response) => {
    const { text, type } = req.body;

    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'Text input is required');
    }

    if (!type || !['base64', 'url', 'html'].includes(type)) {
      throw new AppError(400, 'Unsupported encoding type');
    }

    try {
      let result: string;
      switch (type as EncodingType) {
        case 'base64':
          result = this.encoderService.encodeBase64(text);
          break;
        case 'url':
          result = this.encoderService.encodeUrl(text);
          break;
        case 'html':
          result = this.encoderService.encodeHtml(text);
          break;
        default:
          throw new AppError(400, 'Unsupported encoding type');
      }
      res.json({ result });
    } catch (error) {
      throw new AppError(400, 'Failed to encode text');
    }
  };

  decode = async (req: Request, res: Response) => {
    const { text, type } = req.body;

    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'Text input is required');
    }

    if (!type || !['base64', 'url', 'html'].includes(type)) {
      throw new AppError(400, 'Unsupported decoding type');
    }

    try {
      let result: string;
      switch (type as EncodingType) {
        case 'base64':
          result = this.encoderService.decodeBase64(text);
          break;
        case 'url':
          result = this.encoderService.decodeUrl(text);
          break;
        case 'html':
          result = this.encoderService.decodeHtml(text);
          break;
        default:
          throw new AppError(400, 'Unsupported decoding type');
      }
      res.json({ result });
    } catch (error) {
      throw new AppError(400, 'Failed to decode text');
    }
  };
} 