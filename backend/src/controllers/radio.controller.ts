import { Request, Response, NextFunction } from 'express';
import { radioService } from '../services/radio.service';

export const getRadioCalls = (req: Request, res: Response, next: NextFunction) => {
  try {
    const calls = radioService.getAllRadioCalls();
    res.json({ success: true, data: calls });
  } catch (error) {
    next(error);
  }
};

export const getRadioCall = (req: Request, res: Response, next: NextFunction) => {
  try {
    const radioCallId = Array.isArray(req.params.radioCallId) ? req.params.radioCallId[0] : req.params.radioCallId;

    if (!radioCallId) {
      res.status(400).json({ success: false, message: 'Radio call ID is required' });
      return;
    }

    const call = radioService.getRadioCallById(radioCallId);
    
    if (!call) {
      res.status(404).json({ success: false, message: 'Radio call not found' });
      return;
    }
    
    res.json({ success: true, data: call });
  } catch (error) {
    next(error);
  }
};