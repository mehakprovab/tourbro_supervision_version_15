import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFaqWidgetComponent } from './add-update-faq-widget.component';

describe('AddUpdateFaqWidgetComponent', () => {
  let component: AddUpdateFaqWidgetComponent;
  let fixture: ComponentFixture<AddUpdateFaqWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateFaqWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateFaqWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
