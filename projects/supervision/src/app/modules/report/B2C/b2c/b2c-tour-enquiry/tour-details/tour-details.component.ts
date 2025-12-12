import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// Testing for pdf generation

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.scss']
})
export class TourDetailsComponent implements OnInit {

    @ViewChild('print_brochure', { static: false }) print_voucher: ElementRef;
    enqiryDetails:any;
    tourId:number;
    tourData:any;
    tourDuration:string='';
    visitedCity:string='';
    programDetials:any[]=[];
    bannerImage:string;
    tourName:string;
    tourDescription:any
    priceTableHead=['From Date','To Date','Adult Price','Child Price']
    priceDetails:any
    subSunk= new SubSink();
    rawHtml: string;
    holidayInclusionHtml: SafeHtml;
    holidayExclusionHtml:SafeHtml
    termsConditionsHtml:SafeHtml
    cancellationPolicyHtml:SafeHtml
    tourDetails:any;
    durationPlace=['Duration','Start City','End City','Places Covered']
    showEmailBrouchure:boolean=false
    brochureForm:FormGroup;
    brochurePdf:any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
          jsPDF: {
            orientation: 'potrait'
          },
          pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    
      };
  
    constructor( private sanitizer: DomSanitizer,
                private swalService:SwalService,
                private apiHandlerService:ApiHandlerService,
                private route:ActivatedRoute,
                private fb:FormBuilder
    ) { }
  
    ngOnInit() {
        this.route.queryParams.subscribe((data)=>{
          if(data){
              this.enqiryDetails=data;
          }
        })
        this.createBrouchureForm();
        this.getTourData();
      }
      
      createBrouchureForm(){
        this.brochureForm=this.fb.group({
            email:new FormControl('',[Validators.required]),
            brochure:''
        })
        this.brochureForm.get('email').patchValue(this.enqiryDetails['email']);
      }

      getTourData(){
        this.subSunk.sink = this.apiHandlerService.apiHandler('getBroucher', 'post', {}, {},{
          "toursId":75 //this.tourId - hard coding as of now 
    
        })
        .subscribe(response => {
            if (response.statusCode == 200 || response.statusCode == 201) {
                this.tourData = response.data || [];
                this.tourDetails=this.tourData.toursData;
                this.responseDataMap(this.tourData);
            }
        },(err: HttpErrorResponse) => {
            this.swalService.alert.error(err['error']['Message']);
          });
      }
    
      responseDataMap(resData:any){
        this.tourDuration=resData.toursData['duration'];
        this.tourName=resData.toursData['package_name'];
        this.bannerImage=resData.toursData['banner_image'];
        let tempVisitedCity:any[]=[]; 
        resData.TourItinerary.forEach((item)=>{
          tempVisitedCity.push(item['CityName'])
          this.programDetials.push({
            'CityName':item['CityName'],
            'visited_city_day': item['visited_city_day'],
            'program_title': item['program_title'],
            'program_des': item['program_des'] //.replace(/<[^>]+>/g, ''),
          })
        })
        this.sortProgramDetailsInformation(this.programDetials)
        const uniqueCity = [...new Set(tempVisitedCity)];
        this.visitedCity = uniqueCity.join(', '); 
    
        this.priceDetails=resData.toursPriceManagementData;
        this.appendHtml(resData);
    
      }
    
      sortProgramDetailsInformation(programData:any){
        programData.sort((a, b) => {
          if (a.visited_city_day < b.visited_city_day) {
            return -1;
          }
          if (a.visited_city_day > b.visited_city_day) {
            return 1;
          }
          return 0;
        });
        
      }
    
      appendHtml(inputData){
        this.holidayInclusionHtml = this.sanitizer.bypassSecurityTrustHtml(inputData.toursData['inclusions']);
        this.holidayExclusionHtml = this.sanitizer.bypassSecurityTrustHtml(inputData.toursData['exclusions']);
        this.termsConditionsHtml = this.sanitizer.bypassSecurityTrustHtml(inputData.toursData['terms']);
        this.cancellationPolicyHtml = this.sanitizer.bypassSecurityTrustHtml(inputData.toursData['canc_policy']);
      }
    
      getImage() {
        return `${baseUrl + '/tour/tours/getBannerImage/' + this.bannerImage}`;
      }  
  
      downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.tourDetails['package_name']
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });
        const content = this.print_voucher.nativeElement;
        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },
            callback: async (doc) => {
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();
            }
        });
      }
    
      pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
          pdf.setPage(i);
          pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
        }
      }
      
      closeEnquiry(){

      }

      onFileSelected(files: FileList) {
        const file = files.item(0);
        // this.brochureForm.get('brochure').patchValue(file);
        this.brochurePdf=file;
      }
      

      emailBrouchure(){
        this.showEmailBrouchure = true;
      }
      
      hide()
      {
        this.showEmailBrouchure = false;
      }

      onSendBrouchure(){
        console.log(this.brochureForm.value);
        console.log(this.brochurePdf);
      }

      cancel(){
        this.showEmailBrouchure=false;
      }

    ngOnDestroy(): void {
        
      }

}
