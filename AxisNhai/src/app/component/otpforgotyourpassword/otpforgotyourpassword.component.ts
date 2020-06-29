import { Component, OnInit } from '@angular/core';
import { EnterotpforgotpasswordComponent } from '../enterotpforgotpassword/enterotpforgotpassword.component';
import { BaseService } from 'src/app/core/base.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { StateServiceService } from 'src/app/core/services/state-service.service';

@Component({
  selector: 'app-otpforgotyourpassword',
  templateUrl: './otpforgotyourpassword.component.html',
  styleUrls: ['./otpforgotyourpassword.component.scss']
})
export class OtpforgotyourpasswordComponent implements OnInit {
  entryVal: any = "";
 
  constructor(public baseService: BaseService, public dialog: MatDialog,private stateService: StateServiceService) { }

  ngOnInit() {
    let stateData = this.stateService.data;
    if(stateData){
      this.entryVal = stateData[0].forGotPassDetails;
    }
  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      targetVal : this.entryVal
    };
    const dialogRef = this.dialog.open(EnterotpforgotpasswordComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
}

