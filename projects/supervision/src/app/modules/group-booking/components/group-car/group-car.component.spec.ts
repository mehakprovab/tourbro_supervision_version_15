import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCarComponent } from './group-car.component';

describe('GroupCarComponent', () => {
  let component: GroupCarComponent;
  let fixture: ComponentFixture<GroupCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
