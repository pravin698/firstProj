import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatSnackBar } from '@angular/material';
import { PdfDownloadService } from 'src/app/services/pdf-download.service';
@Component({
  selector: 'app-homebackdated',
  templateUrl: './homebackdated.component.html',
  styleUrls: ['./homebackdated.component.scss']
})
export class HomebackdatedComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  homeParsedArr: any;
  dataSource: any;
  dataSources: any;
  finDataSource: any;
  accountParsedArr: any;
  radioValue1: string;
  radioValue2: string;
  dateValueForSearch: any;
  fromdate: any;
  todate:any;
  displayedColumns: string[] = ['heads', 'amount'];
  displayedColumn: string[] = ['accounttype', 'totalcount'];
  findisplayedColumns: string[] = ['no', 'finYear', 'LimitGrantAmt', 'UtilisedLimit', 'UnutilizedLimit', 'TotalInterestPaidInterest', 'TotalCount'];
  currentDate: Date = new Date();
  yesterdayDate: Date = new Date();

  constructor(private _snackBar: MatSnackBar,public baseService: BaseService, public http: HttpClient, private pdfService: PdfDownloadService) {
    this.radioValue1 = "Account Number";
    this.radioValue2 = "Amount in Rupees";
  }

  ngOnInit() {
    this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1);
    this.fromdate = this.yesterdayDate;
    this.getXmlDataForAccountsOnInit();
  }

  onRefreshClick(value?: any) {
    this.getXmlDataForAccountsOnInit();
  }

  onItemChange(value?: any) {
    this.getXmlDataForAccountsOnInit();
  }

  onExcelDownloadClick(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;

    // let isValid = this.fromDateToDateValidation(this.fromdate,this.todate);
    // if(!isValid){
    //   return;
    // }

    let fromDate = this.fromdate;
    if (fromDate == undefined) {
      fromDate = new Date();
      fromDate = fromDate.setDate(fromDate.getDate() - 1);
      fromDate = new Date(fromDate);
    }

    let finalVal = "",toDateValue="";
    if (fromDate) {
      finalVal = fromDate.getDate() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getFullYear();
      toDateValue = finalVal;
    }

    let url =Url.homeBackDatedDetailsDownload+'?requestUUID='+requestUUID+'&messageDateTime='+messageDateTime+'&fromDate='+finalVal+'&toDate='+toDateValue;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false'); 
  }
  // on search
  onSearch(date) {
    this.getXmlDataForAccountsOnInit();
  }

  fromDateToDateValidation(fromDate:Date,toDate:Date){
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
    return true;
  }

  getXmlDataForAccountsOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    // let isValid = this.fromDateToDateValidation(this.fromdate,this.todate);
    // if(!isValid){
    //   return;
    // }
    let fromDate = this.fromdate;
    let toDate = this.todate;
    if (fromDate == undefined) {
      fromDate = new Date();
      fromDate = fromDate.setDate(fromDate.getDate() - 1);
      fromDate = new Date(fromDate);
    }

    let finalVal = "",toDateValue="";
    if (fromDate) {
      finalVal = fromDate.getDate() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getFullYear();
      toDateValue = finalVal;
    }
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.From_date = finalVal;
    body.To_date = toDateValue;

    this.baseService._makeRequest(Url.homeBackdatedUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXMLHeads(res).then((parseData) => {
          this.dataSource = parseData;
          let value = this.radioValue2;
          this.dataSource.forEach((data) => {
            if (data.amount) {
              if (value == "Amount in Rupees") {
                data.amount = (data.amount)
              } else {
                if(data.heads != "Limit Utilization (%)"){
                  data.amount = ((data.amount) / 10000000);
                }
              }
            }
          })
        });

        this.parseXMLAccountType(res).then((parseDatas) => {
          this.dataSources = parseDatas;
        });

        this.parseXMLFinancialYearHeads(res, this.radioValue2).then((parseData) => {
          this.finDataSource = parseData;
          let value = this.radioValue2;
          this.finDataSource.forEach((data) => {
            if (data.LimitGrantAmt && data.UtilisedLimit && data.UnutilizedLimit && data.TotalInterestPaidInterest !== 'null') {
              if (value == "Amount in Rupees") {
                data.LimitGrantAmt = (data.LimitGrantAmt);
                data.UtilisedLimit = (data.UtilisedLimit);
                data.UnutilizedLimit = (data.UnutilizedLimit);
                data.TotalInterestPaidInterest = (data.TotalInterestPaidInterest);

              } else {
                data.LimitGrantAmt = ((data.LimitGrantAmt) / 10000000);
                data.UtilisedLimit = ((data.UtilisedLimit) / 10000000);
                data.UnutilizedLimit = ((data.UnutilizedLimit) / 10000000);
                data.TotalInterestPaidInterest = ((data.TotalInterestPaidInterest) / 10000000);
              }
            }
          })
        });
      });
  }

  radioChangeHandler(event: any) {
    this.displayedColumns = event.target.value;
  }

  // parse the XML Heads table for backdated
  parseXMLHeads(data) {
    return new Promise(resolve => {
      var k: string | number,
          a: string | number,
          parser = new xml2js.Parser({
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        let arra = [];

        let grantAmount=0,utilizedAmt=0;
        for(a in obj){
          if (k == 'LimitGrantAmt') {
            grantAmount = obj[k][0];
          }
          if (k == 'UtilisedLimit') {
            utilizedAmt = obj[k][0];
          }
        }

        for (k in obj) {

          if (k == 'effAvailableAmt') {
            arra.push({ heads: 'Central Account Balance', amount: obj[k][0] })
          }
          if (k == 'LimitGrantAmt') {
            arra.push({ heads: 'Allocated Limits', amount: obj[k][0] })
          }
          if (k == 'UtilisedLimit') {
            arra.push({ heads: 'Utilized Limits', amount: obj[k][0] })
          }
          if (k == 'UnutilizedLimit') {
            arra.push({ heads: 'Un-Utilized Limit', amount: obj[k][0] })
          }
          if(k == 'LimitUtilization'){
            let value = obj[k][0];
            if (obj[k][0] == "No Records Found") {
              if(grantAmount == 0){
                grantAmount = 1;
              }
              value = (utilizedAmt/grantAmount)*100;
            }
            arra.push({ heads: 'Limit Utilization (%)', amount: value })
          }
          if (k == 'AccruedInterest') {
            let value = obj[k][0];
            if (obj[k][0] == "No Records Found") {
              value = 0;
            }
            arra.push({ heads: 'Quarter to Date-Accrued Interest', amount: value })
          }
          if (k == 'TotalInterestPaidInterest') {
            arra.push({ heads: 'Actual Interest', amount: obj[k][0] })
          }
          if (k == 'PendingAdjustments') {
            arra.push({ heads: 'Pending Adjustments', amount: obj[k][0] })
          }
        }
        resolve(arra);
      });
    });
  }


  // parse the XML AccountType table for backdated
  parseXMLAccountType(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });

      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        let accounttype = [];

        for (a in obj) {
          if (a == 'TotalCount') {
            accounttype.push({ accounttype: 'Number of Subsidiary Accounts', totalcount: obj[a][0] })
          }
        }
        resolve(accounttype);
      });
    });
  }

  /**
   * This method is to prepare the financial year wise resutls
   */
  parseXMLFinancialYearHeads(data, convAmoutVal) {
    return new Promise(resolve => {
      var k: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });

      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        let arra = [];
        let year = '';
        let finYear: any = {};
        let count = 0;
        for (k in obj) {
          if (k != 'effAvailableAmt' && k != 'LimitGrantAmt' && k != 'UtilisedLimit'
            && k != 'UnutilizedLimit' && k != 'LimitUtilization' && k != 'AccruedInterest' && k != 'TotalInterestPaidInterest'
            && k != 'PendingAdjustments' && k != 'TotalCount') {
            if (k.substr(0, 2) == 'FY') {
              year = k.substr(2, 4);
              if (Object.keys(finYear).length != 0) {
                arra.push(finYear);
                finYear = {};
              }
              count = count + 1
              finYear.no = count;
              finYear.finYear = obj[k][0];
            } else {
              let amount = obj[k][0];
              if (k == 'LimitGrantAmt' + year) {
                finYear.LimitGrantAmt = amount;
              } else if (k == 'UtilisedLimit' + year) {
                finYear.UtilisedLimit = amount;
              } else if (k == 'UnutilizedLimit' + year) {
                finYear.UnutilizedLimit = amount;
              } else if (k == 'TotalInterestPaidInterest' + year) {
                finYear.TotalInterestPaidInterest = amount;
              }
              else if (k == 'TotalCount' + year) {
                finYear.TotalCount = amount;
              }
            }
          }
        }
        arra.push(finYear);
        resolve(arra);
      });
    });
  }

  onPDFDownload(){
    this.pdfService.downloadPDF(this.content.nativeElement);
  }
}

