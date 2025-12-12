import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFaqContentComponent } from './list-faq-content.component';

describe('ListFaqContentComponent', () => {
  let component: ListFaqContentComponent;
  let fixture: ComponentFixture<ListFaqContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFaqContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFaqContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
