import { Component, ChangeDetectionStrategy, OnInit, ViewChild, Input } from '@angular/core';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'projects/b2b/src/environments/environment.prod';

const baseUrl = environment.SA_URL;
@Component({
  selector: 'app-tour-gallery',
  templateUrl: './tour-gallery.component.html',
  styleUrls: ['./tour-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TourGalleryComponent implements OnInit {
  imageUrl = `${baseUrl}/sa/tour/tours/getGalleryImages/`;
  items: GalleryItem[];
  @ViewChild('owlCar1', { static: false }) private owlCar1: CarouselComponent;
  @ViewChild('itemTemplate', { static: false }) itemTemplate;
  @Input() tourDetails: any;
  imageData: Array<any> = [];
  slidesPerPage: number = 6;
  tourImages: any[] = [];

  customOptions: OwlOptions = {
    items: 1,
    margin: 4,
    autoplaySpeed: 2000,
    nav: false,
    autoplay: true,
    dots: false,
    loop: false,
    autoplayTimeout: 5000,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
  };

  customOptions2: OwlOptions = {
    items: 6,
    margin: 4,
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

  ngOnInit(): void {
    if (this.tourDetails.BookingSource === "BGTAPINO00002") {
      this.tourImages = this.tourDetails.gallery ? this.tourDetails.gallery.split(",").map(image => `${image}`) : [];
    } else {
      this.tourImages = this.tourDetails.gallery ? JSON.parse(this.tourDetails.gallery).map(image => `${this.imageUrl}${image}`) : [];
    }

  }

  handleCarouselImage(id): void {
    this.owlCar1.to(`${id}`);
  }
}