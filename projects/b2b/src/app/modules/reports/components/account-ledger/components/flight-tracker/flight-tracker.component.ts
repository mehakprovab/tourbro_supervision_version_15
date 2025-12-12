import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import * as Leaflet from 'leaflet';
import 'leaflet-routing-machine';
import 'mapbox-gl-leaflet';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/b2b/src/app/core/services';
import { shareReplay } from 'rxjs/operators';

const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
    selector: 'app-flight-tracker',
    templateUrl: './flight-tracker.component.html',
    styleUrls: ['./flight-tracker.component.scss']
})
export class FlightTrackerComponent implements OnInit, AfterViewInit {

    private map: L.Map;

    @ViewChild('map', { static: false })
    private mapContainer: ElementRef<HTMLElement>;
    showTrackerForm = false;
    flightNumberForm: FormGroup;
    airportForm: FormGroup;
    regConfig: FormGroup;
    submitted = false;
    searchedAirLineList: any;
    searchedList: any;
    minDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    whichForm = "flightNumberForm";
    liveFlightInfo: any;
    flightDetails: any;

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef
    ) {
    }

    title = 'leafletApps';

    ngOnInit(): void {
        this.createForm()
        const svgMarker = {
            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            fillColor: "#003580",
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };
    }

    createFlightNumberForm() {
        this.flightNumberForm = this.fb.group({
            airLine: new FormControl('', [Validators.required]),
            airLineCode: new FormControl(''),
            flightNumber: new FormControl('', [Validators.required]),
            date: new FormControl('', [Validators.required])
        });
    }
    createAirportForm() {
        this.airportForm = this.fb.group({
            airportName: new FormControl('', [Validators.required]),
            airLine: new FormControl('',),
            airLineCode: new FormControl(''),
            date: new FormControl('', [Validators.required]),
            time: new FormControl('', [Validators.required])
        });
    }

    createForm() {
        this.regConfig = this.fb.group({
            flightNumber: new FormControl('ABY462', [Validators.required])
        });
    }

    getPrefferedAirlineList(event: any): void {
        if (event && event.target.value) {
            const name = `${event.target.value}`;
            this.apiHandlerService.apiHandler('preferredAirlines', 'POST', '', '', { name })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedAirLineList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedAirLineList.length = 0;
                    }
                });
        }
    }

    onAirlineSelect(event: any, type): void {
        let city = `${event.name}, (${event.code})`;
        if (city) {
            console.log(event)
            if (type == 'fightForm')
                this.flightNumberForm.patchValue({
                    airLine: event.name,
                    airLineCode: event.code
                });
            if (type == 'airportForm')
                this.airportForm.patchValue({
                    airLine: event.name,
                    airLineCode: event.code
                });
            // this.prefferedAirline.nativeElement.click();
            this.searchedAirLineList.length = 0;
        }
    }

    onAirportSelect(event: any): void {
        // let city = `${event.AirportCity}, ${event.CountryName}, ${event.AirportName}(${event.AirportCode})`;
        let city = `${event.AirportName}(${event.AirportCode})`;
        if (city) {
            this.airportForm.patchValue({ airportName: city });
            if (event.inputFor === 'depart') {
                // this.flightService.originCountry = event;
                // this.regConfig.patchValue({ departureCity: city });

                // this.destinationCity.nativeElement.focus();
            }
            this.searchedList.length = 0;
        }
    }

    hasError1 = (controlName: string, errorName: string) => {
        return ((this.submitted || this.flightNumberForm.controls[controlName].touched) && this.flightNumberForm.controls[controlName].hasError(errorName));
    }
    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.regConfig.controls[controlName].touched) && this.regConfig.controls[controlName].hasError(errorName));
    }
    hasAirportError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.airportForm.controls[controlName].touched) && this.airportForm.controls[controlName].hasError(errorName));
    }

    openTrackerModule() {
        this.showTrackerForm = true;
    }

    hide() {
        this.showTrackerForm = false;
    }

    submitTracker() {
        this.submitted = true;
        let reqBody = {}
        if (!this.regConfig.valid)
            return false
        console.log(this.regConfig.value)
        this.getLiveFlight()
    }

    getLiveFlight() {
        if (!this.regConfig.valid)
            return false
        this.apiHandlerService.apiHandler('liveFlightInfo', 'POST', '', '', { ident: this.regConfig.value.flightNumber })
            .pipe(
                shareReplay(1),
                untilDestroyed(this)
            )
            .subscribe((resp: any) => {
                if (resp.InFlightInfoResult) {
                    this.liveFlightInfo = resp.InFlightInfoResult;
                    console.log(this.liveFlightInfo);
                    this.getFlightDetails()
                }
            });
    }

    getFlightDetails() {
        this.apiHandlerService.apiHandler('flightInfo', 'POST', '', '', { ident: this.regConfig.value.flightNumber })
            .pipe(
                shareReplay(1),
                untilDestroyed(this)
            )
            .subscribe((resp: any) => {
                if (resp.FlightInfoExResult && resp.FlightInfoExResult['flights']) {
                    this.flightDetails = resp.FlightInfoExResult['flights'][0]
                    console.log(this.flightDetails)
                    this.hide()
                    this.trackYourFlight(this.liveFlightInfo)
                }
            });
    }

    trackYourFlight(liveFlight) {
        if (this.map != null) {
            this.map.remove();
        }
        this.map = Leaflet.map('map').setView([0, 0], 0);
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: 'edupala.com © Angular LeafLet',
        }).addTo(this.map);

        var greenIcon = L.icon({
            iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        });

        var redIcon = L.icon(
            {
                iconUrl: 'https://booking247.com/outline_flight_black.png'
            }
        );

        Leaflet.Icon.Default.mergeOptions({
        });

        Leaflet.marker([liveFlight.lowLatitude, liveFlight.lowLongitude]).addTo(this.map).bindPopup(`${this.flightDetails.destinationCity}`).openPopup();
        Leaflet.marker([liveFlight.highLatitude, liveFlight.highLongitude]).addTo(this.map).bindPopup(`${this.flightDetails.originCity}`).openPopup();
        if (liveFlight.latitude > 0 && liveFlight.longitude > 0)
            Leaflet.marker([liveFlight.latitude, liveFlight.longitude], { icon: redIcon }).addTo(this.map);
        var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttribution = 'Map data &copy; 2013 <a href="http://openstreetmap' +
            '.org">OpenStreetMap</a> contributors';
        var osm = new Leaflet.TileLayer(osmUrl, { maxZoom: 18, attribution: osmAttribution });

        var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
            '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
            'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
            ' GIS User Community';
        var esriAerial = new Leaflet.TileLayer(esriAerialUrl,
            { maxZoom: 18, attribution: esriAerialAttrib });

        var gUrl = 'http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        var gAttribution = 'google';
        var googlesat = new Leaflet.TileLayer(gUrl, { maxZoom: 18, attribution: gAttribution });

        var baseLayers = {
            'OpenStreetMap': osm,
            'ESRI Aerial': esriAerial,
            'Google map sat': googlesat
        }

        L.control.layers(baseLayers, {}).addTo(this.map);

        let waypoints = [
            Leaflet.latLng(liveFlight.lowLatitude, liveFlight.lowLongitude),
            Leaflet.latLng(liveFlight.latitude, liveFlight.longitude),
            Leaflet.latLng(liveFlight.highLatitude, liveFlight.highLongitude),
        ]

        var message = ["<strong>" + this.flightDetails.destinationCity + "</strong>", " <strong>" +
            this.regConfig.value.flightNumber + '(' + this.flightDetails.originCity + ' To ' +
            this.flightDetails.destinationCity + ')'
            + "</strong>",
        "<strong>" + this.flightDetails.originCity + "</strong>"];

        Leaflet.Routing.control({
            waypoints: [
                Leaflet.latLng(liveFlight.lowLatitude, liveFlight.lowLongitude),
                Leaflet.latLng(liveFlight.latitude, liveFlight.longitude),
                Leaflet.latLng(liveFlight.highLatitude, liveFlight.highLongitude),
            ],
            lineOptions: {
                styles: [{ color: 'red', opacity: 1, weight: 3 }],
                extendToWaypoints: false,
                missingRouteTolerance: 0
            },
            useZoomParameter: false,
            routeWhileDragging: true,
            show: false,

            plan: Leaflet.Routing.plan(waypoints, {
                createMarker: function (i, wp) {
                    if (waypoints[0]) {
                        if (i == 1) {
                            return L.marker(wp.latLng, {
                                draggable: false,
                                icon: redIcon
                            }).bindPopup(message[i]).openPopup();
                        } else {
                            return L.marker(wp.latLng, {
                                draggable: false,
                                icon: iconDefault
                            }).bindPopup(message[i]).openPopup();
                        }
                    }

                },
                routeWhileDragging: false,
                addWaypoints: false,

            })

        }).addTo(this.map);
        this.cdr.detectChanges()
    }

    getDate(d) {
        return new Date(d * 1000)
    }

    getTime(time) {
        if (time > 0) {
            let unix_timestamp = parseInt(time)
            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
            var date = new Date(unix_timestamp * 1000);
            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            return formattedTime
        } return 0;
    }

    get shouldiHide(): boolean {
        try {
            return !!this.searchedList.length ? true : false;
        } catch (error) {
            //console.log(error);
        }
    }

    get shouldPreferedAirLineHide(): boolean {
        try {
            return !!this.searchedAirLineList.length ? true : false;
        } catch (error) {
            //console.log(error);
        }
    }

    get f() {
        return this.airportForm.controls;
    }

    getSearchedList(event: any): void {
        if (event && event.target.value) {
            const text = `${event.target.value}`;
            this.apiHandlerService.apiHandler('airportList', 'POST', '', '', { text })
                .pipe(
                    shareReplay(1),
                    untilDestroyed(this)
                )
                .subscribe((resp: any) => {
                    if (resp.Status) {
                        this.searchedList = resp.data;
                    } else {
                        const msg = resp['Message'];
                        this.searchedList.length = 0;
                    }

                });
        }
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit() {
        setInterval(() => {
            this.getLiveFlight()
        }, 100000)
    }

}
