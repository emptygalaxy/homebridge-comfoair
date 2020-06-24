import {Service} from "hap-nodejs";

export interface ServiceHandler
{
    getService(): Service;
}