import { Component, OnInit } from '@angular/core';
import { StateServiceService } from 'src/app/core/services/state-service.service';
import { MatDialogConfig, MatSnackBar, MatDialog } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { Router } from '@angular/router';
import { ForgetpasswordComponent } from '../../forgetpassword/forgetpassword.component';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userID:any = "";
  loginUserID = "";
  dateVal:any = "";
  constructor(private stateService: StateServiceService,private _snackBar: MatSnackBar,
    public baseService: BaseService, public dialog: MatDialog, private router: Router,
    private userService:UserService) { 
    let data:any = this.stateService.data;
    if(data){
      this.userID = data[0].UserName;
      this.loginUserID = data[0].UserID;
    }else{
      this.userID = "Axis User";
      this.loginUserID = "Axis User";
    }

    let date =  new Date().toDateString();
    this.dateVal = date ; //date.getDate()+"-"+(date.getMonth()+1)+date.getFullYear();
  }

  ngOnInit() {
  }

  onLogoutClick(){
    this.userService.logout();
  }

  onResetPassword(){
    //(click)="onResetPassword()"
    //routerLink='/main/forgetpassword'

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '60%';
    dialogConfig.height = '88%';
    dialogConfig.ariaLabel = "Password Reset";
    dialogConfig.position = {
      top: '50px',
      right: '50px'
    };
    dialogConfig.data = {
      UserID:this.loginUserID,
      UserName:this.userID
    }
    const dialogRef = this.dialog.open(ForgetpasswordComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
