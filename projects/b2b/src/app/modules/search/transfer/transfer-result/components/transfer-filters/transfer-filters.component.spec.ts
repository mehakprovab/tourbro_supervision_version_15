import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferFiltersComponent } from './transfer-filters.component';

describe('TransferFiltersComponent', () => {
  let component: TransferFiltersComponent;
  let fixture: ComponentFixture<TransferFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
