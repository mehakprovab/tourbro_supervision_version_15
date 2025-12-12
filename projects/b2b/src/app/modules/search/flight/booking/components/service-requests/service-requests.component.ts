import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FlightService } from '../../../flight.service';

@Component({
    selector: 'app-service-requests',
    templateUrl: './service-requests.component.html',
    styleUrls: ['./service-requests.component.scss']
})
export class ServiceRequestsComponent implements OnInit {

    navLinks = [
    ];

    @Input() contactForm: FormGroup;
    @Input() passengers: any;
    @Input() flight: any;
    depCtCode = '';
    desCtCode = '';
    baggages: any = [];
    meals: any = [];
    seats: any = [];
    baggageForm: FormGroup;
    mealForm: FormGroup;
    seatForm: FormGroup;
    baggagesPrice: any = [];
    mealsPrice: any = [];
    seatsPrice: any = [];
    baggageFee: any = 0;
    mealFee: any = 0;
    seatFee: any = 0;


    constructor(
        private flightService: FlightService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {

        const result = this.flight.FlightDetails.Details;
        this.depCtCode = result[0][0].Origin.AirportCode;
        this.desCtCode = result[0][result[0].length - 1].Destination.AirportCode;

        this.flightService.extraServices.subscribe(res => {
            if(res) {
                if (res.Baggage.length) {
                    this.baggages = res.Baggage;
                    this.navLinks.push({
                            label: 'Add Baggage',
                            icon: 'fa fa-suitcase',
                            component: 'addBaggage'
                        });
                }
                if (res.MealPreference.length) {
                    this.navLinks.push({
                        label: 'Add Meal',
                        icon: 'fa fa-cutlery',
                        component: 'addMeal',
                    });
                    this.meals = res.MealPreference;
                }
                if (res.Seat.length) {
                    this.navLinks.push({
                        label: 'Seat Selection',
                        icon: 'fa fa-wheelchair',
                        component: 'seatSelection',
                    });
                    this.seats = res.Seat;
                }
            }
        });

        this.baggageForm = this.fb.group({
            baggages: this.fb.array([])
        });
        this.mealForm = this.fb.group({
            meals: this.fb.array([])
        });
        this.seatForm = this.fb.group({
            seats: this.fb.array([])
        });

        this.passengers.controls.forEach(e => {
            this.baggagesArr.push(this.bagArr());
            this.mealsArr.push(this.mlArr());
            this.seatsArr.push(this.mlArr());
        });
        this.baggagesPrice = this.baggages.flat();
        this.mealsPrice = this.meals.flat();
        this.seatsPrice = this.seats.flat();
    }

    get baggagesArr() {
        return this.baggageForm.get('baggages') as FormArray;
    }
    bagArr() {
        const bags = this.baggages.map(e => this.fb.control(''));
        return this.fb.group({ bag: this.fb.array(bags) });
    }

    get mealsArr() {
        return this.mealForm.get('meals') as FormArray;
    }
    mlArr() {
        const meals = this.meals.map(e => this.fb.control(''));
        return this.fb.group({ ml: this.fb.array(meals) });
    }

    get seatsArr() {
        return this.seatForm.get('seats') as FormArray;
    }
    stArr() {
        const seats = this.seats.map(e => this.fb.control(''));
        return this.fb.group({ st: this.fb.array(seats) });
    }

    onOptionsSelected(type: string, i: number, j: number) {
        let result = {};
        if (type == 'baggage') {
            result = { BaggageId: this.baggagesArr.at(i).value.bag.filter(x => x) };
            const tempBagPrice: any = [];
            this.baggagesArr.value.forEach(e => {
                tempBagPrice.push(e.bag);
            });
            const tempBagPrice2 = tempBagPrice.flat().filter(x => x);
            this.baggageFee = tempBagPrice2.reduce((a, b) => a + Number(this.baggagesPrice.find(x => x.BaggageId == b)['Price']), 0);
        } else if (type == 'meal') {
            result = { MealId: this.mealsArr.at(i).value.ml.filter(x => x) };
            const tempMealPrice: any = [];
            this.mealsArr.value.forEach(e => {
                tempMealPrice.push(e.ml);
            });
            const tempMealPrice2 = tempMealPrice.flat().filter(x => x);
            this.mealFee = tempMealPrice2.reduce((a, b) => a + Number(this.mealsPrice.find(x => x.MealId == b)['Price']), 0);
        } else {
            result = { SeatId: this.seatsArr.at(i).value.st.filter(x => x) };
        }
        this.passengers.at(i).patchValue(result);

        this.flightService.extraFees.next({
            baggageFee: this.baggageFee,
            mealFee: this.mealFee,
            seatFee: 0
        });
    }
}
