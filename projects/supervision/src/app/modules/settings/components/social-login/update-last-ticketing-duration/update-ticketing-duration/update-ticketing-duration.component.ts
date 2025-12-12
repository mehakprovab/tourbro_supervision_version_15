import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';

const log = new Logger('UpdateTicketingDurationComponent');

@Component({
  selector: 'app-update-ticketing-duration',
  templateUrl: './update-ticketing-duration.component.html',
  styleUrls: ['./update-ticketing-duration.component.scss']
})
export class UpdateTicketingDurationComponent implements OnInit {

  AirlineList:Array<any>=[];
  lastKeyupTstamp: number = 0;
  selectedAirLineId:number;
  errorMessage:string;
  subSunk = new SubSink();
  TicketingDurationForm:FormGroup;
  filteredAirline: Observable<string[]>;
  @Output() toUpdate = new EventEmitter<any>();
  constructor( 
    private fb:FormBuilder, 
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private util:UtilityService) {
   }

  ngOnInit() {
    this.TicketingDurationForm=this.fb.group({
        AirlineName:['',Validators.required],
        Duration:['',Validators.required]
      });
     this.getAirlines();
  }

  triggerTab($event){
  }

  getAirlines() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('preferredAirlines', 'post', {}, {}, {
        "name": ""
    }).subscribe(resp => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
            this.AirlineList = resp.data;
            this.setFilteredAirlineList();
        }
    });
}

selectedAirline(airline){
  this.selectedAirLineId=airline.option.id
}

  UpdateTicketingDuration(){
    if(this.TicketingDurationForm.valid){
      let updateDurationDataObject={
        "Id":this.selectedAirLineId.toString(),
        "Minutes": this.TicketingDurationForm.get('Duration').value.toString()
      }
      this.subSunk.sink = this.apiHandlerService.apiHandler('updateLastTicketingTime', 'post', {}, {}, 
        updateDurationDataObject).subscribe(resp => {
        if (resp.statusCode == 201 || resp.statusCode == 200) {
          this.swalService.alert.success("Last ticketing time has been updated.");
          this.TicketingDurationForm.reset();
          this.toUpdate.next({ tabId: 'ticketing_list' })
        } else {
            log.error('Something went wrong')
            this.errorMessage = resp.Message;
            this.swalService.alert.oops(this.errorMessage);
        }
    }, err => { 
        log.error(err);
        this.swalService.alert.oops(err.message);
     });
    }
  }
  
  ResetValues(){
    this.TicketingDurationForm.reset();
  }

  setFilteredAirlineList() {
    this.filteredAirline = this.TicketingDurationForm.controls.AirlineName.valueChanges.pipe(
        startWith(''),
        map(value => this._filterAirline(value || '')),
    );
}

    _filterAirline(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.AirlineList.filter(option => (option.name + ' (' + option.code + ')').toLowerCase().includes(filterValue));
    }

    numberOnly(event): boolean {
        return this.util.numberOnly(event);
    }
    
    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}
