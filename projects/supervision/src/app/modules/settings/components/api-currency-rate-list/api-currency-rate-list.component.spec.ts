import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiCurrencyRateListComponent } from './api-currency-rate-list.component';

describe('ApiCurrencyRateListComponent', () => {
  let component: ApiCurrencyRateListComponent;
  let fixture: ComponentFixture<ApiCurrencyRateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiCurrencyRateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiCurrencyRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
