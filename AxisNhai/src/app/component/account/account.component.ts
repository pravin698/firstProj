import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LimitlewdgerComponent } from '../limitlewdger/limitlewdger.component';
import { TotallimitsComponent } from '../totallimits/totallimits.component';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material/table';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import xml2js from 'xml2js';
import * as _ from 'lodash'; 
import { Url } from 'src/app/core/services/url';
import { Constants } from 'src/app/core/services/constants';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  accountParsedArr: any;
  radioValue1:string;
  radioValue2:string;
  totalCount:any;
  //dataSource = new MatTableDataSource;
  dateValue:any;
  pageSize:any = 10;
  fromCount = 1;
  toCount = 10;
  searchValue:any="";

  constructor(public dialog: MatDialog, public baseService: BaseService, public http: HttpClient) { 
    this.radioValue1 = "Account Number";
    this.radioValue2 = "Amount in Rupees";
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }

  displayedColumns: string[] = ['no', 'AccountOpenDate', 'lastOperatinDate', 'NoOfdayssincelastTransaction', 'AccountID', 'AccountName', 'TotalLimit', 'UsedLimit', 'NoofdaysinceAccountopned', 'FundsUsed', 'BalanceLimit', 'AccountBalance'];
 
  onRefreshClick(){
    this.getXmlDataForAccountsOnInit();
  }

  onExcelDownloadClick(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    var actNumber = '', actName = '';
    let finalVal = '';
    let date = this.dateValue;
    if(date){
      finalVal = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }
    
    if(this.radioValue1){
      if (this.radioValue1 == Constants.actNumber) {
        actNumber = this.searchValue;
      } else {
        actName = this.searchValue;
      }
    } 

    let tailString =  "?RequestUUID="+requestUUID+"&MessageDateTime="+messageDateTime+
                      "&ActNum="+actNumber+"&ActName="+actName+"&fromCount=1"+
                      "&toCount="+this.toCount+"&actDate="+finalVal;

    let url =Url.accountSummaryDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');
  }

  openDialoglimitlewdger(accountNumber?:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      actNumber:accountNumber
    }
    const dialogRef = this.dialog.open(LimitlewdgerComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDailogtotallimit(accountNumber?:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      actNumber:accountNumber
    }
    const dialogRef = this.dialog.open(TotallimitsComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  private getXmlDataForAccountsOnInit(value?:any, radioBtnValue1?:any, date?:any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    var actNumber = '', actName = '';
    let finalVal = '';
    let dateVal = this.dateValue;
    if(date){
      finalVal = dateVal.getDate() + '-' + (dateVal.getMonth() + 1) + '-' + dateVal.getFullYear();
    }
    
    if(this.radioValue1){
      if (this.radioValue1 == Constants.actNumber) {
        actNumber = this.searchValue;
      } else {
        actName = this.searchValue;
      }
    } 

    body.AcctName = actName;
    body.AcctNum = actNumber;
    body.Acct_opn_date = finalVal;
    body.From_count = (this.fromCount).toString();
    body.To_count = (this.toCount).toString();

    this.baseService._makeRequest(Url.accountsXmlUrl, 
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.accountParsedArr = parseData;
        this.totalCount = this.getTotalCount(this.accountParsedArr);
        this.accountParsedArr = this.accountParsedArr.filter((data) => { return (data['no'] != undefined); });
       // this.dataSource.data = this.accountParsedArr;
        let value = this.radioValue2;
        this.accountParsedArr.forEach((data)=>{
          if(data.AcctBal){
            if(value == "Amount in Rupees"){
              data.AcctBal = (data.AcctBal)
            }else{
              data.AcctBal = ((data.AcctBal)/10000000)
            }
          }
        })

        this.accountParsedArr.forEach((data) => {
          if (data.TotalLimitGrantAmt) {
            if (value == "Amount in Rupees") {
              data.TotalLimitGrantAmt = (data.TotalLimitGrantAmt)
            } else {
              data.TotalLimitGrantAmt = ((data.TotalLimitGrantAmt) / 10000000)
            }
          }
        });

        this.accountParsedArr.forEach((data) => {
          if (data.UtilisedLimit) {
            if (value == "Amount in Rupees") {
              data.UtilisedLimit = (data.UtilisedLimit)
            } else {
              data.UtilisedLimit = ((data.UtilisedLimit) / 10000000)
            }
          }
        });

        this.accountParsedArr.forEach((data) => {
          if (data.BalanceLimit) {
            if (value == "Amount in Rupees") {
              data.BalanceLimit = (data.BalanceLimit)
            } else {
              data.BalanceLimit = ((data.BalanceLimit) / 10000000)
            }
          }
        });
        
      });
    });
  }

  getTotalCount(accountParsedArr){
    let totalCount = 0;
    for(let i =0 ;i<accountParsedArr.length;i++){
      let actItem = accountParsedArr[i];
      if(actItem.TotalCoun != undefined){
        totalCount =  actItem.TotalCoun;
        break;
      }
    }
    return totalCount;
  }
  // parse the XML data
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        for (k in obj) {
          const id = k.split(/([0-9]+)/)[1];
          const item = k.split(/([0-9]+)/).filter(Boolean)[0].slice(0, -1);
          if (itemArr.length > 0) {
            const index = _.findIndex(itemArr, { no: id });
            if (index == -1) {
              itemArr.push({ [`${item}`]: obj[k][0], no: id });
            } else {
              if ((item == "ACCT_OPN_DATE") || (item == "LAST_TRAN_DATE")) {
                if ((obj[k][0]) == "NA") {
                  obj[k][0] = "--"
                }
              }
              itemArr[index][item] = obj[k][0]
            }
          }
          else {
            itemArr.push({ [`${item}`]: obj[k][0], no: id });
          }
        }
        resolve(itemArr);
      });
    });
  }

    // search method with input
  onSearch(value?:any, radioBtnValue1?:any, date?:any) {
    this.getXmlDataForAccountsOnInit(value, radioBtnValue1,date);
  }

  onItemChange(value?:any){
    this.getXmlDataForAccountsOnInit();
  }

  // on submit the date
  onSubmit(value, radioBtnValue1,date){
    this.onSearch(value, radioBtnValue1,date);
  }

  pageEvent(event,searchValue,radioValue1,dateValue){
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getXmlDataForAccountsOnInit(searchValue,radioValue1,dateValue);
  }
}