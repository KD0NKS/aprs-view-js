import { IStationSettings } from 'js-aprs-engine';

export class StationSettingsViewModel implements IStationSettings {
    public callsign: string;    
    public passcode: number;
    public ssid: string;
    public symbol?: string;
    public symbolOverlay?: string;
}