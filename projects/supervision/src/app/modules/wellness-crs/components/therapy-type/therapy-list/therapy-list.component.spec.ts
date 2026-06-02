import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapyListComponent } from './therapy-list.component';

describe('TherapyListComponent', () => {
  let component: TherapyListComponent;
  let fixture: ComponentFixture<TherapyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TherapyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TherapyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
