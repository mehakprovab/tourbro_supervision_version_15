import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinentFilterComponent } from './continent-filter.component';

describe('ContinentFilterComponent', () => {
  let component: ContinentFilterComponent;
  let fixture: ComponentFixture<ContinentFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContinentFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinentFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
