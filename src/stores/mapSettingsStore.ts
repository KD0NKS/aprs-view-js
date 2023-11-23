import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
//import { LocalStorage } from "quasar";

import _ from "lodash";

import { usePacketStore } from "./packetStore";
import { StorageKeys } from "../enums";
import { IMapSettings, MapSettings } from "../models/settings";
import { Mapper } from "../utils/mappers";


const _mapper = new Mapper();

export const useMapSettingsStore = defineStore('mapSettings', {
    state: () => ({
        //mapSettings: LocalStorage.getItem(StorageKeys.MAP_SETTINGS) ? _mapper.CopyInto<IMapSettings, MapSettings>(LocalStorage.getItem(StorageKeys.MAP_SETTINGS), new MapSettings()) : new MapSettings()
        mapSettings: useStorage(StorageKeys.MAP_SETTINGS, new MapSettings())
    }),
    getters: {
        getMapSettings: state => state.mapSettings
    },
    actions: {
        setMapSettings(settings: IMapSettings) {
            const packetStore = usePacketStore()

            if(!this.packetTimer) {
                // Set the interval to the new time
                this.packetTimer = setInterval(
                    () => packetStore.clearOldPackets
                    , 60000) // 60000ms per minute
            }

            if(settings.pointLifetime != this.mapSettings.pointLifetime) {
                packetStore.clearOldPackets
            }

            _mapper.CopyInto<IMapSettings, MapSettings>(settings, this.mapSettings)
        }
    },
});
