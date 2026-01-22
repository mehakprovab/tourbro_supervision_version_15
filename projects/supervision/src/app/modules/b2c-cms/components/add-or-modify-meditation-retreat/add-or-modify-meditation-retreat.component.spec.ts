import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyMeditationRetreatComponent } from './add-or-modify-meditation-retreat.component';

describe('AddOrModifyMeditationRetreatComponent', () => {
  let component: AddOrModifyMeditationRetreatComponent;
  let fixture: ComponentFixture<AddOrModifyMeditationRetreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyMeditationRetreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyMeditationRetreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
