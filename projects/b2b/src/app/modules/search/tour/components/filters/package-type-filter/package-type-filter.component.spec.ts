import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypeFilterComponent } from './package-type-filter.component';

describe('PackageTypeFilterComponent', () => {
  let component: PackageTypeFilterComponent;
  let fixture: ComponentFixture<PackageTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
