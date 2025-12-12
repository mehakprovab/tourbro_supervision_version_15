import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTextListComponent } from './slider-text-list.component';

describe('SliderTextListComponent', () => {
  let component: SliderTextListComponent;
  let fixture: ComponentFixture<SliderTextListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderTextListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderTextListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
