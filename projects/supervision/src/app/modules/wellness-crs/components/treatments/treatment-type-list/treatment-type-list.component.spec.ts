import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentTypeListComponent } from './treatment-type-list.component';

describe('TreatmentTypeListComponent', () => {
  let component: TreatmentTypeListComponent;
  let fixture: ComponentFixture<TreatmentTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreatmentTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreatmentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
