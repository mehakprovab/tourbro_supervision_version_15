import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelInfoComponent } from './cancel-info.component';

describe('CancelInfoComponent', () => {
  let component: CancelInfoComponent;
  let fixture: ComponentFixture<CancelInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
