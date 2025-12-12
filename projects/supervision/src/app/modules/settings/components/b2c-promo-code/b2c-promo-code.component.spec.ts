import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cPromoCodeComponent } from './b2c-promo-code.component';

describe('B2cPromoCodeComponent', () => {
  let component: B2cPromoCodeComponent;
  let fixture: ComponentFixture<B2cPromoCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cPromoCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cPromoCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
