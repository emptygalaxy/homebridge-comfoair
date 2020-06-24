import {
    ComfoAirPayload,
    ComfoAirResponse,
    LabeledBooleanValue,
    LabeledNumberValue,
    LabeledStringValue
} from "./ComfoAirResponse";

export interface FaultsResponse extends ComfoAirResponse
{
    payload: FaultsPayload;
}

export interface FaultsPayload extends ComfoAirPayload
{
    currentErrorA: LabeledStringValue;
    currentErrorE: LabeledNumberValue;

    lastErrorA: LabeledStringValue;
    lastErrorE: LabeledNumberValue;

    replaceFilter: LabeledBooleanValue;

    /*

        "currentErrorA": {
            "value": "A0",
            "label": "current error A"
        },
        "currentErrorE": {
            "value": 0,
            "label": "current error E"
        },
        "lastErrorA": {
            "value": "A0",
            "label": "last error A"
        },
        "lastErrorE": {
            "value": 0,
            "label": "last error E"
        },
        "penultimateErrorA": {
            "value": "A0",
            "label": "penultimate error A"
        },
        "penultimateErrorE": {
            "value": 0,
            "label": "penultimate error E"
        },
        "antepenultimateErrorA": {
            "value": "A0",
            "label": "antepenultimate error A"
        },
        "antepenultimateErrorE": {
            "value": 0,
            "label": "antepenultimate error E"
        },
        "replaceFilter": {
            "value": true,
            "label": "replace filter"
        },
        "currentErrorEA": {
            "value": 0,
            "label": "current error EA"
        },
        "lastErrorEA": {
            "value": 0,
            "label": "last error EA"
        },
        "penultimateErrorEA": {
            "value": 0,
            "label": "penultimate error EA"
        },
        "antepenultimateErrorEA": {
            "value": 0,
            "label": "antepenultimate error EA"
        },
        "currentErrorAHigh": {
            "value": 0,
            "label": "current error A high"
        },
        "lastErrorAHigh": {
            "value": 0,
            "label": "last error A high"
        },
        "penultimateErrorAHigh": {
            "value": 0,
            "label": "penultimate error A high"
        },
        "antepenultimateErrorAHigh": {
            "value": 0,
            "label": "antepenultimate error A high"
        },
    * */
}