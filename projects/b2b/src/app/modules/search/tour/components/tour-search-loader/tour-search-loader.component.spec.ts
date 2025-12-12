import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourSearchLoaderComponent } from './tour-search-loader.component';

describe('TourSearchLoaderComponent', () => {
  let component: TourSearchLoaderComponent;
  let fixture: ComponentFixture<TourSearchLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourSearchLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourSearchLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
