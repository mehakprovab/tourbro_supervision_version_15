import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncludesMasterComponent } from './includes-master.component';

describe('IncludesMasterComponent', () => {
  let component: IncludesMasterComponent;
  let fixture: ComponentFixture<IncludesMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncludesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncludesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
