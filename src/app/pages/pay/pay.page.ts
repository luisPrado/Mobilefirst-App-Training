import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
  private total;
  public isLogged;
  constructor(private router : Router) { 
    this.isLogged=AppComponent.isLogged;
    this.total = this.router.getCurrentNavigation().extras.state.total;                                                                      
  }

  ngOnInit() {
  }
  goToPage(url, optionalData?){
    console.log('go to page details url = '+url+' optionalData = '+JSON.stringify(optionalData));
    this.router.navigate([url],{ state: optionalData });
  }
}
