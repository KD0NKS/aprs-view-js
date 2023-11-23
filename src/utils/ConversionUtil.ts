import { DistanceUnitTypes, TemperatureUnitTypes } from "../enums"

export class ConversionUtil {
    public static kmhToMph(speed: number) {
        return speed * 0.621427
    }

    /**
     * Adds a label to speed given in km/h or mph
     *
     * @param speed - speed in kmh or mph
     * @param unitType - unit type from DistanceUnitTypes
     * @returns speed with label
     */
    public static kmhMphWithLabel(speed: number, unitType: string, direction?: number) {
        if(speed) {
            if(unitType == DistanceUnitTypes.METRIC)
                return `${speed.toFixed(2)} km/h ${ direction ? this.degreesToDirection(direction) : '' }`.trim()
            else {
                return `${this.kmhToMph(speed).toFixed(2)} mph ${ direction ? this.degreesToDirection(direction) : '' }`.trim()
            }
        }

        return null
    }

    public static mpsToMph(speed: number): number {
        return speed * 2.236936
    }

    /**
     *
     * @param speed - meters per second or miles per hour
     * @param unitType - unit type from DistanceUnitTypes
     * @param direction - optional direction/course
     * @returns
     */
    public static windSpeedWithLabel(speed: number, unitType: string, direction?: number): string {
        if (unitType == DistanceUnitTypes.METRIC)
            return `${speed.toFixed(2)} m/h ${direction ? this.degreesToDirection(direction) : ''}`.trim()
        else {
            return `${this.mpsToMph(speed).toFixed(2)} mph ${direction ? this.degreesToDirection(direction) : ''}`.trim()
        }
    }

    public static celsiusToFarenheight(temp: number) {
        return temp * (9 / 5) + 32
    }

    public static getTemperatureWithLabel(temp: number, unitType: string) {
        if(temp) {
            if(unitType == TemperatureUnitTypes.CELSIUS) {
                return `${ temp }° C`
            } else {
                return `${ this.celsiusToFarenheight(temp).toFixed(1) }° F`
            }
        }

        return null
    }

    public static metersToFeet(distance: number) {
        return distance * 3.28
    }

    public static metersFeetWithLabel(distance: number, unitType: string): string {
        if(distance) {
            if(unitType == DistanceUnitTypes.METRIC) {
                return `${ distance } m`
            } else {
                return `${ this.metersToFeet(distance).toFixed(2)} ft`
            }
        }
    }

    public static degreesToDirection(direction: number): string {
        if(direction <= 11.25 || direction > 348.75) {
            return 'N'
        } else if(direction > 11.25 && direction <= 33.75) {
            return 'NNE'
        } else if(direction > 33.75 && direction <= 56.25) {
            return 'NE'
        } else if(direction > 56.25 && direction <= 78.75) {
            return 'ENE'
        } else if(direction > 78.75 && direction <= 101.25) {
            return 'E'
        } else if(direction > 101.25 && direction <= 123.75) {
            return 'ESE'
        } else if(direction > 123.75 && direction <= 146.25) {
            return 'SE'
        } else if(direction > 146.25 && direction <= 168.75) {
            return 'SSE'
        } else if(direction > 168.75 && direction <= 191.25) {
            return 'S'
        } else if(direction > 191.25 && direction <= 213.75) {
            return 'SSW'
        } else if(direction > 213.75 && direction <= 236.25) {
            return 'SW'
        } else if(direction > 236.25 && direction <= 258.75) {
            return 'WSW'
        } else if(direction > 258.75 && direction <= 281.25) {
            return 'W'
        } else if(direction > 281.25 && direction <= 303.75) {
            return 'WNW'
        } else if(direction > 303.75 && direction <= 326.25) {
            return 'NW'
        } else if(direction > 326.25 && direction <= 348.75) {
            return 'NNW'
        } else {
            return null
        }
    }
}
