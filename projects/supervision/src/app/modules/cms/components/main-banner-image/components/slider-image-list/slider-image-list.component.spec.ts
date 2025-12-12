import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderImageListComponent } from './slider-image-list.component';

describe('SliderImageListComponent', () => {
  let component: SliderImageListComponent;
  let fixture: ComponentFixture<SliderImageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderImageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
