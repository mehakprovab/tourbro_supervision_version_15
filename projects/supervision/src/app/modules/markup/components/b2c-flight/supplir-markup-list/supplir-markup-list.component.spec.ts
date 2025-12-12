import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplirMarkupListComponent } from './supplir-markup-list.component';

describe('SupplirMarkupListComponent', () => {
  let component: SupplirMarkupListComponent;
  let fixture: ComponentFixture<SupplirMarkupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplirMarkupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplirMarkupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
