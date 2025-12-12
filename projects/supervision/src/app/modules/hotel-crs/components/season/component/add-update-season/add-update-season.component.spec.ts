import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSeasonComponent } from './add-update-season.component';

describe('AddUpdateSeasonComponent', () => {
  let component: AddUpdateSeasonComponent;
  let fixture: ComponentFixture<AddUpdateSeasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSeasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSeasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
