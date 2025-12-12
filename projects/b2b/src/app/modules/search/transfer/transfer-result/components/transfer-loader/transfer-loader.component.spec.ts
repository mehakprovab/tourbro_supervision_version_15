import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLoaderComponent } from './transfer-loader.component';

describe('TransferLoaderComponent', () => {
  let component: TransferLoaderComponent;
  let fixture: ComponentFixture<TransferLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
