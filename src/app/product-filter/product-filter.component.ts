import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent {
  @Output() filter: EventEmitter<any> = new EventEmitter<string>();
  @Output() sort: EventEmitter<any> = new EventEmitter<string>();

  sortForm: FormGroup;
  sortByList = ['Name', 'Price'];  
  
  constructor() { 
    this.sortForm = new FormGroup({sortBy: new FormControl(this.sortByList[0])});
  }

  onFilter(query) {    
    this.filter.emit(query);    
  }

  onSort() {
    const sortBy = this.sortForm.get('sortBy').value.toLowerCase(); 
    this.sort.emit(sortBy);  
  }

}
