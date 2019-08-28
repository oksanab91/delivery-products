import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsCardComponent } from './product-details-card/product-details-card.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },  
  { path: 'products',
    children: [
      {
        path: 'details/:id',
        component: ProductDetailsCardComponent 
      },
    ],
    component: ProductsComponent
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
