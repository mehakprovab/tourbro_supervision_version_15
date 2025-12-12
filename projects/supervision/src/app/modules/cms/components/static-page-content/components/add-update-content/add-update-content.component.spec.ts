import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateContentComponent } from './add-update-content.component';

describe('AddUpdateContentComponent', () => {
  let component: AddUpdateContentComponent;
  let fixture: ComponentFixture<AddUpdateContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
