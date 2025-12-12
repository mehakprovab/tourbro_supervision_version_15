import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CityPackageMasterComponent } from './city-package-master.component';

describe('CityPackageMasterComponent', () => {
  let component: CityPackageMasterComponent;
  let fixture: ComponentFixture<CityPackageMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CityPackageMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityPackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
