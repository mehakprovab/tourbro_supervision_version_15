import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferNameComponent } from './transfer-name.component';

describe('TransferNameComponent', () => {
  let component: TransferNameComponent;
  let fixture: ComponentFixture<TransferNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
