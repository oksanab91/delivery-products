import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Product } from './models/product';
import { map } from 'rxjs/operators';
import { ProductApiService } from './api.service';
import { Paginator } from './models/paginator';


export class ProductState {
  products: Product[] = []
  filtered: Product[] = []
  current: Product = null
  paginator: Paginator = null
  productsOnPage: Product[] = []
  filled: boolean

}

const InitProductState: ProductState = {
  products: [],
  filtered: [],
  productsOnPage: [],
  current: null,
  paginator: new Paginator(),
  filled: false
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly state$: Observable<ProductState>
  private _state$: BehaviorSubject<ProductState>

  constructor(private api: ProductApiService) {  
    this._state$ = new BehaviorSubject(InitProductState)
    this.state$ = this._state$.asObservable()
  }

  get state (): {products: Product[], filtered: Product[], productsOnPage: Product[], 
      current: Product, paginator: Paginator, filled: boolean} {
    return this._state$.getValue()
  }

  setState (nextState: {products: Product[], filtered: Product[], productsOnPage: Product[], 
      current: Product, paginator: Paginator, filled: boolean}): void {
      this._state$.next(nextState)
  }

  getLocaStorage(){
    const local = JSON.parse(localStorage.getItem('products'))    
    return local['products']
  }  

  getAll() {
    localStorage.clear()
    
    return this.api.getAll().pipe(map(prod => {
      this.setState({...this.state, 
        products: [...prod], 
        filtered: [...prod],
        current: null,
        filled: true})
      
      localStorage.setItem('products', JSON.stringify(this.state))

      this.initPaginator()
      this.loadPage(1)

      return this.state
    }))

  }

  loadProducts(filter) {
    let products = this.getLocaStorage()
    const filtered = products.filter(val => val.name.toLowerCase().includes(filter.toLowerCase()) || 
      val.description.toLowerCase().includes(filter.toLowerCase()))   

    this.setState({...this.state,  
      filtered: [...filtered],
      current: null
    })  
    
    localStorage.setItem('products', JSON.stringify(this.state))

    this.sortProducts('name')
    this.resetPaginator()
    this.loadPage(1)

    return of(this.state)
  }

  loadProduct(id: number) {    
    const products = this.getLocaStorage()
    let product = null

    if(id <= 0) {
      product = new Product()
      product = {...product,
        thumbnailUrl: "assets/images/palm-tree.jpg",
        url: "assets/images/palm-tree.jpg"
      }
    }    
    else product = products.filter(val => val.id === id)[0]
      
    this.setState({...this.state, current: product})
    localStorage.setItem('products', JSON.stringify(this.state))

    return of(this.state)
  }

  sortProducts(sortBy: string) {
    const filtered = [...this.state.filtered]
    
    const sorted = filtered.sort((item1, item2) => {
      if (isNaN(Number(item1[sortBy]))) return item1[sortBy].localeCompare(item2[sortBy])      
      return item1[sortBy] - item2[sortBy]
    })
    
    this.setState({...this.state, 
      filtered: [...sorted],
      current: null
    })

    localStorage.setItem('products', JSON.stringify(this.state))

    this.resetPaginator()
    this.loadPage(1)
    
    return this.state
  }

  remove(id: number){
    let products = this.getLocaStorage()    
    products = products.filter(val => val.id !== id)
    
    this.setState({...this.state, 
      products: [...products], 
      filtered: [...products],
      current: null
    })
    
    localStorage.setItem('products', JSON.stringify(this.state))
    this.resetPaginator()    
    this.loadPage(1)
    
    return this.state
  }

  update(product: Product) {
    let products = this.getLocaStorage()
    const ind = products.findIndex(val => val.id === product.id)
    
    if(ind >= 0) {      
      products[ind] = {...products[ind], 
        name: product.name, description: product.description, 
        price: product.price, creationDate: product.creationDate, 
        thumbnailUrl: product.thumbnailUrl, url: product.url}
    }  
    else {
      product = {...product, 
        id: products[products.length-1].id+1,
        creationDate: new Date(),
        deliveryComp: "dhl",
        type: 3
      }
      products = [...products, product]
    }  
    this.setState({...this.state, 
      products: [...products], 
      filtered: [...products], 
      current: {...product}})

    localStorage.setItem('products', JSON.stringify(this.state))

    this.resetPaginator()    
    this.loadPage(1)

    return this.state
  }

  resetPaginator() {
    this.setState({...this.state,
      paginator: {...this.state.paginator, currentPage: 1, 
        start: 0, end: 5, pagesCount: Math.ceil(this.state.filtered.length/5)},
      productsOnPage: [...this.state.filtered.slice(0, 5)]})

    localStorage.setItem('products', JSON.stringify(this.state))

    return this.state
  }

  initPaginator() {
    let paginator = new Paginator()
    paginator = {
      pageSize: 5,
      currentPage: 1,
      start: 0,
      pagesCount: Math.ceil(this.state.filtered.length/5),
      end: 5
    }

    this.setState({...this.state,
      paginator: paginator,
      productsOnPage: [...this.state.filtered.slice(paginator.start, paginator.end)]})

    localStorage.setItem('products', JSON.stringify(this.state))

    return this.state
  }
  
  loadPage(page: number) {
    if(page > this.state.paginator.pagesCount || page < 1) return this.state

    const start = (page - 1) * this.state.paginator.pageSize
    const end = start + this.state.paginator.pageSize
  
    this.setState({...this.state,
      paginator: {...this.state.paginator, currentPage: page, start: start, end: end},
      productsOnPage: [...this.state.filtered.slice(start, end)]
    })

    localStorage.setItem('products', JSON.stringify(this.state))

    return this.state  
  }
  
}

export const productSelect$ = (state$: Observable<ProductState>) => state$.pipe(map(prods => prods.current))
export const productsSelect$ = (state$: Observable<ProductState>) => state$.pipe(map(prods => prods.filtered))
export const productsAllSelect$ = (state$: Observable<ProductState>) => state$.pipe(map(prods => prods.products))
export const productsOnPageSelect$ = (state$: Observable<ProductState>) => state$.pipe(map(prods => prods.productsOnPage))
export const paginatorSelect$ = (state$: Observable<ProductState>) => state$.pipe(map(prods => prods.paginator))