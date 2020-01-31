import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  itemsData: any;   
  public isLogged; 
  constructor(
      public changeRef: ChangeDetectorRef,
      public cartService: CartService, 
      public productsService : ProductsService,
      private router: Router) { 
        this.isLogged=AppComponent.isLogged;
    this.itemsData=[];
  }

  ngOnInit() {
    this.getItemsData();
  }

  ionViewWillEnter() { 
    this.isLogged=AppComponent.isLogged;
    this.getItemsData();
  }
  getItemsData(){
    const productsObservable = this.productsService.getProducts();
    productsObservable.subscribe((data) => {
      if(!data.error ){
        this.itemsData = data.responseJSON;
        this.changeRef.detectChanges();
      }
      else{
        console.log('error de comunicacion');
      }
    });
  }

  
  goToPage(url, optionalData?){
    console.log('go to page details url = '+url+' optionalData = '+JSON.stringify(optionalData));
    this.router.navigate([url],{ state: optionalData });
  }

}
