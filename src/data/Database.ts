import leveldown from 'leveldown'
import path from 'path'
import {
    createRxDatabase,
    RxDatabase,
    RxCollection,
    RxJsonSchema,
    RxDocument,
    addRxPlugin,
} from 'rxdb'
import StrinUtil from '@/utils/StringUtil'

export default class Database {
    private _appDataPath = ''

    /**
     * 
     * @param appPath - Path to the 
     */
    constructor(appPath: string) {
        if(StrinUtil.IsNullOrWhiteSpace(appPath))
            throw Error('Parameter appPath cannot be null or epmpty.')
        
        addRxPlugin(require('pouchdb-adapter-leveldb'))

        this._appDataPath = appPath;

        this.CreateDatabase()
    }

    private async CreateDatabase() {
        const db = await createRxDatabase({
            name: 'stationSettings'
            , adapter: leveldown
        })

        console.dir(db)
    }
}