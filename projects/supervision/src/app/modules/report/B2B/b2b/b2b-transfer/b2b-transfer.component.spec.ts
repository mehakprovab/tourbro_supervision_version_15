import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTransferComponent } from './b2b-transfer.component';

describe('B2bTransferComponent', () => {
  let component: B2bTransferComponent;
  let fixture: ComponentFixture<B2bTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
