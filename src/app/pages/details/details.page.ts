import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public item: any ={};
  public id;
  public isLogged;
  constructor(private router: Router, public productsService: ProductsService, public changeRef: ChangeDetectorRef, 
    public cartService: CartService) {
      this.isLogged=AppComponent.isLogged;
      console.log('constructor details');
      this.id = this.router.getCurrentNavigation().extras.state.id;                                                                      
      if(this.id!=undefined){
        this.getItemData(this.id);
      }
    
  }
  ionViewWillEnter() { 
    
  }
  ngOnInit() {
  }

  getItemData(id){
    const productObservable = this.productsService.getProduct(id);
    productObservable.subscribe((data) => {
      if(!data.error ){
        this.item = data.responseJSON;
        this.item.quantity=1;
        this.changeRef.detectChanges();
      }
      else{
        alert('error de comunicacion');
      }
    });
  }

  addToCart(){
    this.cartService.addCartItem(this.item);
    this.goToPage('cart',this.item);
  }

  goToPage(url, optionalData?){
    console.log('go to page details url = '+url+' optionalData = '+JSON.stringify(optionalData));
    this.router.navigate([url],{ state: optionalData });
  }

}
