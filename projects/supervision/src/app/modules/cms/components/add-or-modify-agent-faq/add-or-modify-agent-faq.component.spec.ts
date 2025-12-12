import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyAgentFaqComponent } from './add-or-modify-agent-faq.component';

describe('AddOrModifyAgentFaqComponent', () => {
  let component: AddOrModifyAgentFaqComponent;
  let fixture: ComponentFixture<AddOrModifyAgentFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyAgentFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyAgentFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
