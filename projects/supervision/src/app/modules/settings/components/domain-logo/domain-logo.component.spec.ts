import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainLogoComponent } from './domain-logo.component';

describe('DomainLogoComponent', () => {
  let component: DomainLogoComponent;
  let fixture: ComponentFixture<DomainLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
