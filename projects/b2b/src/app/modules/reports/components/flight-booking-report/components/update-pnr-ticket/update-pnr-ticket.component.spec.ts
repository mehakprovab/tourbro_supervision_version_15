import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePnrTicketComponent } from './update-pnr-ticket.component';

describe('UpdatePnrTicketComponent', () => {
  let component: UpdatePnrTicketComponent;
  let fixture: ComponentFixture<UpdatePnrTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePnrTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePnrTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
