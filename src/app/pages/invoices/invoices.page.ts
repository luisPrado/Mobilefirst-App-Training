import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  public existsData=false;
  invoiceData  = [
    
  ];
  public isLogged;
  constructor(private invoicesService: InvoicesService, 
    private changeRef: ChangeDetectorRef,
    private router: Router) {
      this.isLogged=AppComponent.isLogged;
      this.getInvoiceData();
     }

  ngOnInit() {
  }

  getInvoiceData(){
    const invoiceObservable = this.invoicesService.getInvoiceItems();
    invoiceObservable.subscribe((data) => {
      console.log(JSON.stringify(data));
      if(!data.error ){
        this.invoiceData = data;
        if(this.invoiceData.length>0){
          this.existsData=true;
        }
        this.changeRef.detectChanges();
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


}
