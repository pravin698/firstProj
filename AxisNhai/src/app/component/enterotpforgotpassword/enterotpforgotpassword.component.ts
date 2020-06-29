import { Component, OnInit, Inject } from '@angular/core';
import { BaseService } from 'src/app/core/base.service';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { AfterVerifypasswordComponent } from '../after-verifypassword/after-verifypassword.component';
import { Router } from '@angular/router';
import { Url } from 'src/app/core/services/url';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-enterotpforgotpassword',
  templateUrl: './enterotpforgotpassword.component.html',
  styleUrls: ['./enterotpforgotpassword.component.scss']
})
export class EnterotpforgotpasswordComponent implements OnInit {
  counterclick = 4;
  targetVal: any = "";
  constructor(public baseService: BaseService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EnterotpforgotpasswordComponent>,
    private router: Router) {
    if (data.targetVal != undefined) {
      this.targetVal = data.targetVal;
    }
  }

  ngOnInit() {
  }

  otpEntered: any = "";

  onBlur(value: any) {
    this.otpEntered = value;
  }
  onRedirectToForgotPassword() {
    this.dialogRef.close();
    this.router.navigateByUrl('/login/forgotyourpassword');
  }

  resendOTP() {
    if(this.counterclick ==0){
      this.counterclick =4;
      this.router.navigateByUrl('/login');
      this.dialogRef.close();
    }

    this.counterclick --;

    let body: any = {};
    const headers =this.baseService.getHeaders();
    body.entry = (this.targetVal).toString();
    this.baseService._makeRequest(Url.generateOTP,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res: string) => {
      if (res == 'OTPGenerated') {
        console.log('Already we are here!!');
      } else {
        this._snackBar.open("OTP Attempts elapsed, Please try tomorrow", "", {
          duration: 4000,
        });
      }
    });
  }

  OpendailogVerifyPassword() {
    if (this.otpEntered == "") {
      this._snackBar.open("Please enter Shared OTP", "", {
        duration: 4000,
      });
    } else if (this.otpEntered.length != 6) {
      this._snackBar.open("Please enter Shared OTP", "", {
        duration: 4000,
      });
    } else {
      let body: any = {};
      const headers =this.baseService.getHeaders();
      body.entry = (this.targetVal).toString();
      body.code = (this.otpEntered).toString();
      this.baseService._makeRequest(Url.validateOTP,
        body,
        'POST', {
        responseType: 'application/text',
        headers: headers
      }).subscribe((res: string) => {
        if (res == "true") {
          this.dialogRef.close();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.data = {
            "targetVal":this.targetVal
          };
          const dialogRef = this.dialog.open(AfterVerifypasswordComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
          });
          //this.router.navigateByUrl('/login');
        } else {
          this._snackBar.open("Please Check your OTP", "", {
            duration: 4000,
          });
        }
      });
    }
  }
}
