import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCommissionsComponent } from './default-commissions.component';

describe('DefaultCommissionsComponent', () => {
  let component: DefaultCommissionsComponent;
  let fixture: ComponentFixture<DefaultCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
