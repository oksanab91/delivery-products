import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from './models/product';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {    
    const url = '../assets/products.json'
    let product: Product[] = [];

    return this.http.get<Product[]>(url)
    .pipe(
      map(data => 
        {          
          data.map(item => {
            product = product.concat(item['fedex'] ? item['fedex'] : []);
            product = product.concat(item['ups'] ? item['ups'] : []);
            product = product.concat(!(item['ups'] || item['fedex']) ? item : []);
          })
         
          return product;
        }),
      catchError(error => {
        alert('No data to display'); 
        return of(null)})
    )  
  }
}
