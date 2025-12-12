import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cCmsComponent } from './b2c-cms.component';

describe('B2cCmsComponent', () => {
  let component: B2cCmsComponent;
  let fixture: ComponentFixture<B2cCmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cCmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
