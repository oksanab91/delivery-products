import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Paginator } from '../models/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Output() setPage: EventEmitter<Paginator> = new EventEmitter<Paginator>();
  @Input('paginator') paginator: Paginator;
  
  pginator = new Paginator;
  totalPages: number;
 
  constructor() {    
   }

  onSetPage(page:number) {    
    this.pginator.currentPage = page;

    const start = (this.pginator.currentPage - 1) * this.pginator.pageSize;
    const end = this.pginator.currentPage === this.totalPages ?

    this.pginator.itemsCount : start + this.pginator.pageSize;
    this.pginator.start = start;
    this.pginator.end = end;

    this.setPage.emit(this.pginator);    
  }

  ngOnInit() {    
    this.pginator = {...this.paginator};
    this.totalPages = this.pginator.itemsCount <= this.pginator.pageSize ? 
      1 : Math.ceil(this.pginator.itemsCount/this.pginator.pageSize);
  }

}