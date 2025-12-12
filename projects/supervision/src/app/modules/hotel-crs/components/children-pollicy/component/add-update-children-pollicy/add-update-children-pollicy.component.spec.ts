import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateChildrenPollicyComponent } from './add-update-children-pollicy.component';

describe('AddUpdateChildrenPollicyComponent', () => {
  let component: AddUpdateChildrenPollicyComponent;
  let fixture: ComponentFixture<AddUpdateChildrenPollicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateChildrenPollicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateChildrenPollicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
