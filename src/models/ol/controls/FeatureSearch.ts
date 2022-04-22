import _, { map } from 'lodash';
import { Control } from 'ol/control';

// Reference: https://openlayers.org/en/latest/examples/custom-controls.html
// Ways this could be improved:
// - Unique id's for each element
// - Add a "clear" button
// - Show/hide input when search button is clicked
// - Account for added/removed stations while typing and searching - dynamically bound options
// - Max height on data list before enabling scrolling
export class FeatureSearch extends Control {
    private _source = null;
    private _searchOpts = []

    constructor(opt_options?: any) {
        const options = opt_options || {}
        const element = document.createElement('div')
        element.className = 'feature-search ol-unselectable ol-control'

        if(options?.className != null && options?.className != '') {
            element.className +=  ` ${ options.className }`
        }

        // Setup search button
        const button = document.createElement('button')
        const img = document.createElement('i')
        img.className = "material-icons"
        img.textContent = "search"

        button.appendChild(img)
        element.appendChild(button)

        // Set up a data list for use in the search
        const dataList = document.createElement('datalist')
        dataList.id = "feature-search-list"
        element.appendChild(dataList)

        // Setup input
        const input = document.createElement('input')
        input.type = 'search'
        input.placeholder = 'Search...'
        input.setAttribute('list', 'feature-search-list')
        element.appendChild(input)

        // TODO: Figure out how to pass a function to refresh the data options
        const focus = () => {
            this._searchOpts = _.reduce(this.source.getFeatures(), (result, value) => {
                result.push(value.get('label'))
                return result
            }, []).sort()

            while(dataList.childNodes.length > 0) {
                dataList.removeChild(dataList.firstChild)
            }

            for(let opt of this._searchOpts) {
                const option = document.createElement('option')
                option.value = opt
                dataList.appendChild(option)
            }
        }

        input.addEventListener('focus', focus)
        input.addEventListener('change', (e) => {
            this.search(input.value)
        })

        button.addEventListener('click', () => {
            this.search(input.value)
        })

        super({
            element: element,
            target: options.target
        })
    }

    private get source() {
        if(this._source == null) {
            this._source = _.find(this.getMap().getAllLayers(), (layer) => {
                return layer.getClassName() == 'station-position-layer'
            }).get('source')
        }

        return this._source
    }

    private search(searchValue: string): void {
        if(_.indexOf(this._searchOpts, searchValue) > -1) {
            const feature = _.find(this.source.getFeatures(), (feature) => {
                return feature.get('label') == searchValue
            })

            if(feature && feature != null) {
                this.getMap().getView().setCenter(feature.getGeometry()["flatCoordinates"])
                this.getMap().getView().setZoom(12)
            }
        }
    }
}
