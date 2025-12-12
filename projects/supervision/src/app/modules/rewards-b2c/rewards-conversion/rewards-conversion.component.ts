import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsService } from 'ngx-export-as';

const log = new Logger('report/B2cCarComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-rewards-conversion',
  templateUrl: './rewards-conversion.component.html',
  styleUrls: ['./rewards-conversion.component.scss']
})
export class RewardsConversionComponent implements OnInit {

private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };

    showModal : boolean;
    showCancelModal : boolean;
    currentRecord : any;
    submitted : boolean = false;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            reward_points: new FormControl('', [Validators.required,Validators.maxLength(5),Validators.pattern("^[0-9]*$")]),
            price: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
            min_limit: new FormControl('', [Validators.required,Validators.maxLength(15),Validators.pattern("^[0-9]*$")]),
            max_limit: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.pattern("^[0-9]*$")])
        });
    }
    onSubmit() {
        this.submitted = true;
        if (this.regConfig.invalid) {
            return;
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('coreRewardConversion', 'post', {}, {},this.regConfig.value)
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                	this.swalService.alert.success(resp.msg || 'Record added successfully');
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
            });
    }

    onReset() {
    	this.submitted = false;
        this.regConfig.reset();
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
