import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Product } from '../models/product';
import { ProductService, productsOnPageSelect$ } from '../product.service';
import { Router } from '@angular/router';
import { slideListInOutAnimation } from '../app-animations/slide.animation';

@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [slideListInOutAnimation]
})
export class ProductsComponent implements OnInit {  
  values$: Observable<any>
  productsOnPage$: Observable<Product[]>
  selectedInd = 0

  constructor(private productService: ProductService, private router: Router) {
  }

  ngOnInit() {
    this.productsOnPage$ = productsOnPageSelect$(this.productService.state$) 
    this.populateProducts()
  }

  selectProduct(ind: number){
    this.selectedInd = ind
  }

  populateProducts() {
    this.values$ = forkJoin(
      this.productService.getAll()
    )
  }

  trackByFn(index, item) {
    return item.id;
  }
}