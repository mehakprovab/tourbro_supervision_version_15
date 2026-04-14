import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyAboutFaqComponent } from './add-or-modify-about-faq.component';

describe('AddOrModifyAboutFaqComponent', () => {
  let component: AddOrModifyAboutFaqComponent;
  let fixture: ComponentFixture<AddOrModifyAboutFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyAboutFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyAboutFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
