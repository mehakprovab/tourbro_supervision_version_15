import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrModifyAyurvedaComponent } from './add-or-modify-ayurveda.component';

describe('AddOrModifyAyurvedaComponent', () => {
  let component: AddOrModifyAyurvedaComponent;
  let fixture: ComponentFixture<AddOrModifyAyurvedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrModifyAyurvedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrModifyAyurvedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
