import { TerminalSettings, TerminalSocket } from "js-aprs-tnc"
import { IConnection } from "./IConnection";
import { AbstractConnection } from "./AbstractConnection"

export class TNCConnection extends AbstractConnection {
    public autoOpen = false
    public baudRate = 9600
    public charset = "ascii"
    public dataBits = 8
    public parity = "none"
    public rtscts = true
    public stopBits = 1
    public messageDelimeter = "\r"
    public exitCommands = []
    public initCommands = []
    public comPort = ""
    public myCallCommand = "MYCALL"


    constructor(settings?: IConnection) {
        super(settings)

        const terminalSettings: TerminalSettings = new TerminalSettings()
        this.comPort = settings["comPort"] ?? ""
        this.myCallCommand = settings["myCallCommand"] ?? "MYCALL"

        terminalSettings.autoOpen = settings['autoOpen'] ?? false

        if(settings) {
            terminalSettings.baudRate = settings["baudRate"]
            terminalSettings.charset = settings["charset"]
            terminalSettings.dataBits = settings["dataBits"]
            terminalSettings.parity = settings["parity"]
            terminalSettings.rtscts = settings["rtscts"]
            terminalSettings.stopBits = settings["stopBits"]
            terminalSettings.messageDelimeter = settings["messageDelimeter"]
            terminalSettings.exitCommands = settings["exitCommands"]
            terminalSettings.initCommands = settings["initCommands"]
        }

        try {
            this._connection = new TerminalSocket(this.comPort, terminalSettings)
        } catch (error) {
            console.log(`Failed bo build Terminal Connection ${this.name}`)
        }
    }

    public get isEnabled(): boolean {
        return this._isEnabled
    }

    public set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled

        if(this._connection) {
            if (this._isEnabled === false) {
                (this._connection as TerminalSocket).close()
            } else {
                (this._connection as TerminalSocket).open()
            }
        }
    }
}
