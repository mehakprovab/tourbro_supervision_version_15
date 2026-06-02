import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessListComponent } from './wellness-list.component';

describe('WellnessListComponent', () => {
  let component: WellnessListComponent;
  let fixture: ComponentFixture<WellnessListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellnessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
