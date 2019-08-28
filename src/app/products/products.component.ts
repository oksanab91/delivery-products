import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NavigationExtras, Router } from '@angular/router';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormGroup, FormControl } from '@angular/forms';

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

  sortForm: FormGroup;
  sortByList = ['Name', 'Price'];  
  
  productsCount = 0;
  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  constructor(private productService: ProductService, private router: Router) {
    this.sortForm = new FormGroup({sortBy: new FormControl(this.sortByList[0])});
  }

  ngOnInit() {
     this.productSubscription = this.populateProducts();
  }

  onSortChange(){
    const sortBy = this.sortForm.get('sortBy').value.toLowerCase();    

    this.filteredProducts.sort((item1, item2) => {
      if (isNaN(Number(item1[sortBy]))) {
        return item1[sortBy].localeCompare(item2[sortBy]);
      }
      return item1[sortBy] - item2[sortBy];
    })
    
    this.setPage(1);    
  }
  onFilter(query){
    this.filteredProducts = (query) ? 
      this.productsAll.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.description.toLowerCase().includes(query.toLowerCase())) :
      this.productsAll;
    
    this.productsCount = this.filteredProducts.length;    
    this.totalPages = this.productsCount <= this.pageSize ? 1 : Math.ceil(this.productsCount/this.pageSize);
    this.setPage(1);

    this.onSortChange();
  }

  setPage(page: number){
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = page === this.totalPages ? this.productsCount : start + this.pageSize;

    this.products = this.filteredProducts.slice(start, end);    
  }

  displayDetails(product: Product) {    
    let navigationExtras: NavigationExtras = {
      state: {
        product: product
      }
    };
    
    this.router.navigate(['products/details', product.id], navigationExtras);
  }

  populateProducts(): Subscription{
    return this.productService.getAll()
    .pipe(
      map(products =>
        {          
          this.productsAll = products;
          this.filteredProducts = products;

          this.productsCount = this.productsAll.length;
          this.totalPages = this.productsCount <= this.pageSize ? 1 : Math.ceil(this.productsCount/this.pageSize);
          this.setPage(1);
        }        
        )
    ).subscribe();  
  }

  ngOnDestroy(){
    this.productSubscription.unsubscribe();
  }
}