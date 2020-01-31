import { Component, Renderer,ChangeDetectorRef, } from '@angular/core';

import { Platform, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  static userName: string;
  static UserLoginChallengeHandler: any;
  static isChallenged;
  static isLogged=false;
  public appPages =[

  ];
  public appPublicPages = [
    {
      title: 'PRODUCTS',
      url: '/products',
      icon: 'book'
    }
  ];
  public appLoginPage = [
    {
      title: 'login',
      url: '/login',
      icon: 'person'
    }
  ]

  public appPrivatePages = [
    {
      title: 'CART',
      url: '/cart',
      icon: 'key'
    },
    {
      title: 'INVOICES',
      url: '/invoices',
      icon: 'key'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private renderer: Renderer,
    private statusBar: StatusBar,
    private router: Router,
    public alertCtrl: AlertController,
    public changeRef: ChangeDetectorRef
  ) {
    AppComponent.isLogged=false;
    AppComponent.isChallenged=false;
    this.appPages = this.appPublicPages.concat(this.appLoginPage);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      
      this.PUSHInitialize();
    });
    this.renderer.listenGlobal('document', 'mfpjsloaded', () => {
      console.log('--> MobileFirst API plugin init complete');
      this.MFPInitComplete();
    });
    this.renderer.listenGlobal('document', 'mfpjsonjsloaded', () => {
      this.JSONStoreInitialize();
    });
  }
  // MFP Init complete function
  MFPInitComplete() {
    console.log('--> MFPInitComplete function called');
    this.registerChallengeHandler(); 
    this.goToPage('products');
    this.splashScreen.hide();
  }
  registerChallengeHandler() {
    AppComponent.UserLoginChallengeHandler = WL.Client.createSecurityCheckChallengeHandler("UserLogin");
    AppComponent.UserLoginChallengeHandler.handleChallenge = ((challenge: any) => {
      AppComponent.isChallenged=true;
      this.displayLoginChallenge(challenge);
    });
    AppComponent.UserLoginChallengeHandler.handleSuccess = ((response: any) => {    
      AppComponent.userName= response.user.displayName;
      this.appPages = this.appPublicPages.concat(this.appPrivatePages);
      AppComponent.isLogged=true;
      console.log('it will call registerDevice');
      this.registerDevice();
      console.log('it called registerDevice');
      this.changeRef.detectChanges();
      this.router.navigateByUrl('products');
    });
    AppComponent.UserLoginChallengeHandler.handleFailure =  ((error: any) => {
      if(error.failure && error.failure == "Account blocked") {
          this.showAlert('Error', 'No Remaining Attempts!', error.failure);
      } else {
          this.showAlert('Error', 'Unexpected Error!', JSON.stringify(error));
      }
    });

  }

  displayLoginChallenge(response) {
    var msg = 'no error';
    console.log(JSON.stringify(response));
    if (response.errorMsg) {
      
      var msg = response.errorMsg + ' <br> Remaining attempts: ' + response.remainingAttempts;
      console.log('--> displayLoginChallenge ERROR: ' + msg);
      this.showAlert('Error', 'Invalid Credentials', msg);
      
    }
    
    this.router.navigate(['login'], { state: { msg: msg } });
  }

  static login(username, password, rememberMeState){
    WLAuthorizationManager.login('UserLogin',{'username':username, 'password':password, rememberMe: rememberMeState}).then(
      function () {
          WL.Logger.debug("login onSuccess");
      },
      function (response) {
          WL.Logger.debug("login onFailure: " + JSON.stringify(response));
      });
  }

  goToPage(url){
    console.log('url 0 '+url);
    if(url=='login'){
      AppComponent.isChallenged=false;
    }
    console.log('navigate '+url);
    this.router.navigate([url],{ state: { msg: 'test' } });
  }

  async showAlert(header, subHeader,message) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }


  //JSONStore
  JSONStoreInitialize(){
    var collections = {
      cart : {
        searchFields: {name: 'string', brand: 'string', price:'integer'}
      },
      invoices:{
        searchFields: {name: 'string', brand: 'string', price:'integer'}
      }
    };
    console.log('initialize json store');
    WL.JSONStore.init(collections).then(function (collections) {
      // handle success - collection.people (people's collection)
      console.log('initialized');
    }).fail(function (error) {
        // handle failure
        console.log('error '+error);
    });
  }

  PUSHInitialize(){

    MFPPush.initialize (
      function(successResponse) {
        console.log('initizialed PUSH');
        MFPPush.registerNotificationsCallback(
          function(message) {
            console.log(JSON.stringify(message));
            alert(JSON.stringify(message));
          }
        );
      },
      function(failureResponse) {
        console.log('error initizialized push');
      }
    );
  };
  registerDevice() {
    WLAuthorizationManager.obtainAccessToken("push.mobileclient").then(
      function(accessToken){
        console.log('token de acceso' +accessToken);
          MFPPush.registerDevice(
              null,
              function(successResponse) {
                console.log("Succeded to register device:" + JSON.stringify(successResponse))
              },
              function(failureResponse) {
                console.log("Failed to register device:" + JSON.stringify(failureResponse));
              }
          )
      }
  );
  }
  





  
  


}

