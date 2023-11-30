<template>
    <div id="map" style="position: relative;">
        <q-dialog v-model="isShowStationInfo">
            <station-feature-card
                :connectionId="stationConnectionId"
                :packet="stationInfoPacket"
                :symbol="stationIcon"
                :overlay="stationIconOverlay"
                style="max-width: 50%"
                />
        </q-dialog>

        <map-context-menu
            :latitude="contextMenuX"
            :longitude="contextMenuY"
            @clearAll="clearAllStations()"
            @stationCoordinatesUpdate="updateCurrentStationCoordinates()"
            >
        </map-context-menu>
    </div>
</template>

<script lang="ts">
    import 'ol/ol.css'

    import { defineComponent, ref } from 'vue'

    import { useMapSettingsStore } from '../stores/mapSettingsStore';
    import { usePacketStore } from '../stores/packetStore';
    import { useStationSettingsStore } from '../stores/stationSettingsStore';

    import { NumberUtil, PacketUtil } from '../utils'
    import _ from 'lodash'
    import { APRSSymbolService, MapService } from '../services'
    import { APRSSymbol } from '../models'

    import BaseLayer from 'ol/layer/Base'
    import { Heatmap as HeatmapLayer, Tile as TileLayer, Image, Graticule } from 'ol/layer'
    import { Feature, Map as OLMap, MapBrowserEvent, View } from 'ol'
    import { fromLonLat, toLonLat } from 'ol/proj'
    import { aprsPacket } from 'js-aprs-fap'
    import Point from 'ol/geom/Point'
    import VectorSource from 'ol/source/Vector'
    import VectorLayer from 'ol/layer/Vector'
    import StadiaMaps from 'ol/source/StadiaMaps'
    import Geometry from 'ol/geom/Geometry'
    import { Style, Fill, Stroke, Text, Icon } from 'ol/style'
    import { LocationTypes } from '../enums'
    import LineString from 'ol/geom/LineString'
    import StationFeatureCard from '../components/maps/StationFeatureCard.vue'
    import MapContextMenu from '../components/maps/MapContextMenu.vue'
    import { FeatureSearch } from '../models/ol/controls/FeatureSearch'
    import { defaults as defaultControls} from 'ol/control'
    import { Coordinate } from 'ol/coordinate';
    import { Circle } from 'ol/geom';
    import { FeatureLike } from 'ol/Feature';

    const amgibuityStyle = new Style({ stroke: new Stroke({ color: 'black', width: 2, lineDash: [ 8, 8 ] }) })

    export default defineComponent({
        components: { StationFeatureCard, MapContextMenu },
        name: 'Map'
        , setup() {
            // services and settings
            const mapSettingsStore = useMapSettingsStore();
            const packetStore = usePacketStore();
            const stationSettingsStore = useStationSettingsStore();
            const stationSettings = stationSettingsStore.stationSettings;

            const packetUtil: PacketUtil = new PacketUtil();
            const mapService = new MapService();
            const mapSettings = mapSettingsStore.getMapSettings;
            const symbolService: APRSSymbolService = new APRSSymbolService()

            // vectors
            const ambiguityVector: VectorSource<FeatureLike> = new VectorSource({})
            const currentStationPositionVector: VectorSource<FeatureLike> = new VectorSource({})
            const genericPointVector: VectorSource<FeatureLike> = new VectorSource({})
            const stationPositionVector: VectorSource<FeatureLike> = new VectorSource({})
            const trailVector: VectorSource<FeatureLike> = new VectorSource({})

            // timers
            const layerTimers = {}

            // data
            const contextMenuX = ref(0)
            const contextMenuY = ref(0)
            const packets = packetStore.getPackets
            const stationInfoPacket = ref(null)
            const stationConnectionId = ref(null)

            // listeners
            const packetAddedListener = ref(null)
            const packetRemovedListener = ref(null)

            const maxPacketAge: number = mapSettings.pointLifetime * 60000;

            // Default: /assets/radio-tower.png
            const stationIconOverlay = ref(new APRSSymbol({
                    key: "logo"
                    , value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABHlJREFUaN7tmW1ollUYx3+Pj7OWmqlbUG5z2ofypQ/inOuTWPZV5ocsEvbBXCm+JSKEiCAIrj5FMkxs0ZdUfCHKl4QgUqJAUNQUtkEQFkXOUh+HbjJ9/HCfR+/9z/XcL88eHdT+cGDXff3P/1zXuc9zznWfwQhG8P9Gpkw6WaARWAjMBV4CngPGOX8v8CfQBZwBvgdOA/eGewJqgTbgDyCfsv0O7ABqhiPwamA30F9C4Nr6gV1A1eMK/m3gnzIEru0q8NajDLwC2BMRwA1gL7ACmOfeUoVr1e5ZK7APyEXofOr6lBVPAceLDNgFLHecNHrvAN1FNI+l1IudeSv4W8BGYPQQtTcBtw39o5TpTVjLphuYXa4ZApoItlkdZ9dQhZcZomcJ1rSFOmAtcALoJNj/e93fJ4A1BFuvhRrgvDHem6UGX42/23QXCb4G6AAGiN9tBoDPgClFdP4Sfg8wuZQEduOveWvZNAM3EwSuLQcsNvSagD7htqcNvhb/kNpo8NYDd0sIvtDuAusM3a3C6yPlid0mAl34u01zkeAvuMRmAWNdm+We/VIkCX0T4/CX0o6kwWfxa5vlwqnBXzZ9wCpgVIz2auPt5oDnhbtKOJdjtB/gFel4A/9Q6TCCX5h0hoBXjST2CGesMUmNScQ3S6e94q/D321Wpgi+gDWiMYC/zvcL54Mkwoel0wrxr8Vf8/pqa4FDBEsjB3wFvCicLHBRtFYL513xH0ySgIrOE/+34l9vBG9Vq//iH2IbhHNM/PONyYqFDq51epf4Z4r/kBF8oR0Q7mzxd4r/WfH3JElAf1xjxK+l8PgYv24IYYwXf078T4i/T4O1tqV8TIKjYvi3IvqqLxNjK7xvaCsBnaUJYl8Re6rYP0QEoL46sf8W+2mx9Q2ZCeg6mya2rtNFYrdFJPCh2K/FaE8XWyfPTOCS2C+L/V3MrDVEJNAQ01e1dWyNzYQeZF+Kvw64w8MfZaX4T1L8R3xSuJVOI+80dZvdJ/0THWQN+Pu3BvmF83XI83qCH1qh7z3Drpc+hbLkcyO56xLLnCQJZPCLuRbh1ALXgAXyfIv0+9G18LMt0meBmyQtI1qk32VS3CRuxz9gssJ53RDslH7vuRZ1WGXwN4LRhta2pMFDUNrqgbYupk8j/qEz0TX9woqrKt8Xfj/BXWsqfCIivQSXtsWwU/iHQz4tEHdG6MxwY4X5H6cNHmASwXWffplZH9gVBOdHmNsc8jeLrwf7zqcK/7LrCsFbLAlviFgeOOeSC2OxcK4yuIYaY0yGfkZOcto63pJSgy+gXQTv4FeoB4XTnkBHa/sqHp4vSZZaYmQZXCJ/Lf4JBEVaeOAmQ0c/VW8DzwjnGxlnKNeWg/AkwV1lHlgqvlYJrBt7v87gr+9W4Sx1z4+4McuKLPAR/ql8SoLaGqGh9z2nxF9JUPBleUyYil8qvBDBrzf40xkCEt2zRKCFwcvlJ+DXCP5vwM8hO0PwH59hg1U6xGElyX4zjxx6Y9BPsltkq7SYPxwJjGAE/wXcB8J8eESa001CAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAzLTE2VDAxOjEzOjM4KzAwOjAw6TzNwwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMy0xNlQwMToxMzozOCswMDowMJhhdX8AAAAodEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL3RtcC9tYWdpY2stQ092U29IUHBpvouTAAAAAElFTkSuQmCC"
                    , name: "Radio Tower"
                    }))

            // Default: /assets/radio-tower.png
            const stationIcon = ref(new APRSSymbol({
                    key: "logo"
                    , value: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAAASAAAAEgARslrPgAABHlJREFUaN7tmW1ollUYx3+Pj7OWmqlbUG5z2ofypQ/inOuTWPZV5ocsEvbBXCm+JSKEiCAIrj5FMkxs0ZdUfCHKl4QgUqJAUNQUtkEQFkXOUh+HbjJ9/HCfR+/9z/XcL88eHdT+cGDXff3P/1zXuc9zznWfwQhG8P9Gpkw6WaARWAjMBV4CngPGOX8v8CfQBZwBvgdOA/eGewJqgTbgDyCfsv0O7ABqhiPwamA30F9C4Nr6gV1A1eMK/m3gnzIEru0q8NajDLwC2BMRwA1gL7ACmOfeUoVr1e5ZK7APyEXofOr6lBVPAceLDNgFLHecNHrvAN1FNI+l1IudeSv4W8BGYPQQtTcBtw39o5TpTVjLphuYXa4ZApoItlkdZ9dQhZcZomcJ1rSFOmAtcALoJNj/e93fJ4A1BFuvhRrgvDHem6UGX42/23QXCb4G6AAGiN9tBoDPgClFdP4Sfg8wuZQEduOveWvZNAM3EwSuLQcsNvSagD7htqcNvhb/kNpo8NYDd0sIvtDuAusM3a3C6yPlid0mAl34u01zkeAvuMRmAWNdm+We/VIkCX0T4/CX0o6kwWfxa5vlwqnBXzZ9wCpgVIz2auPt5oDnhbtKOJdjtB/gFel4A/9Q6TCCX5h0hoBXjST2CGesMUmNScQ3S6e94q/D321Wpgi+gDWiMYC/zvcL54Mkwoel0wrxr8Vf8/pqa4FDBEsjB3wFvCicLHBRtFYL513xH0ySgIrOE/+34l9vBG9Vq//iH2IbhHNM/PONyYqFDq51epf4Z4r/kBF8oR0Q7mzxd4r/WfH3JElAf1xjxK+l8PgYv24IYYwXf078T4i/T4O1tqV8TIKjYvi3IvqqLxNjK7xvaCsBnaUJYl8Re6rYP0QEoL46sf8W+2mx9Q2ZCeg6mya2rtNFYrdFJPCh2K/FaE8XWyfPTOCS2C+L/V3MrDVEJNAQ01e1dWyNzYQeZF+Kvw64w8MfZaX4T1L8R3xSuJVOI+80dZvdJ/0THWQN+Pu3BvmF83XI83qCH1qh7z3Drpc+hbLkcyO56xLLnCQJZPCLuRbh1ALXgAXyfIv0+9G18LMt0meBmyQtI1qk32VS3CRuxz9gssJ53RDslH7vuRZ1WGXwN4LRhta2pMFDUNrqgbYupk8j/qEz0TX9woqrKt8Xfj/BXWsqfCIivQSXtsWwU/iHQz4tEHdG6MxwY4X5H6cNHmASwXWffplZH9gVBOdHmNsc8jeLrwf7zqcK/7LrCsFbLAlviFgeOOeSC2OxcK4yuIYaY0yGfkZOcto63pJSgy+gXQTv4FeoB4XTnkBHa/sqHp4vSZZaYmQZXCJ/Lf4JBEVaeOAmQ0c/VW8DzwjnGxlnKNeWg/AkwV1lHlgqvlYJrBt7v87gr+9W4Sx1z4+4McuKLPAR/ql8SoLaGqGh9z2nxF9JUPBleUyYil8qvBDBrzf40xkCEt2zRKCFwcvlJ+DXCP5vwM8hO0PwH59hg1U6xGElyX4zjxx6Y9BPsltkq7SYPxwJjGAE/wXcB8J8eESa001CAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAzLTE2VDAxOjEzOjM4KzAwOjAw6TzNwwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMy0xNlQwMToxMzozOCswMDowMJhhdX8AAAAodEVYdHN2ZzpiYXNlLXVyaQBmaWxlOi8vL3RtcC9tYWdpY2stQ092U29IUHBpvouTAAAAAElFTkSuQmCC"
                    , name: "Radio Tower"
                    }))

            return {
                packetStore
                , ambiguityVector
                , contextMenuX
                , contextMenuY
                , isShowStationInfo: ref(false)
                , packetUtil
                , currentStationPositionVector
                , genericPointVector
                , layerTimers
                , mapService
                , mapSettings
                , maxPacketAge
                , stationSettings
                , packets
                , packetAddedListener
                , packetRemovedListener
                , stationPositionVector
                , symbolService
                , trailVector
                , stationConnectionId
                , stationIcon
                , stationIconOverlay
                , stationInfoPacket
            }
        }
        , beforeUnmount() {
            this.packets.removeListener('add', this.packetAddedListener)
            this.packets.removeListener('remove', this.packetRemovedListener)

            _.each(this.layerTimers, (t) => {
                clearInterval(t)
            })
        }
        , async mounted() {
            const layers: BaseLayer[] = [
                new TileLayer({
                    className: "stamen-base-layer"
                    , preload: 1
                    , source: new StadiaMaps({
                        layer: 'stamen_toner_lite'
                        , apiKey: null
                        , retina: false
                    })
                })
                , new VectorLayer({
                    className: 'ambiguity-layer'
                    , minZoom: 8
                    , source: this.ambiguityVector
                    , updateWhileAnimating: false
                    , updateWhileInteracting: false
                })
                /*
                // watches
                , new ImageLayer({
                    className: "nowcoast-short-duration-watches"
                    , source: new ImageArcGISRest({
                        // TODO: Refresh source every minute
                        url: 'https://new.nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteoceanhydro_shortduration_hazards_watches_time/MapServer'
                        , params: {
                            'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Watches and warnings by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                    , properties: {
                        "refreshTime": 60000
                    }
                })
                // warnings
                , new ImageLayer({
                    className: "nowcoast-short-duration-warnings"
                    , source: new ImageArcGISRest({
                        // TODO: Refresh source every minute
                        url: 'https://new.nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteoceanhydro_shortduration_hazards_warnings_time/MapServer'
                        , params: {
                            'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Watches and warnings by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                    , properties: {
                        "refreshTime": 60000
                    }
                })
                , new ImageLayer({
                    className: "nowcoast-long-duration-hazards"
                    , source: new ImageArcGISRest({
                        url: 'https://new.nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteoceanhydro_longduration_hazards_time/MapServer'
                        , params: {
                            'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Watches and warnings by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                })
                // radar
                , new ImageLayer({
                    className: "nowcoast-nexrad"
                    , source: new ImageArcGISRest({
                        // TODO: Refresh every 2 -5 min... rtfm here: https://nowcoast.noaa.gov/help/#!section=updateschedule
                        url: 'https://new.nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer'
                        , params: {
                            'LAYERS': '1,3'
                            , 'FORMAT': 'PNG32'
                        }
                        , attributions: [
                            '<br />Rardar tiles by <a href="https://nowcoast.noaa.gov/">nowCOAST<sup>tm</sup></a>'
                        ]
                    })
                    , opacity: 0.5
                    , properties: {
                        "refreshTime": 60000
                    }
                })
                */
                , new VectorLayer({
                    className: 'trail-layer'
                    , declutter: true
                    , minZoom: 8
                    , source: this.trailVector
                    , updateWhileAnimating: false
                    , updateWhileInteracting: false
                })
                , new VectorLayer({
                    className: 'generic-point-layer'
                    , declutter: true
                    , minZoom: 8
                    , source: this.genericPointVector
                    , updateWhileAnimating: false
                    , updateWhileInteracting: false
                })
                , new HeatmapLayer({
                    gradient: [ '#600', '#900', '#C00', '#F00'   ]
                    , maxZoom: 8
                    , source: this.stationPositionVector
                    , weight: '1'
                })
                , new VectorLayer({                 // layer for the current station's position
                    className: 'station-layer'
                    , declutter: false
                    , source: this.currentStationPositionVector
                    , opacity: 0.7
                    , updateWhileAnimating: false
                    , updateWhileInteracting: false
                })
                , new VectorLayer({
                    className: 'station-position-layer'
                    , declutter: false
                    , minZoom: 8
                    , source: this.stationPositionVector
                    , updateWhileAnimating: false
                    , updateWhileInteracting: false
                })
            ]

            const centerLon = this.stationSettings?.longitude ?? -98.5795
            const centerLat = this.stationSettings?.latitude ?? 39.8283

            _.each(_.filter(layers, l => l.get("refreshTime") != null), l => {
                const interval = setInterval(() => { l.get("source").refresh(); console.log(`Refreshing ${l.getClassName()}`) }, l.get("refreshTime"))
                this.layerTimers[l.getClassName()] = interval
            })

            const map = new OLMap({
                target: 'map'
                , controls: defaultControls().extend([
                    new FeatureSearch()
                ])
                , layers: layers
                , view: new View({
                    center: fromLonLat([ centerLon, centerLat ]) // Default to center of the US
                    , zoom: 10
                })
            })

            // TODO: force handle nav/map resizing https://quasar.dev/vue-components/resize-observer

            // display popup on click
            map.on('singleclick', async (evt) => {
                // TODO: This seems to be getting the one on the bottom of the pile
                let feature = _.filter(map.getFeaturesAtPixel(evt.pixel), f => f.getGeometry().getType() != "LineString")[0]

                // Prevent trying to fetch data if a trail is clicked
                if(feature && feature.getGeometry().getType() != "LineString") {
                    const pkt = this.packetStore.getPacket(feature.getId())

                    if(!!pkt) {
                        this.stationConnectionId = pkt[0]

                        const icon = this.symbolService.GetAPRSSymbol(pkt[1].symbolcode, pkt[1].symboltable)
                        this.stationIcon = ref(icon['symbol'])
                        this.stationIconOverlay = ref(icon['overlay'])

                        this.stationInfoPacket = pkt[1] as aprsPacket
                        this.isShowStationInfo = true
                    }
                }

                return
            })

            // Adds a right click/contextmenu listener to the map
            map.addEventListener('contextmenu', (evt: MapBrowserEvent<UIEvent>) => {
                if(evt.coordinate) {
                    const coord = toLonLat(evt.coordinate)

                    if(coord && coord.length > 0) {
                        this.contextMenuY = coord[0]
                        this.contextMenuX = coord[1]
                    }
                }

                return
            })

            this.packetAddedListener = this.packets.on('add', (p) => {
                const packet = p[1]

                if(packet.alive == null || packet.alive == true) {
                    this.addPacket(packet, this.mapSettings.isShowTrails)
                } else {
                    // Remove "killed" objects/items
                    _.map(
                        _.compact(
                            _.filter(
                                this.stationPositionVector.getFeatures()
                                , f =>
                                    f.get('label') == packet.itemname || f.get('label') == packet.objectname
                                )
                        )
                        , f => {
                            try {
                                if(f != undefined)
                                    this.stationPositionVector.removeFeature(f)

                                // TODO: remove the entire trail... assume it won't be used again
                                const trail = this.trailVector.getFeatureById(packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                                if(trail && trail != undefined)
                                    this.trailVector.removeFeature(trail)
                            } catch(e) {
                                console.log(`Failed to add packet: ${e}`)
                            }
                        }
                    )
                }
            })

            this.packetRemovedListener = this.packets.on('remove', (packet) => {
                this.removePoints(this.genericPointVector, [ packet[1].id ])
                this.removePoints(this.stationPositionVector, [ packet[1].id ])
                this.removePoints(this.ambiguityVector, [ packet[1].id ], false)
            })

            this.$nextTick(function() {
                this.loadMapData()
            })

            return
        }
        , methods: {
            async addPacket(packet: aprsPacket, isGenerateTrail: boolean) {
                if(this.packetUtil.isValidPacket(packet) == true) {
                    // TODO: For some reason this doesn't work on initial load
                    let existingFeatures = await _.filter(this.stationPositionVector.getFeatures(), f => {
                        return (f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign))
                                && f.get('receivedTime') <= packet.receivedTime
                    })

                    const mostRecentTime = await _.max(_.reduce(existingFeatures, (result, value) => {
                        result.push(value.get('receivedTime'))
                        return result
                    }, []))

                    const symbols = await this.symbolService.GetAPRSSymbol(packet.symbolcode, packet.symboltable)
                    const styles = await this.generateIcon(packet, symbols)
                    // if no existing features || received time > all existing features
                    if((!mostRecentTime || mostRecentTime == null) || packet.receivedTime > mostRecentTime) {
                        // programatically set the property on the locations object to be reactive
                        let feature = new Feature({
                            geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                        })

                        feature.setId(packet.id)
                        feature.setProperties({
                            name: packet.sourceCallsign
                            , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                            , receivedTime: packet.receivedTime
                        })

                        feature.setStyle(await styles)

                        // NOTE: Existing features are removed below.
                        await this.stationPositionVector.addFeature(feature)
                    }

                    if(symbols['symbol'].isMovable == true) {
                        await this.addGenericPoint(packet)

                        if(isGenerateTrail == true) {
                            this.generateTrail(packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                        }
                    } else {
                        const genericPointIds = _.compact(
                            _.reduce(
                                _.filter(
                                    this.genericPointVector.getFeatures()
                                    , f => {
                                        return f.get('label') == (packet.itemname ?? packet.objectname ?? packet.sourceCallsign)
                                    }
                                )
                                , (result, value) => {
                                    result.push((value as Feature<Geometry>).getId())
                                    return result
                                }
                                , []
                            )
                        )

                        if(genericPointIds && genericPointIds != null && genericPointIds.length > 0) {
                            this.removePoints(this.ambiguityVector, genericPointIds, false)
                            this.removePoints(this.genericPointVector, genericPointIds)
                        }
                    }

                    if(!!packet && packet.posambiguity > 0) {
                        this.generateAmbiguity(packet.id, packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                                , packet.posambiguity, fromLonLat([ packet.longitude, packet.latitude ]))
                    }

                    // Remove all existing features from stationPositionVector
                    if(!!existingFeatures && existingFeatures.length > 0) {
                        _.map(existingFeatures, f => {
                            if(f != undefined) {
                                this.stationPositionVector.removeFeature(f)
                                return
                            }
                        })
                    }
                }

                return
            }
            , async generateAmbiguity(id: string, name: string, ambiguity: number, coordinate: Coordinate): Promise<void> {
                if(this.mapSettings.isShowAmbiguity == true && !!ambiguity && ambiguity > 0) {
                    let radius: number = 1852   // meters in a nautical mile

                    if(ambiguity == 1) {
                        radius = 185.2  // 0.1 nautical miles
                    } else if(ambiguity == 3) {
                        radius = 18520  // 10 nautical miles
                    } else if(ambiguity == 4) {
                        radius = 111120 // 60 nautical miles
                    }

                    let feature = new Feature(
                        new Circle(coordinate, radius)
                    )

                    feature.setId(id)
                    feature.setProperties({
                        name: name
                    })

                    feature.setStyle(amgibuityStyle)
                    this.ambiguityVector.addFeature(feature)
                }

                return
            }
            , async addGenericPoint(packet: aprsPacket): Promise<void> {
                if(this.mapSettings.isShowTrails == true) {
                    let feature = new Feature({
                        geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                    })

                    feature.setId(packet.id)
                    feature.setProperties({
                        name: packet.sourceCallsign
                        , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                        , receivedTime: packet.receivedTime
                    })

                    feature.setStyle(MapService.oldPositionStyle)
                    this.genericPointVector.addFeature(feature)
                }

                return
            }
            , async clearAllStations() {
                this.packetStore.removePackets(
                    _.reduce(this.genericPointVector.getFeatures(), (result, value) => {
                        result.push((value as Feature<Geometry>).getId())
                        return result
                    }, [])
                )

                this.packetStore.removePackets(
                    _.reduce(this.stationPositionVector.getFeatures(), (result, value) => {
                        result.push((value as Feature<Geometry>).getId())
                        return result
                    }, [])
                )

                return
            }
            , async generateIcon(packet: aprsPacket, symbols: any) {
                const symbol = symbols['symbol'] as APRSSymbol
                const overlay = symbols['overlay'] as APRSSymbol
                const retVal = new Array<Style>()

                let course = 0
                let scaleX = 1 // -1 will flip the image: https://github.com/openlayers/openlayers/pull/11037

                if(packet.course && symbol.isRotatable == true) {
                    course = NumberUtil.degToRad(packet.course - 90)

                    if(packet.course > 180) {
                        scaleX = -1
                    }
                }

                const shadowStyle = new Style({
                    image: new Icon({
                        src: symbol.value
                        , rotation: course
                        , scale: [ 1, scaleX ]  // determines whether or not to flip the icon keeping a 1:1 scale
                        , size: [ 24, 24 ]
                    })
                })

                if(this.mapSettings?.isShowLabels === true) {
                    shadowStyle.setText(
                        new Text({
                            text: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                            , fill: MapService.blackTextFill
                            , stroke: MapService.getLabelTextStroke(packet)
                            , offsetX: 10
                            , offsetY: -15
                            , font: 'bold 12px/1 Verdana'
                            , textAlign: 'left'
                        })
                    )
                }

                retVal.push(shadowStyle)

                if(overlay != null && overlay != undefined) {
                    retVal.push(
                        new Style({
                            text: new Text({
                                text: packet.symboltable
                                , fill: MapService.whiteTextFill
                                , stroke: MapService.blackTextStroke
                                , font: 'normal 16px/1 Verdana'
                                , textAlign: 'center'
                            })
                        })
                    )
                }

                return retVal
            }
            , async generateTrail(label: string) {
                if(this.mapSettings.isShowTrails == true) {
                    //TODO: force this to be serial processing? https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971
                    const coords = _.reduce(
                        _.sortBy(
                            _.compact(
                                _.filter(this.genericPointVector.getFeatures(), f => {
                                    return (f.get('label') == label)
                                })
                            )
                            , f => f.get('receivedTime')
                        )
                        , (result, value) => {
                            result.push(value.getGeometry()["flatCoordinates"])
                            return result
                        }
                        , []
                    )

                    if(coords != null) {
                        const trail = this.trailVector.getFeatureById(label)

                        if(trail != null) {
                            (trail.getGeometry() as LineString).setCoordinates(coords)
                            // TODO: append coordinate rather than re-render entire trail
                            // how to remove first instance of a given coordinate?
                            // (trail.getGeometry() as LineString).appendCoordinate(coords)
                        } else {
                            const ls = new LineString(coords)

                            let f = new Feature({
                                geometry: ls
                            })

                            f.setId(label)
                            f.setStyle(this.mapService.getTrailStyle()) // get a random trail style/color

                            this.trailVector.addFeature(f)
                        }
                    }
                }

                return
            }
            , getAllLocationPackets(): [ (string | number), aprsPacket ][] {
                const packets = _.reduce(
                        this.packetStore.getPackets
                        , (result, value) => {
                            if(value[1]) {
                                result.push(value[1])
                            }

                            return result
                        }
                        , []
                    )

                return _.compact(
                    _.sortBy(
                        _.filter(
                            packets
                            , (p) => {
                                return this.packetUtil.isValidPacket(p)
                                    && ((new Date().getTime() - p.receivedTime) < this.maxPacketAge)
                                    && p.latitude != null
                                    && p.longitude != null
                            })
                        , p => (p as aprsPacket).receivedTime
                    )
                )
            }
            , async loadMapData() {
                this.updateCurrentStationCoordinates();

                // get all the location packets and add them
                for(const p of this.getAllLocationPackets()) {
                    await this.addPacket(p, true)
                }

                return
            }
            , async removePoints(vector: VectorSource<FeatureLike>, ids?: number[] | string[], isGenerateTrail = true): Promise<void> {
                if(ids != null && ids.length > 0) {
                    const toRemove = _.compact(_.filter(vector.getFeatures(), (f) => _.indexOf(ids, f.getId()) > -1))

                    if(toRemove != null && toRemove.length > 0) {
                        for(let f of toRemove) {
                            if(f != undefined) {
                                vector.removeFeature(f)

                                if(isGenerateTrail == true) {
                                    this.generateTrail(f.get('label'))
                                }

                                //f.dispose()
                                f = null
                            }
                        }

                        return
                    }
                }

                return
            }
            , async updateCurrentStationCoordinates(): Promise<void> {
                this.currentStationPositionVector.clear();

                // get the current station and show it's position
                if(this.stationSettings.locationType == LocationTypes.FIXED) {
                    const symbols = await this.symbolService.GetAPRSSymbol(this.stationSettings.symbol, this.stationSettings.symbolOverlay);

                    let packet = new aprsPacket();

                    packet.sourceCallsign = this.stationSettings.callsign;
                    packet.latitude = this.stationSettings.latitude;
                    packet.longitude = this.stationSettings.longitude;
                    // TODO: Hardcoded for now until messaging is supported
                    packet.messaging = false;

                    const styles = await this.generateIcon(packet, symbols);

                    let feature = new Feature({
                        geometry: new Point(fromLonLat([ packet.longitude, packet.latitude ]))
                    });

                    feature.setId(packet.id);
                    feature.setProperties({
                        name: packet.sourceCallsign
                        , label: packet.itemname ?? packet.objectname ?? packet.sourceCallsign
                        , receivedTime: packet.receivedTime
                    });

                    feature.setStyle(await styles);
                    await this.currentStationPositionVector.addFeature(feature);
                }

                return;
            }
        }
    })
</script>

<style scoped lang="sass">
#map
    height: 100vh
    width: 100%
</style>

