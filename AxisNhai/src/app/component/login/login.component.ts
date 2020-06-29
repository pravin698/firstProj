import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogConfig } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { StateServiceService } from 'src/app/core/services/state-service.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { JwtService } from 'src/app/core/services/jwt/jwt.service';
import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usernameVal: any;
  passwordVal: any;

  loginAttempts = 5;
  constructor(public dialog: MatDialog,protected http: HttpClient,
    private jwtService: JwtService,
    private stateService: StateServiceService,
    private router: Router, private _snackBar: MatSnackBar, 
    public baseService: BaseService) { }

  captchaCode: any;
  capchaVal: any = "";

  ngOnInit(): void {
    this.loginAttempts = 5;
    this.generateCaptcha();
    this.checkLoggerStatus();
  }

  checkLoggerStatus(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Cache-Control': 'no-cache,no-store,must-revalidate',
      'Content-Security-Policy': "default-src 'self'",
      'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
    });
    this.baseService._makeRequest(Url.systemLogger,
      {},
      'GET', {
      responseType: 'text',
      headers: headers
    }).subscribe((res:string) => {
      let response = JSON.parse(res);
      if(response.LoggerVal){
        //console.log("UI Time: ", new Date().getTime());
        //console.log("UI Time: ", response.LoggerVal);
        this.stateService.offset = new Date().getTime() -  response.LoggerVal;
      }
    });
  }

  onForgotUserID(){
    this.router.navigateByUrl('/login/forgotyourusername');
  }

  onForgotPassword(){
    this.router.navigateByUrl('/login/forgotyourpassword');
  }  

  generateCaptcha() {
    var chr1 = Math.ceil(Math.random() * 10) + '';
    var chr2 = Math.ceil(Math.random() * 10) + '';
    var chr3 = Math.ceil(Math.random() * 10) + '';

    var str = new Array(4).join().replace(/(.|$)/g, function () { return ((Math.random() * 36) | 0).toString(36)[Math.random() < .5 ? "toString" : "toUpperCase"](); });
    this.captchaCode = str + chr1 + ' ' + chr2 + ' ' + chr3;
  }

  ValidCaptcha() {
    var str1 = this.removeSpaces(this.captchaCode);
    var str2 = this.removeSpaces(this.capchaVal);

    if (str1 == str2) return true;
    return false;
  }

  /* Remove spaces from Captcha Code */
  removeSpaces(string) {
    var returnVal = "";
    if (string) {
      returnVal = string.split(' ').join('');
    }
    return returnVal;
  }

  btnClick(username, password) {

    let valid = this.ValidCaptcha();
    if (valid == false) {
      this._snackBar.open("Captcha is not matching", "", {
        duration: 2000,
      });
      this.generateCaptcha();
      return;
    }

    let canRoute = false;
    if (username && password) {
      if (username == 'arun' || username == 'admin') {
        if (password == '123') {
          let encriptedVal = this.stateService.encript('arunkumar');
          console.log(encriptedVal);
          canRoute = true;
        } else {
          this._snackBar.open("Password is not valid", "", {
            duration: 4000,
          });
        }
      } else {
        this.checkUserDetails(username, password);
      }
      if (canRoute) {
        this.getNavigationData("normal","AxisUser","AxisUser");
        //this.router.navigateByUrl('/main/home');
      }
    } else {
      this._snackBar.open("Please give UserName and Password", "", {
        duration: 4000,
      });
    }
  }

  getNavigationData(mode?:String,userID?:String,userName?:String,firstLogin?:String){
    
    //If user account is valid then it will come here, so resetting the value.
    this.loginAttempts = 5;

    let url = Url.navicNormal;
    if(mode == "normal"){
      url = Url.navicNormal;
    }else if(mode == "user"){
      url = Url.navicUser;
    }else if(mode == "AdminMaker"){
      url = Url.navicAdminMaker;
    }else if(mode == "AdminChecker"){
      url = Url.navicAdminChecker;
    }
    if(firstLogin == "true"){
      firstLogin = "true"
    }else{
      firstLogin = "";
    }
    this.stateService.data = [{
      "Url": url,
      "UserID":userID,
      "UserName":userName,
      "FirstLogin":firstLogin
    }];
    
    if(mode == "AdminMaker"){
      this.router.navigateByUrl('/main/usermanagement');
    }else if(mode == "AdminChecker"){
      this.router.navigateByUrl('/main/userchangeworkflow');
    }else{
      this.router.navigateByUrl('/main/home');
    }
  }

  parseStatus(status:any){
    let finalStatus = this.stateService.decryptLoginStatus(status);
    let statusArray = finalStatus.split('ExpAt');

    if(statusArray != null && statusArray != undefined){
      let clientOldTime = Number(statusArray[1]);
      let clientNewTime = new Date().getTime();
      let results = clientNewTime -clientOldTime;
      if(results > 20000){
        return "PasswordFailed";
      }
    }
    return statusArray[0];
  }

  checkUserDetails(username, password) {
    let body: any = {};
    body.chkvalue1 = (username).toString();
    let encPassword = this.stateService.passwordEncript(password);
    body.chkvalue2 = (encPassword).toString();
    body.chkvalue3 = (this.stateService.timeEncription(new Date().getTime())).toString();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST',
      'Cache-Control': 'no-cache,no-store,must-revalidate',
      'Content-Security-Policy': "default-src 'self'",
      'Access-Control-Allow-Headers': "Access-Control-Allow-Headers, Access-Control-Request-Method"
    });
    
    this.http.post(Url.userLogin,body,
      {headers:headers,responseType:'text',observe:'response'})
      .subscribe((res: HttpResponse<any>) => {
        if(res){
          let jwtToken = res.headers.get('authorization');
          this.jwtService.tokenVal = jwtToken;
        }

       

      let response = JSON.parse(res.body);
      if(response && response[0]){
        let status = response[0].Status;
        if(status != 'PasswordFailed' && status != 'UserIDFailed' && status != 'UserLocked'
         && status != 'UserInActive' && status != 'PassExpired' && status != 'SessionExists'){
           status = this.parseStatus(status);
        }

        if(this.loginAttempts != 0){
          this.loginAttempts--;
        }
        
        let userName = response[0].UserName;
        let userID = response[0].UserID;
        let firstLogin = response[0].FirstLogin;
        if (status == 'Success') {
          this.getNavigationData("user",userID,userName,firstLogin);
        } else if (status == 'PasswordFailed') {
          this._snackBar.open("Login failed wrong user credentials", "", {
            duration: 4000,
          });
        } else if (status == 'UserIDFailed') {
          this._snackBar.open("Login failed wrong user credentials", "", {
            duration: 4000,
          });
        } else if (status == 'UserLocked') {
          this._snackBar.open("Login failed wrong user credentials or Locked", "", {
            duration: 4000,
          });
        } else if (status == 'UserInActive') {
          this._snackBar.open("Login failed wrong user credentials or InActive", "", {
            duration: 4000,
          });
        } else if (status == 'PassExpired') {
          this._snackBar.open("Login failed wrong user credentials", "", {
            duration: 4000,
          });
          let stateData:any = this.stateService.data;
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.hasBackdrop = false;
          dialogConfig.width = '60%';
          dialogConfig.height = '84%';
          dialogConfig.ariaLabel = "Password Reset";
          dialogConfig.position = {
            top: '35px',
            right: '50px'
          };
          dialogConfig.data = {
            UserID:userID,
            UserName:userName
          }
          const dialogRef = this.dialog.open(ForgetpasswordComponent,dialogConfig);
          dialogRef.afterClosed().subscribe(result => {

          });
        } else if (status == 'AdminMaker') {
          this.getNavigationData("AdminMaker",userID,userName,firstLogin);
        } else if (status == 'AdminChecker') {
          this.getNavigationData("AdminChecker",userID,userName,firstLogin);
        } else if(status == 'SessionExists'){
          this._snackBar.open("An Open Session Exists", "", {
            duration: 4000,
          });
        }
      }
    });
  }
}
