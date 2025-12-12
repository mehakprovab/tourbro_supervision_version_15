import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { MarkupsService } from '../../../../markups.service';
import { Logger } from 'projects/b2b/src/app/core/logger/logger.service';
import { FlightService } from 'projects/b2b/src/app/modules/search/flight/flight.service';

const log = new Logger('report/TransactionLogsComponent');


@Component({
  selector: 'app-flight-markup-list',
  templateUrl: './flight-markup-list.component.html',
  styleUrls: ['./flight-markup-list.component.scss']
})
export class FlightMarkupListComponent implements OnInit {
    displayedColumns: string[] = ['Flights', 'Mark Up Value', 'Mark Up Type', 'Edit','Action'];
    dataSource ;
    protected subs = new SubSink();
    specificAirlineMarkupForm: FormGroup;
    noData: boolean = true;
    p: number = 1;
    airline_logo = '';
    
  constructor(
    private swalService: SwalService,
    private utility: UtilityService,
    private markupService: MarkupsService,
    private apiHandlerService: ApiHandlerService,
    private fb: FormBuilder,
    private flightService: FlightService,
  ) {
    this.specificAirlineMarkupForm = this.fb.group({
        // items: new FormArray([])
        value: ['', Validators.required],
        value_type:['', Validators.required]
    });
   }

  ngOnInit() {
   this.getMarkupData();
   this.airline_logo = this.flightService.airline_logo;
  }

  hasSpecificAirlineError = (controlName: string, errorName: string) => {
    return (( this.specificAirlineMarkupForm.controls[controlName].touched) && this.specificAirlineMarkupForm.controls[controlName].hasError(errorName));
}

UpdateMarkup(item,form){
    // your delete code
    
    let markupForm = [{
          id: item.id,
        //   airlines: item.airlines,
          value_type: form.value_type ? form.value_type : item.value_type,
          value: form.value ? form.value : item.value,
          markup_currency: "GBP"
      }]
      if (markupForm[0].value_type == "percentage") {
        if (markupForm[0].value > 100) {
            this.swalService.alert.oops("Percentage must not exceed 100");
            return;
        }
    }
      this.subs.sink = this.apiHandlerService.apiHandler('updateFlightMarkup', 'POST', '', '', markupForm).subscribe(res => {
          if (res.Status) {
              // this.airlines = res.data;
              this.specificAirlineMarkupForm.reset();
              this.getMarkupData();
              this.swalService.alert.success("Markup updated successfully.");
          } else {
              this.swalService.alert.oops(res.Message);
          }
      });
  }

  onAddSpecificAirlineMarkup(Udata) {
      
  }

  getMarkupData() {
    this.markupService.fetchMarkupReport().subscribe(resp => {
        log.debug(resp);
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.noData = false;
            this.dataSource = resp.data;
           this.dataSource=this.dataSource.filter((data)=>{
               return data.type==="specific"
            })
           
            this.specificAirlineMarkupForm.patchValue({
                value:this.dataSource.value ? this.dataSource.value : '',
                value_type: this.dataSource.value_type ? this.dataSource.value_type : '',
            })
        }
        else {
            this.noData = true;
            this.swalService.alert.error(resp.msg || '');
        }
    });
}

}
