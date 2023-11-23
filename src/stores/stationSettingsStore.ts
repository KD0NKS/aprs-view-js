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
        setStationLocation(latLong) {
            if(latLong && latLong.latitude && latLong.longitude) {
                this.stationSettings.latitude = latLong.latitude.toFixed(4)
                this.stationSettings.longitude = latLong.longitude.toFixed(4)
            }

            window.connectionService.updateStationSettings(_.clone(this.settings))
        }
        , setStationSettings(settings: IStationSettings) {
            // state.stationSettings.propname = settings.propname doesn't work here
            this.stationSettings.callsign = settings.callsign
            this.stationSettings.passcode = settings.passcode
            this.stationSettings.ssid = settings.ssid
            this.stationSettings.symbol = settings.symbol
            this.stationSettings.symbolOverlay = settings.symbolOverlay
            this.stationSettings.isTransmitPosition = settings.isTransmitPosition ?? false
            this.stationSettings.locationType = settings.locationType ?? LocationTypes.FIXED
            this.stationSettings.latitude = settings.latitude
            this.stationSettings.longitude = settings.longitude

            //LocalStorage.set(StorageKeys.STATION_SETTINGS, _mapper.Map<StationSettings>(this.stationSettings, StationSettings))

            window.connectionService.updateStationSettings(_.clone(settings))
        }
    },
});
