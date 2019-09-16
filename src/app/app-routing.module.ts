import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsCardComponent } from './product-details-card/product-details-card.component';

const routes: Routes = [
  { path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: 'details/:id',
        component: ProductDetailsCardComponent 
      }
    ]
    
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
