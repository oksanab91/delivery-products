import { Component, OnInit, Input } from '@angular/core';
import { Product, ProductDelivery } from '../models/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input('product') product: Product;

  constructor() {} 
}
