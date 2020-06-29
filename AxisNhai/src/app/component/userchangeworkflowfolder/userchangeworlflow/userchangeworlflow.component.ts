import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { LockunlockpreviewComponent } from '../popupsonpreviewbutton/lockunlockpreview/lockunlockpreview.component';

import { CreateuserpreviewComponent } from '../popupsonpreviewbutton/createuserpreview/createuserpreview.component';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';

@Component({
  selector: 'app-userchangeworlflow',
  templateUrl: './userchangeworlflow.component.html',
  styleUrls: ['./userchangeworlflow.component.scss']
})
export class UserchangeworlflowComponent implements OnInit {
  pageSize: any = 10;
  fromCount = 1;
  toCount = 10;
  totalCount: any;
  action: any = '';
  userid: any = '';
  dataSources: any;
  searchCriteria:String="";

  displayedColumns: string[] = ['userid', 'action', 'status', 'comment','buttons'];

  constructor(private _snackBar: MatSnackBar, public baseService: BaseService,
    public dialog: MatDialog, private router: Router) {

  }

  ngOnInit() {
    this.getUserWorkFlowDetails();
  }

  getStatus(row){
    if(row.status == "Approved" || row.status == "Rejected"){
      return true;
    }else{
      return false;
    }
  }
  getDateRefresh(){
    this.getUserWorkFlowDetails();
  }

  pageEvent(event){
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getUserWorkFlowDetails();
  }

  onSearchCriteria(){
    this.getUserWorkFlowDetails();
  }

  getUserWorkFlowDetails() {
    let body: any = {};
    const headers =this.baseService.getHeaders();
    
    let url = Url.getUserWorkflowDetails+"?searchCriteria="+this.searchCriteria+"&fromCount="+this.fromCount+"&toCount="+this.toCount;
    this.baseService._makeRequest(url,
      body,
      'GET', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res: string) => {
      let changeEntry = JSON.parse(res);
      if(changeEntry){
        this.dataSources = changeEntry[0];
        this.totalCount = changeEntry[1];
      }
    });
  }

  openDialogpreview(row) {
    let action = row.action;
    var dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      UserID: row.userid,
      id: row.id,
      action:action
    }
    var dailogref: any;

    switch (action) {
      case "Lock":
        dailogref = this.dialog.open(LockunlockpreviewComponent, dialogConfig);
        dailogref.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
      case "UnLock":
        dailogref = this.dialog.open(LockunlockpreviewComponent, dialogConfig);
        dailogref.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
      case "Activate":
        dailogref = this.dialog.open(LockunlockpreviewComponent, dialogConfig);
        dailogref.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
      case "Inactivate":
        dailogref = this.dialog.open(LockunlockpreviewComponent, dialogConfig);
        dailogref.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
      case "CreateUser":
        var dialogRef1 = this.dialog.open(CreateuserpreviewComponent, dialogConfig);
        dialogRef1.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
      case "EditUser":
        dialogRef1 = this.dialog.open(CreateuserpreviewComponent, dialogConfig);
        dialogRef1.afterClosed().subscribe(result => {
          this.getUserWorkFlowDetails();
        });
        break;
    }
  }
}
