import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypeListComponent } from './package-type-list.component';

describe('PackageTypeListComponent', () => {
  let component: PackageTypeListComponent;
  let fixture: ComponentFixture<PackageTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
