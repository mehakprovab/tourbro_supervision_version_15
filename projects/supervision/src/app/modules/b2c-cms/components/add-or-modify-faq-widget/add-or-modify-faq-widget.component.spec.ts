import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyFaqWidgetComponent } from './add-or-modify-faq-widget.component';

describe('AddOrModifyFaqWidgetComponent', () => {
  let component: AddOrModifyFaqWidgetComponent;
  let fixture: ComponentFixture<AddOrModifyFaqWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyFaqWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyFaqWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
