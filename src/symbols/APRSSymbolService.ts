import APRSSymbol from '@/models/APRSSymbol'
import StringUtil from '@/utils/StringUtil'

interface IAPRSSymbolService {
    symbols: APRSSymbol[];
    overlays: APRSSymbol[];

    GetAPRSSymbol(symbolCode: string, symbolTableId?: string): any;
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
        , value: '@/assets/symbols/Crosshair.gif'
        , name: "Crosshair"
    });

    constructor() {
        this.symbols = [
              new APRSSymbol({ key: "/!"    , value: require('@/assets/symbols/PrimaryTable/PD.gif'                         ) , name: "Police Department"             })
            , new APRSSymbol({ key: '/#'    , value: require('@/assets/symbols/PrimaryTable/Digipeater1.gif'                ) , name: "Digipeater"                    })
            , new APRSSymbol({ key: '/$'    , value: require('@/assets/symbols/PrimaryTable/Phone.gif'                      ) , name: "Phone"                         })
            , new APRSSymbol({ key: '/%'    , value: require('@/assets/symbols/PrimaryTable/DX.gif'                         ) , name: "DX Station"                    })
            , new APRSSymbol({ key: '/&'    , value: require('@/assets/symbols/PrimaryTable/Gateway.gif'                    ) , name: "Gateway"                       })
            , new APRSSymbol({ key: '/\''   , value: require('@/assets/symbols/PrimaryTable/SmallAircraft.gif'              ) , name: "Small Aircraft"                })
            , new APRSSymbol({ key: '/('    , value: require('@/assets/symbols/PrimaryTable/MobileSatteliteStation.gif'     ) , name: "Mobile Sattelite Station"      })
            , new APRSSymbol({ key: '/)'    , value: require('@/assets/symbols/PrimaryTable/Wheelchair.gif'                 ) , name: "Wheelchair"                    })
            , new APRSSymbol({ key: '/*'    , value: require('@/assets/symbols/PrimaryTable/Snowmobile.gif'                 ) , name: "Snow Mobile"                   })
            , new APRSSymbol({ key: '/+'    , value: require('@/assets/symbols/PrimaryTable/RedCross.gif'                   ) , name: "Red Cross"                     })
            , new APRSSymbol({ key: '/,'    , value: require('@/assets/symbols/PrimaryTable/BoyScout.gif'                   ) , name: "Boy Scouts"                    })
            , new APRSSymbol({ key: '/-'    , value: require('@/assets/symbols/PrimaryTable/House.gif'                      ) , name: "House"                         })
            , new APRSSymbol({ key: '/.'    , value: require('@/assets/symbols/PrimaryTable/RedX.gif'                       ) , name: "X"                             })
            , new APRSSymbol({ key: '//'    , value: require('@/assets/symbols/PrimaryTable/RedDot.gif'                     ) , name: "Dot"                           })
            , new APRSSymbol({ key: '/0'    , value: require('@/assets/symbols/PrimaryTable/Circle.gif'                     ) , name: "Circle 0"                      })
            , new APRSSymbol({ key: '/1'    , value: require('@/assets/symbols/PrimaryTable/Circle1.gif'                    ) , name: "Circle 1"                      })
            , new APRSSymbol({ key: '/2'    , value: require('@/assets/symbols/PrimaryTable/Circle2.gif'                    ) , name: "Circle 2"                      })
            , new APRSSymbol({ key: '/3'    , value: require('@/assets/symbols/PrimaryTable/Circle3.gif'                    ) , name: "Circle 3"                      })
            , new APRSSymbol({ key: '/4'    , value: require('@/assets/symbols/PrimaryTable/Circle4.gif'                    ) , name: "Circle 4"                      })
            , new APRSSymbol({ key: '/5'    , value: require('@/assets/symbols/PrimaryTable/Circle5.gif'                    ) , name: "Circle 5"                      })
            , new APRSSymbol({ key: '/6'    , value: require('@/assets/symbols/PrimaryTable/Circle6.gif'                    ) , name: "Circle 6"                      })
            , new APRSSymbol({ key: '/7'    , value: require('@/assets/symbols/PrimaryTable/Circle7.gif'                    ) , name: "Circle 7"                      })
            , new APRSSymbol({ key: '/8'    , value: require('@/assets/symbols/PrimaryTable/Circle8.gif'                    ) , name: "Circle 8"                      })
            , new APRSSymbol({ key: '/9'    , value: require('@/assets/symbols/PrimaryTable/Circle9.gif'                    ) , name: "Circle 9"                      })
            , new APRSSymbol({ key: '/:'    , value: require('@/assets/symbols/PrimaryTable/Fire.gif'                       ) , name: "Fire"                          })
            , new APRSSymbol({ key: '/;'    , value: require('@/assets/symbols/PrimaryTable/Campground.gif'                 ) , name: "Campground"                    })
            , new APRSSymbol({ key: '/<'    , value: require('@/assets/symbols/PrimaryTable/Motorcycle.gif'                 ) , name: "Motorcycle"                    })
            , new APRSSymbol({ key: '/='    , value: require('@/assets/symbols/PrimaryTable/TrainEngine.gif'                ) , name: "Train"                         })
            , new APRSSymbol({ key: '/>'    , value: require('@/assets/symbols/PrimaryTable/Car.gif'                        ) , name: "Car"                           })
            , new APRSSymbol({ key: '/?'    , value: require('@/assets/symbols/PrimaryTable/FileServer.gif'                 ) , name: "File Server"                   })
            , new APRSSymbol({ key: '/@'    , value: require('@/assets/symbols/PrimaryTable/HurricaneFuturePrediction.gif'  ) , name: "Hurricane Future Prediction"   })
            , new APRSSymbol({ key: '/A'    , value: require('@/assets/symbols/PrimaryTable/AidStation.gif'                 ) , name: "Aid Station"                   })
            , new APRSSymbol({ key: '/B'    , value: require('@/assets/symbols/PrimaryTable/BullitenSystem.gif'             ) , name: "Bulliten System"               })
            , new APRSSymbol({ key: '/C'    , value: require('@/assets/symbols/PrimaryTable/Canoe.gif'                      ) , name: "Canoe"                         })
            , new APRSSymbol({ key: '/E'    , value: require('@/assets/symbols/PrimaryTable/Eye.gif'                        ) , name: "Eye"                           })
            , new APRSSymbol({ key: '/F'    , value: require('@/assets/symbols/PrimaryTable/FarmEquipment.gif'              ) , name: "Farm Equipment"                })
            , new APRSSymbol({ key: '/G'    , value: require('@/assets/symbols/PrimaryTable/GridSquare.gif'                 ) , name: "Grid Square"                   })
            , new APRSSymbol({ key: '/H'    , value: require('@/assets/symbols/PrimaryTable/Hotel.gif'                      ) , name: "Hotel"                         })
            , new APRSSymbol({ key: '/I'    , value: require('@/assets/symbols/PrimaryTable/TCPIPOnAirNetwork.gif'          ) , name: "TCPIP On Air Network"          })
            , new APRSSymbol({ key: '/K'    , value: require('@/assets/symbols/PrimaryTable/School.gif'                     ) , name: "School"                        })
            , new APRSSymbol({ key: '/L'    , value: require('@/assets/symbols/PrimaryTable/PCUser.gif'                     ) , name: "PC User"                       })
            , new APRSSymbol({ key: '/M'    , value: require('@/assets/symbols/PrimaryTable/MacAprs.gif'                    ) , name: "Mac APRS"                      })
            , new APRSSymbol({ key: '/N'    , value: require('@/assets/symbols/PrimaryTable/NationalTrafficStation.gif'     ) , name: "National Traffic Station"      })
            , new APRSSymbol({ key: '/O'    , value: require('@/assets/symbols/PrimaryTable/Balloon.gif'                    ) , name: "Balloon"                       })
            , new APRSSymbol({ key: '/P'    , value: require('@/assets/symbols/PrimaryTable/Police.gif'                     ) , name: "Pilice"                        })
            , new APRSSymbol({ key: '/Q'    , value: require('@/assets/symbols/PrimaryTable/Quake.gif'                      ) , name: "Earthquake"                    }) // TBD?
            , new APRSSymbol({ key: '/R'    , value: require('@/assets/symbols/PrimaryTable/RV.gif'                         ) , name: "RV"                            })
            , new APRSSymbol({ key: '/S'    , value: require('@/assets/symbols/PrimaryTable/Shuttle.gif'                    ) , name: "Shuttle"                       })
            , new APRSSymbol({ key: '/T'    , value: require('@/assets/symbols/PrimaryTable/SSTV.gif'                       ) , name: "SSTV"                          })
            , new APRSSymbol({ key: '/U'    , value: require('@/assets/symbols/PrimaryTable/Bus.gif'                        ) , name: "Bus"                           })
            , new APRSSymbol({ key: '/V'    , value: require('@/assets/symbols/PrimaryTable/ATV.gif'                        ) , name: "ATV"                           })    // TODO: Find out what this really stands for
            , new APRSSymbol({ key: '/W'    , value: require('@/assets/symbols/PrimaryTable/NationalWeatherService.gif'     ) , name: "NWS"                           })
            , new APRSSymbol({ key: '/X'    , value: require('@/assets/symbols/PrimaryTable/Helicopter.gif'                 ) , name: "Helicopter"                    })
            , new APRSSymbol({ key: '/Y'    , value: require('@/assets/symbols/PrimaryTable/Yacht.gif'                      ) , name: "Yacht"                         })
            , new APRSSymbol({ key: '/Z'    , value: require('@/assets/symbols/PrimaryTable/WinAprs.gif'                    ) , name: "Win APRS"                      })
            , new APRSSymbol({ key: '/['    , value: require('@/assets/symbols/PrimaryTable/Person.gif'                     ) , name: "Person"                        })
            , new APRSSymbol({ key: '/\\'   , value: require('@/assets/symbols/PrimaryTable/DFStation.gif'                  ) , name: "DF Station"                    })
            , new APRSSymbol({ key: '/]'    , value: require('@/assets/symbols/PrimaryTable/PostOffice.gif'                 ) , name: "Post Office"                   })
            , new APRSSymbol({ key: '/^'    , value: require('@/assets/symbols/PrimaryTable/LargeAircraft.gif'              ) , name: "Large Aircraft"                })
            , new APRSSymbol({ key: '/_'    , value: require('@/assets/symbols/PrimaryTable/WeatherStation.gif'             ) , name: "Weather Station"               })
            , new APRSSymbol({ key: '/`'    , value: require('@/assets/symbols/PrimaryTable/DishAntenna.gif'                ) , name: "Dish Antenna"                  })
            , new APRSSymbol({ key: '/a'    , value: require('@/assets/symbols/PrimaryTable/Ambulance.gif'                  ) , name: "Ambulance"                     })
            , new APRSSymbol({ key: '/b'    , value: require('@/assets/symbols/PrimaryTable/Bicycle.gif'                    ) , name: "Bicycle"                       })
            , new APRSSymbol({ key: '/c'    , value: require('@/assets/symbols/PrimaryTable/IncidentCommandPost.gif'        ) , name: "Incident Command Post"         })
            , new APRSSymbol({ key: '/d'    , value: require('@/assets/symbols/PrimaryTable/Firehouse.gif'                  ) , name: "Firehouse"                     })
            , new APRSSymbol({ key: '/e'    , value: require('@/assets/symbols/PrimaryTable/Horse.gif'                      ) , name: "Horse"                         })
            , new APRSSymbol({ key: '/f'    , value: require('@/assets/symbols/PrimaryTable/FireTruck.gif'                  ) , name: "Fire Truck"                    })
            , new APRSSymbol({ key: '/g'    , value: require('@/assets/symbols/PrimaryTable/Glider.gif'                     ) , name: "Glider"                        })
            , new APRSSymbol({ key: '/h'    , value: require('@/assets/symbols/PrimaryTable/Hospital.gif'                   ) , name: "Hospital"                      })
            , new APRSSymbol({ key: '/i'    , value: require('@/assets/symbols/PrimaryTable/IslandsOnTheAir.gif'            ) , name: "Islands on the Air"            })
            , new APRSSymbol({ key: '/j'    , value: require('@/assets/symbols/PrimaryTable/Jeep.gif'                       ) , name: "Jeep"                          })
            , new APRSSymbol({ key: '/k'    , value: require('@/assets/symbols/PrimaryTable/Truck.gif'                      ) , name: "Truck"                         })
            , new APRSSymbol({ key: '/l'    , value: require('@/assets/symbols/PrimaryTable/Laptop.gif'                     ) , name: "Laptop"                        })
            , new APRSSymbol({ key: '/m'    , value: require('@/assets/symbols/PrimaryTable/MicERepeater.gif'               ) , name: "Mic E Repeater"                })
            , new APRSSymbol({ key: '/n'    , value: require('@/assets/symbols/PrimaryTable/Node.gif'                       ) , name: "Node"                          })
            , new APRSSymbol({ key: '/o'    , value: require('@/assets/symbols/PrimaryTable/EOC.gif'                        ) , name: "EOC"                           })
            , new APRSSymbol({ key: '/p'    , value: require('@/assets/symbols/PrimaryTable/Dog.gif'                        ) , name: "Dog"                           })
            , new APRSSymbol({ key: '/q'    , value: require('@/assets/symbols/PrimaryTable/GridSquare2.gif'                ) , name: "Gridsquare"                    })
            , new APRSSymbol({ key: '/r'    , value: require('@/assets/symbols/PrimaryTable/Repeater.gif'                   ) , name: "Repeater"                      })
            , new APRSSymbol({ key: '/s'    , value: require('@/assets/symbols/PrimaryTable/Boat.gif'                       ) , name: "Boat"                          })
            , new APRSSymbol({ key: '/t'    , value: require('@/assets/symbols/PrimaryTable/TruckStop.gif'                  ) , name: "Truck Stop"                    })
            , new APRSSymbol({ key: '/u'    , value: require('@/assets/symbols/PrimaryTable/SemiTruck.gif'                  ) , name: "Semi Truck"                    })
            , new APRSSymbol({ key: '/v'    , value: require('@/assets/symbols/PrimaryTable/Van.gif'                        ) , name: "Van"                           })
            , new APRSSymbol({ key: '/w'    , value: require('@/assets/symbols/PrimaryTable/WaterStation.gif'               ) , name: "Water Station"                 })
            , new APRSSymbol({ key: '/x'    , value: require('@/assets/symbols/PrimaryTable/Xastir.gif'                     ) , name: "Xastir"                        })
            , new APRSSymbol({ key: '/y'    , value: require('@/assets/symbols/PrimaryTable/HouseWithYagi.gif'              ) , name: "House with Yagi"               })
            , new APRSSymbol({ key: '/z'    , value: require('@/assets/symbols/PrimaryTable/TBD.gif'                        ) , name: "TBD"                           })
            , new APRSSymbol({ key: '/|'    , value: require('@/assets/symbols/PrimaryTable/TNCStreamSwitch.gif'            ) , name: "TNC Strem Switch"              })
            , new APRSSymbol({ key: '/~'    , value: require('@/assets/symbols/PrimaryTable/TNCStreamSwitch1.gif'           ) , name: "TNC Strem Switch"              })
            
            // BEGIN ALTERNATE TABLE
            , new APRSSymbol({ key: '!'     , value: require('@/assets/symbols/AlternateTable/Emergency.gif'                ) , name: "Emergency"             , isAllowOverlay: true })
            , new APRSSymbol({ key: '#'     , value: require('@/assets/symbols/AlternateTable/Digipeater.gif'               ) , name: "Digipeater"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '$'     , value: require('@/assets/symbols/AlternateTable/Bank.gif'                     ) , name: "Bank"                  , isAllowOverlay: true })
            // TODO: Create PowerPlant icon '\\%', value: "/AlternateTable/
            , new APRSSymbol({ key: '&'     , value: require('@/assets/symbols/AlternateTable/BlackDiamond.gif'             ) , name: "Black Diamond"         , isAllowOverlay: true })
            , new APRSSymbol({ key: '\''    , value: require('@/assets/symbols/AlternateTable/CrashSite.gif'                ) , name: "Crash Site"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '('     , value: require('@/assets/symbols/AlternateTable/Cloudy.gif'                   ) , name: "Cloudy"                , isAllowOverlay: true })
            , new APRSSymbol({ key: ')'     , value: require('@/assets/symbols/AlternateTable/Firenet.gif'                  ) , name: "Firenet"               , isAllowOverlay: true })
            , new APRSSymbol({ key: '*'     , value: require('@/assets/symbols/AlternateTable/Snow.gif'                     ) , name: "Snow"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: '+'     , value: require('@/assets/symbols/AlternateTable/Church.gif'                   ) , name: "Church"                , isAllowOverlay: true })
            , new APRSSymbol({ key: ','     , value: require('@/assets/symbols/AlternateTable/GirlScout.gif'                ) , name: "Girl Scout"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '-'     , value: require('@/assets/symbols/AlternateTable/HouseHF.gif'                  ) , name: "House HF"              , isAllowOverlay: true })
            , new APRSSymbol({ key: '.'     , value: require('@/assets/symbols/AlternateTable/Ambiguous.gif'                ) , name: "Ambiguous"             , isAllowOverlay: true })
            , new APRSSymbol({ key: '/'     , value: require('@/assets/symbols/AlternateTable/Waypoint.gif'                 ) , name: "Waypoint"              , isAllowOverlay: true })
            // TODO: ADD 802.11 OR OTHER NETWORK NODE ICON (\8)
            , new APRSSymbol({ key: '9'     , value: require('@/assets/symbols/AlternateTable/GasStation.gif'               ) , name: "Gas Station"           , isAllowOverlay: true })
            , new APRSSymbol({ key: ':'     , value: require('@/assets/symbols/AlternateTable/Hail.gif'                     ) , name: "Hail"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: ';'     , value: require('@/assets/symbols/AlternateTable/Park.gif'                     ) , name: "Park"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: '<'     , value: require('@/assets/symbols/AlternateTable/WeatherFlag.gif'              ) , name: "Weather Flag"          , isAllowOverlay: true })
            // TODO: ADD APRSTT TOUCHTONE (DTMF USERS) ICON (\=)
            , new APRSSymbol({ key: '>'     , value: require('@/assets/symbols/AlternateTable/AltCar.gif'                   ) , name: "Car"                   , isAllowOverlay: true })
            , new APRSSymbol({ key: '?'     , value: require('@/assets/symbols/AlternateTable/InfoKiosk.gif'                ) , name: "Info Kiosk"            , isAllowOverlay: true })
            , new APRSSymbol({ key: '@'     , value: require('@/assets/symbols/AlternateTable/Hurricane.gif'                ) , name: "Hurricane"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'A'     , value: require('@/assets/symbols/AlternateTable/OverlayBox.gif'               ) , name: "Overlay Box"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'B'     , value: require('@/assets/symbols/AlternateTable/BlowingSnow.gif'              ) , name: "Blowing Snow"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'C'     , value: require('@/assets/symbols/AlternateTable/CoastGuard.gif'               ) , name: "Coast Guard"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'D'     , value: require('@/assets/symbols/AlternateTable/Drizzle.gif'                  ) , name: "Drizzle"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'E'     , value: require('@/assets/symbols/AlternateTable/Smoke.gif'                    ) , name: "Smoke"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'F'     , value: require('@/assets/symbols/AlternateTable/FreezingRain.gif'             ) , name: "Freezing Rain"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'G'     , value: require('@/assets/symbols/AlternateTable/SnowShower.gif'               ) , name: "Snow Shower"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'H'     , value: require('@/assets/symbols/AlternateTable/Haze.gif'                     ) , name: "Haze"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: 'I'     , value: require('@/assets/symbols/AlternateTable/RainShower.gif'               ) , name: "Rain Shower"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'J'     , value: require('@/assets/symbols/AlternateTable/Lightning.gif'                ) , name: "Lightning"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'K'     , value: require('@/assets/symbols/AlternateTable/KenwoodHT.gif'                ) , name: "Kenwood HT"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'L'     , value: require('@/assets/symbols/AlternateTable/Lighthouse.gif'               ) , name: "Lighthouse"            , isAllowOverlay: true })
            // TODO: ADD MARS ICON (\M)
            , new APRSSymbol({ key: 'N'     , value: require('@/assets/symbols/AlternateTable/Bouy.gif'                     ) , name: "Bouy"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: 'O'     , value: require('@/assets/symbols/AlternateTable/Rocket.gif'                   ) , name: "Rocket"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'P'     , value: require('@/assets/symbols/AlternateTable/Parking.gif'                  ) , name: "Parking"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'Q'     , value: require('@/assets/symbols/AlternateTable/Earthquake.gif'               ) , name: "Earthquake"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'R'     , value: require('@/assets/symbols/AlternateTable/Restaurant.gif'               ) , name: "Restaurant"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'S'     , value: require('@/assets/symbols/AlternateTable/Satellite.gif'                ) , name: "Satellite"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'T'     , value: require('@/assets/symbols/AlternateTable/Thunderstorm.gif'             ) , name: "Thunderstorm"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'U'     , value: require('@/assets/symbols/AlternateTable/Sunny.gif'                    ) , name: "Sunny"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'V'     , value: require('@/assets/symbols/AlternateTable/VORTAC.gif'                   ) , name: "VORTAC"                , isAllowOverlay: true })
            , new APRSSymbol({ key: 'W'     , value: require('@/assets/symbols/AlternateTable/NWSSite.gif'                  ) , name: "NWS Site"              , isAllowOverlay: true })
            , new APRSSymbol({ key: 'X'     , value: require('@/assets/symbols/AlternateTable/Pharmacy.gif'                 ) , name: "Pharmacy"              , isAllowOverlay: true })
            // TODO: ADD RADIOS AND DEVICES ICON (\Y)
            , new APRSSymbol({ key: '['     , value: require('@/assets/symbols/AlternateTable/Wallcloud.gif'                ) , name: "Wallcloud"             , isAllowOverlay: true })
            // TODO: ADD OVERLAYABLE GPS SYMBOL (\\)
            , new APRSSymbol({ key: '^'     , value: require('@/assets/symbols/AlternateTable/Aircraft.gif'                 ) , name: "Aircraft"              , isAllowOverlay: true })
            , new APRSSymbol({ key: '_'     , value: require('@/assets/symbols/AlternateTable/WXSite.gif'                   ) , name: "WX Site"               , isAllowOverlay: true })
            , new APRSSymbol({ key: '`'     , value: require('@/assets/symbols/AlternateTable/Rain.gif'                     ) , name: "Rain"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: 'a'     , value: require('@/assets/symbols/AlternateTable/ARRL.gif'                     ) , name: "ARRL"                  , isAllowOverlay: true })
            , new APRSSymbol({ key: 'b'     , value: require('@/assets/symbols/AlternateTable/BlowingSand.gif'              ) , name: "Blowing Sand"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'c'     , value: require('@/assets/symbols/AlternateTable/CDTriangle.gif'               ) , name: "CD Triangle"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'd'     , value: require('@/assets/symbols/AlternateTable/DXSpot.gif'                   ) , name: "DX Spot"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'e'     , value: require('@/assets/symbols/AlternateTable/Sleet.gif'                    ) , name: "Sleet"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'f'     , value: require('@/assets/symbols/AlternateTable/FunnelCloud.gif'              ) , name: "Funnel Cloud"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'g'     , value: require('@/assets/symbols/AlternateTable/GaleFlags.gif'                ) , name: "Gale Flags"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'h'     , value: require('@/assets/symbols/AlternateTable/HamStore.gif'                 ) , name: "Ham Store"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'i'     , value: require('@/assets/symbols/AlternateTable/POIBox.gif'                   ) , name: "POI Box"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'j'     , value: require('@/assets/symbols/AlternateTable/WorkZone.gif'                 ) , name: "Work Zone"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 'k'     , value: require('@/assets/symbols/AlternateTable/SpecialVehicle.gif'           ) , name: "Special Vehicle"       , isAllowOverlay: true })
            // TODO: ADD AREAS ICON (\l)
            , new APRSSymbol({ key: 'm'     , value: require('@/assets/symbols/AlternateTable/ValueSign.gif'                ) , name: "Value Sign"            , isAllowOverlay: true })
            , new APRSSymbol({ key: 'n'     , value: require('@/assets/symbols/AlternateTable/OverlayTriangle.gif'          ) , name: "Overlay Triangle"      , isAllowOverlay: true })
            , new APRSSymbol({ key: 'o'     , value: require('@/assets/symbols/AlternateTable/SmallCircle.gif'              ) , name: "Small Circle"          , isAllowOverlay: true })
            , new APRSSymbol({ key: 'p'     , value: require('@/assets/symbols/AlternateTable/PartlyCloudy.gif'             ) , name: "Partly Cloudy"         , isAllowOverlay: true })
            , new APRSSymbol({ key: 'r'     , value: require('@/assets/symbols/AlternateTable/Restrooms.gif'                ) , name: "Restrooms"             , isAllowOverlay: true })
            , new APRSSymbol({ key: 's'     , value: require('@/assets/symbols/AlternateTable/Boat.gif'                     ) , name: "Boat"                  , isAllowOverlay: true })    // TODO: Make a better graphic
            , new APRSSymbol({ key: 't'     , value: require('@/assets/symbols/AlternateTable/Tornado.gif'                  ) , name: "Tornado"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'u'     , value: require('@/assets/symbols/AlternateTable/AltTruck.gif'                 ) , name: "Truck"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'v'     , value: require('@/assets/symbols/AlternateTable/AltVan.gif'                   ) , name: "Van"                   , isAllowOverlay: true })
            , new APRSSymbol({ key: 'w'     , value: require('@/assets/symbols/AlternateTable/Flood.gif'                    ) , name: "Flood"                 , isAllowOverlay: true })
            , new APRSSymbol({ key: 'x'     , value: require('@/assets/symbols/AlternateTable/Obstruction.gif'              ) , name: "Obstruction"           , isAllowOverlay: true })
            , new APRSSymbol({ key: 'y'     , value: require('@/assets/symbols/AlternateTable/Skywarn.gif'                  ) , name: "Skywarn"               , isAllowOverlay: true })
            , new APRSSymbol({ key: 'z'     , value: require('@/assets/symbols/AlternateTable/Shelter.gif'                  ) , name: "Shelter"               , isAllowOverlay: true })
            , new APRSSymbol({ key: '{'     , value: require('@/assets/symbols/AlternateTable/Fog.gif'                      ) , name: "Fog"                   , isAllowOverlay: true })
            , new APRSSymbol({ key: '|'     , value: require('@/assets/symbols/AlternateTable/TNCSwitchStream1.gif'         ) , name: "TNC Switch Stream 1"   , isAllowOverlay: true })
            , new APRSSymbol({ key: '~'     , value: require('@/assets/symbols/AlternateTable/TNCSwitchStream2.gif'         ) , name: "TNC Switch Stream 2"   , isAllowOverlay: true })
        ];

        this.overlays = [
              new APRSSymbol({ key: '0'     , value: require('@/assets/symbols/Overlay/Zero.gif'        ) , name: "0" })
            , new APRSSymbol({ key: '1'     , value: require('@/assets/symbols/Overlay/One.gif'         ) , name: "1" })
            , new APRSSymbol({ key: '2'     , value: require('@/assets/symbols/Overlay/Two.gif'         ) , name: "2" })
            , new APRSSymbol({ key: '3'     , value: require('@/assets/symbols/Overlay/Three.gif'       ) , name: "3" })
            , new APRSSymbol({ key: '4'     , value: require('@/assets/symbols/Overlay/Four.gif'        ) , name: "4" })
            , new APRSSymbol({ key: '5'     , value: require('@/assets/symbols/Overlay/Five.gif'        ) , name: "5" })
            , new APRSSymbol({ key: '6'     , value: require('@/assets/symbols/Overlay/Six.gif'         ) , name: "6" })
            , new APRSSymbol({ key: '7'     , value: require('@/assets/symbols/Overlay/Seven.gif'       ) , name: "7" })
            , new APRSSymbol({ key: '8'     , value: require('@/assets/symbols/Overlay/Eight.gif'       ) , name: "8" })
            , new APRSSymbol({ key: '9'     , value: require('@/assets/symbols/Overlay/Nine.gif'        ) , name: "9" })
            , new APRSSymbol({ key: 'a'     , value: require('@/assets/symbols/Overlay/la.gif'          ) , name: "a" })
            , new APRSSymbol({ key: 'b'     , value: require('@/assets/symbols/Overlay/lb.gif'          ) , name: "b" })
            , new APRSSymbol({ key: 'c'     , value: require('@/assets/symbols/Overlay/lc.gif'          ) , name: "c" })
            , new APRSSymbol({ key: 'd'     , value: require('@/assets/symbols/Overlay/ld.gif'          ) , name: "d" })
            , new APRSSymbol({ key: 'e'     , value: require('@/assets/symbols/Overlay/le.gif'          ) , name: "e" })
            , new APRSSymbol({ key: 'f'     , value: require('@/assets/symbols/Overlay/lf.gif'          ) , name: "f" })
            , new APRSSymbol({ key: 'g'     , value: require('@/assets/symbols/Overlay/lg.gif'          ) , name: "g" })
            , new APRSSymbol({ key: 'h'     , value: require('@/assets/symbols/Overlay/lh.gif'          ) , name: "h" })
            , new APRSSymbol({ key: 'i'     , value: require('@/assets/symbols/Overlay/li.gif'          ) , name: "i" })
            , new APRSSymbol({ key: 'j'     , value: require('@/assets/symbols/Overlay/lj.gif'          ) , name: "j" })
            , new APRSSymbol({ key: 'k'     , value: require('@/assets/symbols/Overlay/lk.gif'          ) , name: "k" })
            , new APRSSymbol({ key: 'l'     , value: require('@/assets/symbols/Overlay/ll.gif'          ) , name: "l" })
            , new APRSSymbol({ key: 'm'     , value: require('@/assets/symbols/Overlay/lm.gif'          ) , name: "m" })
            , new APRSSymbol({ key: 'n'     , value: require('@/assets/symbols/Overlay/ln.gif'          ) , name: "n" })
            , new APRSSymbol({ key: 'o'     , value: require('@/assets/symbols/Overlay/lo.gif'          ) , name: "o" })
            , new APRSSymbol({ key: 'p'     , value: require('@/assets/symbols/Overlay/lp.gif'          ) , name: "p" })
            , new APRSSymbol({ key: 'q'     , value: require('@/assets/symbols/Overlay/lq.gif'          ) , name: "q" })
            , new APRSSymbol({ key: 'r'     , value: require('@/assets/symbols/Overlay/lr.gif'          ) , name: "r" })
            , new APRSSymbol({ key: 's'     , value: require('@/assets/symbols/Overlay/ls.gif'          ) , name: "s" })
            , new APRSSymbol({ key: 't'     , value: require('@/assets/symbols/Overlay/lt.gif'          ) , name: "t" })
            , new APRSSymbol({ key: 'u'     , value: require('@/assets/symbols/Overlay/lu.gif'          ) , name: "u" })
            , new APRSSymbol({ key: 'v'     , value: require('@/assets/symbols/Overlay/lv.gif'          ) , name: "v" })
            , new APRSSymbol({ key: 'w'     , value: require('@/assets/symbols/Overlay/lw.gif'          ) , name: "w" })
            , new APRSSymbol({ key: 'x'     , value: require('@/assets/symbols/Overlay/lx.gif'          ) , name: "x" })
            , new APRSSymbol({ key: 'y'     , value: require('@/assets/symbols/Overlay/ly.gif'          ) , name: "y" })
            , new APRSSymbol({ key: 'z'     , value: require('@/assets/symbols/Overlay/lz.gif'          ) , name: "z" })
            , new APRSSymbol({ key: 'A'     , value: require('@/assets/symbols/Overlay/A.gif'           ) , name: "A" })
            , new APRSSymbol({ key: 'B'     , value: require('@/assets/symbols/Overlay/B.gif'           ) , name: "B" })
            , new APRSSymbol({ key: 'C'     , value: require('@/assets/symbols/Overlay/C.gif'           ) , name: "C" })
            , new APRSSymbol({ key: 'D'     , value: require('@/assets/symbols/Overlay/D.gif'           ) , name: "D" })
            , new APRSSymbol({ key: 'E'     , value: require('@/assets/symbols/Overlay/E.gif'           ) , name: "E" })
            , new APRSSymbol({ key: 'F'     , value: require('@/assets/symbols/Overlay/F.gif'           ) , name: "F" })
            , new APRSSymbol({ key: 'G'     , value: require('@/assets/symbols/Overlay/G.gif'           ) , name: "G" })
            , new APRSSymbol({ key: 'H'     , value: require('@/assets/symbols/Overlay/H.gif'           ) , name: "H" })
            , new APRSSymbol({ key: 'I'     , value: require('@/assets/symbols/Overlay/I.gif'           ) , name: "I" })
            , new APRSSymbol({ key: 'J'     , value: require('@/assets/symbols/Overlay/J.gif'           ) , name: "J" })
            , new APRSSymbol({ key: 'K'     , value: require('@/assets/symbols/Overlay/K.gif'           ) , name: "K" })
            , new APRSSymbol({ key: 'L'     , value: require('@/assets/symbols/Overlay/L.gif'           ) , name: "L" })
            , new APRSSymbol({ key: 'M'     , value: require('@/assets/symbols/Overlay/M.gif'           ) , name: "M" })
            , new APRSSymbol({ key: 'N'     , value: require('@/assets/symbols/Overlay/N.gif'           ) , name: "N" })
            , new APRSSymbol({ key: 'O'     , value: require('@/assets/symbols/Overlay/O.gif'           ) , name: "O" })
            , new APRSSymbol({ key: 'P'     , value: require('@/assets/symbols/Overlay/P.gif'           ) , name: "P" })
            , new APRSSymbol({ key: 'Q'     , value: require('@/assets/symbols/Overlay/Q.gif'           ) , name: "Q" })
            , new APRSSymbol({ key: 'R'     , value: require('@/assets/symbols/Overlay/R.gif'           ) , name: "R" })
            , new APRSSymbol({ key: 'S'     , value: require('@/assets/symbols/Overlay/S.gif'           ) , name: "S" })
            , new APRSSymbol({ key: 'T'     , value: require('@/assets/symbols/Overlay/T.gif'           ) , name: "T" })
            , new APRSSymbol({ key: 'U'     , value: require('@/assets/symbols/Overlay/U.gif'           ) , name: "U" })
            , new APRSSymbol({ key: 'V'     , value: require('@/assets/symbols/Overlay/V.gif'           ) , name: "V" })
            , new APRSSymbol({ key: 'W'     , value: require('@/assets/symbols/Overlay/W.gif'           ) , name: "W" })
            , new APRSSymbol({ key: 'X'     , value: require('@/assets/symbols/Overlay/X.gif'           ) , name: "X" })
            , new APRSSymbol({ key: 'Y'     , value: require('@/assets/symbols/Overlay/Y.gif'           ) , name: "Y" })
            , new APRSSymbol({ key: 'Z'     , value: require('@/assets/symbols/Overlay/Z.gif'           ) , name: "Z" })
            , new APRSSymbol({ key: '!'     , value: require('@/assets/symbols/Overlay/Exclamation.gif' ) , name: "!" })
            , new APRSSymbol({ key: '"'     , value: require('@/assets/symbols/Overlay/dQuote.gif'      ) , name: '"' })
            , new APRSSymbol({ key: '#'     , value: require('@/assets/symbols/Overlay/hash.gif'        ) , name: "#" })
            , new APRSSymbol({ key: '$'     , value: require('@/assets/symbols/Overlay/dollar.gif'      ) , name: "$" })
            , new APRSSymbol({ key: '%'     , value: require('@/assets/symbols/Overlay/pct.gif'         ) , name: "%" })
            , new APRSSymbol({ key: '&'     , value: require('@/assets/symbols/Overlay/amp.gif'         ) , name: "&" })
            , new APRSSymbol({ key: '\''    , value: require('@/assets/symbols/Overlay/sQuote.gif'      ) , name: "'" })
            , new APRSSymbol({ key: '('     , value: require('@/assets/symbols/Overlay/oParen.gif'      ) , name: "(" })
            , new APRSSymbol({ key: ')'     , value: require('@/assets/symbols/Overlay/cParen.gif'      ) , name: ")" })
            , new APRSSymbol({ key: '*'     , value: require('@/assets/symbols/Overlay/asterisk.gif'    ) , name: "*" })
            , new APRSSymbol({ key: '+'     , value: require('@/assets/symbols/Overlay/plus.gif'        ) , name: "+" })
            , new APRSSymbol({ key: ','     , value: require('@/assets/symbols/Overlay/comma.gif'       ) , name: "," })
            , new APRSSymbol({ key: '-'     , value: require('@/assets/symbols/Overlay/dash.gif'        ) , name: "-" })
            , new APRSSymbol({ key: '.'     , value: require('@/assets/symbols/Overlay/period.gif'      ) , name: "." })
            , new APRSSymbol({ key: '/'     , value: require('@/assets/symbols/Overlay/fSlash.gif'      ) , name: "/" })
            , new APRSSymbol({ key: ':'     , value: require('@/assets/symbols/Overlay/colon.gif'       ) , name: ":" })
            , new APRSSymbol({ key: ';'     , value: require('@/assets/symbols/Overlay/sColon.gif'      ) , name: ";" })
            , new APRSSymbol({ key: '<'     , value: require('@/assets/symbols/Overlay/oaBracket.gif'   ) , name: "<" })
            , new APRSSymbol({ key: '='     , value: require('@/assets/symbols/Overlay/equal.gif'       ) , name: "=" })
            , new APRSSymbol({ key: '>'     , value: require('@/assets/symbols/Overlay/caBracket.gif'   ) , name: ">" })
            , new APRSSymbol({ key: '?'     , value: require('@/assets/symbols/Overlay/question.gif'    ) , name: "?" })
            , new APRSSymbol({ key: '@'     , value: require('@/assets/symbols/Overlay/at.gif'          ) , name: "@"})
            , new APRSSymbol({ key: '['     , value: require('@/assets/symbols/Overlay/osBracket.gif'   ) , name: "[" })
            , new APRSSymbol({ key: '\\'    , value: require('@/assets/symbols/Overlay/bSlash.gif'      ) , name: "\\" })
            , new APRSSymbol({ key: ']'     , value: require('@/assets/symbols/Overlay/csBracket.gif'   ) , name: "]" })
            , new APRSSymbol({ key: '^'     , value: require('@/assets/symbols/Overlay/caret.gif'       ) , name: "^" })
            , new APRSSymbol({ key: '_'     , value: require('@/assets/symbols/Overlay/underscore.gif'  ) , name: "_" })
            , new APRSSymbol({ key: '`'     , value: require('@/assets/symbols/Overlay/grave.gif'       ) , name: "`" })
            , new APRSSymbol({ key: '{'     , value: require('@/assets/symbols/Overlay/oBracket.gif'    ) , name: "{" })
            , new APRSSymbol({ key: '|'     , value: require('@/assets/symbols/Overlay/pipe.gif'        ) , name: "|" })
            , new APRSSymbol({ key: '}'     , value: require('@/assets/symbols/Overlay/cBracket.gif'    ) , name: "}" })
            , new APRSSymbol({ key: '~'     , value: require('@/assets/symbols/Overlay/tilde.gif'       ) , name: "~" })
        ]
    }

    private GetOverlay(symbolTableId: string): APRSSymbol {
        if(!StringUtil.IsNullOrWhiteSpace(symbolTableId) && symbolTableId !== '/') {
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
        let retVal: any
        //var key = ''

        // lets try to make sure we only get 1 result here
        if(!StringUtil.IsNullOrWhiteSpace(symbolTableId) && symbolTableId === '/') {
            retVal['symbol'] = this.GetSymbolByKey(symbolTableId + symbolCode)
        } else {
            retVal['symbol'] = this.GetSymbolByKey(symbolCode)
        }

        retVal['overlay'] = this.GetOverlay(symbolTableId)

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