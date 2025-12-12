import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketingDurationComponent } from './update-ticketing-duration.component';

describe('UpdateTicketingDurationComponent', () => {
  let component: UpdateTicketingDurationComponent;
  let fixture: ComponentFixture<UpdateTicketingDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTicketingDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTicketingDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
