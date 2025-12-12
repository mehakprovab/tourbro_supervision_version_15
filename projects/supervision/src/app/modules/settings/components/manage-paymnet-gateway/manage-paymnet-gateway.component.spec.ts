import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymnetGatewayComponent } from './manage-paymnet-gateway.component';

describe('ManagePaymnetGatewayComponent', () => {
  let component: ManagePaymnetGatewayComponent;
  let fixture: ComponentFixture<ManagePaymnetGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePaymnetGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePaymnetGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
