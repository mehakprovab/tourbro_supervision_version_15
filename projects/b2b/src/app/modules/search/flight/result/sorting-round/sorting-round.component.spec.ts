import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingRoundComponent } from './sorting-round.component';

describe('SortingRoundComponent', () => {
  let component: SortingRoundComponent;
  let fixture: ComponentFixture<SortingRoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingRoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
