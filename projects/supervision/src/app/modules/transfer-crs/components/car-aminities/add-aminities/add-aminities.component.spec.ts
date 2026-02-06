import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAminitiesComponent } from './add-aminities.component';

describe('AddAminitiesComponent', () => {
  let component: AddAminitiesComponent;
  let fixture: ComponentFixture<AddAminitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAminitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAminitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
