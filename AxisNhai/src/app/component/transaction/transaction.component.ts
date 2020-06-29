import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  radioValue1: string;
  radioValuecurrency1: string;
  accountParsedArr: any;
  radioValue2: string;
  totalCount: any;
  pageSize: any;
  fromCount = 1;
  toCount = 10;
  accountnumber:any="";
  fromdate:any;
  todate:any;
  transactiondate:any;
  constructor(private _snackBar: MatSnackBar,public baseService: BaseService) {
    this.radioValue1 = "Account Number";
    this.radioValuecurrency1 = "Amount in Rupees";
    this.pageSize = 10;
  }
  datasources: any;
  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  ngOnInit() {
    this.getXmlDataAccounttransactionOnInit();
  }

  onRefreshClick(){
    this.getXmlDataAccounttransactionOnInit();
  }
  onItemChange(value?: any) {
    this.getXmlDataAccounttransactionOnInit();
  }

  onSearchclick(serachcriteria, accountno, fromvalue, tovalue, transacionday) {
    this.getXmlDataAccounttransactionOnInit(serachcriteria, accountno, fromvalue, tovalue, transacionday);
  }

  onExcelDownloadClick(){
    let isValid = this.fromDateToDateValidation(this.fromdate,this.todate);
    if(!isValid){
      return;
    }
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
  
    let finalVal = '';
    if (this.fromdate) {
      finalVal = this.fromdate.getDate() + '-' + (this.fromdate.getMonth()+1) + '-' + this.fromdate.getFullYear();
    }

    let finalValforodate = '';
    if (this.todate) {
      finalValforodate = this.todate.getDate() + '-' + (this.todate.getMonth()+1) + '-' + this.todate.getFullYear();
    }

    let finalValtransactiondate = '';
    if (this.transactiondate) {
      finalValtransactiondate = this.transactiondate.getDate() + '-' + (this.transactiondate.getMonth()+1) + '-' + this.transactiondate.getFullYear();
    }

    var fromdate = finalVal;
    var todate = finalValforodate;
    var accountnumber = this.accountnumber;
    var aco="", frmdate="", tod="";
    if (this.radioValue1 == "Account Number") {
      if(this.accountnumber == undefined || this.accountnumber == ""){
        accountnumber = "";
      }
      aco = accountnumber.toString();
    }else if (this.radioValue1 == "from date") {
      frmdate = fromdate;
      tod = todate;
    }else if (this.radioValue1 == "account transaction") {
      frmdate = finalValtransactiondate;
      tod = finalValtransactiondate;
    }

    let tailString =  "?requestUUID="+requestUUID+"&messageDateTime="+messageDateTime+
                      "&accountId="+aco+"&fromDate="+frmdate+"&toDate="+tod+
                      "&FromCount=1"+"&ToCount="+this.toCount;

    let url =Url.transactionSummaryDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');
  }

  pageEvent(event,accountnumber,fromdate,todate,transactiondate){
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getXmlDataAccounttransactionOnInit(accountnumber,fromdate,todate,transactiondate);
  }

  fromDateToDateValidation(fromDate:Date,toDate:Date){
    if (this.radioValue1 == "from date") {
      if(fromDate != undefined){
        if(toDate != undefined){
          if(fromDate > toDate){
            this._snackBar.open("Please ensure that the End Date is greater than or equal to the Start Date", "", {
              duration: 4000,
            });
            return false;
          }
        }else{
          this._snackBar.open("Please give To Date", "", {
            duration: 4000,
          });
          return false;
        }
      }

      if(toDate != undefined){
        if(fromDate != undefined){
          if(fromDate > toDate){
            this._snackBar.open("Please ensure that the End Date is greater than or equal to the Start Date", "", {
              duration: 4000,
            });
            return false;
          }
        }else{
          this._snackBar.open("Please give From Date", "", {
            duration: 4000,
          });
          return false;
        }
      }
    }
    return true;
  }

  
  private getXmlDataAccounttransactionOnInit(serachcriteria?:any, accountno?:any, fromvalue?:any, tovalue?:any, transacionday?:any,date?:any) {
    
    let isValid = this.fromDateToDateValidation(this.fromdate,this.todate);
    if(!isValid){
      return;
    }

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let finalVal = '';
    if (this.fromdate) {
      finalVal = this.fromdate.getDate() + '-' + (this.fromdate.getMonth()+1) + '-' + this.fromdate.getFullYear();
    }

    let finalValforodate = '';
    if (this.todate) {
      finalValforodate = this.todate.getDate() + '-' + (this.todate.getMonth()+1) + '-' + this.todate.getFullYear();
    }

    let finalValtransactiondate = '';
    if (this.transactiondate) {
      finalValtransactiondate = this.transactiondate.getDate() + '-' + (this.transactiondate.getMonth()+1) + '-' + this.transactiondate.getFullYear();
    }

    var fromdate = finalVal;
    var todate = finalValforodate;
    var accountnumber = this.accountnumber;
    var aco='', frmdate="", tod="";
    if (this.radioValue1 == "Account Number") {
      if(accountnumber == undefined){
        accountnumber = '';
      }
      aco = accountnumber;
    }else if (this.radioValue1 == "from date") {
      frmdate = fromdate;
      tod = todate;
    }else if (this.radioValue1 == "account transaction") {
      frmdate = finalValtransactiondate;
      tod = finalValtransactiondate;
    }
    body.AccountNumber = (aco).toString();
    body.FromDate = frmdate;
    body.ToDate = tod;
    body.FromCount = (this.fromCount).toString();
    body.ToCount = (this.toCount).toString();

    const headers =this.baseService.getHeaders();

    this.baseService._makeRequest(Url.accounttransactionsXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.accountParsedArr = parseData[0];
          if (this.radioValuecurrency1 == "Amount in Crores") {
            this.accountParsedArr.forEach((data) => {
              if (data.AMOUNT) {
                data.AMOUNT = ((data.AMOUNT) / 10000000)
              }

              if (data.RUNING_BALANCE) {
                data.RUNING_BALANCE = ((data.RUNING_BALANCE) / 10000000)
              }
            })
            parseData = this.accountParsedArr;
          }

          //this.dataSource = this.accountParsedArr;
          this.dataSource.data = this.accountParsedArr;
          this.totalCount = parseData[1];
        })
      })
  }
  
  displayedColumns: string[] = ['REC_CNT', 'ACCOUNT_NUMBER', 'ACCOUNT_NAME', 'ACCOUNT_OPEN_DATE', 'TRAN_DATE', 'DR_CR_IND', 'AMOUNT', 'BENEFICIARY_NAME', 'BENEFICIARY_BANK_ACCT', 'IFSI_CODE', 'UTR', 'RUNING_BALANCE'];
  //dataSources =new MatTableDataSource <PeriodicElement>(ELEMENT_DATA);


  // parse the XML data
  parseXML(data) {

    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });

      parser.parseString(data, function (err, result) {

        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        var totalcount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].TotRecCnt[0];
        let arra = [];
        let subTransaction = arr.SubsidiaryTransaction;
        subTransaction.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });
        let resolvedArr = [arra, totalcount]
        resolve(resolvedArr);
      });
    });
  }
}
