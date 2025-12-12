import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBankccountComponent } from './admin-bankccount.component';

describe('AdminBankccountComponent', () => {
  let component: AdminBankccountComponent;
  let fixture: ComponentFixture<AdminBankccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBankccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBankccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
