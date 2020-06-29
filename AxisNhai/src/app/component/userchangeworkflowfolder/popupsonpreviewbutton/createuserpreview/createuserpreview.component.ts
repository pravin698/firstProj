import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { HttpHeaders } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';

@Component({
  selector: 'app-createuserpreview',
  templateUrl: './createuserpreview.component.html',
  styleUrls: ['./createuserpreview.component.scss']
})
export class CreateuserpreviewComponent implements OnInit {
  public toggleButton: boolean = true;
  userid:any;
  recordId:any;
  action:any;
  comment:any=""; 
  displayedColumns: string[] = ['Fieldname', 'CurrentValue', 'NewValue'];
  dataSourcecreateuser:any;
  constructor(private _snackBar: MatSnackBar, public baseService: BaseService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,
    private dialogRef: MatDialogRef<CreateuserpreviewComponent>) {
    if (data) {
      this.userid = data.UserID;
      this.recordId = data.id;
      this.action = data.action;
    }
  }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails() {
    let body: any = {};
    const headers =this.baseService.getHeaders();
    body.userid = this.userid;
    this.baseService._makeRequest(Url.getStagingEntry,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res: string) => {
      let changeEntry = JSON.parse(res);
      if (changeEntry) {
        let stagingInfo = changeEntry[0];
        let masterInfo = changeEntry[1];
        let finalArray = new Array();
        
        if(stagingInfo){
          stagingInfo = stagingInfo[0];
          let k:any;
          for(k in stagingInfo){
            if(k != 'id' && k !="address" && k !="createddate" && k !="updateddate" && k !="address"
             && k !="userid" && k !="password" && k !="requestuuid" && k !="lockstatus" && k !="active" && k !="stagingstatus"
             && k !="refmasterid" ){
              let fieldName = this.getFieldName(k);
              let currVal = this.getCurrentValue(masterInfo,k);
              let newVal = this.getNewValue(stagingInfo,k);
              finalArray.push({
                'Fieldname':fieldName,
                'CurrentValue':currVal,
                'NewValue':newVal
              })
            }
          };          
        }
        this.dataSourcecreateuser = finalArray;

      }
    });
  }
  getCurrentValue(masterInfo,key) {
    let j:any,finalVal="";
    for(j in masterInfo){
      if(key == j){
        finalVal = masterInfo[j];
        if(j == "usertype"){
          if(finalVal == "nhai-1"){
            finalVal = "NHAI";
          }else{
            finalVal = "AXIS";
          }
        }else if(j == "userlevel"){
          
          if(finalVal == "head-0"){
            finalVal = "Head Office";
          }else if(finalVal == "zone-1"){
            finalVal = "Zone";
          }else if(finalVal == "state-2"){
            finalVal = "State";
          }else if(finalVal == "region-3"){
            finalVal = "Regional Office";
          }else if(finalVal == "pd-4"){
            finalVal = "Project Directors";
          }else if(finalVal == "cala-5"){
            finalVal = "CALA";
          }
        }
      }
    }
    return finalVal;
  }
  getNewValue(stagingInfo,k) {
    let newVal:any = "";
    if(stagingInfo){
      newVal = stagingInfo[k];
      if(k == "usertype"){
        if(newVal == "nhai-1"){
          newVal = "NHAI";
        }else{
          newVal = "AXIS";
        }
      }else if(k == "userlevel"){
        
        if(newVal == "head-0"){
          newVal = "Head Office";
        }else if(newVal == "zone-1"){
          newVal = "Zone";
        }else if(newVal == "state-2"){
          newVal = "State";
        }else if(newVal == "region-3"){
          newVal = "Regional Office";
        }else if(newVal == "pd-4"){
          newVal = "Project Directors";
        }else if(newVal == "cala-5"){
          newVal = "CALA";
        }
      }
    }
    return newVal;
  }
  getFieldName(k: any) {
    if(k == 'usertype'){
      return "UserType";
    }else if(k == 'userlevel'){
      return "UserLevel";
    }else if(k == 'zone'){
      return "Zone";
    }else if(k == 'state'){
      return "State";
    }else if(k == 'regions'){
      return "Regional Office";
    }else if(k == 'pds'){
      return "Project Director";
    }else if(k == 'calas'){
      return "CALA Account";
    }else if(k == 'firstname'){
      return "Firstname";
    }else if(k == 'lastname'){
      return "Lastname";
    }else if(k == 'email'){
      return "Email";
    }else if(k == 'phonenumber'){
      return "Phonenumber";
    }
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
