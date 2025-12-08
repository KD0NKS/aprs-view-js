import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import _ from "lodash";

import { usePacketStore } from "./packetStore";
import { StorageKeys } from "../enums";
import { IMapSettings, MapSettings } from "../models/settings";
import { Mapper } from "../utils/mappers";


const _mapper = new Mapper();

export const useMapSettingsStore = defineStore('mapSettings', {
    state: () => ({
        mapSettings: useStorage(StorageKeys.MAP_SETTINGS, new MapSettings())
    }),
    getters: {
        getMapSettings: state => state.mapSettings
    },
    actions: {
        setMapSettings(settings: IMapSettings) {
            const packetStore = usePacketStore()

            if(settings.pointLifetime != this.mapSettings.pointLifetime) {
                packetStore.clearOldPackets
            }

            _mapper.CopyInto<IMapSettings, MapSettings>(settings, this.mapSettings)
        }
    },
});

