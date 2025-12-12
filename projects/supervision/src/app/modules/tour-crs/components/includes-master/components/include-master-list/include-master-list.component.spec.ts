import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncludeMasterListComponent } from './include-master-list.component';

describe('IncludeMasterListComponent', () => {
  let component: IncludeMasterListComponent;
  let fixture: ComponentFixture<IncludeMasterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncludeMasterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncludeMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
