import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartureDateListComponent } from './departure-date-list.component';

describe('DepartureDateListComponent', () => {
  let component: DepartureDateListComponent;
  let fixture: ComponentFixture<DepartureDateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartureDateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartureDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
