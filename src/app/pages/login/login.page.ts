import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import {  Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public data = 
    {
      username: '',
      password:'',
      info:''
    };
    public isLogged;
  constructor(private router: Router,public changeRef: ChangeDetectorRef) {
    this.isLogged=AppComponent.isLogged;
    console.log('login page constructor');
    //console.log(this.router.getCurrentNavigation().extras.state.example);
    
    
  }

  ngOnInit() {
  }
  
  login(){
    if(AppComponent.isChallenged){
      AppComponent.UserLoginChallengeHandler.submitChallengeAnswer(this.data);
    }
    else{
      AppComponent.login(this.data.username,this.data.password,false);
    }
  }

  

 

}
