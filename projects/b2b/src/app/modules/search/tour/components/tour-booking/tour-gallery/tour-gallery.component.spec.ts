import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourGalleryComponent } from './tour-gallery.component';

describe('TourGalleryComponent', () => {
  let component: TourGalleryComponent;
  let fixture: ComponentFixture<TourGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
