import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { InvoicesService } from 'src/app/services/invoices.service';
import { formatDate } from '@angular/common';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public cartData=[];
  public total;
  public existsData=false;
  public isLogged;
  constructor(private cartService: CartService,
              private invoicesService: InvoicesService, 
              public changeRef: ChangeDetectorRef,
              public router: Router) {
                this.isLogged=AppComponent.isLogged;
                
      
   }

  ngOnInit() {
    
  }
  
  ionViewWillEnter() { 
    this.isLogged=AppComponent.isLogged;
    this.existsData=false;
    this.getCartData();
  }
  getCartData(){
    const cartObservable = this.cartService.getCartItems();
    cartObservable.subscribe((data) => {
      console.log(JSON.stringify(data));
      if(!data.error ){
        this.cartData = data;
        this.total=this.getTotal(data);
        if(this.cartData.length>0){
          this.existsData=true;
        }
        this.changeRef.detectChanges();
      }
      else{
        alert('error interno');
      }
    });
  }
  getTotal(data){
    let total =0;
    data.forEach(element => {
      total+=element.json.price;
    });
    return total;
  }

  deleteItem(id){
    const cartObservable = this.cartService.removeCartItem(id);
    cartObservable.subscribe((result) => {
      console.log(JSON.stringify(result));
      if(result>0 ){
        //reload data
        this.getCartData();
      }
      else{
        alert('error interno');
      }
    });
  }

  pay(url, optionalData?){
    this.createInvoice(url, optionalData);
  }

  createInvoice(url, optionalData?){
    const invoiceObservable = this.invoicesService.addInvoiceItem(this.formatDataToArray());
    invoiceObservable.subscribe((result) => {
      console.log(JSON.stringify(result));
      if(result>=0 ){
        this.removeCart(url, optionalData);
      }
      else{
        alert('error interno');
      }
    });
  } 

  removeCart(url, optionalData?){
    const cartObservable = this.cartService.removeAllCartItems();
    cartObservable.subscribe((result) => {
      console.log(JSON.stringify(result));
      if(result=='success' ){
        this.goToPage(url, optionalData);
      }
      else{
        alert('error interno');
      }
    });
  }

  
  goToPage(url, optionalData?){
    console.log('go to page details url = '+url+' optionalData = '+JSON.stringify(optionalData));
    this.router.navigate([url],{ state: optionalData });
  }

  formatDataToArray(){
    let date = formatDate(new Date(),'yyyy/MM/dd', 'en' );
    let formatArray=[];
    this.cartData.forEach(element => {
      element.json.date=date;
      formatArray.push(element.json);
    });
    console.log(formatArray);
    return formatArray;
  }
  

}
