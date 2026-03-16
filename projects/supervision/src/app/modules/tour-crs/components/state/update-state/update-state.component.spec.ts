import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStateComponent } from './update-state.component';

describe('UpdateStateComponent', () => {
  let component: UpdateStateComponent;
  let fixture: ComponentFixture<UpdateStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
