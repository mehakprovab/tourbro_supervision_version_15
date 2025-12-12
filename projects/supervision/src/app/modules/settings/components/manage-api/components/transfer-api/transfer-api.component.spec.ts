import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferApiComponent } from './transfer-api.component';

describe('TransferApiComponent', () => {
  let component: TransferApiComponent;
  let fixture: ComponentFixture<TransferApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
