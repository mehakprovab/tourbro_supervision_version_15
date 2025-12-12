import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2BActiveComponent } from './b2-b-active.component';

describe('B2BActiveComponent', () => {
  let component: B2BActiveComponent;
  let fixture: ComponentFixture<B2BActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2BActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2BActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
