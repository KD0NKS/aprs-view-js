import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core"

import _ from "lodash";

import { ISoftwareSettings, SoftwareSettings } from "../models/settings";
import { Mapper } from "../utils/mappers";
import { StorageKeys } from "../enums";

const _mapper = new Mapper()

export const useSoftwareSettingsStore = defineStore('softwareSettings', {
    state: () => ({
        softwareSettings: useStorage(StorageKeys.SOFTWARE_SETTINGS, new SoftwareSettings())
    }),
    getters: {
        getSoftwareSettings: state => state.softwareSettings
    },
    actions: {
        setSoftwareSettings(settings: ISoftwareSettings) {
            _mapper.CopyInto<ISoftwareSettings, SoftwareSettings>(settings, this.softwareSettings)
        }
    },
});
