import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-b2b-email-voucher',
  templateUrl: './b2b-email-voucher.component.html',
  styleUrls: ['./b2b-email-voucher.component.scss']
})
export class B2bEmailVoucherComponent implements OnInit {
  @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
  private subSunk = new SubSink();
  isOpen = false as boolean;
  invoiceData: any;
  app_reference: "";
  public loading = true;  
  loggedInUser: any;
  email:any;
  invoiceNo:any;
  config: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'print_voucher',
    options: {
        jsPDF: {
            orientation: 'portrait'
        },
        pdfCallbackFn: this.pdfCallbackFn // to add header and footer
    }

};
  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private exportAsService: ExportAsService,
    private utility: UtilityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference = (queryParams['appReference']);
    });
    this.getB2bflightVoucher();
  }

  downloadA4(type: SupportedExtensions, orientation?: string): void {
    window['html2canvas'] = html2canvas;
    const date = new Date().toDateString();
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
    });
    const content = this.print_voucher.nativeElement;
    let fileName = this.invoiceData['AppReference']
    doc.html(content, {
        html2canvas: {
            allowTaint: true,
            useCORS: true,
            scale: 600 / content.scrollWidth
        },
        callback: async (doc) => {
            doc.save(`${fileName}.pdf`);
            this.swalService.alert.success();
            document.getElementById('download').style.display = "block";
            document.getElementById('ticket').style.display = "block";
        }
    });

}

pdfCallbackFn(pdf: any) {
  // example to add page number as footer to every page of pdf
  const noOfPages = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= noOfPages; i++) {
      pdf.setPage(i);
      pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
  }
}

  getB2bflightVoucher() {
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightVoucher', 'post', {}, {},
      {
        "app_reference": this.app_reference,
      })
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
            if(resp.data[0]){
                this.setFareBreakup(resp.data[0]);
            }
          this.invoiceData = resp.data[0] || [];
          if(this.invoiceData && this.invoiceData.Email){
           this.email=this.invoiceData.Email;
          }
          if(this.invoiceData && this.invoiceData.AppReference){
            this.invoiceNo="INV-"+(this.invoiceData.AppReference.split("-")[1]);
           }
        }
        else {
          this.swalService.alert.error(resp.msg || '');
        }
        
        setTimeout(() => {
            this.loading = false; 
        }, 3000);
      });
  }

  calculateDiff(fromDate, toDate) {
    return this.utility.calculateDiff(fromDate, toDate);
  }

  getTime(t) {
    return t.split(" ")[1];
  }

  cancelBooking() {

  }

  findLeaduserDetails(data) {
    if (data) {
      let leadUser = data.filter(x => {
        return x.LeadPax == true
      });
      return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
    }
  }

  displayMaskContact(str) {
    return str.replace(/\d(?=\d{4})/g, "*");
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }

    sendInvoice(email) 
    {
        if (!this.isValidEmailId(email)) {
            this.swalService.alert.oops('Enter valid email address.');
            return;
        }
        else if (!this.app_reference) {
            this.swalService.alert.oops('App reference cannot be empty.');
            return;
        }
        else {
            this.apiHandlerService.apiHandler('sendInvoice', 'POST', '', '', {
                app_reference: this.app_reference,
                email: email
            }).subscribe(res => {
                if (res && ([200, 201].includes(res.statusCode))) {
                     this.swalService.alert.success(res.data);
                     this.email=this.invoiceData.Email;
                }
                else {
                    this.swalService.alert.oops('Some thing went wrong');
                }
            }, (err) => {
                if (err && err.err && err.error.msg){
                    this.swalService.alert.oops(err.error.msg);
                }
            });
        }
    }

    isValidEmailId(emailId) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) {
            return (true)
        }
        return (false)
    }

    setFareBreakup(response){
        let totalPassengerCount=response.Passengers.length;
        let ait=response.TotalFarePriceBreakUp.PriceBreakup.AdvanceTax;
        let adultRecord = response.Passengers.filter((ele) => ele.passenger_type.toLowerCase() === "adult");
        if (adultRecord && adultRecord.length>0) {
            this.setAdultFare(adultRecord, response,totalPassengerCount,ait);
        }

        let childRecord = response.Passengers.filter((ele) => ele.passenger_type.toLowerCase() === "child");
        if (childRecord && childRecord.length>0) {
            this.setChildFare(childRecord, response,totalPassengerCount,ait);
        }

        let infantRecord = response.Passengers.filter((ele) => ele.passenger_type.toLowerCase() === "infant");
        if (infantRecord && infantRecord.length>0) {
            this.setInfantFare(infantRecord, response,totalPassengerCount,ait);
        }
    }

    setAdultFare(adultRecord,response,totalPassengerCount,ait){
        let adultPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.ADT;
        adultRecord.forEach(adult => {
            adult.gross_Tax=adultPriceBreakUp.TotalPrice;
            adult.fareBDT=adultPriceBreakUp.BasePrice;
            adult.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
            adult.taxBDT=adultPriceBreakUp.Tax;
            adult.netFare=(adultPriceBreakUp.TotalPrice)-adult.discount+(ait/totalPassengerCount);
        });
    }

    setChildFare(childRecord,response,totalPassengerCount,ait){
        let childPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.CHD;
        childRecord.forEach(child => {
            child.gross_Tax=childPriceBreakUp.TotalPrice;
            child.fareBDT=childPriceBreakUp.BasePrice;
            child.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
            child.taxBDT=childPriceBreakUp.Tax;
            child.netFare=(childPriceBreakUp.TotalPrice)-child.discount+(ait/totalPassengerCount);
        });
    }

    setInfantFare(infantRecord,response,totalPassengerCount,ait){
        let infantPriceBreakUp=response.TotalFarePriceBreakUp.PassengerBreakup.INF;
        infantRecord.forEach(infant => {
            infant.gross_Tax=infantPriceBreakUp.TotalPrice;
            infant.fareBDT=infantPriceBreakUp.BasePrice;
            infant.discount=response.TotalFarePriceBreakUp.PriceBreakup.CommissionDetails.AgentCommission/totalPassengerCount;
            infant.taxBDT=infantPriceBreakUp.Tax;
            infant.netFare=(infantPriceBreakUp.TotalPrice)-infant.discount+(ait/totalPassengerCount);
        });
    }
    
}
