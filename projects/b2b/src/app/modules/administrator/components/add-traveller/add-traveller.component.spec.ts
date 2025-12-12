import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravellerComponent } from './add-traveller.component';

describe('AddTravellerComponent', () => {
  let component: AddTravellerComponent;
  let fixture: ComponentFixture<AddTravellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTravellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTravellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
