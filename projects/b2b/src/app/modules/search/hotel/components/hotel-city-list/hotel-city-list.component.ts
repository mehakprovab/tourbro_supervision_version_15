import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '../../../../../core/logger/logger.service';

const log = new Logger('HotelCityList');

@Component({
    selector: 'app-hotel-city-list',
    templateUrl: './hotel-city-list.component.html',
    styleUrls: ['./hotel-city-list.component.scss'],
})

export class HotelCityListComponent implements OnInit, OnChanges {
    @Input() getCities = [];
    @Input() inputFor;
    @Output() whichCity = new EventEmitter();
    regConfig: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
        this.regConfig = this.formBuilder.group({
            checkArray: this.formBuilder.array([], [Validators.required]),
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("changes",changes)
        this.getCities = changes.getCities.currentValue;
        console.log("  this.getCities F",  this.getCities )
        const customAirports = [];
        this.getCities.map((val, i, arr) => {
            let pushedInSubAirport = false;
            for (let v of customAirports) {
                if (v.AirportCity === (val.SubPriority ?
                    val.AirportCity : '')
                ) {
                    if (!v['SubAirport'])
                        Object.assign(v, { SubAirport: [] })
                    v['SubAirport'].push(val);
                    pushedInSubAirport = true;
                    break;
                }
            }
            if (!pushedInSubAirport)
                customAirports.push(val)
        });
        this.getCities = customAirports;
        console.log(" this.getCities", this.getCities)
    }

    get hasViewList(): boolean {
        try {
            if (this.getCities.length)
                return true;
            else
                return false;
        } catch (error) {
        }
    }

    onCitySelect(cityObj: object, inputFor: string): void {
        cityObj['inputFor'] = inputFor;
        this.whichCity.emit(cityObj);
        this.getCities.length = 0;
    }
}
