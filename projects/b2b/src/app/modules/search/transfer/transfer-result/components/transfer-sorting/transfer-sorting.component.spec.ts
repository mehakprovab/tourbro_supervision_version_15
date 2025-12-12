import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSortingComponent } from './transfer-sorting.component';

describe('TransferSortingComponent', () => {
  let component: TransferSortingComponent;
  let fixture: ComponentFixture<TransferSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
