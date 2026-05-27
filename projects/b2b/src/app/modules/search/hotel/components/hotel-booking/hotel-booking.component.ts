import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { AlertService } from 'projects/b2b/src/app/core/services/alert.service';
import { formatDate } from 'projects/b2b/src/app/core/services/format-date';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { ModalConfigDataI } from 'projects/b2b/src/app/shared/service/mat-modal.service';
import { SubSink } from 'subsink';
import { HotelService } from '../../hotel.service';
import * as moment from 'moment';
import { browserRefresh } from 'projects/b2b/src/app/app.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HotelSearchLoaderComponent } from '../hotel-result/components/hotel-search-loader/hotel-search-loader.component';

export function getAlertConfig(): TooltipConfig {
    return Object.assign(new TooltipConfig(), {
        placement: 'right',
        container: 'body',
    });
}

@Component({
    selector: 'app-hotel-booking',
    templateUrl: './hotel-booking.component.html',
    styleUrls: ['./hotel-booking.component.scss'],
    providers: [{ provide: TooltipConfig, useFactory: getAlertConfig }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HotelBookingComponent implements OnInit {

    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue'
    };
    isCollapsed = true;
    isCollapsedFareSumm = true;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    modalConfigData: ModalConfigDataI;
    hotel: any;
    flightString: any;
    traveller: any = false;
    travellerString: any;
    contactForm: FormGroup;
    usaDetailsForm: FormGroup;
    titles: any = [];
    infantsTitles: any = [];
    countries: any = [];
    loading: boolean;
    isConfirmed = false;
    maxDate = new Date();
    maxDateAdult: any;
    minDateAdult: any;
    maxDateChild: any;
    minDateChild: any;
    maxDateInfant: any;
    minDateInfant: any;
    extraServices = false;
    currentUser : any;
    airline_logo: string = '';
    protected subs = new SubSink();
    destination: any;
    booking_source: any;
    searchPayload: any;
    searchingHotel = false;
    public browserRefresh: boolean;
    searchId:any;
    travellerAdult: any = 0;
    travellerChild: any = 0;
    travellerChildAge:any =0;
    
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private hotelService: HotelService,
        private alertService: AlertService,
        private dialog: MatDialog,
        private utility: UtilityService,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService
    ) {
    }
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
        // this.searchResult(this.searchPayload);
        // this.hotelService.loading.next(true);
        this.subs.sink = this.hotelService.searchingHotel.subscribe(res => {
            this.searchingHotel = res;
            if(!this.searchingHotel)
            {this.dialog.closeAll();
            }
        });


        this.currentUser = this.utility.readStorage('currentUser', sessionStorage);
        this.airline_logo = this.hotelService.hotel_logo;
        this.hotelService.userTitleList.subscribe(res => {
            if (res) {
                this.titles = res;
                this.infantsTitles = res.filter(t => t.id == 3 || t.id == 4);
            }
        });
        this.hotelService.countryList.subscribe(res => {
            this.countries = res;
        });
        this.createContactForm();
        this.subs.sink = this.hotelService.loading.subscribe(res => {
            this.loading = res;
        });
        this.setHotelTraveller();
        this.setBookingHotelData();
        this.subs.sink = this.hotelService.bookingHotelData.subscribe(res => {
            console.log("res booking",res)
            if (!res) {
                this.router.navigate(['/dashboard']);
            }
            this.traveller = this.hotelService.traveller;
            // if(res && res.RoomDetails){
            //     res.RoomDetails = res.RoomDetails.sort((a, b) => a.Price.Amount - b.Price.Amount);
            // }
            this.hotel = res;
            this.passengers.clear();
            let leadPax = 1;
            if(this.traveller){
                for (let t of Object.keys(this.traveller)) {
                    if (this.traveller[t]) {
                        for (let i = 0; i < this.traveller[t]; i++) {
                            this.addPassenger(t, i, leadPax);
                            leadPax = 0;
                        }
                    }
                }
            }
            this.cdRef.detectChanges();
        });
        this.maxDateAdult = this.addYearsToDate(-12);
        this.minDateAdult = this.addYearsToDate(-100);

        this.maxDateChild = this.addYearsToDate(-2);
        this.minDateChild = this.addYearsToDate(-12);

        this.maxDateInfant = new Date();
        this.minDateInfant = this.addYearsToDate(-2);
    }

    createContactForm() {
        this.contactForm = this.fb.group({
            passengers: this.fb.array([]),
            contact: this.fb.group({
                countryCode: ['+91', [Validators.required]],
                phoneAreaCode: '080',
                phoneExtensionCode: '91',
                phoneNumber: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                message: ['', [Validators.required]]
            }),
            usaForm: [0],
            usaDetailsForm: this.fb.group({
                country_name: ['USA'],
                gender: ['Male'],
                types: ['resident'],
                address: [''],
                city: [''],
                state: [''],
                postal_code: ['']
            }),
        });
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

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
            searchId:`${ssd['searchId']}`
        }
        return reqBody;
    }

    setAdultChildCount(element){
        console.log("element",element)
		this.travellerAdult += Number(element['adults']);
		this.travellerChild += Number(element['childrens']);
        this.travellerChildAge += Number(element['childAges']);
	}

    searchResult(data: any) {
        this.utility.writeStorage("hotelSearchPostdata", data, sessionStorage);
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
        this.router.navigate(['/search/hotel/result']);
        // this.hotelService.searchResult(data);
        // this.cd.detectChanges();
    }


    createUsaDetailsForm() {
        this.usaDetailsForm = this.fb.group({
            // passengers: this.fb.array([]),
            // contact: this.fb.group({
            //     countryCode: ['+91', [Validators.required]],
            //     phoneAreaCode: '080',
            //     phoneExtensionCode: '91',
            //     phoneNumber: [123456789, [Validators.required]],
            //     email: ['', [Validators.required, Validators.email]],
            //     message: ['', [Validators.required]]
            // })
        });
    }

    get passengers() {
        return this.contactForm.get('passengers') as FormArray;
    }

    addPassenger(tt: string, i: number, lead = 0) {
        this.passengers.push(this.createPassenger(tt, i, lead));
    }

    createPassenger(tt: string, i: number, lead = 0): FormGroup {
        const title = tt == 'infants' ? 'Miss' : 'Mr';
        const paxType = tt == 'adults' ? 1 : (tt == 'infants' ? 3 : 2);
        return this.fb.group(
            {
                IsLeadPax: lead,
                Title: [title, [Validators.required]],
                FirstName: [this.currentUser.first_name, [Validators.required]],
                MiddleName: '',
                LastName: [this.currentUser.last_name, [Validators.required]],
                PaxType: paxType,
                Gender: 'Male',
                DateOfBirth: ['', [Validators.required]],
                PassportNumber: ['', [Validators.required]],
                PassportExpiry: ['', [Validators.required]],
                PassportIssuingCountry: ['', [Validators.required]],
                CountryCode: 'IN',
                CountryName: 'India',
                ContactNo: '8050584929',
                PhoneAreaCode: '080',
                PhoneExtensionCode: '91',
                City: 'Bangalore',
                PinCode: '560100',
                AddressLine1: '2nd Floor, Venkatadri IT Park, HP Avenue,, Konnappana Agrahara, Electronic city',
                AddressLine2: '2nd Floor, Venkatadri IT Park, HP Avenue,, Konnappana Agrahara, Electronic city',
                Email: 'anitha.g.provab@gmail.com',
                travellerType: tt,
                travellerTypeCount: i + 1,
                BaggageId: [],
                MealId: [],
                SeatId: []
            }
        );
    }

    onUpdatePassenges(country: any) {
        const result = this.countries.find(c => c.code == country);
        this.passengers.value.forEach((e, i) => {
            this.contactForm.controls['passengers']['controls'][i].patchValue({
                CountryCode: result.code,
                CountryName: result.name,
                FirstName: this.currentUser.first_name,
                LastName: this.currentUser.last_name
            });
        });
    }

    onSubmitBooking() {
        if (this.hotel['Attr']['is_usa']) {
            this.contactForm.patchValue({ usaForm: 0 });
        } else {
            this.contactForm.patchValue({ usaForm: 1 });
        }
        const passengers = this.passengers.value;
        const cEmail = this.contactForm.get('contact.email').value;
        const cPhoneAreaCode = this.contactForm.get('contact.phoneAreaCode').value;
        const cPhoneExtensionCode = this.contactForm.get('contact.phoneExtensionCode').value;
        const passengersTemp = passengers.map(p => {
            const DateOfBirth = formatDate(p.DateOfBirth, '');
            const PassportExpiry = formatDate(p.PassportExpiry, '');
            const Email = cEmail;
            const PhoneAreaCode = cPhoneAreaCode;
            const PhoneExtensionCode = cPhoneExtensionCode;
            let usaFormDetail = {};
            if (this.hotel['Attr']['is_usa']) {
                Object.assign(usaFormDetail, {
                    City: this.contactForm.get('usaDetailsForm.city').value,
                    State: this.contactForm.get('usaDetailsForm.state').value,
                    CountryName: this.contactForm.get('usaDetailsForm.country_name').value,
                    CountryCode: 'US',
                    AddressLine1: this.contactForm.get('usaDetailsForm.address').value,
                    AddressLine2: '.',
                    PinCode: this.contactForm.get('usaDetailsForm.postal_code').value,
                    Gender: this.contactForm.get('usaDetailsForm.gender').value,
                    LocationType: this.contactForm.get('usaDetailsForm.types').value
                });

            }
            return { ...p, DateOfBirth, PassportExpiry, Email, PhoneAreaCode, PhoneExtensionCode, ...usaFormDetail };
        });
        this.hotelService.loading.next(true);

        const created_by_id = this.utility.readStorage('currentUser', sessionStorage)['user_id'];
        this.subs.sink = this.apiHandlerService.apiHandler('commitBooking', 'POST', '', '', {
            created_by_id,
            AppReference: this.hotelService.appReference,
            // AppReference: this.hotelService.resultToken,
            SequenceNumber: 0,
            ResultToken: this.hotelService.resultToken,
            Passengers: passengersTemp
        }).subscribe(res => {
            if (res.Status) {
                // const BookingDetails = this.hotelService.changeCurrencyCommitBooking(res.data.CommitBooking.BookingDetails);
                // this.hotelService.CommitBookingResponse.next(BookingDetails);
                this.router.navigate(['/search/hotel/confirm-passenger']);
            } else {
                this.swalService.alert.oops(res.Message);
                setTimeout(() => {
                    this.router.navigate(['/search/hotel/result']);
                }, 100);
            }
            this.hotelService.loading.next(false);
        });

    }

    addYearsToDate(y: number) {
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        const c = new Date(year + y, month, day);
        return c;
    }

    setBookingHotelData() {
        const storedState = localStorage.getItem('bookingHotelData');
        if (storedState) {
            this.hotelService.bookingHotelData.next(JSON.parse(storedState));
        }
    }
   
    setHotelTraveller(){
       this.hotelService.setHotelTraveller();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
