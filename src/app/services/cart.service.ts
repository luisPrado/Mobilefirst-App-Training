import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public items =[];
  constructor() { 
    this.items = 
    [
    ]
  }

  getCartItems():any{
    const itemsObservable = new Observable(observer => {
      var collectionName = 'cart';
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
  addCartItem(item){
    var collectionName = 'cart';
    var options = {
      //exact: false, //default
      //limit: 10 // returns a maximum of 10 documents, default: return every document
    };
    var items = WL.JSONStore.get(collectionName).add(item,options).then(function(numberOfDocumentsAdded){
      console.log('inserted');
    }).fail(function(error){
      console.log(error);
    });
  }
  removeCartItem(id):any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'cart';
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
  removeAllCartItems():any{
    const itemObservable = new Observable(observer => {
      var collectionName = 'cart';
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
  getCartItem(id){
    var collectionName = 'cart';
    var query = {_id: id};
    var options = {
      //exact: false, //default
      //limit: 10 // returns a maximum of 10 documents, default: return every document
    };
    var items = WL.JSONStore.get(collectionName).find(query,options).then(function(results){
      console.log(JSON.stringify(results));
    }).fail(function(error){
      console.log(error);
    });
  }
}
