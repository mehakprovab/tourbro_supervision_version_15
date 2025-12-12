import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTourPackageComponent } from './update-tour-package.component';

describe('UpdateTourPackageComponent', () => {
  let component: UpdateTourPackageComponent;
  let fixture: ComponentFixture<UpdateTourPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateTourPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTourPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
