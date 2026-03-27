import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombustionMasterComponent } from './combustion-master.component';

describe('CombustionMasterComponent', () => {
  let component: CombustionMasterComponent;
  let fixture: ComponentFixture<CombustionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombustionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombustionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
