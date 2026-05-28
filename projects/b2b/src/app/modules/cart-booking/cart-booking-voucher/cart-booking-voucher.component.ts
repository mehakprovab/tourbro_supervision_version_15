import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/b2b/src/app/core/api-handlers';
import { SwalService } from 'projects/b2b/src/app/core/services/swal.service';
import { UtilityService } from 'projects/b2b/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { finalize } from 'rxjs/operators';
import { HotelService } from '../../../modules/search/hotel/hotel.service';
import { CartService } from '../cart.service';

@Component({
    selector: 'app-cart-booking-voucher',
    templateUrl: './cart-booking-voucher.component.html',
    styleUrls: ['./cart-booking-voucher.component.scss']
})
export class CartBookingVoucherComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    @ViewChild('print_hotel_voucher', { static: false }) print_hotel_voucher: ElementRef;
    srcUrl: string = "";
    public browserRefresh: boolean;
    currentUser: any;
    todayDate = new Date();
    confirmedData: any;
    contact: any;
    airline_logo: string = '';
    private subSunk = new SubSink();
    isChild = false;
    dataTime: any;
    showConfirmTicket: boolean = true;
    showConfirmButtons: boolean = true;
    flightAppReference: string;
    ReservationResultIndex: string;
    ticketServerData: any;
    journeyListData: any;
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

    submitted: boolean;
    showPaymentDetails: boolean;
    paymentData: any;
    confirmation: any;
    orderId: any;
    isSeatInfoNotEmpty: any = false;


    voucher: any;
    booking_source: any;
    isLoading: boolean = true;
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    showPayment: boolean = true;
    adult = 0;
    child = 0;
    hotelAppReference: any;
    cartItems: any;
    voucherData: any;
    bookingDetails: any;
    activityVoucher: any;
    loggedInUser: any;
    secondaryColour: any;
    loadingTemplate: any;
    primaryColour: any;
    loading: boolean = false;

    constructor(
        private flightService: FlightService,
        private swalService: SwalService,
        private util: UtilityService,
        private exportAsService: ExportAsService,
        private apiHandlerService: ApiHandlerService,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
        private hotelService: HotelService,
        private router: Router,
        private cartService: CartService
    ) { }


    ngOnInit(): void {
        const cartData = JSON.parse(sessionStorage.getItem('cartData'));
        if (cartData) {
            this.cartService.cartItemsSubject.next(cartData);
        }
        this.cartService.cartItems.subscribe(items => {
            this.cartItems = items;
        });
        this.getCartVoucher();
        ['cartItemsFlight', 'cartItemsHotel', 'cartItemsTransfer', 'cartItemsActivity'].forEach(item => {
            sessionStorage.removeItem(item);
        });   
        const loggedInUser = sessionStorage.getItem('currentUser');
        this.loggedInUser = JSON.parse(loggedInUser)
        
    }

    getImage(data) {
        return data.replace(/'/g, '')
    }


    getCartVoucher() {
        let req = { refNumber: this.cartItems.refNumber || '' }
        this.subSunk.sink = this.apiHandlerService.apiHandler('bundleVoucher', 'post', '', '', req).subscribe(res => {
            if (res) {
                if (res.data.flight && Object.keys(res.data.flight).length > 0) {
                    res.data.flight[0]['FlightItineraries'].forEach((element, i) => {
                        if (element.attributes) {
                            let attributes = element.attributes.replace(/\"/gi, "\"");
                            res.data.flight[0]['FlightItineraries'][i]['attributes'] = JSON.parse(attributes);
                        }
                    });
                    this.confirmedData = res.data.flight[0];
                    this.enableSeat();
                    // if (this.confirmation && this.confirmedData.BookingStatus === 'BOOKING_HOLD' && this.flightAppReference && this.orderId) {
                    //     this.checkPaymentStatus(this.confirmedData);
                    // }
                    if (this.confirmedData.Passengers[0].ticket_no) {
                        this.showConfirmTicket = false;
                    }
                    this.airline_logo = this.flightService.airline_logo;
                    this.currentUser = this.util.readStorage('b2cUser', sessionStorage);
                    this.cdr.detectChanges();
                }
                if (res.data.hotel && Object.keys(res.data.hotel).length > 0) {

                    this.voucher = res.data.hotel;
                    //     if(this.booking_source == 'TLAPNO00003'){
                    //     this.voucher['BookingDetails'].CancellationReason.hotelBody.searchRequest.RoomGuests.forEach(item => {
                    //         console.log("item",item)
                    //         this.adult += item.NoOfAdults;
                    //         this.child += item.NoOfChild;
                    //     });
                    // }

                    this.voucher['BookingDetails'].CancellationReason.searchRequest.RoomGuests.forEach(item => {
                        console.log("item", item)
                        this.adult += item.NoOfAdults;
                        this.child += item.NoOfChild;
                    });
                    this.voucher['BookingPaxDetails'].forEach((element, i) => {
                        console.log("element", element)
                        console.log("i", i)
                        if (i < this.voucher['BookingPaxDetails'].length) {
                            if (element['PaxType'] == 'Child') {
                                this.noOfChilds++;
                            } else if (element['PaxType'] == 'Adult') {
                                this.noOfAdults++;
                            }
                        }
                    });
                }
                if (res.data.transfer && Object.keys(res.data.transfer).length > 0) {
                    this.voucherData = res.data.transfer;
                    let bookingData = this.voucherData.BookingDetails.attributes.replace(/'/g, '"');
                    let paxDetails = this.voucherData.BookingPaxDetails[0].attributes.replace(/'/g, '"');
                    this.bookingDetails = { ...JSON.parse(paxDetails), ...JSON.parse(bookingData)};
                    this.cdr.detectChanges();
                }
                if (res.data.activity && Object.keys(res.data.activity).length > 0) {
                    this.activityVoucher = res.data.activity;
                    this.cdr.detectChanges();
                }
            }
        });
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode,
            order_id: this.orderId
        }
        this.flightService.loading.next(true);
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
            .subscribe(res => {
                if (res) {
                    this.confirmedData.BookingStatus = res.data.FinalBooking.BookingDetails.BookingStatus;
                    let paxes = [];
                    res.data.FinalBooking.BookingDetails.PassengerDetails.forEach(element => {
                        let pax = {
                            first_name: element.FirstName,
                            id: element.PassengerId,
                            last_name: element.LastName,
                            passenger_type: element.PassengerType,
                            ticket_no: element.TicketNumber,
                            title: element.Title
                        }
                        paxes.push(pax);
                    });
                    this.confirmedData.Passengers = paxes;
                    this.util.writeStorage("ticketCache", res.data.FinalBooking.BookingDetails, sessionStorage)
                    this.showConfirmTicket = false;
                    this.flightService.loading.next(false);
                    this.cdr.detectChanges();
                }
            }, (err => {
                this.swalService.alert.oops(err.error.Message);
                this.flightService.loading.next(false);
            })
            );
    }

    downloadFlight(type: SupportedExtensions, orientation?: string): void {
        document.getElementById('download').style.display = "none";
        //document.getElementById('ticket').style.display = "none";
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
                doc.save(`${this.confirmedData['AppReference']}.pdf`);
                this.swalService.alert.success();
                document.getElementById('download').style.display = "inline-block";
                // document.getElementById('ticket').style.display = "inline-block";
                // if (!isWithPrice) {
                //     this.showPayment = !isWithPrice;
                // }
            }
        });
    }

    async downloadA4(type: SupportedExtensions, orientation?: string, from?: string) {
        let imageUrl;
        let app_reference;
        if(from === 'transfer') {
            imageUrl = this.bookingDetails.ProductImage;
            app_reference = this.bookingDetails.app_reference
        } else if (from === 'activityVoucher') {
            imageUrl = this.activityVoucher.ItenaryData.attributes.ProductImage;
            app_reference = this.activityVoucher.ItenaryData.app_reference;
        }
        this.loading = true;
        document.getElementById('download').style.display = "none";
        try {
          const base64Image = await this.getImageLoad(imageUrl, app_reference);
    
        const imgEl = document.querySelector('.image-download img') as HTMLImageElement;
        if (imgEl) {
          imgEl.src = base64Image;
          await this.waitForImageToLoad(imgEl); // ensure image is rendered
        }
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
            doc.save(`${app_reference}.pdf`);
            this.loading = false;
            this.swalService.alert.success();
            document.getElementById('download').style.display = "inline-block";
            this.cdr.detectChanges();
          }
        });
        } catch {
          this.swalService.alert.error()
          document.getElementById('download').style.display = "inline-block";
          this.loading = false;
        }
       
      }

      getImageLoad(imagePath: string, app_refernce): Promise<string> {
        const obj = {
          app_reference: app_refernce,
          image_url: imagePath.replace(/'/g,'')
        };
      
        return new Promise((resolve, reject) => {
          this.apiHandlerService.apiHandler('imageDownload', 'post', {}, {}, obj).subscribe({
            next: (data: any) => {
              const mimeType = data.mimeType || 'image/jpeg'; // fallback
              const base64Image = `data:${mimeType};base64,${data.base64}`;
              resolve(base64Image);
            },
            error: (err) => reject(err)
          });
        });
      }
      
        waitForImageToLoad(img: HTMLImageElement): Promise<void> {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Even on error, resolve so the process continues
          }
        });
      }
        commonBadgeStyle = {
          fontSize: '13px',
          padding: '8px',
          borderRadius: '5px',
        }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    duration(origin, destination) {
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';
    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    checkPaymentStatus(data) {
        let req = {
            app_reference: this.flightAppReference,
            order_id: this.orderId
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('paymentConfirmation', 'post', {}, {},
            req).subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.callPnrTicket(data);
                }
            })
    }

    public download(): void {
        this.showConfirmButtons = false;
        window.scrollTo(0, 0);
        var data = document.getElementById('print_voucher');

        setTimeout(() => {
            html2canvas(data, {
                allowTaint: true,
                useCORS: true
            }).then(canvas => {
                const contentDataURL = canvas.toDataURL('image/png', 1.0)
                let pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(contentDataURL);
                var width = pdf.internal.pageSize.getWidth() - 3;
                var height = (imgProps.height * width) / imgProps.width;
                pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);

                this.swalService.alert.success();
                pdf.save(`${this.confirmedData['AppReference']}.pdf`);
                this.showConfirmButtons = true;
            });
        }, 1000)
    }

    submitTicket(data) {
        this.router.navigate(['/flight/payment-details'], {
            queryParams: {
                AppReference: data.AppReference,
            }
        });
    }

    enableSeat() {
        const currentUser = this.util.readStorage('b2cUser', sessionStorage);
        if (this.confirmedData && (this.confirmedData.ApiCode == 'ZBAPINO00002' || this.confirmedData.ApiCode == 'ZBAPINO00007') && currentUser && currentUser.id == 44) {
            this.isSeatInfoNotEmpty = this.util.checkSeatSelection(this.confirmedData.Passengers);
        }
    }










    bookingConfirmation(q) {
        console.log(q);
        this.booking_source = q.booking_source;
        this.hotelService.loading.next(true);
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {}, {
            AppReference: q.AppReference
        }).pipe(
            finalize(() => {
                this.hotelService.loading.next(false);
                this.isLoading = false;
            })
        ).subscribe(resp => {
            if (resp.statusCode == 201) {
                this.hotelService.loading.next(false);
                this.voucher = resp.data;
                if (this.booking_source == 'TLAPNO00003') {
                    this.voucher['BookingDetails'].CancellationReason.hotelBody.searchRequest.RoomGuests.forEach(item => {
                        console.log("item", item)
                        this.adult += item.NoOfAdults;
                        this.child += item.NoOfChild;
                    });
                }
                if (this.booking_source != 'TLAPNO00003') {
                    this.voucher['BookingDetails'].CancellationReason.searchRequest.RoomGuests.forEach(item => {
                        console.log("item", item)
                        this.adult += item.NoOfAdults;
                        this.child += item.NoOfChild;
                    });
                }
                this.voucher['BookingPaxDetails'].forEach((element, i) => {
                    console.log("element", element)
                    console.log("i", i)
                    if (i < this.voucher['BookingPaxDetails'].length) {
                        if (element['PaxType'] == 'Child') {
                            this.noOfChilds++;
                        } else if (element['PaxType'] == 'Adult') {
                            this.noOfAdults++;
                        }
                    }
                });
            }
        }, err => {
            this.hotelService.loading.next(false);
            console.error(err);
        });
    }

    getNoOfRoomsCount() {
        let totalRoomsBooked: number = 0;
        console.log(" this.voucher['BookingItineraryDetails']", this.voucher)
        this.voucher['BookingItineraryDetails'].forEach(o => {
            totalRoomsBooked += o['BlockQuantity'];
        });
        return totalRoomsBooked;
    }

    getDatesFormat(date) {
        if (date != null) {
            date = date.split(' ')[0];
            let d = new Date(date).getDate(), m = new Date(date).toDateString().split(' ')[1], y = new Date(date).getFullYear(), day = new Date(date).toDateString().split(' ')[0];
            day = this.util.getWeekDay(day);
            return `${day + ',&nbsp;' + d + '&nbsp;' + m + '&nbsp;' + y}`;
        }
    }

    getTimes(t: string): string {
        if (t != null) {
            t = t.split(' ')[1];
            let time = Number(t.split(':')[0]);
            if (time > 12) {
                return `${t} PM`;
            } else if (time < 12) {
                return `${t} AM`;
            } if (time == 12) {
                return `${t} PM`;
            }
        }
    }

    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }

    getTotalAmnt() {
        let totalAmnt: number = 0;
        this.voucher['BookingItineraryDetails'].forEach(o => {
            totalAmnt += o.TotalFare;
        });
        return totalAmnt;
    }

    getNoOfNights(i, o): number {
        let checkin = Number(new Date(i).getTime()), checkout = Number(new Date(o).getTime()), nights: number = 0;
        nights = (checkout - checkin) / (1000 * 60 * 60 * 24);
        return nights;
    }

    getBoardType(roomName: string): string {
        let temp = roomName.split('-'), boardType = '';
        temp.forEach((s, i) => {
            if (i > 0 && i < temp.length - 1) {
                boardType += s;
                boardType += (i < temp.length - 2) ? '-' : '';
            }
        })
        return `${boardType}`;
    }


    public downloadPDF1(isWithPrice: boolean) {
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
                doc.save(`${this.voucher['BookingDetails']['AppReference']}- ${this.voucher['BookingDetails']['ConfirmationReference']} -${date}.pdf`);
                console.log('Success');
                this.swalService.alert.success();
            }
        });
    }

    public downloadPDF() {
        var data = document.getElementById('print_hotel_voucher');
        const date = new Date().toDateString();
        this.loading = true;
        window.scrollTo(0, 0);

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
                this.loading = false;
                this.swalService.alert.success();
                pdf.save(`${this.voucher['BookingDetails']['AppReference']}-${date}.pdf`);
            });
        }, 1000);
    }


    cancel() {
        this.router.navigate(['/hotel/hotel-cancellation'], {
            queryParams: { "AppReference": this.voucher['BookingDetails']['AppReference'] }
        })
    }


    downloadWithPrice(t: boolean) {
        console.log(t);
        this.showPayment = t;
    }

    getTotalFare(itinarary: any) {
        let totalFare: any = 0;
        itinarary.forEach(element => {
            totalFare += element.RoomPrice;
        });
        return totalFare;
    }

    getHotelPhoto(imgArrStr) {
        let imgArray = JSON.parse(imgArrStr.replace(/'/gi, "\""));
        return imgArray;
    }
    getStarArray(num) {
        num = Number(num);
        let starArr = [];
        if (num)
            starArr.length = Math.round(num);
        return starArr;
    }
    getStarArrayRemaining(num) {
        num = Number(num);
        let starArr = [];
        if (num && num >= 0)
            starArr.length = 5 - Math.round(num);
        return starArr;
    }
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
