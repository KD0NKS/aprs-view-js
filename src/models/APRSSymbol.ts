export default class APRSSymbol {
    public constructor(init?: Partial<APRSSymbol>) {
        Object.assign(this, init)
    }

    public name: string
    public key: string
    public value: any  // Yeah, yeah, yeah, it's an image...
    public isAllowOverlay: boolean = false
    public isRotatable: boolean = false
}
