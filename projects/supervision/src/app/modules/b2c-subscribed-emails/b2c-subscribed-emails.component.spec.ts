import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cSubscribedEmailsComponent } from './b2c-subscribed-emails.component';

describe('B2cSubscribedEmailsComponent', () => {
  let component: B2cSubscribedEmailsComponent;
  let fixture: ComponentFixture<B2cSubscribedEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cSubscribedEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cSubscribedEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
