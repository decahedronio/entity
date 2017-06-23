export class StringHelper {
    /**
     * Convert a string to camelCase.
     * @param source
     * @returns {string}
     */
    public static toCamel(source: string): string {
        // Inspired by http://www.devcurry.com/2011/07/javascript-convert-camelcase-to-dashes.html
        // Remove underscores and turn the next character into uppercase
        const str: string = source.replace(/_+(.)/g, (x, chr) => chr.toUpperCase());

        // If we have a leading uppercase (either the source started with an
        // uppercase character or with an underscore), lowercase the first.
        return this.lowercaseFirst(str);
    }

    /**
     * Convert a string to snake_case.
     *
     * @param source
     * @returns {any}
     */
    public static toSnake(source: string): string {
        const str: string = this.lowercaseFirst(source);
        return str.replace(/([A-Z])/g, x => '_' + x.toLowerCase());
    }

    /**
     * Lowercase the first letter of a string.
     *
     * @param str
     * @returns {string}
     */
    private static lowercaseFirst(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
}
