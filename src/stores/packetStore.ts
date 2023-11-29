import { defineStore } from "pinia";

import _ from "lodash";
import { EventedArray } from "../models/arrays/EventedArray";
import { aprsPacket, PacketTypeEnum } from "js-aprs-fap";

import { useMapSettingsStore } from "./mapSettingsStore";

const _maxDataLength = 100

/* NOTE!  For performance reasons, DO NOT use a state level array for this! */
const aprsPackets = new EventedArray<[ string | number, aprsPacket ]>()

export const usePacketStore = defineStore('packets', {
    state: () => ({
        aprsData: new Array<[ string | number, aprsPacket ]>()
    }),
    getters: {
        getAprsData: state => state.aprsData
        , getPacket: state => id => {
            if(id != undefined && id != null && id != "") {
                return _.find(aprsPackets, p => p[1].id == id);
            }

            return null;
        }
        , getPackets: state => aprsPackets
        , getPacketsByName: state => name => _.filter(aprsPackets, p => (p[1].itemname == name || p[1].objectname == name || p[1].sourceCallsign == name))
    },
    actions: {
        async addData(data: [ string | number, aprsPacket ]) {
            this.aprsData.push(data)

            // TODO: This should probably be a setting to cache x amount of data.
            if(this.aprsData.length > _maxDataLength) {
                this.aprsData.shift()
            }

            return
        }
        , async addPacket(packet: [ string | number, aprsPacket ]) {
            aprsPackets.push(packet)
            return
        }
        , async clearOldPackets() {
            const mapSettingsStore = useMapSettingsStore()

            // DO NOT! use lodash here.  Its internal bowels use Array.prototype.splice rather than the given array's overridden version.
            aprsPackets.remove(packet => (
                (new Date().getTime() - packet[1].receivedTime) >= (mapSettingsStore.getMapSettings.pointLifetime * 60000)
                && (
                       packet[1].type == null
                    || packet[1].type == undefined
                    || packet[1].type == PacketTypeEnum.LOCATION
                    || packet[1].type == PacketTypeEnum.OBJECT
                    || packet[1].type == PacketTypeEnum.ITEM
                ))
            )

            return
        }
        , async removePackets(ids: string[]) {
            aprsPackets.remove(packet => {
                //ids.indexOf(packet[1].id.toString()) > -1
                ids.indexOf(packet[0].toString()) > -1

                return packet;
            })

            return

            // TODO: When database is in place, mark these as deleted
        }
    },
});

