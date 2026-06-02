import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessCenterListComponent } from './wellness-center-list.component';

describe('WellnessCenterListComponent', () => {
  let component: WellnessCenterListComponent;
  let fixture: ComponentFixture<WellnessCenterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessCenterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessCenterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
