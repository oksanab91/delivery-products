import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Paginator } from '../models/paginator';
import { ProductService, paginatorSelect$ } from '../product.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() paginator: Paginator
  paginator$: Observable<Paginator>
 
  constructor(private productService: ProductService) {    
   }

  onSetPage(page:number) {
    this.productService.loadPage(page)
  }

  ngOnInit() { 
    this.paginator$ = paginatorSelect$(this.productService.state$)
  }

}