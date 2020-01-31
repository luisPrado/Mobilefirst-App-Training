import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }
  getProducts() : any{
    const productsObservable = new Observable(observer => {
      var resourceRequest = new WLResourceRequest("/adapters/ItemAdapter/resource/getProducts",WLResourceRequest.GET);
      resourceRequest.send().then((response) => {
        console.log(response);
        observer.next( {
          error: false,
          responseJSON:response.responseJSON
        })
      },
      function(error){
        console.log(error);
        observer.next( {
          error:true,
          message:error.responseText
        });
      });
    });
    return productsObservable;
  }
  
  
  getProduct(id): any{
    const productObservable = new Observable(observer => {
      var resourceRequest = new WLResourceRequest("/adapters/ItemAdapter/resource/getProduct?id="+id,WLResourceRequest.GET);
      resourceRequest.send().then((response) => {
        observer.next( {
          error: false,
          responseJSON:response.responseJSON
        })
      },
      function(error){
        observer.next( {
          error:true,
          message:error.responseText
        });
      });
    });
    return productObservable;
  }

  
}
