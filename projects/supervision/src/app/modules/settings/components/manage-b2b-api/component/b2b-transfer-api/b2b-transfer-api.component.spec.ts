import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bTransferApiComponent } from './b2b-transfer-api.component';

describe('B2bTransferApiComponent', () => {
  let component: B2bTransferApiComponent;
  let fixture: ComponentFixture<B2bTransferApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bTransferApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bTransferApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
