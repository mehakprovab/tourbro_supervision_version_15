import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cWellnessComponent } from './b2c-wellness.component';

describe('B2cWellnessComponent', () => {
  let component: B2cWellnessComponent;
  let fixture: ComponentFixture<B2cWellnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2cWellnessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2cWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
