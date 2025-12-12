import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTypeComponent } from './theme-type.component';

describe('ThemeTypeComponent', () => {
  let component: ThemeTypeComponent;
  let fixture: ComponentFixture<ThemeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
