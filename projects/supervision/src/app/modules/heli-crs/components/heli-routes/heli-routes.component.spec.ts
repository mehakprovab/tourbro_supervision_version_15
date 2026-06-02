import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliRoutesComponent } from './heli-routes.component';

describe('HeliRoutesComponent', () => {
  let component: HeliRoutesComponent;
  let fixture: ComponentFixture<HeliRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeliRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
