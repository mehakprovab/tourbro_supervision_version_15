import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bActivityComponent } from './b2b-activity.component';

describe('B2bActivityComponent', () => {
  let component: B2bActivityComponent;
  let fixture: ComponentFixture<B2bActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
