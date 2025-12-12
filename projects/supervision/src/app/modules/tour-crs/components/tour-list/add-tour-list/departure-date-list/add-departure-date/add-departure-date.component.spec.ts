import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartureDateComponent } from './add-departure-date.component';

describe('AddDepartureDateComponent', () => {
  let component: AddDepartureDateComponent;
  let fixture: ComponentFixture<AddDepartureDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDepartureDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartureDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
