import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCityPackageMasterComponent } from './add-update-city-package-master.component';

describe('AddUpdateCityPackageMasterComponent', () => {
  let component: AddUpdateCityPackageMasterComponent;
  let fixture: ComponentFixture<AddUpdateCityPackageMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateCityPackageMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCityPackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
