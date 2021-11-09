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

    public getTrailStyle(): Style {
        if(this._trailStyleIndex > this._trailStyles.length -1) {
            this._trailStyleIndex = 0
        }

        return this._trailStyles[this._trailStyleIndex++]
    }
}
