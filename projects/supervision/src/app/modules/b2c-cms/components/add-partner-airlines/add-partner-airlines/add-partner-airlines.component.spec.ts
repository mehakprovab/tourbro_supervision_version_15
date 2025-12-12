import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyPartnerAirlinesComponent } from './add-partner-airlines.component';

describe('AddOrModifyPartnerAirlinesComponent', () => {
  let component: AddOrModifyPartnerAirlinesComponent;
  let fixture: ComponentFixture<AddOrModifyPartnerAirlinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyPartnerAirlinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyPartnerAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
