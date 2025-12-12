import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsService } from 'ngx-export-as';

const log = new Logger('report/HotelVoucherComponent');

@Component({
  selector: 'app-b2c-car-voucher',
  templateUrl: './b2c-car-voucher.component.html',
  styleUrls: ['./b2c-car-voucher.component.scss']
})
export class B2cCarVoucherComponent implements OnInit,OnDestroy {

  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
	private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData : any;
    app_reference : "";

  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute
    ) { }

  ngOnInit() {
  	this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference =(queryParams['appReference']);  
    });
  	this.getB2cHotelVoucher();
  }

  getB2cHotelVoucher(){
  	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cCarVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.voucherData = resp.data[0] || [];
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
  }

  calculateDiff(fromDate,toDate){
        return this.utility.calculateDiff(fromDate,toDate);
    }

    getTime(t){
    	return t.split(" ")[1];
    }

    cancelBooking(){

    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => {
            return x.LeadPax == true
        });
           return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

  ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
