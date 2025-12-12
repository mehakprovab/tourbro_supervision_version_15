import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { HotelService } from '../../../../hotel.service';
import { AuthService } from 'projects/b2b/src/app/auth/auth.service';
@Component({
    selector: 'app-hotel-detail-images',
    templateUrl: './hotel-detail-images.component.html',
    styleUrls: ['./hotel-detail-images.component.scss']
})
export class HotelDetailImagesComponent implements OnInit {

    @Input() hotel: any;
    @Input() traveller: any;
    @ViewChild('owlCar1', { static: false }) private owlCar1: CarouselComponent;
    @ViewChild('itemTemplate', { static: false }) itemTemplate;
    items: GalleryItem[];
    imageData: Array<any> = [];
    travellerAdult: any = 0;
    travellerChild: any = 0;
    slidesPerPage: number = 6;
    hotels: {}[] = [];
    customOptions: OwlOptions = {
        items: 1,
        margin: 4,
        autoplaySpeed: 2000,
        nav: true,
        autoplay: true,
        dots: false,
        loop: true,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    };

    customOptions2: OwlOptions = {
        items: 8,
        margin: 3,
        dots: false,
        nav: false,
        animateOut: 'fadeOut',
        smartSpeed: 200,
        autoplaySpeed: 500,
        slideBy: this.slidesPerPage,
        responsiveRefreshRate: 100,
        autoplayHoverPause: true,
        autoplayTimeout: 5000,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
    }
    minimumRoomPrice: any;
    roomNameandType: any;
    sidebarToggle: boolean = false;

    constructor(
        public gallery: Gallery,
        public lightbox: Lightbox,
        private hotelService: HotelService,
        private authServ: AuthService
    ) { }

    ngOnInit() {
        console.log("hotel",this.hotel)
        this.hotels = this.hotel.HotelPicture ? this.hotel.HotelPicture : [];
        this.setGuest();
        this.authServ.toggleSidebar.subscribe((res) => {
            this.sidebarToggle = res;
            console.log(this.sidebarToggle)
        })
    }

    handleCarouselImage(id): void {
        this.owlCar1.to(`${id}`);
    }
    hasAmenities(amenitiesArr: Array<any>, type: string): boolean {
        const amenitiesStr = amenitiesArr.join('').replace(/_/gi, '').toLowerCase();
        const typeArr = type.toLowerCase().replace(/_/gi, '').split('|');
        let found: boolean = false;
        typeArr.forEach(matchStr => {
            const match = new RegExp(`${matchStr}`, 'gi');
            if (amenitiesStr.match(match)) {
                found = true
            }
        });
        return found;
    }
    morePhotos() {
        this.items = this.imageData.map(item => new ImageItem({ src: item, thumb: item, text: 'Name of image' }));
        const lightboxRef = this.gallery.ref('lightbox');
        lightboxRef.setConfig({
            imageSize: ImageSize.Cover,
            thumbPosition: ThumbnailsPosition.Bottom,
            itemTemplate: this.itemTemplate,

        });
        lightboxRef.load(this.items);
    }
    setGuest(){
        this.hotel.searchRequest.RoomGuests.forEach(element => {
            this.travellerAdult += element.NoOfAdults;
            this.travellerChild += element.NoOfChild;
        });

        // this.hotel.RoomDetails.forEach((roomGroup) => {
        //     roomGroup.forEach((roomData) => {
        //         roomData.Rooms.forEach((room) => {
        //         room.Price.forEach((price) => {
        //             const amount = parseFloat(price.Amount);
        //             if (amount < this.minimumRoomPrice) {
        //                 this.minimumRoomPrice = amount;
        //                 this.roomNameandType = room.RoomName;
        //             }
        //         });
        //         });
        //     });
        // });
this.minimumRoomPrice = Infinity;
this.roomNameandType = '';
        this.hotel.RoomDetails.forEach((roomGroup: any[]) => {
            roomGroup.forEach((roomData: any) => {
                roomData.Rooms.forEach((room: any) => {
                if (!room.Price || !Array.isArray(room.Price)) return; // safety check

                room.Price.forEach((price: any) => {
                    const amount = parseFloat(price.Amount);

                    if (amount < this.minimumRoomPrice) {
                    this.minimumRoomPrice = amount;
                    this.roomNameandType = room.RoomName;
                    }
                });
                });
            });
        });
    }
    goTo(location: string): void {
        this.hotelService.scrollToRoomDetails.next(true);
    }


}
