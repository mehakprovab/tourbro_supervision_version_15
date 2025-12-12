import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { FlightService } from '../../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-airlines-filter',
    templateUrl: './airlines-filter.component.html',
    styleUrls: ['./airlines-filter.component.scss']
})
export class AirlinesFilterComponent implements OnInit, AfterViewInit {

    flights: any = [];
    flightsCopy: any = [];
    airlines: any = [];
    airlinesForm: FormGroup;
    currency:string = '';
    protected subs = new SubSink();
    
    constructor(
        private fb: FormBuilder,
        private flightService: FlightService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.createAirlinesForm();
        this.subs.sink = this.flightService.currentCurrency.subscribe(res => {
            this.currency = res;
        });
        this.subs.sink = this.flightService.flights.subscribe(res => {
            this.flights = res;
           
        });
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            
            const airlinesTemp = [];
            this.airlines = [];
            this.items.clear();
            if (res.length) {
                this.currency=res[0]['Price']['Currency'];
                const airlinesPrice: any = [];
                const airlinesPriceTemp: any = [];
                res.forEach(flight => {
                    const d = flight.FlightDetails.Details[0][0];
                    if (!airlinesPriceTemp.includes(d.OperatorName)) {
                        airlinesPriceTemp.push(d.OperatorName);
                    }
                    airlinesPrice.push({ name: d.OperatorName, price: flight.Price.TotalDisplayFare });
                });
                const airlinesPriceTemp2: any = [];
                airlinesPriceTemp.forEach(e => {
                    const result = airlinesPrice.filter(t => t.name === e);
                    airlinesPriceTemp2[e] = result.reduce((prev, curr) => {
                        return Number(prev.price) < curr.price ? prev : curr;
                    });
                });

                this.flightsCopy = res;

                this.flightsCopy.filter(flight => {
                    const d = flight.FlightDetails.Details[0][0];
                    if (!airlinesTemp.includes(d.OperatorName)) {
                        this.items.push(new FormControl(0));
                        airlinesTemp.push(d.OperatorName);
                        this.airlines.push({
                            name: d.OperatorName,
                            isChecked: false,
                            code: d.OperatorCode,
                            price: airlinesPriceTemp2[d.OperatorName].price,
                            currency:res[0]['Price']['Currency']
                        });
                    }
                });
                this.airlines.sort((a, b) => {
                    return a.price - b.price;
                });
                this.flightService.airlinesCarousel.next(this.airlines);

            } else {
                this.flightService.airlinesCarousel.next([]);
            }

        });

        this.subs.sink = this.flightService.airlineCarouselClick.subscribe(i => {
            if (this.airlinesForm.controls['items']['controls'][i] && i >= 0 || i === undefined) {
                let itemsValue = Array(this.items.value.length).fill(0);
                itemsValue[i] = 1;
                if (i === undefined) {
                    itemsValue = Array(this.items.value.length).fill(1);
                }
                this.airlinesForm.patchValue({ items: itemsValue });
            }
        });

        this.subs.sink = this.flightService.airlinesReset.subscribe(res => {
            if (res) {
                this.clearAirlinesFilter();
            }
        });


        this.subs.sink = this.flightService.changeDetectionEmitter.subscribe(
            () => {
                this.cd.detectChanges();
            },
            (err) => {
                // handle errors...
            }
        );
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    get items(): FormArray {
        return this.airlinesForm.get('items') as FormArray;
    }

    createAirlinesForm() {
        this.airlinesForm = this.fb.group({
            items: this.fb.array([])
        });
    }

    filterByAirlines(val) {
        const airlinesTemp = [];
        this.items.value.forEach((element, i) => {
            airlinesTemp.push({ name: this.airlines[i].name, isChecked: element });
        });
        this.flightService.airlines.next(airlinesTemp);
        this.flightService.filterByAirlines();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearAirlinesFilter() {
        this.airlinesForm.patchValue({ items: Array(this.items.value.length).fill(0) });
        const airlinesTemp = [];
        this.items.value.forEach((element, i) => {
            airlinesTemp.push({ name: this.airlines[i].name, isChecked: false });
        });
        this.flightService.airlines.next(airlinesTemp);
        this.flightService.filterByAirlines();
    }

}
