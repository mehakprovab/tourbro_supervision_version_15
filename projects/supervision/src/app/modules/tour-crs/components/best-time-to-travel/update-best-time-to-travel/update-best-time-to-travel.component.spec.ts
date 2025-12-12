import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBestTimeToTravelComponent } from './update-best-time-to-travel.component';

describe('UpdateBestTimeToTravelComponent', () => {
  let component: UpdateBestTimeToTravelComponent;
  let fixture: ComponentFixture<UpdateBestTimeToTravelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBestTimeToTravelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBestTimeToTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
