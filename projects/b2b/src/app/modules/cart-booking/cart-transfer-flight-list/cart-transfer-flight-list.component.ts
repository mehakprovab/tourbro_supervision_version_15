import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart-transfer-flight-list',
  templateUrl: './cart-transfer-flight-list.component.html',
  styleUrls: ['./cart-transfer-flight-list.component.scss']
})
export class CartTransferFlightListComponent implements OnInit {

  @Input() getAirports = [];
  @Input() inputFor;
  @Output() whichCity = new EventEmitter();
  regConfig: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
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
    this.cdRef.detectChanges();
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
    this.cdRef.detectChanges();
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

