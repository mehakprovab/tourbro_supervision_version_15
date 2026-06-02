import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelipadsListComponent } from './helipads-list.component';

describe('HelipadsListComponent', () => {
  let component: HelipadsListComponent;
  let fixture: ComponentFixture<HelipadsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelipadsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelipadsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
