import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdsCommissionsComponent } from './gds-commissions.component';

describe('GdsCommissionsComponent', () => {
  let component: GdsCommissionsComponent;
  let fixture: ComponentFixture<GdsCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdsCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdsCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
