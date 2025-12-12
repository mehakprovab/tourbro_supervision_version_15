import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenPollicyComponent } from './children-pollicy.component';

describe('ChildrenPollicyComponent', () => {
  let component: ChildrenPollicyComponent;
  let fixture: ComponentFixture<ChildrenPollicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildrenPollicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenPollicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
