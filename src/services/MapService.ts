import { aprsPacket, PacketTypeEnum } from "js-aprs-fap"
import _ from "lodash"
import CircleStyle from 'ol/style/Circle'
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"

export class MapService {
    private _trailStyleIndex = 0
    private _trailStyles: Style[] = _.map([
            "rgba(125 , 0     , 255   , 0.5)" // purple
            , "rgba(0   , 0     , 255   , 0.5)" // blue
            , "rgba(255 , 0     , 255   , 0.5)" // hot pink-ish
            , "rgba(255 , 0     , 0     , 0.5)" // red
            , "rgba(0   , 225   , 255   , 0.5)" // teal
            , "rgba(255 , 64    , 0     , 0.5)" // orange
            , "rgba(0   , 0     , 102   , 0.5)" // navy
            , "rgba(128 , 0     , 0     , 0.5)" // maroon
            , "rgba(0   , 0     , 0     , 0.5)" // black
        ], c =>
            new Style({
                stroke: new Stroke({
                    color: c
                    , width: 4
                })
            })
        )

    /**
     * Returns the color coded text border for a packet label according to the conditions listed below.
     * These can be found at: http://www.aprs.org/symbols.html
     *
     * NOTE: Support for blue, yello, dark gray, and black are not yet supported.
     *
     * WHITE: . . . . . . . A Full-up APRS station that is message capable
     * GRAY: . . . . . . . . A Tracker or other station without message capability
     * CYAN: . . . . . . . . A moving station with CSE/SPEED or a Dead Reckoned Station
     * BLUE(dark) . . . . The previous position of a MOVED station or object
     * YELLOW: . . . . . Your own active OBJECTS you are transmitting to the net
     * VIOLET: . . . . . . Objects placed on the map by others
     * Dark GRAY: . . . Old Symbols not updated in the last 80 minutes or more
     * BLACK: . . . . . . Old Symbols that have been "killed" by the originator
     * RED: . . . . . . . . . Emergency, Alarmed, or otherwise unknown symbols
     *
     * @param {aprsPacket} packet
     * @returns {Stroke} The stroke with the proper color for the text border.
     */

    public static getLabelTextStroke(packet: aprsPacket): Stroke {
        if(packet.type == PacketTypeEnum.OBJECT || packet.type == PacketTypeEnum.ITEM) {
            // TODO: YELLOW: Your own active OBJECTS you are transmitting to the net
            return MapService.violetTextStroke
        } else if(packet.course && packet.speed) {
            return MapService.cyanTextStroke
        } else if(packet.messaging && packet.messaging == true) {
            return MapService.whiteTextStroke
        } else if(packet.messaging == null || packet.messaging == false) {
            // TODO: This may not be entirely accurate.  Check js-aprs-fap to make sure the messaging value is always set where appropriate
            return MapService.grayTextStroke
        }

        // TODO: Dark Gray
        // TODO: Black

        return MapService.redTextStroke

    }

    public static oldPositionStyle: Style = new Style({
        image: new CircleStyle({
            radius: 3
            , fill: new Fill({ color: "red" })
        })
    })

    public static whiteTextFill: Fill = new Fill({
        color: 'white'
    })

    public static blackTextFill: Fill = new Fill({
        color: 'black'
    })

    public static blackTextStroke: Stroke = new Stroke({
        color: 'black'
        , width: 2
    })

    public static whiteTextStroke: Stroke = new Stroke({
        color: 'white'
        , width: 4
    })

    public static grayTextStroke: Stroke = new Stroke({
        color: 'silver'
        , width: 4
    })

    public static cyanTextStroke: Stroke = new Stroke({
        color: "rgba(0, 255, 255, 0.7)"
        , width: 4
    })

    public static darkBlueTextStroke: Stroke = new Stroke({
        color: "navy"
        , width: 4
    })

    public static yellowTextStroke: Stroke = new Stroke({
        color: "yellow"
        , width: 4
    })

    public static violetTextStroke: Stroke = new Stroke({
        color: "rgba(238, 130, 238, 0.7)"
        , width: 4
    })

    public static darkGrayTextStroke: Stroke = new Stroke({
        color: "charcoal"
        , width: 4
    })

    public static redTextStroke: Stroke = new Stroke({
        color: "rgba(255, 0, 0, 0.7)"
        , width: 4
    })

    public getTrailStyle(): Style {
        if(this._trailStyleIndex > this._trailStyles.length -1) {
            this._trailStyleIndex = 0
        }

        return this._trailStyles[this._trailStyleIndex++]
    }
}
