import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsCardComponent } from './product-details-card.component';

describe('ProductDetailsCardComponent', () => {
  let component: ProductDetailsCardComponent;
  let fixture: ComponentFixture<ProductDetailsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
