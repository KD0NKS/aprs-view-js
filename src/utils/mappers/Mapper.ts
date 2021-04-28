import _ from "lodash"

export class Mapper {
    /**
     * Usage is screwy, however, typescript does not handle creating a new instance of a generic type inside of a generic method gracefully.
     * https://github.com/microsoft/TypeScript/issues/204#issuecomment-122414105
     *
     * Mapper.MapObject<StationSettings>(persistentStorage.get('stationSettings'), StationSettings)
     */
    public static Map<T>(obj: any, ctor: ctorOf<T>): T {
        // This may not work in all cases
        const retVal = new ctor()

        if(obj) {
            Object.keys(retVal).forEach(k => {
                if(obj[k]) {
                    retVal[k] = obj[k]
                } else {
                    retVal[k] = null
                }
            })
        }

        return retVal
    }

    public static CopyInto<T, U>(from: T, to: U): U {
        if(from && to && _.isObject(from) && _.isObject(to)) {
            Object.keys(to).forEach(k => {
                if(from[k]) {
                    to[k] = from[k]
                } else {
                    to[k] = null
                }
            })

            return to
        } else {
            throw Error('Must provide two objects.')
        }
    }
}

interface ctorOf<T> {
    new (...args: any[]): T
}
