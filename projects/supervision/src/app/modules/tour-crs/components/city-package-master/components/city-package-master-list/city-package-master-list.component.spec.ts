import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityPackageMasterListComponent } from './city-package-master-list.component';

describe('CityPackageMasterListComponent', () => {
  let component: CityPackageMasterListComponent;
  let fixture: ComponentFixture<CityPackageMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityPackageMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityPackageMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
