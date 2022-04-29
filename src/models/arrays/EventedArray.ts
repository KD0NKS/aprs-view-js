import _, { ListIteratee } from 'lodash'

// https://dev.to/gate3/extending-javascript-array-with-an-event-handler-1ce2
// IMPORTANT!!! DO NOT!!! Extend this class myNewArray instanceOf EventArray will return false!
// https://blog.simontest.net/extend-array-with-typescript-965cc1134b3
export class EventedArray<T> extends Array<T> {
    private _listeners = {}

    constructor(...items: Array<T>) {
        super(...items)
        Object.setPrototypeOf(this, Object.create(EventedArray.prototype))
    }

    public push(...items: T[]): number {
        let result = super.push(...items)
        this.triggerEvent('add', items)
        return result
    }

    public pop(): T {
        let result = super.pop()
        this.triggerEvent('remove', result)
        return result
    }

    public shift(): T {
        let result = super.shift()
        this.triggerEvent('remove', result)
        return result
    }

    public unshift(...items: T[]): number {
        let result = super.unshift(...items)
        this.triggerEvent('add', items)
        return result
    }

    public remove(predicate?: ListIteratee<T>): T[] {
        let result = _.remove(this, predicate)
        this.triggerEvent('remove', result)

        return result
    }

    public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        let result = super.splice(start, deleteCount, ...items)

        this.triggerEvent('add', items)
        this.triggerEvent('remove', result)

        return result
    }

    private async triggerEvent(eventName, elements: T | T[]) {
        if(this._listeners[eventName] && this._listeners[eventName].length > 0) {
            if(_.isArray(elements)) {
                _.each(elements, (element) => {
                    _.each(this._listeners[eventName](element))
                })
            } else {
                _.each(this._listeners[eventName](elements))
            }
        }
    }

    public on(event, callback): void {
        this._listeners[event] = callback
    }

    public addListener(eventName, callback): void {
        if(!this._listeners[eventName]) {
            // Create a new array for new events
            // idea of an array is we can invoke all callbacks
            this._listeners[eventName] = []
        }

        this._listeners[eventName].push(callback)
    }

    public removeListener(eventName, callback): void {
        if(this._listeners[eventName]) {
            // Remove the callback from the array
            this._listeners[eventName] = _.without(this._listeners[eventName], callback)
        }
    }
}
