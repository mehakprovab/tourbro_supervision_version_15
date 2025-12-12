
export function tempTraveller() {
    return {
        adults: 1,
        childrens: 1,
        infants: 0
    }
}

export function fakeFlightResult(tripType) {

    if (tripType == 'Oneway') {
        return {
            Status: 1,
            Message: '',
            data: {
                Search: {
                    FlightDataList: {
                        JourneyList: [
                            [
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:55:00',
                                                        FDTV: 1595447700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:35:00',
                                                        FATV: 1595460900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 40 Mins',
                                                    DurationMins: 340,
                                                    OperatorCode: 'LJ',
                                                    OperatorName: 'Sierra nation',
                                                    FlightNumber: '1',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '3'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 222,
                                        PriceBreakup: {
                                            BasicFare: 172,
                                            Tax: 50,
                                            TotalPrice: 222,
                                            RBD: 'X',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 86,
                                                Tax: 25,
                                                TotalPrice: 111
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 86,
                                                Tax: 25,
                                                TotalPrice: 111
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*1*_*8UV0Iqj5bzLIsn1e'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:05:00',
                                                        FDTV: 1595412300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 12:40:00',
                                                        FATV: 1595421600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '4 Hrs 35 Mins',
                                                    DurationMins: 275,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '417',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 15:55:00',
                                                        FDTV: 1595433300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 18:05:00',
                                                        FATV: 1595441100
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 10 Mins',
                                                    DurationMins: 130,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '619',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '3 Hrs 15 Mins',
                                                    LayOverTimeMins: 195
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 281,
                                        PriceBreakup: {
                                            BasicFare: 221,
                                            Tax: 60,
                                            TotalPrice: 281,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 126,
                                                Tax: 30,
                                                TotalPrice: 156
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 95,
                                                Tax: 30,
                                                TotalPrice: 125
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*2*_*ioQYxK4rPGcuwp2J'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:05:00',
                                                        FDTV: 1595412300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 12:40:00',
                                                        FATV: 1595421600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '4 Hrs 35 Mins',
                                                    DurationMins: 275,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '417',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-16 08:40:00',
                                                        FDTV: 1595407200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 10:50:00',
                                                        FATV: 1595415000
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 10 Mins',
                                                    DurationMins: 130,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '611',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '20 Hrs',
                                                    LayOverTimeMins: 1200
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 281,
                                        PriceBreakup: {
                                            BasicFare: 221,
                                            Tax: 60,
                                            TotalPrice: 281,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 126,
                                                Tax: 30,
                                                TotalPrice: 156
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 95,
                                                Tax: 30,
                                                TotalPrice: 125
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*3*_*QdF2o4PLgHM7pXme'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:15:00',
                                                        FDTV: 1595412900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 13:35:00',
                                                        FATV: 1595424900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 20 Mins',
                                                    DurationMins: 320,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '409',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 16:45:00',
                                                        FDTV: 1595436300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 18:30:00',
                                                        FATV: 1595442600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    DurationMins: 105,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '607',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '3 Hrs 10 Mins',
                                                    LayOverTimeMins: 190
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 281,
                                        PriceBreakup: {
                                            BasicFare: 221,
                                            Tax: 60,
                                            TotalPrice: 281,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 126,
                                                Tax: 30,
                                                TotalPrice: 156
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 95,
                                                Tax: 30,
                                                TotalPrice: 125
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*4*_*tJfg7dFMnkVSgMb7'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:15:00',
                                                        FDTV: 1595412900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 13:35:00',
                                                        FATV: 1595424900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 20 Mins',
                                                    DurationMins: 320,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '409',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-16 08:35:00',
                                                        FDTV: 1595406900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 10:20:00',
                                                        FATV: 1595413200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    DurationMins: 105,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '601',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '19 Hrs',
                                                    LayOverTimeMins: 1140
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 281,
                                        PriceBreakup: {
                                            BasicFare: 221,
                                            Tax: 60,
                                            TotalPrice: 281,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 126,
                                                Tax: 30,
                                                TotalPrice: 156
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 95,
                                                Tax: 30,
                                                TotalPrice: 125
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*5*_*rO8WZglBUKq68icf'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 16:45:00',
                                                        FDTV: 1595436300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:40:00',
                                                        FATV: 1595446800
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 55 Mins',
                                                    DurationMins: 235,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '629',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 22:45:00',
                                                        FDTV: 1595457900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 00:45:00',
                                                        FATV: 1595378700
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs',
                                                    DurationMins: 180,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '761',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '3 Hrs 5 Mins',
                                                    LayOverTimeMins: 185
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 320,
                                        PriceBreakup: {
                                            BasicFare: 239,
                                            Tax: 81,
                                            TotalPrice: 320,
                                            RBD: 'T',
                                            TaxDetails: {
                                                Other_Tax: 81
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 137,
                                                Tax: 40,
                                                TotalPrice: 177
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 102,
                                                Tax: 40,
                                                TotalPrice: 142
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*6*_*2pKdZDJbrjdyIl2i'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 16:45:00',
                                                        FDTV: 1595436300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:40:00',
                                                        FATV: 1595446800
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 55 Mins',
                                                    DurationMins: 235,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '629',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 02:00:00',
                                                        FDTV: 1595383200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 04:00:00',
                                                        FATV: 1595390400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs',
                                                    DurationMins: 180,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '767',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '6 Hrs 20 Mins',
                                                    LayOverTimeMins: 380
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 335,
                                        PriceBreakup: {
                                            BasicFare: 239,
                                            Tax: 96,
                                            TotalPrice: 335,
                                            RBD: 'T',
                                            TaxDetails: {
                                                Other_Tax: 96
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 137,
                                                Tax: 56,
                                                TotalPrice: 193
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 102,
                                                Tax: 40,
                                                TotalPrice: 142
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*7*_*jpZJQnVEa9E2twgn'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 22:35:00',
                                                        FDTV: 1595457300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 01:10:00',
                                                        FATV: 1595380200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 35 Mins',
                                                    DurationMins: 215,
                                                    OperatorCode: 'UO',
                                                    OperatorName: 'Hong kong express',
                                                    FlightNumber: '627',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '20 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 13:15:00',
                                                        FDTV: 1595423700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 15:20:00',
                                                        FATV: 1595431200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 5 Mins',
                                                    DurationMins: 185,
                                                    OperatorCode: 'UO',
                                                    OperatorName: 'Hong kong express',
                                                    FlightNumber: '700',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '20 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '12 Hrs 5 Mins',
                                                    LayOverTimeMins: 725
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 407,
                                        PriceBreakup: {
                                            BasicFare: 326,
                                            Tax: 81,
                                            TotalPrice: 407,
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: 81
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 163,
                                                Tax: 40,
                                                TotalPrice: 203
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 163,
                                                Tax: 40,
                                                TotalPrice: 203
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*8*_*nNKmrh89hzFQR2fo'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 22:35:00',
                                                        FDTV: 1595457300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 01:10:00',
                                                        FATV: 1595380200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 35 Mins',
                                                    DurationMins: 215,
                                                    OperatorCode: 'UO',
                                                    OperatorName: 'Hong kong express',
                                                    FlightNumber: '627',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '20 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 16:55:00',
                                                        FDTV: 1595436900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 19:05:00',
                                                        FATV: 1595444700
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 10 Mins',
                                                    DurationMins: 190,
                                                    OperatorCode: 'UO',
                                                    OperatorName: 'Hong kong express',
                                                    FlightNumber: '702',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '20 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '15 Hrs 45 Mins',
                                                    LayOverTimeMins: 945
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 407,
                                        PriceBreakup: {
                                            BasicFare: 326,
                                            Tax: 81,
                                            TotalPrice: 407,
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: 81
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 163,
                                                Tax: 40,
                                                TotalPrice: 203
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 163,
                                                Tax: 40,
                                                TotalPrice: 203
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*9*_*yRNjAIpvk0EKtxZT'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:20:00',
                                                        FDTV: 1595413200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 14:10:00',
                                                        FATV: 1595427000
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 50 Mins',
                                                    DurationMins: 350,
                                                    OperatorCode: 'TG',
                                                    OperatorName: 'Thai airways',
                                                    FlightNumber: '657',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 423,
                                        PriceBreakup: {
                                            BasicFare: 373,
                                            Tax: 50,
                                            TotalPrice: 423,
                                            RBD: 'K',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 213,
                                                Tax: 25,
                                                TotalPrice: 238
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 160,
                                                Tax: 25,
                                                TotalPrice: 185
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*10*_*aoeZ6yJDEH6cFLpx'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:30:00',
                                                        FDTV: 1595446200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:10:00',
                                                        FATV: 1595459400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 40 Mins',
                                                    DurationMins: 340,
                                                    OperatorCode: 'OZ',
                                                    OperatorName: 'Asiana airlines',
                                                    FlightNumber: '741',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '10 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 568,
                                        PriceBreakup: {
                                            BasicFare: 518,
                                            Tax: 50,
                                            TotalPrice: 568,
                                            RBD: 'Q',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 296,
                                                Tax: 25,
                                                TotalPrice: 321
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 222,
                                                Tax: 25,
                                                TotalPrice: 247
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*11*_*8MP0I4F1BkH1Ax0t'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 18:05:00',
                                                        FDTV: 1595441100
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 21:45:00',
                                                        FATV: 1595454300
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 40 Mins',
                                                    DurationMins: 340,
                                                    OperatorCode: 'KE',
                                                    OperatorName: 'Korean air',
                                                    FlightNumber: '651',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 568,
                                        PriceBreakup: {
                                            BasicFare: 518,
                                            Tax: 50,
                                            TotalPrice: 568,
                                            RBD: 'E',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 296,
                                                Tax: 25,
                                                TotalPrice: 321
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 222,
                                                Tax: 25,
                                                TotalPrice: 247
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*12*_*nEJp9rF0OSqpUg08'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:10:00',
                                                        FDTV: 1595412600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 13:00:00',
                                                        FATV: 1595422800
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 50 Mins',
                                                    DurationMins: 230,
                                                    OperatorCode: 'CX',
                                                    OperatorName: 'Cathay pacific',
                                                    FlightNumber: '417',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 14:25:00',
                                                        FDTV: 1595427900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 16:30:00',
                                                        FATV: 1595435400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 5 Mins',
                                                    DurationMins: 185,
                                                    OperatorCode: 'CX',
                                                    OperatorName: 'Cathay pacific',
                                                    FlightNumber: '751',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '1 Hr 25 Mins',
                                                    LayOverTimeMins: 85
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 576,
                                        PriceBreakup: {
                                            BasicFare: 495,
                                            Tax: 81,
                                            TotalPrice: 576,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 81
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 283,
                                                Tax: 40,
                                                TotalPrice: 323
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 212,
                                                Tax: 40,
                                                TotalPrice: 252
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*13*_*94vIZNo3EX1JmuA6'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 12:00:00',
                                                        FDTV: 1595419200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 13:35:00',
                                                        FATV: 1595424900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 35 Mins',
                                                    DurationMins: 155,
                                                    OperatorCode: 'B7',
                                                    OperatorName: 'Uni airways',
                                                    FlightNumber: '169',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 20:45:00',
                                                        FDTV: 1595450700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:30:00',
                                                        FATV: 1595460600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 45 Mins',
                                                    DurationMins: 225,
                                                    OperatorCode: 'BR',
                                                    OperatorName: 'Eva air',
                                                    FlightNumber: '205',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '7 Hrs 10 Mins',
                                                    LayOverTimeMins: 430
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 593,
                                        PriceBreakup: {
                                            BasicFare: 481,
                                            Tax: 112,
                                            TotalPrice: 593,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 42,
                                                YR: 20
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 275,
                                                Tax: 56,
                                                TotalPrice: 331
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 206,
                                                Tax: 56,
                                                TotalPrice: 262
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*14*_*bqZ0HtWgWUgKHpY8'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:45:00',
                                                        FDTV: 1595447100
                                                    },
                                                    Destination: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 21:25:00',
                                                        FATV: 1595453100
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 40 Mins',
                                                    DurationMins: 160,
                                                    OperatorCode: 'BR',
                                                    OperatorName: 'Eva air',
                                                    FlightNumber: '159',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 22:30:00',
                                                        FDTV: 1595457000
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 01:10:00',
                                                        FATV: 1595380200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 40 Mins',
                                                    DurationMins: 220,
                                                    OperatorCode: 'BR',
                                                    OperatorName: 'Eva air',
                                                    FlightNumber: '61',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '1 Hr 5 Mins',
                                                    LayOverTimeMins: 65
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 593,
                                        PriceBreakup: {
                                            BasicFare: 481,
                                            Tax: 112,
                                            TotalPrice: 593,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 42,
                                                YR: 20
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 275,
                                                Tax: 56,
                                                TotalPrice: 331
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 206,
                                                Tax: 56,
                                                TotalPrice: 262
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*15*_*0wifrWU1Nelif0du'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 20:45:00',
                                                        FDTV: 1595450700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 22:25:00',
                                                        FATV: 1595456700
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 40 Mins',
                                                    DurationMins: 160,
                                                    OperatorCode: 'CI',
                                                    OperatorName: 'China airlines',
                                                    FlightNumber: '163',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '35 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-16 07:05:00',
                                                        FDTV: 1595401500
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 09:45:00',
                                                        FATV: 1595411100
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 40 Mins',
                                                    DurationMins: 220,
                                                    OperatorCode: 'CI',
                                                    OperatorName: 'China airlines',
                                                    FlightNumber: '833',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '35 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '8 Hrs 40 Mins',
                                                    LayOverTimeMins: 520
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 631,
                                        PriceBreakup: {
                                            BasicFare: 571,
                                            Tax: 60,
                                            TotalPrice: 631,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 326,
                                                Tax: 30,
                                                TotalPrice: 356
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 245,
                                                Tax: 30,
                                                TotalPrice: 275
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*16*_*WhuzrPY6UAbpWPMe'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:20:00',
                                                        FDTV: 1595413200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 14:10:00',
                                                        FATV: 1595427000
                                                    },
                                                    OperatingAirline: 'operated by TG 657',
                                                    Duration: '5 Hrs 50 Mins',
                                                    DurationMins: 350,
                                                    OperatorCode: 'OZ',
                                                    OperatorName: 'Asiana airlines',
                                                    FlightNumber: '6737',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '10 Kilograms',
                                                        AvailableSeats: '4'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 645,
                                        PriceBreakup: {
                                            BasicFare: 595,
                                            Tax: 50,
                                            TotalPrice: 645,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 340,
                                                Tax: 25,
                                                TotalPrice: 365
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 255,
                                                Tax: 25,
                                                TotalPrice: 280
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*17*_*m8XBFEYGlSrCRNOB'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 06:30:00',
                                                        FDTV: 1595399400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 10:40:00',
                                                        FATV: 1595414400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '6 Hrs 10 Mins',
                                                    DurationMins: 370,
                                                    OperatorCode: '7C',
                                                    OperatorName: 'Callsign coyne air',
                                                    FlightNumber: '2201',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 801,
                                        PriceBreakup: {
                                            BasicFare: 751,
                                            Tax: 50,
                                            TotalPrice: 801,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 429,
                                                Tax: 25,
                                                TotalPrice: 454
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 322,
                                                Tax: 25,
                                                TotalPrice: 347
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*18*_*K1kwiAODWcygHUo2'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 20:05:00',
                                                        FDTV: 1595448300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:59:00',
                                                        FATV: 1595462340
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 54 Mins',
                                                    DurationMins: 354,
                                                    OperatorCode: '7C',
                                                    OperatorName: 'Callsign coyne air',
                                                    FlightNumber: '2203',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 801,
                                        PriceBreakup: {
                                            BasicFare: 751,
                                            Tax: 50,
                                            TotalPrice: 801,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 50
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 429,
                                                Tax: 25,
                                                TotalPrice: 454
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 322,
                                                Tax: 25,
                                                TotalPrice: 347
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*19*_*zgxGpBNdwQ4LEngA'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 09:10:00',
                                                        FDTV: 1595409000
                                                    },
                                                    Destination: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 11:00:00',
                                                        FATV: 1595415600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 50 Mins',
                                                    DurationMins: 170,
                                                    OperatorCode: 'CX',
                                                    OperatorName: 'Cathay pacific',
                                                    FlightNumber: '421',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 17:45:00',
                                                        FDTV: 1595439900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 19:45:00',
                                                        FATV: 1595447100
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs',
                                                    DurationMins: 120,
                                                    OperatorCode: 'CX',
                                                    OperatorName: 'Cathay pacific',
                                                    FlightNumber: '405',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '6 Hrs 45 Mins',
                                                    LayOverTimeMins: 405
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 21:35:00',
                                                        FDTV: 1595453700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:35:00',
                                                        FATV: 1595460900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs',
                                                    DurationMins: 180,
                                                    OperatorCode: 'CX',
                                                    OperatorName: 'Cathay pacific',
                                                    FlightNumber: '617',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '10 Hrs 35 Mins',
                                                    LayOverTimeMins: 635
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 828,
                                        PriceBreakup: {
                                            BasicFare: 745,
                                            Tax: 83,
                                            TotalPrice: 828,
                                            RBD: 'M',
                                            TaxDetails: {
                                                Other_Tax: 81,
                                                YR: 2
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 408,
                                                Tax: 42,
                                                TotalPrice: 450
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 337,
                                                Tax: 42,
                                                TotalPrice: 379
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*20*_*2tog7fZ4s5nN0KH1'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 06:30:00',
                                                        FDTV: 1595399400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 10:40:00',
                                                        FATV: 1595414400
                                                    },
                                                    OperatingAirline: 'operated by 7C ',
                                                    Duration: '6 Hrs 10 Mins',
                                                    DurationMins: 370,
                                                    OperatorCode: 'H1',
                                                    OperatorName: 'Hahn air systems',
                                                    FlightNumber: '9957',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '4'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 861,
                                        PriceBreakup: {
                                            BasicFare: 751,
                                            Tax: 110,
                                            TotalPrice: 861,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 60
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 429,
                                                Tax: 55,
                                                TotalPrice: 484
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 322,
                                                Tax: 55,
                                                TotalPrice: 377
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*21*_*Z8P257dJ36rbG7e5'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 20:05:00',
                                                        FDTV: 1595448300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:59:00',
                                                        FATV: 1595462340
                                                    },
                                                    OperatingAirline: 'operated by 7C ',
                                                    Duration: '5 Hrs 54 Mins',
                                                    DurationMins: 354,
                                                    OperatorCode: 'H1',
                                                    OperatorName: 'Hahn air systems',
                                                    FlightNumber: '9857',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '4'
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 861,
                                        PriceBreakup: {
                                            BasicFare: 751,
                                            Tax: 110,
                                            TotalPrice: 861,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 60
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 429,
                                                Tax: 55,
                                                TotalPrice: 484
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 322,
                                                Tax: 55,
                                                TotalPrice: 377
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*22*_*irMX79CcVcEf154v'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 10:35:00',
                                                        FDTV: 1595414100
                                                    },
                                                    Destination: {
                                                        AirportCode: 'CGK',
                                                        CityName: 'Jakarta',
                                                        AirportName: 'Soekarno-Hatta International Airport',
                                                        Terminal: 'T3',
                                                        DateTime: '2020-09-15 15:50:00',
                                                        FATV: 1595433000
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '7 Hrs 15 Mins',
                                                    DurationMins: 435,
                                                    OperatorCode: 'GA',
                                                    OperatorName: 'Garuda airlines',
                                                    FlightNumber: '879',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'CGK',
                                                        CityName: 'Jakarta',
                                                        AirportName: 'Soekarno-Hatta International Airport',
                                                        Terminal: 'T3',
                                                        DateTime: '2020-09-16 09:35:00',
                                                        FDTV: 1595410500
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 13:10:00',
                                                        FATV: 1595423400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs 35 Mins',
                                                    DurationMins: 215,
                                                    OperatorCode: 'GA',
                                                    OperatorName: 'Garuda airlines',
                                                    FlightNumber: '866',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '30 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '17 Hrs 45 Mins',
                                                    LayOverTimeMins: 1065
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1045,
                                        PriceBreakup: {
                                            BasicFare: 821,
                                            Tax: 224,
                                            TotalPrice: 1045,
                                            RBD: 'N',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 174
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 469,
                                                Tax: 112,
                                                TotalPrice: 581
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 352,
                                                Tax: 112,
                                                TotalPrice: 464
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*23*_*Bbfcwin5riH3CV05'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:05:00',
                                                        FDTV: 1595412300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 12:40:00',
                                                        FATV: 1595421600
                                                    },
                                                    OperatingAirline: 'operated by VN 417',
                                                    Duration: '4 Hrs 35 Mins',
                                                    DurationMins: 275,
                                                    OperatorCode: 'KE',
                                                    OperatorName: 'Korean air',
                                                    FlightNumber: '5683',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HAN',
                                                        CityName: 'Hanoi',
                                                        AirportName: 'Noi Bai International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 15:55:00',
                                                        FDTV: 1595433300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 18:05:00',
                                                        FATV: 1595441100
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 10 Mins',
                                                    DurationMins: 130,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '619',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '3 Hrs 15 Mins',
                                                    LayOverTimeMins: 195
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1096,
                                        PriceBreakup: {
                                            BasicFare: 1036,
                                            Tax: 60,
                                            TotalPrice: 1096,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 592,
                                                Tax: 30,
                                                TotalPrice: 622
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 444,
                                                Tax: 30,
                                                TotalPrice: 474
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*24*_*B1cqHWCmkHvSDxom'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:15:00',
                                                        FDTV: 1595412900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 13:35:00',
                                                        FATV: 1595424900
                                                    },
                                                    OperatingAirline: 'operated by VN 409',
                                                    Duration: '5 Hrs 20 Mins',
                                                    DurationMins: 320,
                                                    OperatorCode: 'KE',
                                                    OperatorName: 'Korean air',
                                                    FlightNumber: '5681',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 16:45:00',
                                                        FDTV: 1595436300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 18:30:00',
                                                        FATV: 1595442600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    DurationMins: 105,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '607',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '3 Hrs 10 Mins',
                                                    LayOverTimeMins: 190
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1096,
                                        PriceBreakup: {
                                            BasicFare: 1036,
                                            Tax: 60,
                                            TotalPrice: 1096,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 592,
                                                Tax: 30,
                                                TotalPrice: 622
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 444,
                                                Tax: 30,
                                                TotalPrice: 474
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*25*_*1N2nsHz93noJpZ7w'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 10:15:00',
                                                        FDTV: 1595412900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 13:35:00',
                                                        FATV: 1595424900
                                                    },
                                                    OperatingAirline: 'operated by VN 409',
                                                    Duration: '5 Hrs 20 Mins',
                                                    DurationMins: 320,
                                                    OperatorCode: 'KE',
                                                    OperatorName: 'Korean air',
                                                    FlightNumber: '5681',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'SGN',
                                                        CityName: 'Ho Chi Minh City',
                                                        AirportName: 'Ho Chi Minh City Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-16 08:35:00',
                                                        FDTV: 1595406900
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 10:20:00',
                                                        FATV: 1595413200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    DurationMins: 105,
                                                    OperatorCode: 'VN',
                                                    OperatorName: 'Vietnam airways',
                                                    FlightNumber: '601',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '12 Kilograms',
                                                        AvailableSeats: '7'
                                                    },
                                                    LayOverTime: '19 Hrs',
                                                    LayOverTimeMins: 1140
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1096,
                                        PriceBreakup: {
                                            BasicFare: 1036,
                                            Tax: 60,
                                            TotalPrice: 1096,
                                            RBD: 'P',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 10
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 592,
                                                Tax: 30,
                                                TotalPrice: 622
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 444,
                                                Tax: 30,
                                                TotalPrice: 474
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*26*_*1MGFspwdHmKwjUk8'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 09:00:00',
                                                        FDTV: 1595408400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 11:40:00',
                                                        FATV: 1595418000
                                                    },
                                                    OperatingAirline: 'operated by OZ 721',
                                                    Duration: '3 Hrs 40 Mins',
                                                    DurationMins: 220,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '1551',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HKG',
                                                        CityName: 'Hong Kong',
                                                        AirportName: 'Hong Kong International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 18:10:00',
                                                        FDTV: 1595441400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 20:10:00',
                                                        FATV: 1595448600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '3 Hrs',
                                                    DurationMins: 180,
                                                    OperatorCode: 'HX',
                                                    OperatorName: 'Trans north aviation',
                                                    FlightNumber: '765',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '6 Hrs 30 Mins',
                                                    LayOverTimeMins: 390
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1130,
                                        PriceBreakup: {
                                            BasicFare: 1049,
                                            Tax: 81,
                                            TotalPrice: 1130,
                                            RBD: 'H',
                                            TaxDetails: {
                                                Other_Tax: 81
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 599,
                                                Tax: 40,
                                                TotalPrice: 639
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 450,
                                                Tax: 40,
                                                TotalPrice: 490
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*27*_*9Us4agkBXa3bs1Ou'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 09:00:00',
                                                        FDTV: 1595408400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'SIN',
                                                        CityName: 'Singapore',
                                                        AirportName: 'Changi Airport',
                                                        Terminal: 'T0',
                                                        DateTime: '2020-09-15 14:20:00',
                                                        FATV: 1595427600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '6 Hrs 20 Mins',
                                                    DurationMins: 380,
                                                    OperatorCode: 'SQ',
                                                    OperatorName: 'Singapore airlines',
                                                    FlightNumber: '607',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '35 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'SIN',
                                                        CityName: 'Singapore',
                                                        AirportName: 'Changi Airport',
                                                        Terminal: 'T3',
                                                        DateTime: '2020-09-15 16:00:00',
                                                        FDTV: 1595433600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 17:25:00',
                                                        FATV: 1595438700
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 25 Mins',
                                                    DurationMins: 145,
                                                    OperatorCode: 'SQ',
                                                    OperatorName: 'Singapore airlines',
                                                    FlightNumber: '976',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '35 Kilograms',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '1 Hr 40 Mins',
                                                    LayOverTimeMins: 100
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 1638,
                                        PriceBreakup: {
                                            BasicFare: 1580,
                                            Tax: 58,
                                            TotalPrice: 1638,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 58
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 903,
                                                Tax: 29,
                                                TotalPrice: 932
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 677,
                                                Tax: 29,
                                                TotalPrice: 706
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*28*_*aNTiKfYl7NbWxXqG'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 14:20:00',
                                                        FDTV: 1595427600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T2',
                                                        DateTime: '2020-09-15 15:50:00',
                                                        FATV: 1595433000
                                                    },
                                                    OperatingAirline: 'operated by OZ 713',
                                                    Duration: '2 Hrs 30 Mins',
                                                    DurationMins: 150,
                                                    OperatorCode: 'BR',
                                                    OperatorName: 'Eva air',
                                                    FlightNumber: '2149',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '4'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'TPE',
                                                        CityName: 'Taipei',
                                                        AirportName: 'Taiwan Taoyuan International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 20:05:00',
                                                        FDTV: 1595448300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 22:50:00',
                                                        FATV: 1595458200
                                                    },
                                                    OperatingAirline: 'operated by TG 635',
                                                    Duration: '3 Hrs 45 Mins',
                                                    DurationMins: 225,
                                                    OperatorCode: 'BR',
                                                    OperatorName: 'Eva air',
                                                    FlightNumber: '2217',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '1 Piece',
                                                        CabinBaggage: '7 Kilograms',
                                                        AvailableSeats: '4'
                                                    },
                                                    LayOverTime: '4 Hrs 15 Mins',
                                                    LayOverTimeMins: 255
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 2579,
                                        PriceBreakup: {
                                            BasicFare: 2467,
                                            Tax: 112,
                                            TotalPrice: 2579,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 50,
                                                YQ: 42,
                                                YR: 20
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 1410,
                                                Tax: 56,
                                                TotalPrice: 1466
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 1057,
                                                Tax: 56,
                                                TotalPrice: 1113
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*29*_*Tzy3Bi98edx5qPfV'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T1',
                                                        DateTime: '2020-09-15 21:10:00',
                                                        FDTV: 1595452200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'HND',
                                                        CityName: 'Tokyo',
                                                        AirportName: 'Haneda Airport',
                                                        Terminal: 'T3',
                                                        DateTime: '2020-09-15 23:30:00',
                                                        FATV: 1595460600
                                                    },
                                                    OperatingAirline: 'operated by OZ 178',
                                                    Duration: '2 Hrs 20 Mins',
                                                    DurationMins: 140,
                                                    OperatorCode: 'NH',
                                                    OperatorName: 'All nippon airways co',
                                                    FlightNumber: '6896',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '2 Pieces',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '4'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'HND',
                                                        CityName: 'Tokyo',
                                                        AirportName: 'Haneda Airport',
                                                        Terminal: 'T3',
                                                        DateTime: '2020-09-16 00:55:00',
                                                        FDTV: 1595379300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-16 05:25:00',
                                                        FATV: 1595395500
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '6 Hrs 30 Mins',
                                                    DurationMins: 390,
                                                    OperatorCode: 'NH',
                                                    OperatorName: 'All nippon airways co',
                                                    FlightNumber: '877',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '2 Pieces',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '1 Hr 25 Mins',
                                                    LayOverTimeMins: 85
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 5497,
                                        PriceBreakup: {
                                            BasicFare: 5425,
                                            Tax: 72,
                                            TotalPrice: 5497,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                Other_Tax: 68,
                                                YQ: 4
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 3100,
                                                Tax: 39,
                                                TotalPrice: 3139
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 2325,
                                                Tax: 33,
                                                TotalPrice: 2358
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: true,
                                        AirlineRemark: '1tp'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*30*_*zrHoMCYAIjHD7QcN'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 06:30:00',
                                                        FDTV: 1595399400
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 10:40:00',
                                                        FATV: 1595414400
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '6 Hrs 10 Mins',
                                                    DurationMins: '370',
                                                    OperatorCode: '7C',
                                                    OperatorName: 'Jeju Air',
                                                    FlightNumber: '2201',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '',
                                                        CabinBaggage: '',
                                                        AvailableSeats: ''
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 572600,
                                        PriceBreakup: {
                                            BasicFare: 542800,
                                            Tax: 29800,
                                            TotalPrice: 572600,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                other_tax: 59600
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 513000,
                                                Tax: 29800,
                                                TotalPrice: 542800
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 29800,
                                                Tax: 0,
                                                TotalPrice: 29800
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '2tf'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*31*_*QgBnNvlyBNfwoZaO'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'ICN',
                                                        CityName: 'Seoul',
                                                        AirportName: 'Incheon International Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 20:05:00',
                                                        FDTV: 1595448300
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BKK',
                                                        CityName: 'Bangkok',
                                                        AirportName: 'Airport',
                                                        Terminal: 'T',
                                                        DateTime: '2020-09-15 23:59:00',
                                                        FATV: 1595462340
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '5 Hrs 54 Mins',
                                                    DurationMins: '354',
                                                    OperatorCode: '7C',
                                                    OperatorName: 'Jeju Air',
                                                    FlightNumber: '2203',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '',
                                                        CabinBaggage: '',
                                                        AvailableSeats: ''
                                                    }
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'USD',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: 572600,
                                        PriceBreakup: {
                                            BasicFare: 542800,
                                            Tax: 29800,
                                            TotalPrice: 572600,
                                            RBD: 'Y',
                                            TaxDetails: {
                                                other_tax: 59600
                                            },
                                            AgentCommission: 0,
                                            AgentTdsOnCommision: 0
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: 513000,
                                                Tax: 29800,
                                                TotalPrice: 542800
                                            },
                                            CHD: {
                                                PassengerCount: 1,
                                                BasePrice: 29800,
                                                Tax: 0,
                                                TotalPrice: 29800
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: false,
                                        AirlineRemark: '2tf'
                                    },
                                    ResultToken: '41ee40e6b15ff83a622b4928d5e01987*_*32*_*CNbSoeIlHu0hjJT7'
                                }
                            ]
                        ]
                    },
                    NearByAirports: [
                        {
                            depart: [
                                {
                                    AirportCode: 'GMP',
                                    AirportName: 'Gimpo Airport'
                                },
                                {
                                    AirportCode: 'ICN',
                                    AirportName: 'Seoul (Incheon)'
                                },
                                {
                                    AirportCode: 'SSN',
                                    AirportName: 'Seoul AB'
                                }
                            ],
                            arrival: [
                                {
                                    AirportCode: 'BKK',
                                    AirportName: 'Suvarnabhumi International'
                                },
                                {
                                    AirportCode: 'DMK',
                                    AirportName: 'Don Muang'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    } else {
        return {
            Status: 1,
            Message: '',
            data: {
                Search: {
                    FlightDataList: {
                        JourneyList: [
                            [
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-04 06:40:00',
                                                        FDTV: 1590993600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 08:25:00',
                                                        FATV: 1590999900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '858',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 09:45:00',
                                                        FDTV: 1591004700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-04 11:50:00',
                                                        FATV: 1591012200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 5 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '825',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '5 Hrs 10 Mins'
                                                }
                                            ],
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-06 07:00:00',
                                                        FDTV: 1590994800
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 09:00:00',
                                                        FATV: 1591002000
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '828',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 16:00:00',
                                                        FDTV: 1591027200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-06 17:45:00',
                                                        FATV: 1591033500
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '853',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '10 Hrs 45 Mins'
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'KRW',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: '344200.00',
                                        PriceBreakup: {
                                            BasicFare: '308400.00',
                                            Tax: '35800.00',
                                            TotalPrice: '344200.00',
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: '10700.00',
                                                K3: '15900.00',
                                                YR: '9200.00'
                                            },
                                            AgentCommission: '0.00',
                                            AgentTdsOnCommision: '0.00'
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: '308400.00',
                                                Tax: '35800.00',
                                                TotalPrice: '344200.00'
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: 1,
                                        AirlineRemark: 'Galileo'
                                    },
                                    ResultToken: '2f9fd6a240e29a0fa246a06f61eb3649*_*1*_*21jiQwPsgB3hbETL'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-04 06:40:00',
                                                        FDTV: 1590993600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 08:25:00',
                                                        FATV: 1590999900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '858',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 09:45:00',
                                                        FDTV: 1591004700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-04 11:50:00',
                                                        FATV: 1591012200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 5 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '825',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '5 Hrs 10 Mins'
                                                }
                                            ],
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-06 08:40:00',
                                                        FDTV: 1591000800
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 10:50:00',
                                                        FATV: 1591008600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 10 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '822',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 16:00:00',
                                                        FDTV: 1591027200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-06 17:45:00',
                                                        FATV: 1591033500
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '853',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '9 Hrs 5 Mins'
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'KRW',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: '344200.00',
                                        PriceBreakup: {
                                            BasicFare: '308400.00',
                                            Tax: '35800.00',
                                            TotalPrice: '344200.00',
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: '10700.00',
                                                K3: '15900.00',
                                                YR: '9200.00'
                                            },
                                            AgentCommission: '0.00',
                                            AgentTdsOnCommision: '0.00'
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: '308400.00',
                                                Tax: '35800.00',
                                                TotalPrice: '344200.00'
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: 1,
                                        AirlineRemark: 'Galileo'
                                    },
                                    ResultToken: '2f9fd6a240e29a0fa246a06f61eb3649*_*2*_*iJ6KHY0pZjL2dAg7'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-04 06:40:00',
                                                        FDTV: 1590993600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 08:25:00',
                                                        FATV: 1590999900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '858',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 09:45:00',
                                                        FDTV: 1591004700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-04 11:50:00',
                                                        FATV: 1591012200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 5 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '825',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '5 Hrs 10 Mins'
                                                }
                                            ],
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-06 08:40:00',
                                                        FDTV: 1591000800
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 10:50:00',
                                                        FATV: 1591008600
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 10 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '822',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 17:30:00',
                                                        FDTV: 1591032600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-06 19:15:00',
                                                        FATV: 1591038900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '849',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '10 Hrs 35 Mins'
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'KRW',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: '344200.00',
                                        PriceBreakup: {
                                            BasicFare: '308400.00',
                                            Tax: '35800.00',
                                            TotalPrice: '344200.00',
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: '10700.00',
                                                K3: '15900.00',
                                                YR: '9200.00'
                                            },
                                            AgentCommission: '0.00',
                                            AgentTdsOnCommision: '0.00'
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: '308400.00',
                                                Tax: '35800.00',
                                                TotalPrice: '344200.00'
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: 1,
                                        AirlineRemark: 'Galileo'
                                    },
                                    ResultToken: '2f9fd6a240e29a0fa246a06f61eb3649*_*3*_*zZ4hgpeltQN9kUi8'
                                },
                                {
                                    FlightDetails: {
                                        Details: [
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-04 06:40:00',
                                                        FDTV: 1590993600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 08:25:00',
                                                        FATV: 1590999900
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '858',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-04 09:45:00',
                                                        FDTV: 1591004700
                                                    },
                                                    Destination: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-04 11:50:00',
                                                        FATV: 1591012200
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs 5 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '825',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '5 Hrs 10 Mins'
                                                }
                                            ],
                                            [
                                                {
                                                    Origin: {
                                                        AirportCode: 'MAA',
                                                        CityName: 'Chennai',
                                                        AirportName: 'Chennai Airport',
                                                        Terminal: '1',
                                                        DateTime: '2020-10-06 12:30:00',
                                                        FDTV: 1591014600
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 14:30:00',
                                                        FATV: 1591021800
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '2 Hrs',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '826',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    }
                                                },
                                                {
                                                    Origin: {
                                                        AirportCode: 'BOM',
                                                        CityName: 'Mumbai',
                                                        AirportName: 'Chhatrapati Shivaji International Airport',
                                                        Terminal: '2',
                                                        DateTime: '2020-10-06 16:00:00',
                                                        FDTV: 1591027200
                                                    },
                                                    Destination: {
                                                        AirportCode: 'BLR',
                                                        CityName: 'Bangalore',
                                                        AirportName: 'Bengaluru International Airport',
                                                        Terminal: '',
                                                        DateTime: '2020-10-06 17:45:00',
                                                        FATV: 1591033500
                                                    },
                                                    OperatingAirline: '',
                                                    Duration: '1 Hr 45 Mins',
                                                    OperatorCode: 'UK',
                                                    OperatorName: 'Air vistara',
                                                    FlightNumber: '853',
                                                    CabinClass: 'Economy',
                                                    Attr: {
                                                        Baggage: '15 Kilograms',
                                                        CabinBaggage: 0,
                                                        AvailableSeats: '9'
                                                    },
                                                    LayOverTime: '5 Hrs 15 Mins'
                                                }
                                            ]
                                        ]
                                    },
                                    Price: {
                                        Currency: 'KRW',
                                        Fare_Type: 'Regular Fare',
                                        TotalDisplayFare: '344200.00',
                                        PriceBreakup: {
                                            BasicFare: '308400.00',
                                            Tax: '35800.00',
                                            TotalPrice: '344200.00',
                                            RBD: 'V',
                                            TaxDetails: {
                                                Other_Tax: '10700.00',
                                                K3: '15900.00',
                                                YR: '9200.00'
                                            },
                                            AgentCommission: '0.00',
                                            AgentTdsOnCommision: '0.00'
                                        },
                                        PassengerBreakup: {
                                            ADT: {
                                                PassengerCount: 1,
                                                BasePrice: '308400.00',
                                                Tax: '35800.00',
                                                TotalPrice: '344200.00'
                                            }
                                        }
                                    },
                                    Attr: {
                                        IsRefundable: 1,
                                        AirlineRemark: 'Galileo'
                                    },
                                    ResultToken: '2f9fd6a240e29a0fa246a06f61eb3649*_*4*_*D6pnYKcJINO7Ymkq'
                                }
                            ]
                        ]
                    }
                }
            }
        }
    }


}

export function tempFareQuaote() {
    return {
        Status: 1,
        Message: '',
        data: {
            UpdateFareQuote: {
                FareQuoteDetails: {
                    JourneyList: {
                        FlightDetails: {
                            Details: [
                                [
                                    {
                                        Origin: {
                                            AirportCode: 'BLR',
                                            CityName: 'Bangalore',
                                            AirportName: 'Bengaluru International Airport',
                                            Terminal: '',
                                            DateTime: '2020-06-04 03:30:00',
                                            FDTV: 1588649400
                                        },
                                        Destination: {
                                            AirportCode: 'CMB',
                                            CityName: 'Colombo',
                                            AirportName: 'Bandaranayake International Airport',
                                            Terminal: '',
                                            DateTime: '2020-06-04 05:00:00',
                                            FATV: 1588654800
                                        },
                                        OperatingAirline: '',
                                        Duration: '1 Hr 30 Mins ',
                                        OperatorCode: 'UL',
                                        OperatorName: 'Srilankan airlines',
                                        FlightNumber: '174',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '30 Kilograms',
                                            CabinBaggage: 0,
                                            AvailableSeats: '7'
                                        }
                                    },
                                    {
                                        Origin: {
                                            AirportCode: 'CMB',
                                            CityName: 'Colombo',
                                            AirportName: 'Bandaranayake International Airport',
                                            Terminal: '',
                                            DateTime: '2020-06-04 18:25:00',
                                            FDTV: 1588703100
                                        },
                                        Destination: {
                                            AirportCode: 'DXB',
                                            CityName: 'Dubai',
                                            AirportName: 'Dubai International Airport',
                                            Terminal: '1',
                                            DateTime: '2020-06-04 21:40:00',
                                            FATV: 1588714800
                                        },
                                        OperatingAirline: '',
                                        Duration: '4 Hrs 45 Mins ',
                                        OperatorCode: 'UL',
                                        OperatorName: 'Srilankan airlines',
                                        FlightNumber: '225',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '30 Kilograms',
                                            CabinBaggage: 0,
                                            AvailableSeats: '7'
                                        },
                                        LayOverTime: '18 Hrs 10 Mins '
                                    }
                                ]
                            ]
                        },
                        Price: {
                            Currency: 'KRW',
                            Fare_Type: 'Regular Fare',
                            TotalDisplayFare: '9436.40',
                            PriceBreakup: {
                                BasicFare: '2684.60',
                                Tax: '6751.80',
                                TotalPrice: '9436.40',
                                RBD: 'Q',
                                TaxDetails: {
                                    IN: '855.60',
                                    K3: '384.40',
                                    P2: '440.20',
                                    ZR: '105.40',
                                    YQ: '4966.20'
                                },
                                AgentCommission: '0.00',
                                AgentTdsOnCommision: '0.00',
                                CommissionEarned: 0,
                                PLBEarned: 0,
                                TdsOnCommission: 0,
                                TdsOnPLB: 0
                            },
                            PassengerBreakup: {
                                ADT: {
                                    PassengerCount: 1,
                                    BasePrice: '2684.60',
                                    Tax: '6751.80',
                                    TotalPrice: '9436.40'
                                },
                                CHD: {
                                    PassengerCount: 1,
                                    BasePrice: '2684.60',
                                    Tax: '6751.80',
                                    TotalPrice: '9436.40'
                                }
                            }
                        },
                        Attr: {
                            IsRefundable: 1,
                            AirlineRemark: '',
                            is_usa: false
                        },
                        ResultToken: 'c292cd9a9d79298ee96fe5d4e5594ec4*_*22*_*MhT7ljftJeW3sZxd'
                    }
                }
            }
        }
    }
}

export function tempExtraServices() {
    return {
        Status: 1,
        Message: '',
        data: {
            ExtraServices: {
                ExtraServiceDetails: {
                    Baggage: [

                    ],
                    MealPreference: [
                        [
                            {
                                Code: 'AVML',
                                Description: 'Asian Vegetarian / Vegetarian Hindu Meal',
                                Origin: 'BLR',
                                Destination: 'TRV',
                                Price: '10.00',
                                MealId: '317ebbde8660b6245d247603d7c35f27*_*24*_*PtdymFQurGg1Nsc4'
                            },
                            {
                                Code: 'BBML',
                                Description: 'Baby meal / infant/baby food',
                                Origin: 'BLR',
                                Destination: 'TRV',
                                Price: '10.00',
                                MealId: '317ebbde8660b6245d247603d7c35f27*_*25*_*c5z4YdjuarqiDxoT'
                            }
                        ]
                    ],
                    Seat: []
                }
            }
        }
    }
}

export function fakeCommitBookingResult() {
    return {
        Status: 1,
        Message: '',
        data: {
            CommitBooking: {
                BookingDetails: {
                    PassengerContactDetails: {
                        Email: 'anitha.g.provab@gmail.com',
                        Phone: '8050584929',
                        PhoneAreaCode: '080',
                        PhoneExtension: '91'
                    },
                    PassengerDetails: [
                        {
                            PassengerId: '28',
                            PassengerType: 'CHD',
                            Title: 'Mrs',
                            FirstName: 'Anitha',
                            MiddleName: '',
                            LastName: 'Gangapatanm',
                            DateOfBirth: '1990-03-14',
                            Gender: 'Male',
                            PassportNumber: 'PP43645678',
                            PassportIssuingCountry: 'IN',
                            PassportExpiryDate: '2026-07-12',
                            BaggageDetails: [
                                {
                                    Origin: 'HKG',
                                    Destination: 'SIN',
                                    Baggage: '4 (2 bags - 35Kg total - 320.00  USD)',
                                    Price: 320.00
                                },
                                {
                                    Origin: 'HKG',
                                    Destination: 'SIN',
                                    Baggage: '4 (2 bags - 35Kg total - 320.00  USD)',
                                    Price: 320.00
                                }
                            ]
                        }
                    ],
                    JourneyList: {
                        FlightDetails: {
                            Details: [
                                [
                                    {
                                        Origin: {
                                            AirportCode: 'BLR',
                                            CityName: 'Bengaluru International Airport',
                                            AirportName: 'Bengaluru International Airport',
                                            Terminal: 'T',
                                            DateTime: '2021-01-29 08:00:00',
                                            FDTV: 1611907200
                                        },
                                        Destination: {
                                            AirportCode: 'DEL',
                                            CityName: 'Indira Gandhi International Airport',
                                            AirportName: 'Indira Gandhi International Airport',
                                            Terminal: 'T3',
                                            DateTime: '2021-01-29 10:40:00',
                                            FATV: 1611916800
                                        },
                                        OperatingAirline: '',
                                        Duration: '2 Hrs 40 Mins',
                                        OperatorCode: 'UK',
                                        DisplayOperatorCode: 'UK',
                                        OperatorName: 'Air vistara',
                                        FlightNumber: '808',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '15 Kilograms',
                                            CabinBaggage: 0,
                                            AvailableSeats: '9'
                                        }
                                    },
                                    {
                                        Origin: {
                                            AirportCode: 'DEL',
                                            CityName: 'Indira Gandhi International Airport',
                                            AirportName: 'Indira Gandhi International Airport',
                                            Terminal: 'T3',
                                            DateTime: '2021-01-29 17:25:00',
                                            FDTV: 1611941100
                                        },
                                        Destination: {
                                            AirportCode: 'MAA',
                                            CityName: 'Chennai Airport',
                                            AirportName: 'Chennai Airport',
                                            Terminal: 'T1',
                                            DateTime: '2021-01-29 20:15:00',
                                            FATV: 1611951300
                                        },
                                        OperatingAirline: '',
                                        Duration: '2 Hrs 50 Mins',
                                        OperatorCode: 'UK',
                                        DisplayOperatorCode: 'UK',
                                        OperatorName: 'Air vistara',
                                        FlightNumber: '837',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '15 Kilograms',
                                            CabinBaggage: 0,
                                            AvailableSeats: '9'
                                        },
                                        LayOverTime: '6 Hrs 45 Mins'
                                    }
                                ]
                            ]
                        }
                    },
                    Price: {
                        Currency: 'USD',
                        Fare_Type: 'Regular Fare',
                        TotalDisplayFare: 243000,
                        PriceBreakup: {
                            BasicFare: 220600,
                            Tax: 22400,
                            TotalPrice: 243000,
                            RBD: 'Q',
                            TaxDetails: {
                                IN: 3600,
                                K3: 11300,
                                P2: 2900,
                                YR: 4600
                            },
                            AgentCommission: 0,
                            AgentTdsOnCommision: 0
                        },
                        PassengerBreakup: {
                            ADT: {
                                PassengerCount: 1,
                                BasePrice: 220600,
                                Tax: 22400,
                                TotalPrice: 243000
                            }
                        }
                    },
                    Attr: {
                        IsRefundable: 1,
                        AirlineRemark: 'Galileo',
                        IsPriceChanged: false
                    },
                    ResultToken: '7657c83ab6d4f06ef2c3b5a5d5610de3*_*361*_*FotifAWppTLgltzW'
                }
            }
        }
    }
}

export function fakeFinalBookingResult() {
    return {
        Status: '2',
        Message: '',
        data: {
            FinalBooking: {
                BookingDetails: {
                    BookingStatus: "BOOKING_HOLD",
                    BookingAppReference: "TEST",
                    GDSPNR: 'UO202006030000134979',
                    BookingId: 'UO202006030000134979',
                    AIRLINEPNR: '',
                    PassengerContactDetails: {
                        Email: 'anitha.g.provab@gmail.com',
                        Phone: '8050584929',
                        PhoneAreaCode: '080',
                        PhoneExtension: '91'
                    },
                    PassengerDetails: [
                        {
                            PassengerId: '32',
                            PassengerType: 'ADT',
                            Title: 'Mrs',
                            FirstName: 'Anitha',
                            MiddleName: '',
                            LastName: 'Gangapatanm',
                            DateOfBirth: '1990-03-14',
                            Gender: 'Male',
                            PassportNumber: 'PP43645678',
                            PassportIssuingCountry: 'IN',
                            PassportExpiryDate: '2026-07-12',
                            TicketNumber: null
                        }
                    ],
                    JourneyList: {
                        FlightDetails: {
                            Details: [
                                [
                                    {
                                        Origin: {
                                            AirportCode: 'HKG',
                                            CityName: 'Hong Kong International Airport',
                                            AirportName: 'Hong Kong International Airport',
                                            Terminal: 'T1',
                                            DateTime: '2020-08-18 15:20:00',
                                            FDTV: 1597764000
                                        },
                                        Destination: {
                                            AirportCode: 'SGN',
                                            CityName: 'Ho Chi Minh City Airport',
                                            AirportName: 'Ho Chi Minh City Airport',
                                            Terminal: 'T2',
                                            DateTime: '2020-08-18 17:15:00',
                                            FATV: 1597770900
                                        },
                                        AirlinePNR: 'UO202006030000134979',
                                        OperatingAirline: '',
                                        Duration: '1 Hr 55 Mins',
                                        OperatorCode: 'VN',
                                        DisplayOperatorCode: 'VN',
                                        OperatorName: 'Vietnam airways',
                                        FlightNumber: '595',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '1 Pieces',
                                            CabinBaggage: '0 Kilograms',
                                            AvailableSeats: ''
                                        }
                                    },
                                    {
                                        Origin: {
                                            AirportCode: 'SGN',
                                            CityName: 'Ho Chi Minh City Airport',
                                            AirportName: 'Ho Chi Minh City Airport',
                                            Terminal: 'T2',
                                            DateTime: '2020-08-19 09:00:00',
                                            FDTV: 1597827600
                                        },
                                        Destination: {
                                            AirportCode: 'SIN',
                                            CityName: 'Changi Airport',
                                            AirportName: 'Changi Airport',
                                            Terminal: 'T4',
                                            DateTime: '2020-08-19 12:10:00',
                                            FATV: 1597839000
                                        },
                                        AirlinePNR: 'UO202006030000134979',
                                        OperatingAirline: '',
                                        Duration: '3 Hrs 10 Mins',
                                        OperatorCode: 'VN',
                                        DisplayOperatorCode: 'VN',
                                        OperatorName: 'Vietnam airways',
                                        FlightNumber: '651',
                                        CabinClass: 'Economy',
                                        Attr: {
                                            Baggage: '1 Pieces',
                                            CabinBaggage: '0 Kilograms',
                                            AvailableSeats: ''
                                        }
                                    }
                                ]
                            ]
                        }
                    },
                    Price: {
                        Currency: 'KRW',
                        Fare_Type: 'Regular Fare',
                        TotalDisplayFare: 193724.6,
                        PriceBreakup: {
                            BasicFare: 114774,
                            Tax: 78950.6,
                            TotalPrice: 193724.6,
                            RBD: 'P',
                            TaxDetails: {
                                airportTax: 78950.6,
                                fuelTax: 0
                            },
                            AgentCommission: 0,
                            AgentTdsOnCommision: 0
                        },
                        PassengerBreakup: {
                            ADT: {
                                PassengerCount: '1',
                                BasePrice: 114774,
                                Tax: 78950.6,
                                TotalPrice: 193724.6
                            }
                        }
                    },
                    Attr: {
                        IsRefundable: '',
                        AirlineRemark: 'Chinadomestic',
                        IsPriceChanged: false
                    }
                }
            }
        }
    }
}

export function fakeVoucher() {
    return {
        Status: true,
        Message: '',
        data: {
            voucher_data: {
                booking_details: [
                    {
                        app_reference: 'FB06-054505-254641',
                        status: 'BOOKING_HOLD',
                        email: 'anitha.g.provab@gmail.com',
                        phone: '8050584929',
                        booked_date: '19-May-2020'
                    }
                ],
                booking_itinerary_details: [
                    {
                        airline_code: 'TR',
                        airline_name: 'Transbrasil s/a linhas aereas',
                        flight_number: '981',
                        fare_class: 'Economy',
                        from_airport_code: 'HKG',
                        from_airport_name: 'Hong Kong International Airport',
                        to_airport_code: 'SIN',
                        to_airport_name: 'Changi Airport',
                        departure_datetime: '2020-07-04 19:20:00',
                        arrival_datetime: '2020-07-04 23:15:00',
                        attributes: '{"AirlinePNR":null,"IsRefundable":0,"OperatingAirline":"","Duration":"3 Hrs 55 Mins ","LayOverTime":null,"OriginTerminal":"2","DestinationTerminal":"1","Attr":{"Baggage":"20 Kilograms","CabinBaggage":0,"AvailableSeats":"7"}}',
                        airline_pnr: ''
                    }
                ],
                booking_customer_details: [
                    {
                        passenger_type: 'Adult',
                        title: 'Mrs',
                        first_name: 'Anitha',
                        middle_name: '',
                        last_name: 'Gangapatanm',
                        date_of_birth: '1990-03-14',
                        ticket_number: null
                    },
                    {
                        passenger_type: 'Child',
                        title: 'Mr',
                        first_name: 'Anil',
                        middle_name: '',
                        last_name: 'Gangapatanm',
                        date_of_birth: '2010-05-12',
                        ticket_number: null
                    },
                    {
                        passenger_type: 'Infant',
                        title: 'Mr',
                        first_name: 'Saiii',
                        middle_name: '',
                        last_name: 'Gangapatanm',
                        date_of_birth: '2019-03-14',
                        ticket_number: null
                    }
                ],
                booking_transaction_details: [
                    {
                        gds_pnr: '5HV8V8',
                        fare_breakup: {
                            Currency: 'KRW',
                            Fare_Type: 'Regular Fare',
                            TotalDisplayFare: '1639.28',
                            PriceBreakup: {
                                BasicFare: '939.92',
                                Tax: '699.36',
                                TotalPrice: '1639.28',
                                RBD: 'X',
                                TaxDetails: {
                                    G3: '163.68',
                                    HK: '72.73',
                                    I5: '90.95',
                                    YR: '372.00'
                                },
                                AgentCommission: '0.00',
                                AgentTdsOnCommision: '0.00',
                                CommissionEarned: 0,
                                PLBEarned: 0,
                                TdsOnCommission: 0,
                                TdsOnPLB: 0
                            },
                            PassengerBreakup: {
                                ADT: {
                                    PassengerCount: 1,
                                    BasePrice: '388.12',
                                    Tax: '281.60',
                                    TotalPrice: '669.72'
                                },
                                CHD: {
                                    PassengerCount: 1,
                                    BasePrice: '388.12',
                                    Tax: '208.88',
                                    TotalPrice: '597.00'
                                },
                                INF: {
                                    PassengerCount: 1,
                                    BasePrice: '163.68',
                                    Tax: '208.88',
                                    TotalPrice: '372.56'
                                }
                            }
                        },
                        total_fare: '1639.28'
                    }
                ],
                extrabaggge_details: [],
                meal_details: [],
                seat_details: []
            },
            domain_details: {
                address: null,
                logo: 'nnm.pjeg',
                phone: null,
                domainname: 'Demo USD',
                domainwebsite: 'https://travelsoho.com/antrip_v1'
            }
        }
    }
}