import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  public items =[];
  constructor() { 
    this.items = 
    [
    ]
  }

  getInvoiceItems():any{
    const itemsObservable = new Observable(observer => {
      var collectionName = 'invoices';
      var options = {
        //exact: false, //default
        //limit: 10 // returns a maximum of 10 documents, default: return every document
      };
      var items = WL.JSONStore.get(collectionName).findAll(options).then(function(results){
        console.log(JSON.stringify(results));
        observer.next(results); 
      }).fail(function(error){
        console.log(error);
        observer.next( error);
      });
    });
    return itemsObservable;

    
  }
  addInvoiceItem(item):any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'invoices';
      var options = {
        //exact: false, //default
        //limit: 10 // returns a maximum of 10 documents, default: return every document
      };
      var items = WL.JSONStore.get(collectionName).add(item,options).then(function(numberOfDocumentsAdded){
        observer.next(numberOfDocumentsAdded); 
      }).fail(function(error){
        observer.next(0); 
      });
    });
    return itemObservable;
  }
  removeInvoiceItem(id):any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'invoices';
      var query = {_id: id};
      var options = {
        exact: true, //default
        //limit: 10 // returns a maximum of 10 documents, default: return every document
      };
      var items = WL.JSONStore.get(collectionName).remove(query,options).then(function(numberOfDocsRemoved){
        console.log(numberOfDocsRemoved);
        observer.next(numberOfDocsRemoved);
      }).fail(function(error){
        console.log(error);
        observer.next(error);
      });
    });
    return itemObservable;
  }
  removeAllInvoiceItems():any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'invoices';
      var options = {};
      WL.JSONStore.get(collectionName).clear(options).then(function () {
        // Handle success.
        observer.next('success');
      })
      .fail(function (errorObject) {
        observer.next(errorObject);
      });
    });
    return itemObservable;
  }
  getInvoiceItem(id):any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'invoices';
      var query = {_id: id};
      var options = {
        //exact: false, //default
        //limit: 10 // returns a maximum of 10 documents, default: return every document
      };
      var items = WL.JSONStore.get(collectionName).find(query,options).then(function(results){
        observer.next(results);
      }).fail(function(error){
        observer.next(error);
      });
    });
    return itemObservable;
  }
  

}
