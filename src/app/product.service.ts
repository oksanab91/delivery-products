import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, ProductJson } from './models/product';
import * as productData from './models/products_data.json';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    // return this.http.get<ProductDelivery[]>('../models/products_data.json')
    // sortBy
    // filterBy

    let js = JSON.stringify(productData);
    // console.log(js);
    let productDelivery: ProductJson[] = [];
    
    return of(JSON.parse(js))
    .pipe(
      map(data => 
        {
          // console.log(data['default']);

          productDelivery = data['default'];
          let p: Product[] = [];
          productDelivery.map(prod => {
            // console.log(prod.ups);
            // console.log(prod.thirdType);
            
            p = p.concat(prod.fedex ? prod.fedex : []);
            p = p.concat(prod.ups ? prod.ups : []);
            p = p.concat(prod.thirdType ? prod.thirdType : []);
                      
          });
          console.log(p);

          // this.productsCount = p.length;
          return p;
        }),
      catchError(error => {
        alert('No data to display'); 
        return of(null)})
    )
  }

    // let prods: Product[] = [];
              // prods.concat(prod.products);
              // return prods;

  // products: [
  //   {"fedex":
  //   {
  //     "creationDate":1530110788904,
  //   "description":"accusamus beatae ad facilis cum similique qui sunt",
  //   "id":1,"name":"product 1","price":10,
  //   "thumbnailUrl":"http://placehold.it/150/92c952",
  //   "url":"http://placehold.it/600/92c952"
  //   },
  //   "type":1}
  // ];
}
