import { TerminalSettings, TerminalSocket } from "js-aprs-tnc"
import { IConnection } from "./IConnection";
import { AbstractConnection } from "./AbstractConnection"

export class TNCConnection extends AbstractConnection {
    public autoOpen = false
    public baudRate: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number = 9600
    public charset: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex' = "ascii"
    public dataBits: 8 | 7 | 6 | 5 = 8
    public parity: 'none' | 'even' | 'mark' | 'odd' | 'space' = "none"
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
        this.exitCommands = settings["exitCommands"] ?? []
        this.initCommands = settings["initCommands"] ?? []
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

        this.applyListeners()
    }

    public get isEnabled(): boolean {
        return this._isEnabled
    }

    public set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled

        try {
            if(this._connection) {
                if (this._isEnabled === false) {
                    (this._connection as TerminalSocket).close()
                } else {
                    (this._connection as TerminalSocket).open()
                }
            }
        } catch {
            console.log("Unable to open or close port.")
        }
    }
}
