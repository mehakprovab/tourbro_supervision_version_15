import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmcLoginComponent } from './dmc-login.component';

describe('DmcLoginComponent', () => {
  let component: DmcLoginComponent;
  let fixture: ComponentFixture<DmcLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmcLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmcLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
