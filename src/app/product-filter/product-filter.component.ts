import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { ProductService } from '../product.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent {
  sortForm: FormGroup;
  sortByList = ['Name', 'Price'];  
  private subscription: Subscription  
  private searchName = new Subject<string>()
  
  constructor(private productService: ProductService, private router: Router) { 
    this.sortForm = new FormGroup({sortBy: new FormControl(this.sortByList[0])});
  }

  ngOnInit() {
    this.subscription = this.searchName.pipe(      
      // wait 300ms after each keystroke before considering the filter
      debounceTime(300),

      // ignore new filter if same as previous filter
      distinctUntilChanged(),

      // switch to new search observable each time the filter changes
      switchMap((filter: string) => {
        return this.productService.loadProducts(filter)
      })               
    )
    .subscribe()
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  search(filter: string): void {    
    this.searchName.next(filter)
  }

  onSort() {
    const sortBy = this.sortForm.get('sortBy').value.toLowerCase()
    this.productService.sortProducts(sortBy)    
    setTimeout(() => {      
      this.router.navigateByUrl(`/products`)
    })    
  }

}
