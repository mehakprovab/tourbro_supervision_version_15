import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourSearchNameComponent } from './tour-search-name.component';

describe('TourSearchNameComponent', () => {
  let component: TourSearchNameComponent;
  let fixture: ComponentFixture<TourSearchNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourSearchNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourSearchNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
