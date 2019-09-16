import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details-card',
  templateUrl: './product-details-card.component.html',
  styleUrls: ['./product-details-card.component.scss']
})
export class ProductDetailsCardComponent implements OnInit {  
  product: Product;  
  productId: number;
  productForm: FormGroup;
  
  message = '';
  messageId = '';
  messageShow = false;  
  
  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private service: ProductService) {
  } 
  
  ngOnInit() {
    this.route.firstChild.params.subscribe(params => {
      this.productId = +params['id'];
      this.getProduct();
    });
  }

  getProduct(){
    return this.service.getAll().pipe(
      map(prod =>
        {          
          let products = prod;
          
          products.forEach((p: Product) => {
            if (p.id == this.productId) {
              this.product = p;
            }
          });

          this.buildForm();
        }        
      )
    ).subscribe(); 
  }

  buildForm(){
    this.productForm = new FormGroup({
      name: new FormControl(this.product.name, Validators.required),
      price: new FormControl(this.product.price.toFixed(2), [Validators.required, this.priceValidator]),        
      description: new FormControl(this.product.description),    
    });
  }

  priceValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const valid = control.value>0;
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }
  
  get name() {
    return this.productForm.get('name');
  }

  get price() {
    return this.productForm.get('price');
  }

  onSubmit(){    
    try {
      this.message = `Thank you for updating product ${this.productForm.value.name}`;
      this.messageId = 'Success';
      this.messageShow = true;
      
      alert(this.message);
    } catch (error) {
      console.log(this.productForm.value);
    }    
  }
  
}
