import { Component, OnInit } from '@angular/core';
import { StateServiceService } from 'src/app/core/services/state-service.service';
import { MatDialogConfig, MatSnackBar, MatDialog } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { Router } from '@angular/router';
import { ForgetpasswordComponent } from 'src/app/component/forgetpassword/forgetpassword.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(private stateService: StateServiceService,private _snackBar: MatSnackBar,
    public baseService: BaseService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    let stateData:any = this.stateService.data;
    if(stateData != undefined){
      stateData = stateData[0];
      let firstLogin = stateData.FirstLogin;
      if(firstLogin == "true"){
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
            UserID:stateData.UserID,
            UserName:stateData.UserName
          }
        const dialogRef = this.dialog.open(ForgetpasswordComponent,dialogConfig);
        dialogRef.afterClosed().subscribe(result => {

        });
      }
    }
  }

}
