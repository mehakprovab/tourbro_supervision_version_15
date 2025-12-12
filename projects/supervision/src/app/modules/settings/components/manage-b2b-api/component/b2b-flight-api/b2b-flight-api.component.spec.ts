import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bFlightApiComponent } from './b2b-flight-api.component';

describe('B2bFlightApiComponent', () => {
  let component: B2bFlightApiComponent;
  let fixture: ComponentFixture<B2bFlightApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bFlightApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bFlightApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
