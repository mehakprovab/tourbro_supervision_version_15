import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellerAgencyComponent } from './traveller-agency.component';

describe('TravellerAgencyComponent', () => {
  let component: TravellerAgencyComponent;
  let fixture: ComponentFixture<TravellerAgencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravellerAgencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravellerAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
