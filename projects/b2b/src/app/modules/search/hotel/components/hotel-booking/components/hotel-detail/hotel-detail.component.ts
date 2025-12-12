import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import { HotelService } from '../../../../hotel.service';

@Component({
    selector: 'app-hotel-detail',
    templateUrl: './hotel-detail.component.html',
    styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {

    @ViewChild('mapContainer', { static: true }) gMap: ElementRef<HTMLDivElement>;
    @Input() hotel: any;
    @Input() traveller: any;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    map: any; //google.maps.Map;
    coordinates: any;
    lat: number;
    lng: number;
    marker: google.maps.Marker;
    details: any = {};
    mapLoaded: Promise<boolean>;

    constructor(
        private hotelService: HotelService
    ) { }

    ngOnInit() {
        // this.resizeMap();
        if(this.traveller){
            this.traveller.forEach(element => {
                this.travellerAdult += element.adults;
                this.travellerChild += element.childrens;
            });
        }
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

    goTo(location: string): void {
        this.hotelService.scrollToRoomDetails.next(true);
    }

    resizeMap() {
        this.coordinates = { lat: this.hotel.Latitude, lng: this.hotel.Longitude };
        this.mapInitializer();
    }

    mapInitializer() {
        this.map = new google.maps.Map(this.gMap.nativeElement, {
            center: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.placeMarker();
    }

    placeMarker() {
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
        let latlngset = new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng);
        let marker = new google.maps.Marker({
            map: this.map,
            icon: svgMarker,
            title: this.hotel.HotelName,
            position: latlngset
        });
        let style_pop_up = 'height="60" width="60"';
        let style_image = 'height="30" width="30"';
        let pop_up_hotel_image = '<img src="' + this.hotel['HotelPicture'] + '" ' + style_pop_up + '>';
        let $pop_up = '<div style="width:300px; padding:2px;"><div class="mapplot" style="color:#3399FE;"> <div class="projimg1" style="float:left;"> ' + pop_up_hotel_image + '</div> <div class="mapplot_desc"><div style="color: royalblue; font-size: 14px; font-weight:bold;"> ' + this.hotel.HotelName + ', <small style="color:#000;"> ' + this.hotel.HotelAddress + '</small></div> <div style="float:left"> </div></div> </div></div></div>';
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
        })(marker, this.hotel.HotelName, infowindow));

    }

    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
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

}
