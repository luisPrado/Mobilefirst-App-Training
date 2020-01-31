import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InvoicesService } from 'src/app/services/invoices.service';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  id=-1;
  public item: any ={}
  public isLogged;
  constructor(private invoicesService: InvoicesService,
    private changeRef: ChangeDetectorRef,
    private router: Router) {
      this.isLogged=AppComponent.isLogged;
      this.id = this.router.getCurrentNavigation().extras.state.id;                                                                      
      if(this.id!=undefined){
        this.getItemData(this.id);
      }
     }

  ngOnInit() {
  }

  getItemData(id){
    const productObservable = this.invoicesService.getInvoiceItem(id);
    productObservable.subscribe((data) => {
      if(!data.error ){
        this.item = data[0].json;
        this.changeRef.detectChanges();
      }
      else{
        alert('error de comunicacion');
      }
    });
  }
  goToPage(url, optionalData?){
    console.log('go to page details url = '+url+' optionalData = '+JSON.stringify(optionalData));
    this.router.navigate([url],{ state: optionalData });
  }

}
