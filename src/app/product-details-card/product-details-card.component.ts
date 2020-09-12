import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Product } from '../models/product';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, take } from 'rxjs/operators';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-details-card.component.html',
  styleUrls: ['./product-details-card.component.scss']
})
export class ProductDetailsCardComponent implements OnInit, OnDestroy {  
  product: Product;
  productForm: FormGroup;
  
  message = '';
  messageId = '';
  messageShow = false;
  destroy$: Subject<boolean> = new Subject<boolean>();  
  
  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private service: ProductService) {
  } 
  
  ngOnInit() {

    this.buildForm()

    this.route.paramMap.pipe(takeUntil(this.destroy$))    
    .subscribe(params => {
      let id = +params.get('id')
      if(isNaN(id)) id = -1
      
      this.service.loadProduct(id).pipe(map(val => {
        this.product = val.current
        if(this.product) {          
            this.productForm.patchValue(this.product)          
        }
      }),take(1)).subscribe()
    })
  }
  
  buildForm(){
    this.productForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, this.priceValidator]),        
      description: new FormControl()
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
      const submitProd = {...this.productForm.value, 
        url: this.product.url, 
        thumbnailUrl: this.product.thumbnailUrl }
      this.service.update(submitProd)

      this.message = `Thank you for updating product ${this.productForm.value.name}`;
      this.messageId = 'Success';
      this.messageShow = true;
      
      alert(this.message);
      this.router.navigate(['/products'])

    } catch (error) {
      console.log(this.productForm.value);
    }    
  }
  
  ngOnDestroy() {
    this.destroy$.next(true) 
    this.destroy$.unsubscribe()    
  }
}
