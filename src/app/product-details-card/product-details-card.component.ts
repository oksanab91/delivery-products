import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details-card',
  templateUrl: './product-details-card.component.html',
  styleUrls: ['./product-details-card.component.scss']
})
export class ProductDetailsCardComponent implements OnInit {  
  product: Product;
  productForm: FormGroup;

  message = '';
  messageId = '';
  messageShow = false;  
  
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
  }  
  
  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart),
      map(() => this.router.getCurrentNavigation().extras.state.product)
    ).subscribe(prod => 
      {this.product = prod;
        this.buildForm();
      })
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
