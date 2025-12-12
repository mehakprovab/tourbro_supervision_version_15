import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bRegisterComponent } from './b2b-register.component';

describe('B2bRegisterComponent', () => {
  let component: B2bRegisterComponent;
  let fixture: ComponentFixture<B2bRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
