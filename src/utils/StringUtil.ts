export default class StringUtil {
    /**
     * Returns true or false based on whether or not the string is empty, whitespace, or otherwise null/undefined.
     * Accepting no parameter seems pointless, however, it is the only way to allow null or undefined checks.
     *
     * @param string? String to test
     * @returns boolean
     */
    public static IsNullOrWhiteSpace(val?: string): boolean {
        return val == null || val.trim().length === 0;
    }
}

//export { StringUtil };