import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyServiceFaqComponent } from './add-or-modify-service-faq.component';

describe('AddOrModifyServiceFaqComponent', () => {
  let component: AddOrModifyServiceFaqComponent;
  let fixture: ComponentFixture<AddOrModifyServiceFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyServiceFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyServiceFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
