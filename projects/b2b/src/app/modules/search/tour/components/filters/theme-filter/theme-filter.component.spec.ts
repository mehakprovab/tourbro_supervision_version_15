import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeFilterComponent } from './theme-filter.component';

describe('ThemeFilterComponent', () => {
  let component: ThemeFilterComponent;
  let fixture: ComponentFixture<ThemeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
