import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input('product') product: Product
  @Input('selected') selected = false

  constructor(private productService: ProductService, private router: Router) {} 

  remove() {
    try{
      this.productService.remove(this.product.id)
      this.router.navigate(['/products'])      
    }    
    catch(err){
      console.log(err)
    }    
  }
}
