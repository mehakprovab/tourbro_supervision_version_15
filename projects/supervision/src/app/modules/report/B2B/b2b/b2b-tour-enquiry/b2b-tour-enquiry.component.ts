import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-b2b-tour-enquiry',
  templateUrl: './b2b-tour-enquiry.component.html',
  styleUrls: ['./b2b-tour-enquiry.component.scss']
})
export class B2bTourEnquiryComponent implements OnInit {

  private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'SL No' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        // { key: 'name', value: 'Name' },
        // { key: 'phone', value: 'Contact Number' },
        // { key: 'email', value: 'Email' },
        // { key: 'departurePlace', value: 'Departure Place' },
        // { key: 'departureDate', value: 'Departure Date' },
        // { key: 'message', value: 'Message' }


        { key: 'hotel', value: 'Hotel' },
        { key: 'resort', value: 'Resort' },
        { key: 'duration', value: 'Duration' },
        { key: 'board', value: 'Board' },
        { key: 'date', value: 'Date' },
        { key: 'flyingFrom', value: 'Flying From' },
        { key: 'adults', value: 'Adults' },
        { key: 'children', value: 'Children' },
        { key: 'childAges', value: 'ChildAges' },
        { key: 'title', value: 'Title' },
        { key: 'firstName', value: 'First Name' },
        { key: 'lastName', value: 'Last Name' },
        { key: 'enquiryDescription', value: 'Enquiry Description' },
        { key: 'telephone', value: 'Telephone' },
        { key: 'preferredCallBackTime', value: 'Preferred CallBackTime' },
        { key: 'travel', value: 'Travel Agreed' },
    ];
    
    noData: boolean = true;
    respData: Array<any> = [];
    filterArray:Array<any>=[];
    searchSpin:boolean=true;
    enqiryDetails:any;
    resDataFilter:Array<any>=[];
    searchText:string;
    config: any = {
        type: 'pdf',
        elementIdOrContent: 'b2b-tour-enquiry',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showModal : boolean=false;
    showCancelModal : boolean;
    currentRecord : any = [];
    respDataCopy:any=[]
    respDataTemp:Array<any>=[];
    viewEnquiryDetails:boolean=false;
    currentUser: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private router:Router,
        private route:ActivatedRoute
    ) { }

    ngOnInit() {
        this.createSearchForm();
        this.getB2BTourEnquiry();
    }

    createSearchForm(){
        this.regConfig = this.fb.group({
            toDate: new FormControl('', [Validators.maxLength(120)]),
            fromDate: new FormControl('', [Validators.maxLength(120)]),
            phone: new FormControl('', [Validators.maxLength(10)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
    }
    onSearchSubmit() {
        this.respData=this.respDataTemp;
        this.filterData();
    }

    onReset() {
        this.regConfig.reset();
        this.onSearchSubmit();
    }

    isFormEmpty() {
        for (const controlName in this.regConfig.controls) {
          if (this.regConfig.controls.hasOwnProperty(controlName)) {
            const control = this.regConfig.controls[controlName];
            if (control.value !== null && control.value !== '') {
              return false; 
            }
          }
        }
        return true; 
    } 
    
    filterData(){
        for (const controlName in this.regConfig.controls) {
            if (this.regConfig.controls.hasOwnProperty(controlName)) {
              const control = this.regConfig.controls[controlName];
              if (control.value !== null && control.value !== '') {
                if(controlName=='phone'){
                    this.respData=this.respData.filter((item)=> {
                        return item['phone']==control.value;
                    });
                }else if(controlName=='email'){
                    this.respData=this.respData.filter((item)=> {
                        return item['email']==control.value;
                    });
                }else if(controlName=='status'){
                    if(control.value=='ALL'){
                        return this.respData;
                    }else{
                        this.respData=this.respData.filter((item)=> {
                            return item['status']==control.value;
                        });
                    }
                }else if(controlName=='fromDate'){
                    const date = new Date(control.value);
                    const formattedDate = date.toISOString().slice(0, 10);
                    this.respData=this.respData.filter((item)=> {
                        return item['departureDate']>=formattedDate;
                    });
                }else if(controlName=='toDate'){
                    const date = new Date(control.value);
                    const formattedDate = date.toISOString().slice(0, 10);
                    this.respData=this.respData.filter((item)=> {
                        return item['departureDate']<=formattedDate;
                    });
                }
              }
            }
          }
    }

    getB2BTourEnquiry() {
        this.currentUser = this.utility.readStorage('currentSupervisionUser', sessionStorage);
        const req = {
            UserId: this.currentUser.id,
            UserType: 'B2B'
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bTourEnquiryList', 'post', {}, {},req
            )
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.respData=resp.data;
                    this.respDataTemp = resp.data;
                    this.searchSpin=false;
                }
                else {
                    this.searchSpin = false;
                    this.swalService.alert.error(resp.msg || '');
                }
            },(err: HttpErrorResponse) => {
                this.searchSpin = false;
                this.swalService.alert.error(err['error']['Message']);
            });
    }

    sortData(sort: Sort) {
        const data = this.filterArray.length ? this.filterArray : [...this.respDataTemp];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name': return this.utility.compare('' + a.name.toLocaleLowerCase(), '' + b.name.toLocaleLowerCase(), isAsc);
                case 'phone': return this.utility.compare('' + a.contactNumber, '' + b.contactNumber, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                case 'departurePlace': return this.utility.compare('' + a.departurePlace.toLocaleLowerCase(), '' + b.departurePlace.toLocaleLowerCase(), isAsc);
                case 'departureDate': return this.utility.compare(+a.departureDate, +b.departureDate, isAsc);
                case 'message': return this.utility.compare('' + a.message.toLocaleLowerCase(), '' + b.message.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                default: return 0;
            }
        });
    }

    download(type: any, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.utility.downloadElementAsPdf(this.config.elementIdOrContent, `b2b-tour-enquiry`, orientation || (this.config.options && this.config.options.jsPDF && this.config.options.jsPDF.orientation));
    }
    
    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }


    downloadPdf() {
        const element = document.getElementById('b2b-tour-enquiry');
        html2canvas(element).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 297; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('B2B_Tour_Enquiry_Report.pdf');
            this.swalService.alert.success();
        });
    }

    showEnquiryDetails(data){
        // this.showModal = true;
        // this.currentRecord = data;
        this.viewEnquiryDetails=true;
        this.enqiryDetails=data;
        this.router.navigate(['/report/b2c-tour-enquiry/details'],{queryParams:data})
    }

    openEnquiry(data){
        if(data.status==1){
            this.swalService.alert.oops('This enquiry is already open')
        }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('b2cTourEnquiryStatusChange', 'post', {}, {},{
                "status":1,
                "id": data.id
            }
            )
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success('This enquiry has been opened')
                    this.getB2BTourEnquiry();
                }
            },(err: HttpErrorResponse) => {
                this.searchSpin = true;
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    }

    closeEnquiry(data){
        if(data.status==0){
            this.swalService.alert.oops('This enquiry is already closed')
        }else{
            this.subSunk.sink = this.apiHandlerService.apiHandler('b2cTourEnquiryStatusChange', 'post', {}, {},{
                "status":0,
                "id": data.id
            }
            )
            .subscribe(resp => {
                console.log(resp);
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success('This enquiry has been closed')
                    this.getB2BTourEnquiry();
                }
            },(err: HttpErrorResponse) => {
                this.searchSpin = true;
                this.swalService.alert.error(err['error']['Message']);
            });
        }
    }

    tourBrochure(data){
        const QuaryParam={
            tourId:data.tourId 
          }
        this.router.navigate(['/tour-crs/tour-list/brochure'],{queryParams:QuaryParam})
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
