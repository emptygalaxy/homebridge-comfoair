import { Service } from 'homebridge';

export interface ServiceHandler
{
    getService(): Service;
}