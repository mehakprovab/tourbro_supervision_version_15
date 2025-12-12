import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContinentComponent } from './add-continent.component';

describe('AddContinentComponent', () => {
  let component: AddContinentComponent;
  let fixture: ComponentFixture<AddContinentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContinentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContinentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
