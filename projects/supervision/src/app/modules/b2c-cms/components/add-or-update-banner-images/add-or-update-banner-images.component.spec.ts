import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateBannerImagesComponent } from './add-or-update-banner-images.component';

describe('AddOrUpdateBannerImagesComponent', () => {
  let component: AddOrUpdateBannerImagesComponent;
  let fixture: ComponentFixture<AddOrUpdateBannerImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrUpdateBannerImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdateBannerImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
