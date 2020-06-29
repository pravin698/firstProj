import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { DeleteusermanagementdatapopupComponent } from '../deleteusermanagementdatapopup/deleteusermanagementdatapopup.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';
import { NewuserComponent } from '../newuser/newuser.component';
@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {
  userid: any;
  totalCount: any;
  pageSize:any = 10;
  fromCount: any = 1;
  toCount: any = 10;
  dataSource :any;
  searchCriteria:String = "";

  constructor(private _snackBar: MatSnackBar,public baseService: BaseService, public dialog: MatDialog, private router: Router) { }
  
  ngOnInit() {
    this.getUserDetailsDate();
  }

  toggleStatus(element){
    return element.lockstatus;
  }

  getDateRefresh(){
    this.getUserDetailsDate();
  }

  openDialogNewUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '80%';
    dialogConfig.ariaLabel = "User Create/Update";
    dialogConfig.position = {
      top: '50px',
      right: '20px'
    };
    dialogConfig.data = {
      title:"Create User"
    }
    const dialogRef = this.dialog.open(NewuserComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onSlideToggle(previousCheckState,row){
    let body: any  = {};
    body.userid = (row.userid).toString();
    body.lockstatus = previousCheckState ? 'true':'false';
    const headers =this.baseService.getHeaders();
    
    this.baseService._makeRequest(Url.lockUser,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res == 'Lock'){
        this._snackBar.open("User Lock request sent to Admin Checker", "", {
          duration: 2000,
        });
      }else if(res == 'UnLock'){
        this._snackBar.open("User UnLock request sent to Admin Checker", "", {
          duration: 2000,
        });
      }else if(res == 'StatusPending'){
        this._snackBar.open("A pending request exists for this User", "", {
          duration: 2000,
        });
      }else if(res == 'Failed'){
        this._snackBar.open("Lock/Un-lock failed", "", {
          duration: 2000,
        });
      }
      this.getUserDetailsDate();
    });
  }

  pageEvent(event){
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getUserDetailsDate();
  }

  displayedColumns: string[] = ['id','userid','userlevel', 'username', 'userEmail', 'mobilenumber', 'deleteAction', 'toggleAction'];
  
  onSearchCriteria(){
    this.getUserDetailsDate();
  }

  getUserDetailsDate(){
    const headers =this.baseService.getHeaders();

    let url = Url.getUserInfo+"?searchCriteria="+this.searchCriteria+"&fromCount="+this.fromCount+'&toCount='+this.toCount;

    this.baseService._makeRequest(url,
      {},
      'GET', {
      responseType: 'application/json',
      headers: headers
    }).subscribe((res:string) => {
      if(res){
        let userData = JSON.parse(res);
        if(userData){
          let userInfoList = userData[0];
          if(userInfoList){
            if(userInfoList.length > 0){
              let usersList = [];
              for(let i=0;i<userInfoList.length;i++){
                let userInfoEntry = userInfoList[i];
                if(userInfoEntry.userid != 'AdminMaker' && userInfoEntry.userid != 'AdminChecker'){
                  usersList.push({
                    'id': userInfoEntry.id,
                    'userid': userInfoEntry.userid,
                    'userType': userInfoEntry.usertype,
                    'userZone': userInfoEntry.zone,
                    'userState': userInfoEntry.state,
                    'userRegion': userInfoEntry.regions,
                    'userPD': userInfoEntry.pds,
                    'userCala': userInfoEntry.calas,
                    'userlevel': userInfoEntry.userlevel,
                    'userEmail': userInfoEntry.email,
                    'username': userInfoEntry.firstname +" "+userInfoEntry.lastname,
                    'mobilenumber': userInfoEntry.phonenumber,
                    'lockstatus': userInfoEntry.lockstatus == 'true' ? true : false,
                    'active':userInfoEntry.active == 'true' ? true : false,
                  });
                }
              }
              this.dataSource = usersList;
            }else{
              this.dataSource = [];
            }
          }

          this.totalCount = userData[1];
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {

    }
    const dialogRef = this.dialog.open(DeleteusermanagementdatapopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  OnSelectUser(userInfo) {
    //this.router.navigate(['/main/useraccount/:id', userid]);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.hasBackdrop = false;
    dialogConfig.width = '70%';
    dialogConfig.height = '80%';
    dialogConfig.ariaLabel = "User Create/Update";
    dialogConfig.position = {
      top: '50px',
      right: '20px'
    };
    dialogConfig.data = {
      title:"Update User",
      UserID:userInfo.userid,
      userData: userInfo
    }
    const dialogRef = this.dialog.open(NewuserComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  onActiveAction(event,row){
    let body: any  = {};
    body.userid = (row.userid).toString();
    body.activestatus = row.active ? 'false':'true';
    const headers =this.baseService.getHeaders();
    
    this.baseService._makeRequest(Url.userActiveStaus,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res == 'Activate'){
        this._snackBar.open("User Activate request sent to Admin Checker", "", {
          duration: 2000,
        });
      }else if(res == 'Inactivate'){
        this._snackBar.open("User Deactivated request sent to Admin Checker", "", {
          duration: 2000,
        });
      }else if(res == 'StatusPending'){
        this._snackBar.open("A pending request exists for this User", "", {
          duration: 2000,
        });
      }else if(res == 'Failed'){
        this._snackBar.open("User Active/Deactive failed", "", {
          duration: 2000,
        });
      }
      this.getUserDetailsDate();
    });
  }
  
}