import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { Paginator } from '../models/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {  
  productsAll: Product[];
  products: Product[];
  filteredProducts: Product[];
  productSelected: Product;
  productSubscription: Subscription;
 
  paginator: Paginator;
  productsCount = 0;  

  constructor(private productService: ProductService, private router: Router) {    
  }

  ngOnInit() {
     this.productSubscription = this.populateProducts();
  }

  sort(sortBy: string){
    this.filteredProducts.sort((item1, item2) => {
      if (isNaN(Number(item1[sortBy]))) {
        return item1[sortBy].localeCompare(item2[sortBy]);
      }
      return item1[sortBy] - item2[sortBy];
    })   

    this.setPage(this.paginator);    
  }

  filter(query: string){    
    this.filteredProducts = (query) ? 
      this.productsAll.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())) :
      this.productsAll;
    
    this.productsCount = this.filteredProducts.length;    
       
    this.setPage(this.paginator)
  }

  setPage(page: Paginator){ 
    this.products = this.filteredProducts.slice(page.start, page.end);    
  }

  displayDetails(product: Product) {    
    let navigationExtras: NavigationExtras = {
      state: {
        product: product
      }
    };
    
    this.router.navigate(['products/details', product.id], navigationExtras);
  }

  initPaginator(){
    this.paginator = new Paginator();     
    this.paginator.pageSize = 5; 
    this.paginator.currentPage = 1;
    this.paginator.start = 0;
    this.paginator.itemsCount = this.productsCount;
    this.paginator.end = (this.productsCount < this.paginator.pageSize && this.productsCount > 0) ?
      this.productsCount : this.paginator.pageSize;    
  }

  populateProducts(): Subscription{
    return this.productService.getAll()
    .pipe(
      map(products =>
        {          
          this.productsAll = products;
          this.filteredProducts = products;
          this.productsCount = this.productsAll.length;
          
          this.initPaginator();
          this.setPage(this.paginator);
        }        
        )
    ).subscribe();  
  }

  ngOnDestroy(){
    this.productSubscription.unsubscribe();
  }
}