import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedActivityComponent } from './recomended-activity.component';

describe('RecomendedActivityComponent', () => {
  let component: RecomendedActivityComponent;
  let fixture: ComponentFixture<RecomendedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecomendedActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomendedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
