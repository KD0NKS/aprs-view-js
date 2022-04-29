import { IMapSettings } from "@/models/settings/IMapSettings";

export class MapSettings implements IMapSettings {
    public pointLifetime: number = 30
    public isShowLabels: boolean = true
    public isShowTrails: boolean = true
}
