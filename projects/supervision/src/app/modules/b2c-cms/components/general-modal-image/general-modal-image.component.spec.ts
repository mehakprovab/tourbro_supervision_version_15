import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralModalImageComponent } from './general-modal-image.component';

describe('GeneralModalImageComponent', () => {
  let component: GeneralModalImageComponent;
  let fixture: ComponentFixture<GeneralModalImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralModalImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralModalImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
