import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateB2cComponent } from './create-b2c.component';

describe('CreateB2cComponent', () => {
  let component: CreateB2cComponent;
  let fixture: ComponentFixture<CreateB2cComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateB2cComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateB2cComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
