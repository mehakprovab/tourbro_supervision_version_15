import { Component, OnInit, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Logger } from '../../../../../core/logger/logger.service';
import { EventEmitter } from '@angular/core';

const log = new Logger('FlightAirLineList');

@Component({
  selector: 'app-preferred-airline',
  templateUrl: './preferred-airline.component.html',
  styleUrls: ['./preferred-airline.component.scss']
})
export class PreferredAirlineComponent implements OnInit,OnChanges {

    @Input() getAirports = [];
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
        this.getAirports = changes.getAirports.currentValue;
        const customAirports = [];
        this.getAirports.map((val, i, arr) => {
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
        this.getAirports = customAirports;
    }

    get hasViewList(): boolean {
        try {
            if (this.getAirports.length)
                return true;
            else
                return false;
        } catch (error) {
        }
    }

    onAirportSelect(cityObj: object, inputFor: string): void {
        cityObj['inputFor'] = inputFor;
        this.whichCity.emit(cityObj);
        this.getAirports.length = 0;
    }

    onCheckBoxChange(e) {
        const checkArray: FormArray = this.regConfig.get('checkArray') as FormArray;
        if (e.target.checked) {
            checkArray.push(new FormControl(e.target.value));
        } else {
            let i = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value === e.target.value) {
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

}
