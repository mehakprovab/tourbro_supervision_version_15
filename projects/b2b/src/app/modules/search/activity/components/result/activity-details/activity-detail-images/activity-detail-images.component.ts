import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
@Component({
  selector: 'app-activity-detail-images',
  templateUrl: './activity-detail-images.component.html',
  styleUrls: ['./activity-detail-images.component.scss']
})
export class ActivityDetailImagesComponent implements OnInit {

  constructor() { }
  items: GalleryItem[];
  @ViewChild('owlCar1', { static: false }) private owlCar1: CarouselComponent;
  @ViewChild('itemTemplate', { static: false }) itemTemplate;
  @Input() activity: any;
  imageData: Array<any> = [];
  slidesPerPage: number = 6;
  activityImages: any[] = [];

  customOptions: OwlOptions = {
    items: 1,
    margin: 4,
    autoplaySpeed: 2000,
    nav: false,
    autoplay: true,
    dots: false,
    loop: true,
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
     this.activityImages = this.activity.ProductPhotos;
  }

  handleCarouselImage(id): void {
    this.owlCar1.to(`${id}`);
  }

}
