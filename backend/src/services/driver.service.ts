import { drivers } from '../data/mockData';
import { DriverProfile } from '../types';

export const driverService = {
  getAllDrivers: (): DriverProfile[] => {
    return drivers;
  },

  getDriverById: (id: string): DriverProfile | undefined => {
    return drivers.find(driver => driver.id === id);
  }
};