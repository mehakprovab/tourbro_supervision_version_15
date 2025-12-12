import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildrenPollicyListComponent } from './children-pollicy-list.component';

describe('ChildrenPollicyListComponent', () => {
  let component: ChildrenPollicyListComponent;
  let fixture: ComponentFixture<ChildrenPollicyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildrenPollicyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildrenPollicyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
