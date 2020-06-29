import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpHeaders } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';
import { BaseService } from 'src/app/core/base.service';
import { Router } from '@angular/router';
import { StateServiceService } from 'src/app/core/services/state-service.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {
  hide = true;
  hideNewPassword = true;
  hideOldPassword = true;
  userName:String;
  userID:String;
  passwordVal:any;
  passwordVal1:any;
  passwordVal2:any;
  constructor(private stateService: StateServiceService,private _snackBar: MatSnackBar,@Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<ForgetpasswordComponent>,public baseService: BaseService,
    private router: Router) {
      if(data){
        this.userName = data.UserName;
        this.userID = data.UserID;
      }
  }

  ngOnInit() {
  }

  onUpdateClick(passwordForm){
    if(!passwordForm.invalid){
    if(this.passwordVal1 == this.passwordVal2){
      let body: any = {};
      const headers =this.baseService.getHeaders();
      body.UserID = (this.userID).toString();
      let encPassword1 = this.stateService.passwordEncript(this.passwordVal);
      let encPassword2 = this.stateService.passwordEncript(this.passwordVal1);
      body.password = (encPassword1).toString();
      body.newPassword = (encPassword2).toString();
      this.baseService._makeRequest(Url.passwordReset,
        body,
        'POST', {
        responseType: 'application/text',
        headers: headers
      }).subscribe((res: string) => {
        if (res == 'Success') {
          this.dialogRef.close();
          //this.router.navigateByUrl('/login');
          this._snackBar.open("Password Reset Success, Please logout and login again", "", {
            duration: 4000,
          });
        } else if(res == "UserNotFound") {
          this._snackBar.open("Not met with password policy requirements", "", {
            duration: 4000,
          });
        } else if(res == "PasswordNotMatch") {
          this._snackBar.open("Not met with password policy requirements", "", {
            duration: 4000,
          });
        } else if(res == "PasswordExistsinLast5") {
          this._snackBar.open("Not met with password policy requirements", "", {
            duration: 4000,
          });
        }
      });
    }else{
      this._snackBar.open("New Password and Current Password are not matching", "", {
        duration: 4000,
      });
    }
  }

}
}
