export class NumberUtil {
    /**
     * Converts degrees to radians
     *
     * @param number - The number to convert to radians
     * @returns degrees converted to radians
     */
    public static degToRad(val: number): number {
        return (val * (Math.PI/180))
    }
}
