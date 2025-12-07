import { IConnection, AbstractConnection } from ".";

export class TNCConnection extends AbstractConnection {
    public autoOpen = false;
    public aprsPath;
    public baudRate: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number = 9600;
    public charset: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex' = "ascii";
    public comPort = "";
    public converseCommand: "";
    public dataBits: 8 | 7 | 6 | 5 = 8;
    public myCallCommand = "";
    public parity: 'none' | 'even' | 'mark' | 'odd' | 'space' = "none";
    public rtscts = true;
    public stopBits = 1;
    public unprotoCommand;
    public messageDelimeter = "\r";
    public exitCommands = [];
    public initCommands = [];

    constructor(settings?: IConnection) {
        super(settings);

        if(settings && settings != null) {
            //this.autoOpen = settings["autoOpen"];
            this.aprsPath = settings["aprsPath"];
            this.baudRate = settings["baudRate"];
            this.charset = settings["charset"];
            this.comPort = settings["comPort"] ?? "";
            this.converseCommand = settings["converseCommand"] ?? "";
            this.dataBits = settings["dataBits"];
            this.exitCommands = settings["exitCommands"] ?? [];
            this.initCommands = settings["initCommands"] ?? [];
            this.myCallCommand = settings['myCallCommand'] ?? "";
            //this.parity = settings["parity"];
            //this.rtscts = settings["rtscts"];
            this.stopBits = settings["stopBits"];
            this.unprotoCommand = settings["unprotoCommand"];
            this.messageDelimeter = settings["messageDelimeter"] = "\r";
        }
    }

    public toJSON() {
        const jsonObj = super.toJSON();

        jsonObj["aprsPath"] =  this.aprsPath;
        jsonObj["autoOpen"] = this.autoOpen;
        jsonObj["comPort"] = this.comPort;
        jsonObj["converseCommand"] = this.converseCommand;
        jsonObj["exitCommands"] = this.exitCommands;
        jsonObj["initCommands"] = this.initCommands;
        jsonObj["myCallCommand"] = this.myCallCommand;
        jsonObj["baudRate"] = this.baudRate;
        jsonObj["charset"] = this.charset;
        jsonObj["dataBits"] = this.dataBits;
        jsonObj["parity"] = this.parity;
        jsonObj["rtscts"] = this.rtscts;
        jsonObj["stopBits"] = this.stopBits;
        jsonObj["unprotoCommand"] = this.unprotoCommand;
        jsonObj["messageDelimeter"] = this.messageDelimeter;

        return jsonObj;
    }
}
