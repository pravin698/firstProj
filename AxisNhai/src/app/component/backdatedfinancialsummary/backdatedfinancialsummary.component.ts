import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { PdfDownloadService } from 'src/app/services/pdf-download.service';

@Component({
  selector: 'app-backdatedfinancialsummary',
  templateUrl: './backdatedfinancialsummary.component.html',
  styleUrls: ['./backdatedfinancialsummary.component.scss']
})
export class BackdatedfinancialsummaryComponent implements OnInit {
  @ViewChild('content', {static: false}) content: ElementRef;
  dataSources: any;
  dataSource: any;
  data: any;
  backdatedValue: any;
  finBackAmtConv: string;
  constructor(
    public baseService: BaseService, public http: HttpClient, private pdfService: PdfDownloadService
  ) { 
    this.finBackAmtConv = "Amount in Rupees";
  }

  ngOnInit() {
    this.getFinSummaryBackDated();
  }

  onRefreshClick(){
    this.getFinSummaryBackDated();
  }

  onExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    let date = this.backdatedValue;
    if (date == undefined) {
      date = new Date();
      date = date.setDate(date.getDate() - 1);
      date = new Date(date);
    }
    let finalVal = "",toDateValue="";
    if (date) {
      finalVal = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }

    let url =Url.financialSummaryBackDatedDownload+'?RequestUUID='+requestUUID+'&MessageDateTime='+messageDateTime+'&backDate='+finalVal;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  private getFinSummaryBackDated() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS092_${this.baseService.randomStr()}`;
    var finVal = '';
    let date = this.backdatedValue;
    if (date == undefined) {
      date = new Date();
      date = date.setDate(date.getDate() - 1);
      date = new Date(date);
    }

    if (date) {
      finVal = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    }
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.Back_date = finVal;

    this.baseService._makeRequest(Url.fiinancialsummarybackdatedXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXMLDeposit(res,this.finBackAmtConv).then((parseData) => {
          this.dataSources = parseData;
        })

        this.parseXMLSummary(res,this.finBackAmtConv).then((parseDataSummary) => {
          this.dataSource = parseDataSummary;
        })

        this.parseXMLDisbursement(res,this.finBackAmtConv).then((parseDataDisbursement) => {
          this.data = parseDataDisbursement;
        })
      })
  }

  onItemChange(value?:any){
    this.getFinSummaryBackDated();
  }
  // parse the XML data
  parseXMLDeposit(data,finBackAmtConv) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([1-9]+)/)[1];

          let calAmount = finBackAmtConv == "Amount in Rupees" ? obj[k][0] : ((obj[k][0])/10000000);
          if (k == 'F01CumulativeDeposit') {
            arra.push({ no: id, deposit: 'Cumulative Deposit(YTD)', amount: calAmount })
          }
          if (k == 'F02InterestCredited') {
            arra.push({ no: id, deposit: 'Interest Credited(YTD)', amount: calAmount })
          }
          if (k == 'F03TotalBalance') {
            arra.push({ no: id, deposit: 'Total Balance(1+2)', amount: calAmount })
          }
        }
        resolve(arra);
      });
    });
  }


  // parse the XML data
  parseXMLSummary(data,finBackAmtConv) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([0-9]+)/)[1];
          let calAmount = finBackAmtConv == "Amount in Rupees" ? obj[k][0] : ((obj[k][0])/10000000);
          if (k == 'F08SABalance') {
            arra.push({ no: id, summary: 'Central a/c Balance', amount: calAmount })
          }
          if (k == 'F09CumLimAssigned') {
            arra.push({ no: id, summary: 'Cumulative Limits Assigned', amount: calAmount })
          }
          if (k == 'F10CreditReceived') {
            arra.push({ no: id, summary: 'Credit Received/Return Credit in PD account', amount: calAmount })
          }
          if (k == 'F11BalLimToBeAssigned') {
            arra.push({ no: id, summary: 'Balance Limits to be assigned(1-9)', amount: calAmount })
          }
          if (k == 'F12InterestAccrued') {
            arra.push({ no: id, summary: 'Interest Accured Till Now', amount: calAmount })
          }
          if (k == 'F13CreditException') {
            arra.push({ no: id, summary: 'Exception Credits', amount: calAmount })
          }
        }
        resolve(arra);
      });
    });
  }

  // parse the XML data
  parseXMLDisbursement(data,finBackAmtConv) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
        parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].FinanceSummaryDtl[0];
        let arra = [];

        for (k in obj) {
          const id = k.split(/([1-9]+)/)[1];
          let calAmount = finBackAmtConv == "Amount in Rupees" ? obj[k][0] : ((obj[k][0])/10000000);
          if (k == 'F04CumulativeDisb') {
            arra.push({ no: id, disbursement: 'Cumulative Disbursement', amount: calAmount })
          }
          if (k == 'F04APaidToBene') {
            arra.push({ no: '4A', disbursement: 'Paid to Beneficiary', amount: calAmount })
          }
          if (k == 'F04BAdminExpense') {
            arra.push({ no: '4B', disbursement: 'Paid to Admin Expenses', amount: calAmount })
          }
          if (k == 'F04CPaidForTDS') {
            arra.push({ no: '4C', disbursement: 'Paid for TDS', amount: calAmount })
          }
          if (k == 'F04DOtherDebit') {
            arra.push({ no: '4D', disbursement: 'Other Debits/Exception Debits', amount: calAmount })
          }
          if (k == 'F05InterestTrf') {
            arra.push({ no: id, disbursement: 'Interest Transfer', amount: calAmount })
          }
          if (k == 'F06LastDayRtnTran') {
            arra.push({ no: id, disbursement: 'Last Day Returns Transaction', amount: calAmount })
          }
          if (k == 'F07TotalBalance') {
            arra.push({ no: id, disbursement: 'Net Cumulative Disbursements(4+5)', amount: calAmount })
          }
        }
        resolve(arra);
      });
    });
  }

  onSearchbybackdate(value) {
    this.getFinSummaryBackDated();
  }

  onPDFDownload(){
    this.pdfService.downloadPDF(this.content.nativeElement);
  }
  
  displayedColumns: string[] = ['no', 'deposit', 'amount'];
  //dataSources = ELEMENT_DATA;
  displayedColumn: string[] = ['no', 'summary', 'amount'];
  //dataSource = ELEMENT;
  displayed: string[] = ['no', 'disbursement', 'amount'];
  //data = ELE;
}
