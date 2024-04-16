import { aprsPacket, PacketTypeEnum } from "js-aprs-fap"
import _ from "lodash"
import CircleStyle from 'ol/style/Circle'
import Fill from "ol/style/Fill"
import Stroke from "ol/style/Stroke"
import Style from "ol/style/Style"

export class MapService {
    private _trailStyleIndex = 0
    private _trailStyles: Style[] = _.map([
          "rgba(0   , 255   , 255   , 0.8)" // aqua
        , "rgba(138 , 43    , 226   , 0.8)" // blue violet
        , "rgba(248 , 131   , 121   , 0.8)" // coral pink
        , "rgba(255 , 29    , 206   , 0.8)" // Hot Magenta
        , "rgba(255 , 247   , 0     , 0.8)" // Lemon
        , "rgba(124 , 252   , 0     , 0.8)" // Lawn Green
        , "rgba(0   , 0     , 205   , 0.8)" // MediumBlue
        , "rgba(255 , 79    , 0     , 0.8)" // International Orange
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

    public getLabelTextStroke(packet: aprsPacket): Stroke {
        if(packet.type == PacketTypeEnum.OBJECT || packet.type == PacketTypeEnum.ITEM) {
            // TODO: YELLOW: Your own active OBJECTS you are transmitting to the net
            return this.violetTextStroke
        } else if(packet.course && packet.speed) {
            return this.cyanTextStroke
        } else if(packet.messaging && packet.messaging == true) {
            return this.whiteTextStroke
        } else if(packet.messaging == null || packet.messaging == false) {
            // TODO: This may not be entirely accurate.  Check js-aprs-fap to make sure the messaging value is always set where appropriate
            return this.grayTextStroke
        }

        // TODO: Dark Gray
        // TODO: Black

        return this.redTextStroke
    }

    public readonly oldPositionStyle: Style = new Style({
        image: new CircleStyle({
            radius: 3
            , fill: new Fill({ color: "red" })
        })
    })

    public readonly whiteTextFill: Fill = new Fill({
        color: 'white'
    })

    public readonly blackTextFill: Fill = new Fill({
        color: 'black'
    })

    public readonly blackTextStroke: Stroke = new Stroke({
        color: 'black'
        , width: 2
    })

    public readonly whiteTextStroke: Stroke = new Stroke({
        color: 'white'
        , width: 4
    })

    public readonly grayTextStroke: Stroke = new Stroke({
        color: 'silver'
        , width: 4
    })

    public readonly cyanTextStroke: Stroke = new Stroke({
        color: "rgba(0, 255, 255, 0.7)"
        , width: 4
    })

    public readonly darkBlueTextStroke: Stroke = new Stroke({
        color: "navy"
        , width: 4
    })

    public readonly yellowTextStroke: Stroke = new Stroke({
        color: "yellow"
        , width: 4
    })

    public readonly violetTextStroke: Stroke = new Stroke({
        color: "rgba(238, 130, 238, 0.7)"
        , width: 4
    })

    public readonly darkGrayTextStroke: Stroke = new Stroke({
        color: "charcoal"
        , width: 4
    })

    public readonly redTextStroke: Stroke = new Stroke({
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
