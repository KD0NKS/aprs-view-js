export class APRSSymbol {
    public constructor(init?: Partial<APRSSymbol>) {
        this.name = init?.name ?? null
        this.key = init?.key ?? null
        this.value = init?.value ?? null
        this.isAllowOverlay = init?.isAllowOverlay ?? false
        this.isRotatable = init?.isRotatable ?? false
    }

    public name: string
    public key: string
    public value: any  // Yeah, yeah, yeah, it's an image...
    public isAllowOverlay: boolean = false
    public isRotatable: boolean = false
}
