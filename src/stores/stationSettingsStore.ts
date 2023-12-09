import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core"

import _ from "lodash";

import { LocationTypes, StorageKeys } from "../enums";
import { IStationSettings, StationSettings } from "../models/settings";

export const useStationSettingsStore = defineStore('stationSettings', {
    state: () => ({
        stationSettings: useStorage(StorageKeys.STATION_SETTINGS, new StationSettings())
    }),
    getters: {
        getStationSettings: state => state.stationSettings
    },
    actions: {
        setStationLocation(latLong: { latitude: number; longitude: number }) {
            if(latLong && latLong.latitude && latLong.longitude) {
                this.stationSettings.latitude = latLong.latitude.toFixed(4)
                this.stationSettings.longitude = latLong.longitude.toFixed(4)
            }

            window.connectionService.updateStationSettings(_.clone(this.stationSettings))
        }
        , setStationSettings(settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            this.stationSettings.callsign = settings.callsign
            this.stationSettings.passcode = settings.passcode
            this.stationSettings.ssid = settings.ssid
            this.stationSettings.symbol = settings.symbol
            this.stationSettings.symbolOverlay = settings.symbolOverlay
            this.stationSettings.isTransmitPosition = settings.isTransmitPosition ?? false
            this.stationSettings.locationType = settings.locationType ?? LocationTypes.NONE

            if(settings.locationType == LocationTypes.FIXED) {
                this.stationSettings.comment = settings.comment
                this.stationSettings.latitude = settings.latitude
                this.stationSettings.longitude = settings.longitude
                this.stationSettings.transmitInterval = settings.transmitInterval ?? 15
            } else {
                this.stationSettings.comment = null;
                this.stationSettings.latitude = null
                this.stationSettings.longitude = null
                this.stationSettings.isTransmitPosition = false
                // TODO: Kill anything trying to send position packets
            }

            window.connectionService.updateStationSettings(_.clone(settings))
        }
    },
});
