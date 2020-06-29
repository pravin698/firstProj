import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { OtpforgotyourpasswordComponent } from '../otpforgotyourpassword/otpforgotyourpassword.component';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { StateServiceService } from 'src/app/core/services/state-service.service';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/core/base.service';
import { HttpHeaders } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';


@Component({
  selector: 'app-forgotyourpassword',
  templateUrl: './forgotyourpassword.component.html',
  styleUrls: ['./forgotyourpassword.component.scss']
})
export class ForgotyourpasswordComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    //Validators.email,
     Validators.pattern(/^([6-9]\d{9})|([A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3})$/)
  ]);

  matcher = new MyErrorStateMatcher();
  constructor(public dialog: MatDialog,private stateService: StateServiceService,private router: Router,public baseService: BaseService,private _snackBar: MatSnackBar) { }
  requireVal:any = "";
  ngOnInit() {
  }

  onforgotPassSumit(){
    this.requireVal = this.emailFormControl.value;
    if(this.requireVal == ""){
      this._snackBar.open("Please enter your Registered E-Mail Address OR Mobile Number", "", {
        duration: 4000,
      });
    }else{
      let body: any  = {};
      const headers =this.baseService.getHeaders();
      body.entry = (this.requireVal).toString();
      this.baseService._makeRequest(Url.generateOTP,
        body,
        'POST', {
        responseType: 'application/text',
        headers: headers
      }).subscribe((res:string) => {
        if(res == 'OTPGenerated'){
          this.stateService.data = [{'forGotPassDetails':this.requireVal}];
          this.router.navigateByUrl('/login/otpforgotyourpassword');
        }else{
          this._snackBar.open("OTP Attempts elapsed, Please try tomorrow", "", {
            duration: 4000,
          });
        }
      });
    }
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(OtpforgotyourpasswordComponent);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  

}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
// @Component({
//   selector:'otpforgotyourpassword',
//   templateUrl:'otpforgotyourpassword.html',
// })

// export class Otpforgotyourpassword{}



