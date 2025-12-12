import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareRulesComponent } from './fare-rules.component';

describe('FareRulesComponent', () => {
  let component: FareRulesComponent;
  let fixture: ComponentFixture<FareRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
