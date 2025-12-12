import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContinentComponent } from './update-continent.component';

describe('UpdateContinentComponent', () => {
  let component: UpdateContinentComponent;
  let fixture: ComponentFixture<UpdateContinentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateContinentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContinentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
