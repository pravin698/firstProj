import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { BaseService } from 'src/app/core/base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { Url } from 'src/app/core/services/url';
import { PdfDownloadService } from 'src/app/services/pdf-download.service';
@Component({
  selector: 'app-financialsummarry',
  templateUrl: './financialsummarry.component.html',
  styleUrls: ['./financialsummarry.component.scss']
})
export class FinancialsummarryComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  dataSources: any;
  dataSource: any;
  datas: any;
  radioValue1: string;
  radioValue2: string;

  constructor(
    public baseService: BaseService, public http: HttpClient, private pdfService: PdfDownloadService
  ) {
    this.radioValue1 = "Account Number";
    this.radioValue2 = "Amount in Rupees";
    this.onItemChange(this.radioValue2);
  }

  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }

  onRefreshClick() {
    this.getXmlDataForAccountsOnInit();
  }

  onExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.financialSummaryDownload+'?RequestUUID='+requestUUID+'&MessageDateTime='+messageDateTime;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getXmlDataForAccountsOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    
    this.baseService._makeRequest(Url.financilalsummaryXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.dataSources = parseData;

          let value = this.radioValue2;
          this.dataSources.forEach((data) => {
            if (data.amount) {
              if (value == "Amount in Rupees") {
                data.amount = (data.amount)
              } else {
                data.amount = ((data.amount) / 10000000)
              }
            }
          })
        })

        this.parseXMLSummary(res).then((parseDataSummary) => {
          this.dataSource = parseDataSummary;

          let value = this.radioValue2;
          this.dataSource.forEach((data) => {
            if (data.amount) {
              if (value == "Amount in Rupees") {
                data.amount = (data.amount)
              } else {
                data.amount = ((data.amount) / 10000000)
              }
            }
          })
        })

        this.parseXMLDisbursement(res).then((parseDataDisbursement) => {
          this.datas = parseDataDisbursement;

          let value = this.radioValue2;
          this.datas.forEach((data) => {
            if (data.amount) {
              if (value == "Amount in Rupees") {
                data.amount = (data.amount)
              } else {
                data.amount = ((data.amount) / 10000000)
              }
            }
          })
        });
      });
  }
  // parse the XML data for Deposit Grid
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([1-9]+)/)[1];

          if (k == 'F01CumulativeDeposit') {
            arra.push({ no: id, deposit: 'Cumulative Deposit(YTD)', amount: obj[k][0] })
          }
          if (k == 'F02InterestCredited') {
            arra.push({ no: id, deposit: 'Interest Credited(YTD)', amount: obj[k][0] })
          }
          if (k == 'F03TotalBalance') {
            arra.push({ no: id, deposit: 'Total Balance(1+2)', amount: obj[k][0] })
          }
        }
        //console.log("arr:", itemArr)
        resolve(arra);
      });
    });
  }

  // parse the XML data for Summary Grid
  parseXMLSummary(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([0-9]+)/)[1];

          if (k == 'F08SABalance') {
            arra.push({ no: id, summary: 'Central a/c Balance', amount: obj[k][0] })
          }
          if (k == 'F09CumLimAssigned') {
            arra.push({ no: id, summary: 'Cumulative Limits Assigned', amount: obj[k][0] })
          }
          if (k == 'F10CreditReceived') {
            arra.push({ no: id, summary: 'Credit Received/Return Credit in PD account', amount: obj[k][0] })
          }
          if (k == 'F11BalLimToBeAssigned') {
            arra.push({ no: id, summary: 'Balance Limits to be assigned(1-9)', amount: obj[k][0] })
          }
          if (k == 'F12InterestAccrued') {
            arra.push({ no: id, summary: 'Interest Accured Till Now', amount: obj[k][0] })
          }
          if (k == 'F13CreditException') {
            arra.push({ no: id, summary: 'Exception Credits', amount: obj[k][0] })
          }
        }
        //console.log("arr:", itemArr)
        resolve(arra);
      });
    });
  }

  // parse the XML data for Disbursement Grid
  parseXMLDisbursement(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([1-9]+)/)[1];

          if (k == 'F04CumulativeDisb') {
            arra.push({ no: id, disbursement: 'Cumulative Disbursement', amount: obj[k][0] })
          }
          if (k == 'F04APaidToBene') {
            arra.push({ no: '4A', disbursement: 'Paid to Beneficiary', amount: obj[k][0] })
          }
          if (k == 'F04BAdminExpense') {
            arra.push({ no: '4B', disbursement: 'Paid to Admin Expenses', amount: obj[k][0] })
          }
          if (k == 'F04CPaidForTDS') {
            arra.push({ no: '4C', disbursement: 'Paid for TDS', amount: obj[k][0] })
          }
          if (k == 'F04DOtherDebit') {
            arra.push({ no: '4D', disbursement: 'Other Debits/Exception Debits', amount: obj[k][0] })
          }
          if (k == 'F05InterestTrf') {
            arra.push({ no: id, disbursement: 'Interest Transfer', amount: obj[k][0] })
          }
          if (k == 'F06LastDayRtnTran') {
            arra.push({ no: id, disbursement: 'Last Day Returns Transaction', amount: obj[k][0] })
          }
          if (k == 'F07TotalBalance') {
            arra.push({ no: id, disbursement: 'Net Cumulative Disbursements(4+5)', amount: obj[k][0] })
          }
        }
        //console.log("arr:", itemArr)
        resolve(arra);
      });
    });
  }

  displayedColumns: string[] = ['no', 'deposit', 'amount'];
  //dataSources = ELEMENT_DATA;
  displayedColumn: string[] = ['no', 'summary', 'amount'];
  //dataSource = ELEMENT;
  displayed: string[] = ['no', 'disbursement', 'amount'];
  //data = ELE;

  onItemChange(value?: any) {
    //this.radioValue2 = value;
    this.getXmlDataForAccountsOnInit();
  }

  onPDFDownload(){
    this.pdfService.downloadPDF(this.content.nativeElement);
  }
}