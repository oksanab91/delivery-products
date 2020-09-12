import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import { ProductService, productsOnPageSelect$ } from '../product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
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
    ).pipe(
      map(([listState]) => {        
        if(listState.productsOnPage.length > 0) {
          setTimeout(() => {      
            this.router.navigateByUrl(`/products/details/${listState.productsOnPage[0].id}`)
          })
        }
        return { listState }
      })
    );
  }

  trackByFn(index, item) {
    return item.id;
  }
}