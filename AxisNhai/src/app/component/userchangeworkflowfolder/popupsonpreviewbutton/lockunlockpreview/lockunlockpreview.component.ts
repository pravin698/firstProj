import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-lockunlockpreview',
  templateUrl: './lockunlockpreview.component.html',
  styleUrls: ['./lockunlockpreview.component.scss']
})
export class LockunlockpreviewComponent implements OnInit {  
  displayedColumns: string[] = ['userid', 'action'];
  dataSourcelockunlock:any;
  userid:any;
  recordId:any;
  action:any;
  comment:any="";
  constructor(private _snackBar: MatSnackBar, public baseService: BaseService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<LockunlockpreviewComponent>) {
      if(data){
        this.userid = data.UserID;
        this.recordId = data.id;
        this.action = data.action;

        this.dataSourcelockunlock = [{'userid':this.userid,'action':"Approve To "+this.action+" User."}];
      }
  }

  ngOnInit() {

  }

  OnApprove(){
    this.sendResponse("Approved");
  }

  Onreject() {
    if(this.comment == "" || this.comment.lenght < 10){
      this._snackBar.open("Give text is not meeting with the requirement", "", {
        duration: 5000,
      });
    }else{
      this.sendResponse("Rejected");
    }
  }
  sendResponse(state: string) {

    let body: any = {};
    body.id = (this.recordId).toString();
    body.userid = this.userid;
    body.response = state;
    body.comment = this.comment;

    const headers =this.baseService.getHeaders();
    
    this.baseService._makeRequest(Url.checkerResponse,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res == 'Success'){
        this._snackBar.open("Review Successful", "", {
          duration: 4000,
        });        
      } else if (res == 'PhoneNumberExists') {
        this._snackBar.open("Phone number already exists within the system", "", {
          duration: 5000,
        });
      } else if (res == 'EmailExists') {
        this._snackBar.open("Email already exists within the system", "", {
          duration: 5000,
        });
      }else{
        this._snackBar.open("Review operation failed", "", {
          duration: 4000,
        });
      }
      this.dialogRef.close('refresh');
    });
  }
}