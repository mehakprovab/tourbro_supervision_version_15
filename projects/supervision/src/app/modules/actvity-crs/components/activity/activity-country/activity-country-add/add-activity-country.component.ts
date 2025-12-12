import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { SwalService } from "projects/supervision/src/app/core/services/swal.service";
import { ActivityCrsService } from "../../../../activity-crs.service";
@Component({
    selector: 'app-add-activity-country',
    templateUrl: './add-activity-country.component.html',
    styleUrls: ['./add-activity-country.component.scss']
})

export class AddActivityCountryComponent implements OnInit, AfterViewInit {
    @Output() someEvent = new EventEmitter<any>();

    @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
    map: google.maps.Map;
    geocoder: google.maps.Geocoder;
    mapOptions: google.maps.MapOptions;
    marker: google.maps.Marker;
    center!: google.maps.LatLngLiteral;
    searchBox!: google.maps.places.SearchBox;

    countryList: any;
    submitted: boolean = false;
    @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
    addCountryForm: FormGroup;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    editCountryId: any;

    constructor(
        private cdrf: ChangeDetectorRef,
        private fb: FormBuilder,
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private activityCrsService: ActivityCrsService
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.activityCrsService.getCountryData.subscribe(data => {
            console.log(data);
            this.countryList = data;
            this.editCountryId = data.id;
            this.addCountryForm.patchValue({
                Name: data.CountryName,
                IsoCode: data.CountryCode,
                CurrencyCode: data.CurrencyCode,
                Latitude: data.latitude,
                Longitude: data.longitude,
                CurrencyName: data.CurrencyName
            })
        })
    }

    createForm() {
        this.addCountryForm = this.fb.group({
            Name: [''],
            IsoCode: ['', Validators.required],
            // Continent: ['', Validators.required],
            CurrencyCode: ['', Validators.required],
            CurrencyName: ['', Validators.required],
            Latitude: ['', Validators.required],
            Longitude: ['', Validators.required]
        })
    }

    get country() { return this.addCountryForm.controls; }

    ngAfterViewInit() {
        setTimeout(() => {
            this.getGeoCoords();
        }, 3500); // Adjust the delay as needed (in milliseconds)
    }

    getGeoCoords() {
        if (this.countryList && this.countryList.latitude && this.countryList.longitude) {
            this.center = {
                lat: parseFloat(this.countryList.latitude),
                lng: parseFloat(this.countryList.longitude)
            };
            this.mapInitializer();
        } else {
            navigator.geolocation.getCurrentPosition(pos => {
                this.center = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                this.mapInitializer();
            }, err => {
                console.error(`Browser does not support GeoLocation`, err);
            });
        }
        this.cdrf.detectChanges();
    }

    mapInitializer() {
        this.mapOptions = {
            center: this.center,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        console.log("gmap", this.gmap)
        this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
        // this.loading = false;
        console.log("map", this.map)
        this.placeMarker();
        this.initializeSearchBox();
    }
    placeMarker() {
        this.marker = new google.maps.Marker({
            position: this.center,
            map: this.map
        });

        this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
                this.marker.setPosition(event.latLng);
                this.addCountryForm.get('Latitude').setValue(event.latLng.lat());
                this.addCountryForm.get('Longitude').setValue(event.latLng.lng());
                this.getTimezoneOffset(event.latLng.lat(), event.latLng.lng());
            }
        });
        this.marker.addListener('dblclick', () => {
            this.map.setZoom(12);
            this.map.setCenter(this.marker.getPosition() as google.maps.LatLng);
        });
    }

    resetForm() {
        this.addCountryForm.reset();
    }

    initializeSearchBox() {
        const input = this.searchInput.nativeElement as HTMLInputElement;
        this.searchBox = new google.maps.places.SearchBox(input);

        this.map.addListener('bounds_changed', () => {
            this.searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
        });

        this.searchBox.addListener('places_changed', () => {
            const places = this.searchBox.getPlaces();
            if (!places || places.length === 0) {
                return;
            }

            const place = places[0];
            if (!place.geometry || !place.geometry.location) {
                console.error('Place has no geometry');
                return;
            }
            const location = place.geometry.location;
            this.marker.setPosition(location);
            this.map.setCenter(location);

            this.addCountryForm.get('Latitude').setValue(location.lat());
            this.addCountryForm.get('Longitude').setValue(location.lng());

            this.getTimezoneOffset(location.lat(), location.lng());
        });
    }

    getTimezoneOffset(lat: number, lng: number) {
        const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const apiKey = 'AIzaSyB3N3Rg1vCjF6FmEc9qisxtS2JOpVUTKDM'; // Replace with your actual API key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        fetch(url).then(res => res.json()).then(data => {
            console.log(data);
            const geoResp = data;
            const country = geoResp.results[0].address_components.find((c: any) =>
                c.types.includes("country")
            );
            if (!country) return null;
            const iso = country.short_name;
            const name = country.long_name;

            const restResp = fetch(`https://restcountries.com/v3.1/alpha/${iso}`).then(r => r.json()).then(res => {
                console.log(res[0]);
                const info = res[0];
                const currencyCode = Object.keys(info.currencies)[0];
                const currencyName = info.currencies[currencyCode].name;
                const continent = info.region;  // No numeric mapping needed
                this.addCountryForm.patchValue({
                    Name: name,
                    IsoCode: iso,
                    // Continent: continent,
                    CurrencyCode: currencyCode,
                    CurrencyName: currencyName
                });
                console.log(this.addCountryForm.value)
            });

        })
    }

    submitCountry() {
        if(!this.addCountryForm.valid) {
            this.swalService.alert.oops('Please fill required fields.')
        }
        else {
            this.loading = true;
            if (this.editCountryId) {
                this.updateCountry()
            } 
            else {
                 const req = this.addCountryForm.value;
                 const payLoad = {
                    "Name": req.Name,
                    "IsoCode": req.IsoCode,
                    "currency_code": req.CurrencyCode,
                    "currency_name": req.CurrencyName,
                    "latitude": req.Latitude,
                    "longitude": req.Longitude,
                    "status": 0
                 }
            this.apiHandlerService.apiHandler('addActivityCountry', 'POST', {} , {}, payLoad).subscribe({
                next: (res) => {
                    console.log(res);
                    if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                        this.someEvent.next({ tabId: 'list_activity_country', hotel_type: '' })
                        this.editCountryId = '';
                        this.addCountryForm.reset();
                    } else {
                        this.swalService.alert.oops()
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.swalService.alert.error(err.error.Message.replace('400','')
                    );
                    this.loading = false;
                }
            })
            }
           
        }
        
    }


    updateCountry() {
            this.loading = true;
            const req = {CountryId: this.editCountryId,...this.addCountryForm.value};
            const payLoad = {
                "CountryId": req.CountryId,
                "Name": req.Name,
                "IsoCode": req.IsoCode,
                "CurrencyCode": req.CurrencyCode,
                "CurrencyName": req.CurrencyName,
                "Latitude": req.Latitude,
                "Longitude": req.Longitude
            }
            this.apiHandlerService.apiHandler('editActivityCountry', 'POST', {} , {}, payLoad).subscribe({
                next: (res) => {
                    console.log(res);
                    if (res.Status === true && (res.statusCode === 200 || res.statusCode === 201)) {
                        this.someEvent.next({ tabId: 'list_activity_country', hotel_type: '' });
                        this.editCountryId = '';
                        this.addCountryForm.reset();
                    } else {
                        this.swalService.alert.oops()
                    }
                    this.loading = false;
                },
                error: (err) => {
                    this.swalService.alert.error(err.error.Message.replace('400','')
);
                    this.loading = false;
                }
            })
        }
}