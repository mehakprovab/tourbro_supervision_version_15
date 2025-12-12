import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeDdComponent } from './cheque-dd.component';

describe('ChequeDdComponent', () => {
  let component: ChequeDdComponent;
  let fixture: ComponentFixture<ChequeDdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequeDdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeDdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
