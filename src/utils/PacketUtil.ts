import { aprsPacket } from "js-aprs-fap";
import { StringUtil } from "@/utils";

export class PacketUtil {
    public isValidPacket(packet: aprsPacket) {
        return (packet.latitude && packet.latitude != null && packet.latitude != undefined)
            && (packet.longitude && packet.latitude != null && packet.longitude != undefined)
            && StringUtil.IsNullOrWhiteSpace(packet.resultCode)
            && StringUtil.IsNullOrWhiteSpace(packet.resultMessage)
    }
}
