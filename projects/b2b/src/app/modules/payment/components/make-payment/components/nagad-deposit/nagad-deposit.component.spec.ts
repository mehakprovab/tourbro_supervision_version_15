import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NagadDepositComponent } from './nagad-deposit.component';

describe('NagadDepositComponent', () => {
  let component: NagadDepositComponent;
  let fixture: ComponentFixture<NagadDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NagadDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NagadDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
