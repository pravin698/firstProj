import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { BaseService } from 'src/app/core/base.service';
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';
import { StateServiceService } from 'src/app/core/services/state-service.service';

@Component({
  selector: 'app-after-verifypassword',
  templateUrl: './after-verifypassword.component.html',
  styleUrls: ['./after-verifypassword.component.scss']
})
export class AfterVerifypasswordComponent implements OnInit {
  hide = true;
  hideNewPassword = true;
  hideOldPassword = true;
  passwordForm = new FormGroup({
    newpasswordFormControl : new FormControl('', [
      Validators.required,
        //Validators.email,
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]),
      confirmpasswordFormControl :new FormControl('', [
        Validators.required,
          //Validators.email,
           Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ])
  });

    
//  newpassowrdtxt : any;
//  confirmpasswordtxt : any;
  matcher = new MyErrorStateMatcher();
  
  pass1:any = "";
  pass2:any = "";
  
  targetVal: any = "";
  constructor(public baseService: BaseService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AfterVerifypasswordComponent>,
    private stateService: StateServiceService,
    private router: Router) {
    if (data.targetVal != undefined) {
      this.targetVal = data.targetVal;
    }
  }
//   Checkpassword(val){
// this.newpassowrdtxt = 
// this.newpassowrdtxt =
// if(this.newpassowrdtxt === this.confirmpasswordtxt){

  
// }
// else{
  
//   alert('Password does not match ,Enter again');
// }
//  }
  ngOnInit() {

   
  }

  onResetClick(){
    if(this.passwordForm.valid){
    if(this.pass1 == this.pass2){
      let body: any = {};
      const headers =this.baseService.getHeaders();
      
      body.entry = (this.targetVal).toString();
      let encPassword = this.stateService.passwordEncript(this.pass1);
      body.password = (encPassword).toString();
      this.baseService._makeRequest(Url.forgotPasswordRest,
        body,
        'POST', {
        responseType: 'application/text',
        headers: headers
      }).subscribe((res: string) => {
        if (res == 'Success') {
          this.dialogRef.close();
          this.router.navigateByUrl('/login');
        }else if(res == 'PasswordExistsinLast5'){
          this._snackBar.open("Password Rule: You can not use the last 5 Passwords not satisfied", "", {
            duration: 4000,
          });
        } else {
          this._snackBar.open("Password Reset failed", "", {
            duration: 4000,
          });
        }
      });
    }
  }
  }
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
