import { DriverState } from '../types';
import { apiGet } from './client';

/**
 * Shape actually returned by GET /api/state/:driverId.
 *
 * The backend only derives `currentState` (from the driver's most recent
 * radio call) — it does not compute confidence, trend, or a state
 * distribution breakdown, so those fields aren't modeled here. Those parts
 * of the Driver State page continue to come from the `driver` prop
 * (DriverProfile), same as before this integration.
 */
export interface DriverStateResponse {
  driverId: string;
  currentState: DriverState;
}

/**
 * Fetches the live-derived current state for a driver.
 * GET /api/state/:driverId -> { success: true, data: { driverId, currentState } }
 */
export const fetchDriverState = (driverId: string): Promise<DriverStateResponse> =>
  apiGet<DriverStateResponse>(`/state/${driverId}`);