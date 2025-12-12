import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bActiveListComponent } from './b2b-active-list.component';

describe('B2bActiveListComponent', () => {
  let component: B2bActiveListComponent;
  let fixture: ComponentFixture<B2bActiveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bActiveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bActiveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
