import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDetailImagesComponent } from './transfer-detail-images.component';

describe('TransferDetailImagesComponent', () => {
  let component: TransferDetailImagesComponent;
  let fixture: ComponentFixture<TransferDetailImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferDetailImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDetailImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
