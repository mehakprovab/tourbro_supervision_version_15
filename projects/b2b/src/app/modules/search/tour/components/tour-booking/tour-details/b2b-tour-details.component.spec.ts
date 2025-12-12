import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourDetailsComponent } from './b2b-tour-details.component';

describe('TourDetailsComponent', () => {
  let component: B2bTourDetailsComponent;
  let fixture: ComponentFixture<B2bTourDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
