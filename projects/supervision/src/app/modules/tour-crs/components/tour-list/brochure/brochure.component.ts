import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../environments/environment.prod';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { HttpErrorResponse } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'app-brochure',
  templateUrl: './brochure.component.html',
  styleUrls: ['./brochure.component.scss']
})
export class BrochureComponent implements OnInit {

  brochureData:any;
  tourDuration:string='7Days|6Nights';
  visitedCity:string='';
  programDetials:any[]=[];
  bannerImage:string;
  tourName:string;
  tourDescription:any
  priceTableHead=['From Date','To Date','Adult Price','Child Price']
  priceDetails:any
  tourId:Number;
  subSunk= new SubSink();
  rawHtml: string;
  CurrentYear: Number = new Date().getFullYear();
  holidayInclusionHtml: SafeHtml;
  holidayExclusionHtml:SafeHtml
  termsConditionsHtml:SafeHtml
  cancellationPolicyHtml:any;

  constructor(private apiHandlerService:ApiHandlerService,private route:ActivatedRoute, private sanitizer: DomSanitizer,
              private swalService:SwalService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data)=>{
      if(data){
          this.tourId=data['tourId']
      }
    })
    this.getBrochureData();
  }

  getBrochureData(){
    this.subSunk.sink = this.apiHandlerService.apiHandler('getBroucher', 'post', {}, {},{
      "toursId":this.tourId

    })
    .subscribe(response => {
        if (response.statusCode == 200 || response.statusCode == 201) {
            this.brochureData = response.data || [];
            this.responseDataMap(this.brochureData);
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
        'visited_city_day': item['visited_city_day'],
        'program_title': item['program_title'],
        'program_des': item['program_des'].replace(/<[^>]+>/g, ''),
      })
    })
    this.sortProgramDetailsInformation(this.programDetials)
    const uniqueCity = [...new Set(tempVisitedCity)];
    this.visitedCity = uniqueCity.join(', '); 

    this.priceDetails=resData.toursPriceManagementData;
    this.appendHtml(resData);
    this.cancellationPolicyHtml = JSON.parse(this.priceDetails[0]['canc_policy']);

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
    this.holidayInclusionHtml = inputData.toursData['inclusions'].replace(/\\n/g, '');;
    this.holidayExclusionHtml = inputData.toursData['exclusions'].replace(/\\n/g, '');;
    this.termsConditionsHtml = inputData.toursData['terms'].replace(/\\n/g, '');;
  }

  getImage() {
    return `${baseUrl + '/tour/tours/getBannerImage/' + this.bannerImage}`;
  } 

  ngOnDestroy(): void {
      
    }

    getChildPrice(data) {
      if(data) {
        return JSON.parse(data);
      }
    }
    getCancPolicies(data) {
      if(data) {
        return JSON.parse(data);
      }
    }

      downloadA4(type: any, orientation?: string): void {
        window.scrollTo(0, 0);
        const data = document.getElementById('print_voucher');
        const date = new Date().toDateString();

        setTimeout(() => {
            html2canvas(data!, {
                allowTaint: true,
                useCORS: true,
                scale: 2 // Better resolution
            }).then(canvas => {
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 280; // A4 height in mm

                const pdf = new jsPDF('p', 'mm', 'a4');

                const imgProps = {
                    width: canvas.width,
                    height: canvas.height
                };

                const pageHeightPx = (pageHeight * canvas.width) / imgWidth; // Convert mm to px
                const totalPages = Math.ceil(canvas.height / pageHeightPx);

                for (let page = 0; page < totalPages; page++) {
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = Math.min(pageHeightPx, canvas.height - page * pageHeightPx);

                    const pageCtx = pageCanvas.getContext('2d')!;
                    pageCtx.fillStyle = '#ffffff';
                    pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

                    pageCtx.drawImage(
                        canvas,
                        0,
                        page * pageHeightPx,
                        canvas.width,
                        pageHeightPx,
                        0,
                        0,
                        canvas.width,
                        pageHeightPx
                    );

                    const imgData = pageCanvas.toDataURL('image/png');

                    if (page > 0) {
                        pdf.addPage();
                    }

                    pdf.addImage(
                        imgData,
                        'PNG',
                        0,
                        0,
                        imgWidth,
                        (pageCanvas.height * imgWidth) / canvas.width
                    );
                }
                this.swalService.alert.success();
                pdf.save(`Tour Brochure.pdf`);
            });
        }, 1000);
  }

}
