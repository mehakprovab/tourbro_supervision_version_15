import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeliCrsListComponent } from './heli-crs-list.component';

describe('HeliCrsListComponent', () => {
  let component: HeliCrsListComponent;
  let fixture: ComponentFixture<HeliCrsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeliCrsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeliCrsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
