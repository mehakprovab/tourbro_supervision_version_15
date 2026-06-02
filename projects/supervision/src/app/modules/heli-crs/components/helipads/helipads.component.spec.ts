import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelipadsComponent } from './helipads.component';

describe('HelipadsComponent', () => {
  let component: HelipadsComponent;
  let fixture: ComponentFixture<HelipadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelipadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelipadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
