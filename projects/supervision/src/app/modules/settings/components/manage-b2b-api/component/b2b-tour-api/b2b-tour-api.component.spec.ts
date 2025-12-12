import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTourApiComponent } from './b2b-tour-api.component';

describe('B2bTourApiComponent', () => {
  let component: B2bTourApiComponent;
  let fixture: ComponentFixture<B2bTourApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTourApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTourApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
