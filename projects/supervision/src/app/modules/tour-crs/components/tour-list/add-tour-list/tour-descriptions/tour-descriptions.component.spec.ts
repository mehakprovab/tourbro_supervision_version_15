import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDescriptionsComponent } from './tour-descriptions.component';

describe('TourDescriptionsComponent', () => {
  let component: TourDescriptionsComponent;
  let fixture: ComponentFixture<TourDescriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourDescriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourDescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
