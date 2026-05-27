import { ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { } from 'googlemaps';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ThemeOptions } from 'projects/b2b/src/app/theme-options';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';
import { HotelSearchLoaderComponent } from './components/hotel-search-loader/hotel-search-loader.component';
import * as moment from 'moment';
@Component({
    selector: 'app-hotel-result',
    templateUrl: './hotel-result.component.html',
    styleUrls: ['./hotel-result.component.scss']
})
export class HotelResultComponent implements OnInit, DoCheck {

    @ViewChild('mapContainer', { static: true }) gMap: ElementRef<HTMLDivElement>;
    searchType = "middle";
    traveller: any;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    travellerChildAge:any =0;
    checkInDate: any;
    checkOutDate: any;
    destination: any;
    booking_source: any;
    searchPayload: any;
    protected subs = new SubSink();
    loading: boolean;
    hotels: any = [];
    errorMessage: any;
    isCollapsed = true;
    serverError = false;
    noHotel = false;
    searchingHotel = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    endSlice: number = 20;
    throttle: any;
    map: any; //google.maps.Map;
    coordinates: any = { 'lat': 12.972442, 'lng': 77.580643 };
    lat: number;
    lng: number;
    marker: google.maps.Marker;
    details: any = {};
    mapLoaded: Promise<boolean>;
    public browserRefresh: boolean;
    searchId:any;
    constructor(
        private hotelService: HotelService,
        private router: Router,
        public globals: ThemeOptions,
        private cd: ChangeDetectorRef,
        private dialog: MatDialog,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService,
        private swalService: SwalService
    ) {}

    ngOnInit() {
        this.browserRefresh = browserRefresh;
        this.searchPayload = this.prepareSearchPayloadFromSessionData('hotelSearchData');
        if (this.browserRefresh) {
            this.hotelService.formFilled=JSON.parse(sessionStorage.getItem('hotelSearchData'));
		}
       
         this.searchPayload.RoomGuests.forEach(element => {
            this.traveller = [{
                adults: element.NoOfAdults,
                childrens: element.NoOfChild
            }];
        });
        this.searchResult(this.searchPayload);
        this.hotelService.loading.next(true);
        this.subs.sink = this.hotelService.searchingHotel.subscribe(res => {
            this.searchingHotel = res;
            if(!this.searchingHotel)
            {this.dialog.closeAll();
            }
        });
        this.subs.sink = this.hotelService.serverError.subscribe(res => {
            this.serverError = res;
        });
        this.subs.sink = this.hotelService.loading.subscribe(res => {
            this.loading = res;
        });
        this.subs.sink = this.hotelService.hotels.subscribe(res => {
            //this.hotelService.loading.next(true);
            if (!res.length) {
                this.hotels = [];
                this.hotelService.loading.next(false);
            } else {
                this.hotelService.loading.next(false);
                this.hotels = res || [];
                this.details = res;
                // this.mapInitializer();
                if (!this.loading) {
                    setTimeout(_ => {
                        this.dialog.closeAll();
                        this.globals.sidebarHover = true;
                    }, 100);
                }
            }
        });
        this.subs.sink = this.hotelService.changeDetectionEmitter.subscribe(
            () => {
                // this.cd.detectChanges();
            },
            (err) => {
                console.log(err);
            }
        );

        this.subs.sink = this.hotelService.isCollapsed.subscribe(res => {
            this.isCollapsed = res;
        });
        this.subs.sink = this.hotelService.noHotel.subscribe(res => {
            this.noHotel = res;
        });
        // this.hotelService.loading.next(false);
    }

    onScrollDown(len) {
        if ((len % 20) === 0 && this.endSlice < 500) {
            this.endSlice += 20;
        }
    }


    ngAfterViewChecked() {
        // this.cd.detectChanges();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            // this.cd.detectChanges();
        });
    }

    resetFilter() {
        this.hotelService.resetFilter();
    }

    searchResult(data: any) {
       
        this.util.writeStorage("hotelSearchPostdata", data, sessionStorage);
        this.searchPayload = this.prepareSearchPayloadFromSessionData('hotelSearchData');
        const params = this.hotelService.formFilled;
        if (params) {
            this.travellerAdult = 0;
            this.travellerChild = 0;
            this.traveller = params['traveller'];
            this.traveller.forEach(element => {
                this.travellerAdult += element.adults;
                this.travellerChild += element.childrens;
            });
            this.booking_source = params['destination_source'];
            this.searchId = params['searchId'];
            let config = new MatDialogConfig();
            config.height = '600px';
            config.width = '1000px';
            config.panelClass = "copy-items-modal";
            config.disableClose = true;
            config.data = {
                data: this.hotelService.formFilled
            }
            let copyDialog = this.dialog.open(HotelSearchLoaderComponent, config);
        }
        // RDD
        this.hotelService.searchResult(this.searchPayload);
        // this.cd.detectChanges();
    }

    private prepareSearchPayloadFromSessionData(sessionKey: string): any {
        const ssd = JSON.parse(sessionStorage.getItem(sessionKey));
        this.destination=ssd.destination_name;
        let RoomGuests = [];
      
        ssd['traveller'].forEach(element => {
            this.setAdultChildCount(element);
            RoomGuests.push({
                "NoOfAdults": Number(element['adults']),
                "NoOfChild": Number(element['childrens']),
                "ChildAge":element['childAges']
            })
        });

        let reqBody = {
            "CheckIn": `${(moment(ssd['check_in_date'])).format('YYYY-MM-DD')}`,
			"CheckOut": `${moment(ssd['check_out_date']).format('YYYY-MM-DD')}`,
            // "CheckIn": `${ssd['check_in_date']}`,
            // "CheckOut": `${ssd['check_out_date']}`,
            "Currency": 'GBP',
            "Market":`${ssd['market']}`,
            "CancellationPolicy": true,
            "CityIds": [
                `${ssd['destination_id']}`
            ],
            "NoOfNights": `${ssd['noOfNights']}`,
            NoOfRooms: Number(ssd['traveller'].length),
            RoomGuests,
            booking_source: `${ssd['destination_source']}`,
            searchId:`${ssd['searchId']}`,
            CountryCode: `${ssd['countryCode']}`
        }
        return reqBody;
    }

    onBookNow(hotel: any) {
        this.loading = true;
        this.hotelService.loading.next(true);
        this.subs.sink = this.apiHandlerService.apiHandler('hotelDetails', 'POST', '', '', {
            ResultToken: hotel['ResultIndex'],
            booking_source: hotel['booking_source']
        }).subscribe(res => {
            if (res.data.length > 0 || res.data) {
                this.loading = false;
                this.hotelService.bookingHotelData.next(res.data);
                localStorage.setItem('bookingHotelData', JSON.stringify(this.hotelService.bookingHotelData.getValue()));
                this.hotelService.resultToken = res.ResultToken;
                this.hotelService.traveller = this.traveller;
                localStorage.setItem('b2bHotelTraveller', JSON.stringify(this.hotelService.traveller));
                this.router.navigate(['/search/hotel/booking']);
            } else {
                this.loading = false;
                this.hotelService.loading.next(false);
                this.swalService.alert.oops(res.Message);
            }
            this.hotelService.loading.next(false);
        },(err) => {
            this.loading = false;
            this.swalService.alert.oops("Something got error. Please try again.");
        });
    }

    hasAmenities(amenitiesArr: Array<any>, type: string): boolean {
        const amenitiesStr = amenitiesArr.join('').replace(/_/gi, '').toLowerCase();
        const typeArr = type.toLowerCase().replace(/_/gi, '').split('|');
        let found: boolean = false;
        typeArr.forEach(matchStr => {
            const match = new RegExp(`${matchStr}`, 'gi');
            if (amenitiesStr.match(match)) {
                found = true
            }
        });
        return found;
    }

// Amenities mapping with FontAwesome or custom icons
amenitiesMap: { [key: string]: { icon: string, tooltip: string } } = {
    reception24: { icon: 'fi fi-rr-user-clock', tooltip: '24-Hour Reception' },
    safe: { icon: 'fi fi-rr-shield-check', tooltip: 'Safe' },
    cloakroom: { icon: 'fi fi-rr-hanger', tooltip: 'Cloakroom' },
    lifts: { icon: 'fi fi-rr-elevator', tooltip: 'Lifts' },
    cafe: { icon: 'fi fi-rr-coffee', tooltip: 'Cafe' },
    supermarket: { icon: 'fi fi-rr-store', tooltip: 'Supermarket' },
    shops: { icon: 'fi fi-rr-cart-alt', tooltip: 'Shops' },
    hairdresser: { icon: 'fi fi-rr-scissors', tooltip: 'Hairdresser' },
    bars: { icon: 'fi fi-rr-glass-cheers', tooltip: 'Bar' },
    pub: { icon: 'fi fi-rr-beer', tooltip: 'Pub' },
    disco: { icon: 'fi fi-rr-music', tooltip: 'Disco' },
    conferenceroom: { icon: 'fi fi-rr-meeting', tooltip: 'Conference Room' },
    internet: { icon: 'fi fi-rr-globe', tooltip: 'Internet' },
    wlan: { icon: 'fi fi-rr-wifi', tooltip: 'WiFi' },
    roomservice: { icon: 'fi fi-rr-concierge-bell', tooltip: 'Room Service' },
    laundryservice: { icon: 'fi fi-rr-washer', tooltip: 'Laundry Service' },
    carpark: { icon: 'fi fi-rr-parking', tooltip: 'Parking' },
    garage: { icon: 'fi fi-rr-garage', tooltip: 'Garage' },
    playground: { icon: 'fi fi-rr-playground', tooltip: 'Playground' },
    tvroom: { icon: 'fi fi-rr-tv-music', tooltip: 'TV Room' },
    washing: { icon: 'fi fi-rr-washer', tooltip: 'Washing Machine' },
    gamesroom: { icon: 'fi fi-rr-gamepad', tooltip: 'Games Room' },
    restaurants: { icon: 'fi fi-rr-restaurant', tooltip: 'Restaurants' },
    bicyclehire: { icon: 'fi fi-rr-bicycle', tooltip: 'Bicycle Hire' },
    miniclub: { icon: 'fi fi-rr-club', tooltip: 'Mini Club' },
    pets: { icon: 'fi fi-rr-paw', tooltip: 'Pets Allowed' },
    wheelchairaccessible: { icon: 'fi fi-rr-wheelchair', tooltip: 'Wheelchair Accessible' },
    restaurants_nosmokingarea: { icon: 'fi fi-rr-smoking-ban', tooltip: 'Non-Smoking Area' },
    kiosk: { icon: 'fi fi-rr-store-alt', tooltip: 'Kiosk' },
    medicalservice: { icon: 'fi fi-rr-briefcase-medical', tooltip: 'Medical Service' },
    bicyclecellar: { icon: 'fi fi-rr-bicycle', tooltip: 'Bicycle Cellar' },
    moneyexchange: { icon: 'fi fi-rr-bank', tooltip: 'Money Exchange' },
    foyer: { icon: 'fi fi-rr-home', tooltip: 'Foyer' },
    theatre: { icon: 'fi fi-rr-theater', tooltip: 'Theatre' },
    casino: { icon: 'fi fi-rr-dice', tooltip: 'Casino' },
    aircon: { icon: 'fi fi-rr-air-conditioner', tooltip: 'Air Conditioning' },
    Parking: { icon: 'fi fi-rr-parking', tooltip: 'Parking' },
    'Free toiletries': { icon: 'fi fi-rr-toilet-paper', tooltip: 'Free Toiletries' },
    TV: { icon: 'fi fi-rr-tv-music', tooltip: 'TV' },
    'Safe Toilet': { icon: 'fi fi-rr-toilet', tooltip: 'Safe Toilet' },
    Telephone: { icon: 'fi fi-rr-phone-office', tooltip: 'Telephone' },
    'Air conditioning': { icon: 'fi fi-rr-air-conditioner', tooltip: 'Air Conditioning' },
    'Washing Machine': { icon: 'fi fi-rr-washer', tooltip: 'Washing Machine' },
    'Free Wifi': { icon: 'fi fi-rr-wifi', tooltip: 'Free WiFi' },
    'Swimming Pool': { icon: 'fi fi-rr-swimming-pool', tooltip: 'Swimming Pool' },
    restaurants_aircon: { icon: 'fi fi-rr-air-conditioner', tooltip: 'Air-Conditioned Restaurant' },
    restaurants_highchair: { icon: 'fi fi-rr-highchair', tooltip: 'Restaurant Highchair' },
    checkin24: { icon: 'fi fi-rr-clock', tooltip: '24-Hour Check-in' },
    spa: { icon: 'fi fi-rr-spa', tooltip: 'Spa Services' },
    gym: { icon: 'fi fi-rr-dumbbell', tooltip: 'Gym/Fitness Center' },
    sauna: { icon: 'fi fi-rr-hot-tub', tooltip: 'Sauna' },
    beachaccess: { icon: 'fi fi-rr-umbrella-beach', tooltip: 'Beach Access' },
    airportshuttle: { icon: 'fi fi-rr-bus', tooltip: 'Airport Shuttle' },
    breakfast: { icon: 'fi fi-rr-bread', tooltip: 'Breakfast Available' },
    petfriendly: { icon: 'fi fi-rr-dog-leashed', tooltip: 'Pet Friendly' }
  };
  
  // Function to check if an amenity exists in the map
  hasAmenityIcon(amenity: string): boolean {
    return !!this.amenitiesMap[amenity];
  }
  
  // Function to get icon class for an amenity
  getAmenityIcon(amenity: string): string {
    return this.amenitiesMap[amenity].icon || 'fi fi-rr-circle-question'; // Default icon
  }
  
  // Function to get tooltip text for an amenity
  getAmenityTooltip(amenity: string): string {
    return this.amenitiesMap[amenity].tooltip || amenity.replace(/_/g, ' ');
  }
  
  

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = Math.round(num);
        return starArr;
    }

    getStarArrayRemaining(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = 5 - Math.round(num);
        return starArr;
    }

    ngDoCheck(): void {
    }

    //For map

    mapInitializer() {
        var mapProp = {
            center: new google.maps.LatLng(this.details[0]['Latitude'], this.details[0]['Longitude']),
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP // also use ROADMAP,SATELLITE or TERRAIN
        };

        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#003580",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };

        this.map = new google.maps.Map(document.getElementById("toggleMap"), mapProp);
        var marker = new google.maps.Marker({ position: mapProp.center, icon: svgMarker });

        marker.setIcon(svgMarker)
        marker.setMap(this.map);
        /*var infowindow = new google.maps.InfoWindow({ content: "Hey !! Here we are" });
        infowindow.open(this.map, marker);*/
        // this.setMultipleMarker(this);
        this.setMarkers();
    }


    setMarkers() {
        let infowindow = new google.maps.InfoWindow()
        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#003580",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };
        this.details.forEach((place) => {
            let latlngset = new google.maps.LatLng(place.Latitude, place.Longitude);
            let marker = new google.maps.Marker({
                map: this.map,
                title: place.HotelName,
                position: latlngset,
                icon: svgMarker,
            });
            marker.setIcon(svgMarker)
            this.map.setCenter(marker.getPosition())

            let style_pop_up = 'height="60" width="60"';
            let style_image = 'height="30" width="30"';
            let pop_up_hotel_image = '<img src="' + place['HotelPicture'] + '" ' + style_pop_up + '>';

            //<img src="./assets/images/star_rating_black_' + 0 + '.png" alt="" />
            let $pop_up = `<div style="width:300px; padding:2px;">
            <div class="mapplot" style="color:#3399FE;"> 
            <div class="projimg1" style="float:left;">  ${pop_up_hotel_image} </div> 
            <div class="mapplot_desc"><div style="color: royalblue; font-size: 14px; font-weight:bold;"> 
             ${place.HotelName}, <small style="color:#000;"> ${place.HotelAddress} </small></div> 
             <div style="float:left"> <div class="rating_empty" style="margin-left: 0px;"> 
             <span class="rating-no">
             
             
              </span><h5 class="font-weight-bold"> GBP ${place.Price.Amount}</h5> 
              <button id="book" class="btn btn-info">
              <span class="sendapplink-wrapper"><span class="sendapplink-text">Book</span></span></button>
              <p id="resultIndex" style="visibility: hidden; display:none;"> ${place.ResultIndex} </p>
              <p id="bookingSource" style="visibility: hidden; display:none;"> ${place.booking_source} </p>
              </div> </div></div> </div></div>`;
            //	let $pop_up = `${place.HotelName}`;
            let currentInfoWin = true;

            google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
                return function () {
                    if (currentInfoWin) {
                        infowindow.close();
                    }
                    infowindow.setContent($pop_up);
                    infowindow.open(this.map, marker);
                    currentInfoWin = true;
                };
            })(marker, place.HotelName, infowindow));

        });

        infowindow.addListener('domready', () => {
            let resultIndex = document.getElementById('resultIndex').innerHTML;
            let bookingSource = document.getElementById('bookingSource').innerHTML;
            let hotel = {
                ResultIndex: resultIndex.trim(),
                booking_source: bookingSource.trim()
            }
            document.getElementById("book").addEventListener("click", () => {
                //this.showRooms(val);
                this.onBookNow(hotel)
            });
        });

    }

    convert(price, cur) {
        return `${cur} ${price}`
    }

    showRooms(hotel) {
        // let queryParams = {};
        // this.subSunk.sink = this.hotelService.searchHotelReqBody.subscribe(reqBody => {
        // 	//queryParams = Object.assign({ hotel_ids: [`${hotel['HotelCode']}`] }, reqBody);
        // 	queryParams = Object.assign({ hotel_ids: [hotel] }, reqBody);
        // })
        //this.router.navigate(['/hotel/hotel-details'], { queryParams })
    }
    
    setAdultChildCount(element){
        console.log("element",element)
		this.travellerAdult += Number(element['adults']);
		this.travellerChild += Number(element['childrens']);
        this.travellerChildAge += Number(element['childAges']);
	}

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
