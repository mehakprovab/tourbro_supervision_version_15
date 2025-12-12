import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2cStaticPageContentComponent } from './b2c-static-page-content.component';

describe('B2cStaticPageContentComponent', () => {
  let component: B2cStaticPageContentComponent;
  let fixture: ComponentFixture<B2cStaticPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2cStaticPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2cStaticPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
