import type {Service} from 'homebridge';

export interface ServiceHandler {
  getService(): Service;
}
