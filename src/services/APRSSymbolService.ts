import APRSSymbol from '@/models/APRSSymbol'
import StringUtil from '@/utils/StringUtil'

interface IAPRSSymbolService {
    symbols: APRSSymbol[];
    overlays: APRSSymbol[];

    GetAPRSSymbol(symbolCode: string, symbolTableId?: string): APRSSymbol
    GetOverlays(): APRSSymbol[]
    GetSymbols(): APRSSymbol[]
    GetSymbolByKey(key?: string): APRSSymbol
}

/**
 * Defines a set of symbols to be used as defined in chapter 20 of the APRS spec.
 */
export class APRSSymbolService implements IAPRSSymbolService {
    public symbols: APRSSymbol[];
    public overlays: APRSSymbol[];

    // TODO: allow user to define their own default?
    private readonly CROSSHAIR = new APRSSymbol({
        key: ''
        , value: require('@/assets/symbols/Crosshair.png')
        , name: "Crosshair"
    });

    constructor() {


        /*
         * TODO: For more fun, here's a more descriptive list
         * in the future, we could change the name accordingly for specific alt types
         */
        this.symbols = [
              new APRSSymbol({ key: "/!"    , value: require('@/assets/symbols/PrimaryTable/PD.png'                         ), name: "Police Department"            })
            , new APRSSymbol({ key: '/#'    , value: require('@/assets/symbols/PrimaryTable/Digipeater.png'                 ), name: "Digipeater"                   })
            , new APRSSymbol({ key: '/$'    , value: require('@/assets/symbols/PrimaryTable/Phone.png'                      ), name: "Phone"                        })
            , new APRSSymbol({ key: '/%'    , value: require('@/assets/symbols/PrimaryTable/DX.png'                         ), name: "DX Station"                   })
            , new APRSSymbol({ key: '/&'    , value: require('@/assets/symbols/PrimaryTable/Gateway.png'                    ), name: "Gateway"                      })
            , new APRSSymbol({ key: '/\''   , value: require('@/assets/symbols/PrimaryTable/SmallAircraft.png'              ), name: "Small Aircraft"               })
            , new APRSSymbol({ key: '/('    , value: require('@/assets/symbols/PrimaryTable/MobileSatteliteStation.png'     ), name: "Mobile Sattelite Station"     })
            , new APRSSymbol({ key: '/)'    , value: require('@/assets/symbols/PrimaryTable/Wheelchair.png'                 ), name: "Wheelchair"                   })
            , new APRSSymbol({ key: '/*'    , value: require('@/assets/symbols/PrimaryTable/Snowmobile.png'                 ), name: "Snow Mobile"                  })
            , new APRSSymbol({ key: '/+'    , value: require('@/assets/symbols/PrimaryTable/RedCross.png'                   ), name: "Red Cross"                    })
            , new APRSSymbol({ key: '/,'    , value: require('@/assets/symbols/PrimaryTable/BoyScout.png'                   ), name: "Boy Scouts"                   })
            , new APRSSymbol({ key: '/-'    , value: require('@/assets/symbols/PrimaryTable/House.png'                      ), name: "House"                        })
            , new APRSSymbol({ key: '/.'    , value: require('@/assets/symbols/PrimaryTable/RedX.png'                       ), name: "X"                            })
            , new APRSSymbol({ key: '//'    , value: require('@/assets/symbols/PrimaryTable/RedDot.png'                     ), name: "Dot"                          })
            , new APRSSymbol({ key: '/0'    , value: require('@/assets/symbols/PrimaryTable/Circle.png'                     ), name: "Circle 0"                     })
            , new APRSSymbol({ key: '/1'    , value: require('@/assets/symbols/PrimaryTable/Circle1.png'                    ), name: "Circle 1"                     })
            , new APRSSymbol({ key: '/2'    , value: require('@/assets/symbols/PrimaryTable/Circle2.png'                    ), name: "Circle 2"                     })
            , new APRSSymbol({ key: '/3'    , value: require('@/assets/symbols/PrimaryTable/Circle3.png'                    ), name: "Circle 3"                     })
            , new APRSSymbol({ key: '/4'    , value: require('@/assets/symbols/PrimaryTable/Circle4.png'                    ), name: "Circle 4"                     })
            , new APRSSymbol({ key: '/5'    , value: require('@/assets/symbols/PrimaryTable/Circle5.png'                    ), name: "Circle 5"                     })
            , new APRSSymbol({ key: '/6'    , value: require('@/assets/symbols/PrimaryTable/Circle6.png'                    ), name: "Circle 6"                     })
            , new APRSSymbol({ key: '/7'    , value: require('@/assets/symbols/PrimaryTable/Circle7.png'                    ), name: "Circle 7"                     })
            , new APRSSymbol({ key: '/8'    , value: require('@/assets/symbols/PrimaryTable/Circle8.png'                    ), name: "Circle 8"                     })
            , new APRSSymbol({ key: '/9'    , value: require('@/assets/symbols/PrimaryTable/Circle9.png'                    ), name: "Circle 9"                     })
            , new APRSSymbol({ key: '/:'    , value: require('@/assets/symbols/PrimaryTable/Fire.png'                       ), name: "Fire"                         })
            , new APRSSymbol({ key: '/;'    , value: require('@/assets/symbols/PrimaryTable/Campground.png'                 ), name: "Campground"                   })
            , new APRSSymbol({ key: '/<'    , value: require('@/assets/symbols/PrimaryTable/Motorcycle.png'                 ), name: "Motorcycle"                   })
            , new APRSSymbol({ key: '/='    , value: require('@/assets/symbols/PrimaryTable/TrainEngine.png'                ), name: "Train"                        })
            , new APRSSymbol({ key: '/>'    , value: require('@/assets/symbols/PrimaryTable/Car.png'                        ), name: "Car"                          })
            , new APRSSymbol({ key: '/?'    , value: require('@/assets/symbols/PrimaryTable/FileServer.png'                 ), name: "File Server"                  })
            , new APRSSymbol({ key: '/@'    , value: require('@/assets/symbols/PrimaryTable/HurricaneFuturePrediction.png'  ), name: "Hurricane Future Prediction"  })
            , new APRSSymbol({ key: '/A'    , value: require('@/assets/symbols/PrimaryTable/AidStation.png'                 ), name: "Aid Station"                  })
            , new APRSSymbol({ key: '/B'    , value: require('@/assets/symbols/PrimaryTable/BullitenSystem.png'             ), name: "Bulliten System"              })
            , new APRSSymbol({ key: '/C'    , value: require('@/assets/symbols/PrimaryTable/Canoe.png'                      ), name: "Canoe"                        })
            , new APRSSymbol({ key: '/E'    , value: require('@/assets/symbols/PrimaryTable/Eye.png'                        ), name: "Eye"                          })
            , new APRSSymbol({ key: '/F'    , value: require('@/assets/symbols/PrimaryTable/FarmEquipment.png'              ), name: "Farm Equipment"               })
            , new APRSSymbol({ key: '/G'    , value: require('@/assets/symbols/PrimaryTable/GridSquare.png'                 ), name: "Grid Square"                  })
            , new APRSSymbol({ key: '/H'    , value: require('@/assets/symbols/PrimaryTable/Hotel.png'                      ), name: "Hotel"                        })
            , new APRSSymbol({ key: '/I'    , value: require('@/assets/symbols/PrimaryTable/TCPIPOnAirNetwork.png'          ), name: "TCPIP On Air Network"         })
            , new APRSSymbol({ key: '/K'    , value: require('@/assets/symbols/PrimaryTable/School.png'                     ), name: "School"                       })
            , new APRSSymbol({ key: '/L'    , value: require('@/assets/symbols/PrimaryTable/PCUser.png'                     ), name: "PC User"                      })
            , new APRSSymbol({ key: '/M'    , value: require('@/assets/symbols/PrimaryTable/MacAprs.png'                    ), name: "Mac APRS"                     })
            , new APRSSymbol({ key: '/N'    , value: require('@/assets/symbols/PrimaryTable/NationalTrafficStation.png'     ), name: "National Traffic Station"     })
            , new APRSSymbol({ key: '/O'    , value: require('@/assets/symbols/PrimaryTable/Balloon.png'                    ), name: "Balloon"                      })
            , new APRSSymbol({ key: '/P'    , value: require('@/assets/symbols/PrimaryTable/Police.png'                     ), name: "Police"                       })
            , new APRSSymbol({ key: '/Q'    , value: require('@/assets/symbols/PrimaryTable/Quake.png'                      ), name: "Earthquake"                   }) // TBD?
            , new APRSSymbol({ key: '/R'    , value: require('@/assets/symbols/PrimaryTable/RV.png'                         ), name: "RV"                           })
            , new APRSSymbol({ key: '/S'    , value: require('@/assets/symbols/PrimaryTable/Shuttle.png'                    ), name: "Shuttle"                      })
            , new APRSSymbol({ key: '/T'    , value: require('@/assets/symbols/PrimaryTable/SSTV.png'                       ), name: "SSTV"                         })
            , new APRSSymbol({ key: '/U'    , value: require('@/assets/symbols/PrimaryTable/Bus.png'                        ), name: "Bus"                          })
            , new APRSSymbol({ key: '/V'    , value: require('@/assets/symbols/PrimaryTable/ATV.png'                        ), name: "ATV"                          }) // TODO: Find out what this really stands for
            , new APRSSymbol({ key: '/W'    , value: require('@/assets/symbols/PrimaryTable/NationalWeatherService.png'     ), name: "NWS"                          })
            , new APRSSymbol({ key: '/X'    , value: require('@/assets/symbols/PrimaryTable/Helicopter.png'                 ), name: "Helicopter"                   })
            , new APRSSymbol({ key: '/Y'    , value: require('@/assets/symbols/PrimaryTable/Yacht.png'                      ), name: "Yacht"                        })
            , new APRSSymbol({ key: '/Z'    , value: require('@/assets/symbols/PrimaryTable/WinAprs.png'                    ), name: "Win APRS"                     })
            , new APRSSymbol({ key: '/['    , value: require('@/assets/symbols/PrimaryTable/Person.png'                     ), name: "Person"                       })
            , new APRSSymbol({ key: '/\\'   , value: require('@/assets/symbols/PrimaryTable/DFStation.png'                  ), name: "DF Station"                   })
            , new APRSSymbol({ key: '/]'    , value: require('@/assets/symbols/PrimaryTable/PostOffice.png'                 ), name: "Post Office"                  })
            , new APRSSymbol({ key: '/^'    , value: require('@/assets/symbols/PrimaryTable/LargeAircraft.png'              ), name: "Large Aircraft"               })
            , new APRSSymbol({ key: '/_'    , value: require('@/assets/symbols/PrimaryTable/WeatherStation.png'             ), name: "Weather Station"              })
            , new APRSSymbol({ key: '/`'    , value: require('@/assets/symbols/PrimaryTable/DishAntenna.png'                ), name: "Dish Antenna"                 })
            , new APRSSymbol({ key: '/a'    , value: require('@/assets/symbols/PrimaryTable/Ambulance.png'                  ), name: "Ambulance"                    })
            , new APRSSymbol({ key: '/b'    , value: require('@/assets/symbols/PrimaryTable/Bicycle.png'                    ), name: "Bicycle"                      })
            , new APRSSymbol({ key: '/c'    , value: require('@/assets/symbols/PrimaryTable/IncidentCommandPost.png'        ), name: "Incident Command Post"        })
            , new APRSSymbol({ key: '/d'    , value: require('@/assets/symbols/PrimaryTable/Firehouse.png'                  ), name: "Firehouse"                    })
            , new APRSSymbol({ key: '/e'    , value: require('@/assets/symbols/PrimaryTable/Horse.png'                      ), name: "Horse"                        })
            , new APRSSymbol({ key: '/f'    , value: require('@/assets/symbols/PrimaryTable/FireTruck.png'                  ), name: "Fire Truck"                   })
            , new APRSSymbol({ key: '/g'    , value: require('@/assets/symbols/PrimaryTable/Glider.png'                     ), name: "Glider"                       })
            , new APRSSymbol({ key: '/h'    , value: require('@/assets/symbols/PrimaryTable/Hospital.png'                   ), name: "Hospital"                     })
            , new APRSSymbol({ key: '/i'    , value: require('@/assets/symbols/PrimaryTable/IslandsOnTheAir.png'            ), name: "Islands on the Air"           })
            , new APRSSymbol({ key: '/j'    , value: require('@/assets/symbols/PrimaryTable/Jeep.png'                       ), name: "Jeep"                         })
            , new APRSSymbol({ key: '/k'    , value: require('@/assets/symbols/PrimaryTable/Truck.png'                      ), name: "Truck"                        })
            , new APRSSymbol({ key: '/l'    , value: require('@/assets/symbols/PrimaryTable/Laptop.png'                     ), name: "Laptop"                       })
            , new APRSSymbol({ key: '/m'    , value: require('@/assets/symbols/PrimaryTable/MicERepeater.png'               ), name: "Mic E Repeater"               })
            , new APRSSymbol({ key: '/n'    , value: require('@/assets/symbols/PrimaryTable/Node.png'                       ), name: "Node"                         })
            , new APRSSymbol({ key: '/o'    , value: require('@/assets/symbols/PrimaryTable/EOC.png'                        ), name: "EOC"                          })
            , new APRSSymbol({ key: '/p'    , value: require('@/assets/symbols/PrimaryTable/Dog.png'                        ), name: "Dog"                          })
            , new APRSSymbol({ key: '/q'    , value: require('@/assets/symbols/PrimaryTable/GridSquare2.png'                ), name: "Gridsquare"                   })
            , new APRSSymbol({ key: '/r'    , value: require('@/assets/symbols/PrimaryTable/Repeater.png'                   ), name: "Repeater"                     })
            , new APRSSymbol({ key: '/s'    , value: require('@/assets/symbols/PrimaryTable/Boat.png'                       ), name: "Boat"                         })
            , new APRSSymbol({ key: '/t'    , value: require('@/assets/symbols/PrimaryTable/TruckStop.png'                  ), name: "Truck Stop"                   })
            , new APRSSymbol({ key: '/u'    , value: require('@/assets/symbols/PrimaryTable/SemiTruck.png'                  ), name: "Semi Truck"                   })
            , new APRSSymbol({ key: '/v'    , value: require('@/assets/symbols/PrimaryTable/Van.png'                        ), name: "Van"                          })
            , new APRSSymbol({ key: '/w'    , value: require('@/assets/symbols/PrimaryTable/WaterStation.png'               ), name: "Water Station"                })
            , new APRSSymbol({ key: '/x'    , value: require('@/assets/symbols/PrimaryTable/Xastir.png'                     ), name: "Xastir"                       })
            , new APRSSymbol({ key: '/y'    , value: require('@/assets/symbols/PrimaryTable/HouseWithYagi.png'              ), name: "House with Yagi"              })
            , new APRSSymbol({ key: '/z'    , value: require('@/assets/symbols/PrimaryTable/TBD.png'                        ), name: "TBD"                          })
            , new APRSSymbol({ key: '/|'    , value: require('@/assets/symbols/PrimaryTable/TNCStreamSwitch.png'            ), name: "TNC Strem Switch"             })
            , new APRSSymbol({ key: '/~'    , value: require('@/assets/symbols/PrimaryTable/TNCStreamSwitch1.png'           ), name: "TNC Strem Switch"             })

            // BEGIN ALTERNATE TABLE
            , new APRSSymbol({ key: '!'     , value: require('@/assets/symbols/AlternateTable/Emergency.png'                ), name: "Emergency"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '#'     , value: require('@/assets/symbols/AlternateTable/Digipeater.png'               ), name: "Digipeater"           , isAllowOverlay: true })
            , new APRSSymbol({ key: '$'     , value: require('@/assets/symbols/AlternateTable/Bank.png'                     ), name: "Bank"                 , isAllowOverlay: true })
            // TODO: Create PowerPlant icon '\\%', value: "/AlternateTable/
            , new APRSSymbol({ key: '&'     , value: require('@/assets/symbols/AlternateTable/BlackDiamond.png'             ), name: "Black Diamond"        , isAllowOverlay: true })
            , new APRSSymbol({ key: '\''    , value: require('@/assets/symbols/AlternateTable/CrashSite.png'                ), name: "Crash Site"           , isAllowOverlay: true })
            , new APRSSymbol({ key: '('     , value: require('@/assets/symbols/AlternateTable/Cloudy.png'                   ), name: "Cloudy"               , isAllowOverlay: true })
            , new APRSSymbol({ key: ')'     , value: require('@/assets/symbols/AlternateTable/Firenet.png'                  ), name: "Firenet"              , isAllowOverlay: true })
            , new APRSSymbol({ key: '*'     , value: require('@/assets/symbols/AlternateTable/Snow.png'                     ), name: "Snow"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: '+'     , value: require('@/assets/symbols/AlternateTable/Church.png'                   ), name: "Church"               , isAllowOverlay: true })
            , new APRSSymbol({ key: ','     , value: require('@/assets/symbols/AlternateTable/GirlScout.png'                ), name: "Girl Scout"           , isAllowOverlay: true })
            , new APRSSymbol({ key: '-'     , value: require('@/assets/symbols/AlternateTable/HouseHF.png'                  ), name: "House HF"             , isAllowOverlay: true })
            , new APRSSymbol({ key: '.'     , value: require('@/assets/symbols/AlternateTable/Ambiguous.png'                ), name: "Ambiguous"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '/'     , value: require('@/assets/symbols/AlternateTable/Waypoint.png'                 ), name: "Waypoint"             , isAllowOverlay: true })
            , new APRSSymbol({ key: '0'     , value: require('@/assets/symbols/AlternateTable/Circle.png'                   ), name: "Circle"               , isAllowOverlay: true})
            // TODO: ADD 802.11 OR OTHER NETWORK NODE ICON (\8)
            , new APRSSymbol({ key: '9'     , value: require('@/assets/symbols/AlternateTable/GasStation.png'               ), name: "Gas Station"          , isAllowOverlay: true })
            , new APRSSymbol({ key: ':'     , value: require('@/assets/symbols/AlternateTable/Hail.png'                     ), name: "Hail"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: ';'     , value: require('@/assets/symbols/AlternateTable/Park.png'                     ), name: "Park"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: '<'     , value: require('@/assets/symbols/AlternateTable/WeatherFlag.png'              ), name: "Weather Flag"         , isAllowOverlay: true })
            // TODO: ADD APRSTT TOUCHTONE (DTMF USERS) ICON (\=)
            , new APRSSymbol({ key: '>'     , value: require('@/assets/symbols/AlternateTable/AltCar.png'                   ), name: "Car"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: '?'     , value: require('@/assets/symbols/AlternateTable/InfoKiosk.png'                ), name: "Info Kiosk"           , isAllowOverlay: true })
            , new APRSSymbol({ key: '@'     , value: require('@/assets/symbols/AlternateTable/Hurricane.png'                ), name: "Hurricane"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'A'     , value: require('@/assets/symbols/AlternateTable/OverlayBox.png'               ), name: "Overlay Box"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'B'     , value: require('@/assets/symbols/AlternateTable/BlowingSnow.png'              ), name: "Blowing Snow"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'C'     , value: require('@/assets/symbols/AlternateTable/CoastGuard.png'               ), name: "Coast Guard"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'D'     , value: require('@/assets/symbols/AlternateTable/Drizzle.png'                  ), name: "Drizzle"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'E'     , value: require('@/assets/symbols/AlternateTable/Smoke.png'                    ), name: "Smoke"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'F'     , value: require('@/assets/symbols/AlternateTable/FreezingRain.png'             ), name: "Freezing Rain"        , isAllowOverlay: true })
            , new APRSSymbol({ key: 'G'     , value: require('@/assets/symbols/AlternateTable/SnowShower.png'               ), name: "Snow Shower"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'H'     , value: require('@/assets/symbols/AlternateTable/Haze.png'                     ), name: "Haze"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'I'     , value: require('@/assets/symbols/AlternateTable/RainShower.png'               ), name: "Rain Shower"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'J'     , value: require('@/assets/symbols/AlternateTable/Lightning.png'                ), name: "Lightning"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'K'     , value: require('@/assets/symbols/AlternateTable/KenwoodHT.png'                ), name: "Kenwood HT"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'L'     , value: require('@/assets/symbols/AlternateTable/Lighthouse.png'               ), name: "Lighthouse"           , isAllowOverlay: true })
            // TODO: ADD MARS ICON (\M)
            , new APRSSymbol({ key: 'N'     , value: require('@/assets/symbols/AlternateTable/Bouy.png'                     ), name: "Bouy"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'O'     , value: require('@/assets/symbols/AlternateTable/Rocket.png'                   ), name: "Rocket"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'P'     , value: require('@/assets/symbols/AlternateTable/Parking.png'                  ), name: "Parking"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'Q'     , value: require('@/assets/symbols/AlternateTable/Earthquake.png'               ), name: "Earthquake"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'R'     , value: require('@/assets/symbols/AlternateTable/Restaurant.png'               ), name: "Restaurant"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'S'     , value: require('@/assets/symbols/AlternateTable/Satellite.png'                ), name: "Satellite"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'T'     , value: require('@/assets/symbols/AlternateTable/Thunderstorm.png'             ), name: "Thunderstorm"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'U'     , value: require('@/assets/symbols/AlternateTable/Sunny.png'                    ), name: "Sunny"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'V'     , value: require('@/assets/symbols/AlternateTable/VORTAC.png'                   ), name: "VORTAC"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'W'     , value: require('@/assets/symbols/AlternateTable/NWSSite.png'                  ), name: "NWS Site"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'X'     , value: require('@/assets/symbols/AlternateTable/Pharmacy.png'                 ), name: "Pharmacy"             , isAllowOverlay: true })
            // TODO: ADD RADIOS AND DEVICES ICON (\Y)
            , new APRSSymbol({ key: '['     , value: require('@/assets/symbols/AlternateTable/Wallcloud.png'                ), name: "Wallcloud"            , isAllowOverlay: true })
            // TODO: ADD OVERLAYABLE GPS SYMBOL (\\)
            , new APRSSymbol({ key: '^'     , value: require('@/assets/symbols/AlternateTable/Aircraft.png'                 ), name: "Aircraft"             , isAllowOverlay: true })
            , new APRSSymbol({ key: '_'     , value: require('@/assets/symbols/AlternateTable/WXSite.png'                   ), name: "WX Site"              , isAllowOverlay: true })
            , new APRSSymbol({ key: '`'     , value: require('@/assets/symbols/AlternateTable/Rain.png'                     ), name: "Rain"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'a'     , value: require('@/assets/symbols/AlternateTable/RedDiamond.png'               ), name: "Red Diamond"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'b'     , value: require('@/assets/symbols/AlternateTable/BlowingSand.png'              ), name: "Blowing Sand"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'c'     , value: require('@/assets/symbols/AlternateTable/CDTriangle.png'               ), name: "CD Triangle"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'd'     , value: require('@/assets/symbols/AlternateTable/DXSpot.png'                   ), name: "DX Spot"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'e'     , value: require('@/assets/symbols/AlternateTable/Sleet.png'                    ), name: "Sleet"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'f'     , value: require('@/assets/symbols/AlternateTable/FunnelCloud.png'              ), name: "Funnel Cloud"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'g'     , value: require('@/assets/symbols/AlternateTable/GaleFlags.png'                ), name: "Gale Flags"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'h'     , value: require('@/assets/symbols/AlternateTable/HamStore.png'                 ), name: "Ham Store"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'i'     , value: require('@/assets/symbols/AlternateTable/POIBox.png'                   ), name: "POI Box"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'j'     , value: require('@/assets/symbols/AlternateTable/WorkZone.png'                 ), name: "Work Zone"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'k'     , value: require('@/assets/symbols/AlternateTable/SpecialVehicle.png'           ), name: "Special Vehicle"      , isAllowOverlay: true })
            // TODO: ADD AREAS ICON (\l)
            , new APRSSymbol({ key: 'm'     , value: require('@/assets/symbols/AlternateTable/ValueSign.png'                ), name: "Value Sign"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'n'     , value: require('@/assets/symbols/AlternateTable/OverlayTriangle.png'          ), name: "Overlay Triangle"     , isAllowOverlay: true })
            , new APRSSymbol({ key: 'o'     , value: require('@/assets/symbols/AlternateTable/SmallCircle.png'              ), name: "Small Circle"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'p'     , value: require('@/assets/symbols/AlternateTable/PartlyCloudy.png'             ), name: "Partly Cloudy"        , isAllowOverlay: true })
            , new APRSSymbol({ key: 'r'     , value: require('@/assets/symbols/AlternateTable/Restrooms.png'                ), name: "Restrooms"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 's'     , value: require('@/assets/symbols/AlternateTable/Boat.png'                     ), name: "Boat"                 , isAllowOverlay: true })    // TODO: Make a better graphic
            , new APRSSymbol({ key: 't'     , value: require('@/assets/symbols/AlternateTable/Tornado.png'                  ), name: "Tornado"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'u'     , value: require('@/assets/symbols/AlternateTable/AltTruck.png'                 ), name: "Truck"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'v'     , value: require('@/assets/symbols/AlternateTable/AltVan.png'                   ), name: "Van"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: 'w'     , value: require('@/assets/symbols/AlternateTable/Flood.png'                    ), name: "Flood"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'x'     , value: require('@/assets/symbols/AlternateTable/Obstruction.png'              ), name: "Obstruction"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'y'     , value: require('@/assets/symbols/AlternateTable/Skywarn.png'                  ), name: "Skywarn"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'z'     , value: require('@/assets/symbols/AlternateTable/Shelter.png'                  ), name: "Shelter"              , isAllowOverlay: true })
            , new APRSSymbol({ key: '{'     , value: require('@/assets/symbols/AlternateTable/Fog.png'                      ), name: "Fog"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: '|'     , value: require('@/assets/symbols/AlternateTable/TNCSwitchStream1.png'         ), name: "TNC Switch Stream 1"  , isAllowOverlay: true })
            , new APRSSymbol({ key: '~'     , value: require('@/assets/symbols/AlternateTable/TNCSwitchStream2.png'         ), name: "TNC Switch Stream 2"  , isAllowOverlay: true })
        ];

        this.overlays = [
              new APRSSymbol({ key: '0'     , value: require('@/assets/symbols/Overlay/Zero.png'        ), name: "0" })
            , new APRSSymbol({ key: '1'     , value: require('@/assets/symbols/Overlay/One.png'         ), name: "1" })
            , new APRSSymbol({ key: '2'     , value: require('@/assets/symbols/Overlay/Two.png'         ), name: "2" })
            , new APRSSymbol({ key: '3'     , value: require('@/assets/symbols/Overlay/Three.png'       ), name: "3" })
            , new APRSSymbol({ key: '4'     , value: require('@/assets/symbols/Overlay/Four.png'        ), name: "4" })
            , new APRSSymbol({ key: '5'     , value: require('@/assets/symbols/Overlay/Five.png'        ), name: "5" })
            , new APRSSymbol({ key: '6'     , value: require('@/assets/symbols/Overlay/Six.png'         ), name: "6" })
            , new APRSSymbol({ key: '7'     , value: require('@/assets/symbols/Overlay/Seven.png'       ), name: "7" })
            , new APRSSymbol({ key: '8'     , value: require('@/assets/symbols/Overlay/Eight.png'       ), name: "8" })
            , new APRSSymbol({ key: '9'     , value: require('@/assets/symbols/Overlay/Nine.png'        ), name: "9" })
            , new APRSSymbol({ key: 'a'     , value: require('@/assets/symbols/Overlay/la.png'          ), name: "a" })
            , new APRSSymbol({ key: 'b'     , value: require('@/assets/symbols/Overlay/lb.png'          ), name: "b" })
            , new APRSSymbol({ key: 'c'     , value: require('@/assets/symbols/Overlay/lc.png'          ), name: "c" })
            , new APRSSymbol({ key: 'd'     , value: require('@/assets/symbols/Overlay/ld.png'          ), name: "d" })
            , new APRSSymbol({ key: 'e'     , value: require('@/assets/symbols/Overlay/le.png'          ), name: "e" })
            , new APRSSymbol({ key: 'f'     , value: require('@/assets/symbols/Overlay/lf.png'          ), name: "f" })
            , new APRSSymbol({ key: 'g'     , value: require('@/assets/symbols/Overlay/lg.png'          ), name: "g" })
            , new APRSSymbol({ key: 'h'     , value: require('@/assets/symbols/Overlay/lh.png'          ), name: "h" })
            , new APRSSymbol({ key: 'i'     , value: require('@/assets/symbols/Overlay/li.png'          ), name: "i" })
            , new APRSSymbol({ key: 'j'     , value: require('@/assets/symbols/Overlay/lj.png'          ), name: "j" })
            , new APRSSymbol({ key: 'k'     , value: require('@/assets/symbols/Overlay/lk.png'          ), name: "k" })
            , new APRSSymbol({ key: 'l'     , value: require('@/assets/symbols/Overlay/ll.png'          ), name: "l" })
            , new APRSSymbol({ key: 'm'     , value: require('@/assets/symbols/Overlay/lm.png'          ), name: "m" })
            , new APRSSymbol({ key: 'n'     , value: require('@/assets/symbols/Overlay/ln.png'          ), name: "n" })
            , new APRSSymbol({ key: 'o'     , value: require('@/assets/symbols/Overlay/lo.png'          ), name: "o" })
            , new APRSSymbol({ key: 'p'     , value: require('@/assets/symbols/Overlay/lp.png'          ), name: "p" })
            , new APRSSymbol({ key: 'q'     , value: require('@/assets/symbols/Overlay/lq.png'          ), name: "q" })
            , new APRSSymbol({ key: 'r'     , value: require('@/assets/symbols/Overlay/lr.png'          ), name: "r" })
            , new APRSSymbol({ key: 's'     , value: require('@/assets/symbols/Overlay/ls.png'          ), name: "s" })
            , new APRSSymbol({ key: 't'     , value: require('@/assets/symbols/Overlay/lt.png'          ), name: "t" })
            , new APRSSymbol({ key: 'u'     , value: require('@/assets/symbols/Overlay/lu.png'          ), name: "u" })
            , new APRSSymbol({ key: 'v'     , value: require('@/assets/symbols/Overlay/lv.png'          ), name: "v" })
            , new APRSSymbol({ key: 'w'     , value: require('@/assets/symbols/Overlay/lw.png'          ), name: "w" })
            , new APRSSymbol({ key: 'x'     , value: require('@/assets/symbols/Overlay/lx.png'          ), name: "x" })
            , new APRSSymbol({ key: 'y'     , value: require('@/assets/symbols/Overlay/ly.png'          ), name: "y" })
            , new APRSSymbol({ key: 'z'     , value: require('@/assets/symbols/Overlay/lz.png'          ), name: "z" })
            , new APRSSymbol({ key: 'A'     , value: require('@/assets/symbols/Overlay/A.png'           ), name: "A" })
            , new APRSSymbol({ key: 'B'     , value: require('@/assets/symbols/Overlay/B.png'           ), name: "B" })
            , new APRSSymbol({ key: 'C'     , value: require('@/assets/symbols/Overlay/C.png'           ), name: "C" })
            , new APRSSymbol({ key: 'D'     , value: require('@/assets/symbols/Overlay/D.png'           ), name: "D" })
            , new APRSSymbol({ key: 'E'     , value: require('@/assets/symbols/Overlay/E.png'           ), name: "E" })
            , new APRSSymbol({ key: 'F'     , value: require('@/assets/symbols/Overlay/F.png'           ), name: "F" })
            , new APRSSymbol({ key: 'G'     , value: require('@/assets/symbols/Overlay/G.png'           ), name: "G" })
            , new APRSSymbol({ key: 'H'     , value: require('@/assets/symbols/Overlay/H.png'           ), name: "H" })
            , new APRSSymbol({ key: 'I'     , value: require('@/assets/symbols/Overlay/I.png'           ), name: "I" })
            , new APRSSymbol({ key: 'J'     , value: require('@/assets/symbols/Overlay/J.png'           ), name: "J" })
            , new APRSSymbol({ key: 'K'     , value: require('@/assets/symbols/Overlay/K.png'           ), name: "K" })
            , new APRSSymbol({ key: 'L'     , value: require('@/assets/symbols/Overlay/L.png'           ), name: "L" })
            , new APRSSymbol({ key: 'M'     , value: require('@/assets/symbols/Overlay/M.png'           ), name: "M" })
            , new APRSSymbol({ key: 'N'     , value: require('@/assets/symbols/Overlay/N.png'           ), name: "N" })
            , new APRSSymbol({ key: 'O'     , value: require('@/assets/symbols/Overlay/O.png'           ), name: "O" })
            , new APRSSymbol({ key: 'P'     , value: require('@/assets/symbols/Overlay/P.png'           ), name: "P" })
            , new APRSSymbol({ key: 'Q'     , value: require('@/assets/symbols/Overlay/Q.png'           ), name: "Q" })
            , new APRSSymbol({ key: 'R'     , value: require('@/assets/symbols/Overlay/R.png'           ), name: "R" })
            , new APRSSymbol({ key: 'S'     , value: require('@/assets/symbols/Overlay/S.png'           ), name: "S" })
            , new APRSSymbol({ key: 'T'     , value: require('@/assets/symbols/Overlay/T.png'           ), name: "T" })
            , new APRSSymbol({ key: 'U'     , value: require('@/assets/symbols/Overlay/U.png'           ), name: "U" })
            , new APRSSymbol({ key: 'V'     , value: require('@/assets/symbols/Overlay/V.png'           ), name: "V" })
            , new APRSSymbol({ key: 'W'     , value: require('@/assets/symbols/Overlay/W.png'           ), name: "W" })
            , new APRSSymbol({ key: 'X'     , value: require('@/assets/symbols/Overlay/X.png'           ), name: "X" })
            , new APRSSymbol({ key: 'Y'     , value: require('@/assets/symbols/Overlay/Y.png'           ), name: "Y" })
            , new APRSSymbol({ key: 'Z'     , value: require('@/assets/symbols/Overlay/Z.png'           ), name: "Z" })
            , new APRSSymbol({ key: '!'     , value: require('@/assets/symbols/Overlay/Exclamation.png' ), name: "!" })
            , new APRSSymbol({ key: '"'     , value: require('@/assets/symbols/Overlay/dQuote.png'      ), name: '"' })
            , new APRSSymbol({ key: '#'     , value: require('@/assets/symbols/Overlay/hash.png'        ), name: "#" })
            , new APRSSymbol({ key: '$'     , value: require('@/assets/symbols/Overlay/dollar.png'      ), name: "$" })
            , new APRSSymbol({ key: '%'     , value: require('@/assets/symbols/Overlay/pct.png'         ), name: "%" })
            , new APRSSymbol({ key: '&'     , value: require('@/assets/symbols/Overlay/amp.png'         ), name: "&" })
            , new APRSSymbol({ key: '\''    , value: require('@/assets/symbols/Overlay/sQuote.png'      ), name: "'" })
            , new APRSSymbol({ key: '('     , value: require('@/assets/symbols/Overlay/oParen.png'      ), name: "(" })
            , new APRSSymbol({ key: ')'     , value: require('@/assets/symbols/Overlay/cParen.png'      ), name: ")" })
            , new APRSSymbol({ key: '*'     , value: require('@/assets/symbols/Overlay/asterisk.png'    ), name: "*" })
            , new APRSSymbol({ key: '+'     , value: require('@/assets/symbols/Overlay/plus.png'        ), name: "+" })
            , new APRSSymbol({ key: ','     , value: require('@/assets/symbols/Overlay/comma.png'       ), name: "," })
            , new APRSSymbol({ key: '-'     , value: require('@/assets/symbols/Overlay/dash.png'        ), name: "-" })
            , new APRSSymbol({ key: '.'     , value: require('@/assets/symbols/Overlay/period.png'      ), name: "." })
            , new APRSSymbol({ key: '/'     , value: require('@/assets/symbols/Overlay/fSlash.png'      ), name: "/" })
            , new APRSSymbol({ key: ':'     , value: require('@/assets/symbols/Overlay/colon.png'       ), name: ":" })
            , new APRSSymbol({ key: ';'     , value: require('@/assets/symbols/Overlay/sColon.png'      ), name: ";" })
            , new APRSSymbol({ key: '<'     , value: require('@/assets/symbols/Overlay/oaBracket.png'   ), name: "<" })
            , new APRSSymbol({ key: '='     , value: require('@/assets/symbols/Overlay/equal.png'       ), name: "=" })
            , new APRSSymbol({ key: '>'     , value: require('@/assets/symbols/Overlay/caBracket.png'   ), name: ">" })
            , new APRSSymbol({ key: '?'     , value: require('@/assets/symbols/Overlay/question.png'    ), name: "?" })
            , new APRSSymbol({ key: '@'     , value: require('@/assets/symbols/Overlay/at.png'          ), name: "@"})
            , new APRSSymbol({ key: '['     , value: require('@/assets/symbols/Overlay/osBracket.png'   ), name: "[" })
            , new APRSSymbol({ key: '\\'    , value: require('@/assets/symbols/Overlay/bSlash.png'      ), name: "\\" })
            , new APRSSymbol({ key: ']'     , value: require('@/assets/symbols/Overlay/csBracket.png'   ), name: "]" })
            , new APRSSymbol({ key: '^'     , value: require('@/assets/symbols/Overlay/caret.png'       ), name: "^" })
            , new APRSSymbol({ key: '_'     , value: require('@/assets/symbols/Overlay/underscore.png'  ), name: "_" })
            , new APRSSymbol({ key: '`'     , value: require('@/assets/symbols/Overlay/grave.png'       ), name: "`" })
            , new APRSSymbol({ key: '{'     , value: require('@/assets/symbols/Overlay/oBracket.png'    ), name: "{" })
            , new APRSSymbol({ key: '|'     , value: require('@/assets/symbols/Overlay/pipe.png'        ), name: "|" })
            , new APRSSymbol({ key: '}'     , value: require('@/assets/symbols/Overlay/cBracket.png'    ), name: "}" })
            , new APRSSymbol({ key: '~'     , value: require('@/assets/symbols/Overlay/tilde.png'       ), name: "~" })
        ]
    }

    private GetOverlay(symbolTableId: string): APRSSymbol {
        if(!StringUtil.IsNullOrWhiteSpace(symbolTableId) && symbolTableId != '/') {
            const retVal = this.overlays.filter(function(c) {
                return c.key == symbolTableId
            });

            if(retVal.length > 0)
                return retVal[0]
        }

        return null
    }

    /**
     * This will return an object with the symbol and an overlay if it has one.
     * @param symbolTableId string - required
     * @param symbolCode string - optional
     */
    public GetAPRSSymbol(symbolCode: string, symbolTableId?: string): any {
        const retVal: any = {}
        //var key = ''

        if(StringUtil.IsNullOrWhiteSpace(symbolCode) && StringUtil.IsNullOrWhiteSpace(symbolTableId)) {
            retVal['symbol'] = this.CROSSHAIR
            return retVal
        }

        // lets try to make sure we only get 1 result here
        if(!StringUtil.IsNullOrWhiteSpace(symbolTableId) && symbolTableId == '/') {
            retVal['symbol'] = this.GetSymbolByKey(`${symbolTableId}${symbolCode}`)
        } else {
            retVal['symbol'] = this.GetSymbolByKey(symbolCode)
            retVal['overlay'] = this.GetOverlay(symbolTableId)
        }

        return retVal
    }

    public GetOverlays(): APRSSymbol[] {
        return this.overlays
    }

    public GetSymbols(): APRSSymbol[] {
        return this.symbols
    }

    /**
     * @param key String - Table symbol + Symbol Code
     *
     * @returns APRSSymbol - If not found, it will return a crosshair symbol
     */
    public GetSymbolByKey(key?: string): APRSSymbol {
        let retVal = this.symbols.find(x => x.key == key)

        if(retVal == null) {
            retVal = this.CROSSHAIR
        }

        return retVal
    }
}
