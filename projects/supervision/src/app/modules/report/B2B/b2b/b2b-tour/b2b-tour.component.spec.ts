import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourComponent } from './b2b-tour.component';

describe('B2bTourComponent', () => {
  let component: B2bTourComponent;
  let fixture: ComponentFixture<B2bTourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
