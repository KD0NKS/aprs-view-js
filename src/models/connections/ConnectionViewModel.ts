import { IConnection } from "./IConnection"

export class ConnectionViewModel implements IConnection {
    public id: string = ''
    public name: string = ''
    public connectionType: string = ''

    public host?: string = ''
    public port?: number = 0
    public filter?: string = ''

    public comPort?: string = ''
    public charset?: 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'base64' | 'binary' | 'hex' = 'ascii'
    public exitCommands?: string[] = ["DIGI OFF", "UIDIGI OFF WIDE1-1", "BEACON EVERY 0", "HID OFF", "CD INTERNAL", "INTFACE TERMINAL", "ECHO ON"]
    public messageDelimieter? = '\r'
    public myCallCommand?: string = ''
    public initCommands?: string[] = ["ECHO OFF", "INTFACE TERMINAL", "CD SOFTWARE", "LFAOFF", "AUTOLF ON", "MONITOR ON", "MCON OFF"
        , "MALL ON", "MCOM OFF", "MXMIT OFF", "BEACON EVERY 0", "BLT EVERY 0", "UIDIGI OFF WIDE1-1", "DIGIPEAT OFF", "UIDWAIT OFF"
        , "PID OFF", "HEADERLN OFF", "PASSALL OFF", "FLOW ON", "HID OFF", "MSTAMP OFF", "NEWMODE OFF", "XFLOW ON", "HBAUD 1200", "ECHO ON"]
    public autoOpen?: boolean = false
    public baudRate?: 115200 | 57600 | 38400 | 19200 | 9600 | 4800 | 2400 | 1800 | 1200 | 600 | 300 | 200 | 150 | 134 | 110 | 75 | 50 | number = 9600
    public dataBits?: 8 | 7 | 6 | 5 = 8
    public highWaterMark?: number = 65536
    public lock?: boolean = true
    public stopBits?: 1 | 2 = 1
    public parity?: 'none' | 'even' | 'mark' | 'odd' | 'space' = 'none'
    public rtscts?: boolean = true
    public xany?: boolean = false
    public xon?: boolean = false
    public xoff?: boolean = false
}
