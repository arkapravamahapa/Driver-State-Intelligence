import { radioCalls } from '../data/mockData';
import { RadioCall } from '../types';

export const radioService = {
  getAllRadioCalls: (): RadioCall[] => {
    return radioCalls;
  },

  getRadioCallById: (id: string): RadioCall | undefined => {
    return radioCalls.find(call => call.id === id);
  }
};