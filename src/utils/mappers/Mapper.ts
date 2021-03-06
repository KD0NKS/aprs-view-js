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
            _.each(Object.keys(retVal), k => {
                if(obj[k]) {
                    retVal[k] = obj[k]
                } else {
                    retVal[k] = null
                }
            })
        }

        return retVal
    }

    /**
     * Copies values from objFrom to objTo only if objTo has a matching key and their types match.
     *
     * @param objFrom
     * @param objTo
     * @returns
     */
    public static CopyInto<T, U>(objFrom: T, objTo: U): U {
        if(objFrom && objTo && _.isObject(objFrom) && _.isObject(objTo)) {
            _.each(Object.keys(objTo), k => {
                if(_.has(objFrom, k) && typeof objTo[k] == typeof objFrom[k]) {
                    objTo[k] = objFrom[k] ?? null
                }
            })

            return objTo
        } else {
            throw Error('Must provide two objects.')
        }
    }
}

interface ctorOf<T> {
    new (...args: any[]): T
}
