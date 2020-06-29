import { Component, OnInit } from '@angular/core';
import { EnterotpforgotusernameComponent } from '../enterotpforgotusername/enterotpforgotusername.component';
import { BaseService } from 'src/app/core/base.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { StateServiceService } from 'src/app/core/services/state-service.service';

@Component({
  selector: 'app-otpforgotyourusername',
  templateUrl: './otpforgotyourusername.component.html',
  styleUrls: ['./otpforgotyourusername.component.scss']
})
export class OtpforgotyourusernameComponent implements OnInit {

  entryVal:any="";

  constructor(public baseService: BaseService, public dialog: MatDialog,private stateService: StateServiceService) { }

  ngOnInit() {
    let stateData = this.stateService.data;
    if(stateData){
      this.entryVal = stateData[0].forGotUserDetails;
    }
  }


  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      targetVal : this.entryVal
    };
    
    const dialogRef = this.dialog.open(EnterotpforgotusernameComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
