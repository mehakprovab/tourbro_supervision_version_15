import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bActivityApiComponent } from './b2b-activity-api.component';

describe('B2bActivityApiComponent', () => {
  let component: B2bActivityApiComponent;
  let fixture: ComponentFixture<B2bActivityApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bActivityApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bActivityApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
