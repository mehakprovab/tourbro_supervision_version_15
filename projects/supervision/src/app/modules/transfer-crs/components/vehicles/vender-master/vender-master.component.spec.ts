import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderMasterComponent } from './vender-master.component';

describe('VenderMasterComponent', () => {
  let component: VenderMasterComponent;
  let fixture: ComponentFixture<VenderMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenderMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
