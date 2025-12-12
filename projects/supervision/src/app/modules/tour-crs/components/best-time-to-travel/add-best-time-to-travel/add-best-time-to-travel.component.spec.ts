import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBestTimeToTravelComponent } from './add-best-time-to-travel.component';

describe('AddBestTimeToTravelComponent', () => {
  let component: AddBestTimeToTravelComponent;
  let fixture: ComponentFixture<AddBestTimeToTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBestTimeToTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBestTimeToTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
