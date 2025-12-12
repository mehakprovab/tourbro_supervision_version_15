import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFaqContentComponent } from './add-update-faq-content.component';

describe('AddUpdateFaqContentComponent', () => {
  let component: AddUpdateFaqContentComponent;
  let fixture: ComponentFixture<AddUpdateFaqContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateFaqContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateFaqContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
