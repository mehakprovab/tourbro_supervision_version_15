import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPnrComponent } from './import-pnr.component';

describe('ImportPnrComponent', () => {
  let component: ImportPnrComponent;
  let fixture: ComponentFixture<ImportPnrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPnrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
