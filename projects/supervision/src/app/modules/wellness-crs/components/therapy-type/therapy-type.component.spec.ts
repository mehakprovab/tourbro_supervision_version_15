import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapyTypeComponent } from './therapy-type.component';

describe('TherapyTypeComponent', () => {
  let component: TherapyTypeComponent;
  let fixture: ComponentFixture<TherapyTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapyTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
