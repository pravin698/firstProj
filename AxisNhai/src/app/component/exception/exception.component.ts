import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { Url } from 'src/app/core/services/url';
import { Constants } from 'src/app/core/services/constants';
@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent implements OnInit {
  exceptionParsedData: any;
  //dataSource = new MatTableDataSource;
  pageSize: any = 10;
  totalCount: any;
  radioValue: string;
  dateValue1: any;
  dateValue2: any;
  fromCount = 1;
  toCount = 10;
  accountnumber:any = "";

  constructor(public baseService: BaseService, public http: HttpClient) {
    this.radioValue = Constants.amountInRupees;
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getXmlDataForExceptionsOnInit();
  }

  pageEvent(event, fromDate, toDate) {
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.onExceptionsSearch(fromDate, toDate);
  }

  displayedColumns: string[] = ['no', 'subsidiaryaccountno', 'subsidiaryaccountname', 'subsidiaryaccountopendate', 'date', 'debitcredit', 'tranparticulars', 'amount'];

  private getXmlDataForExceptionsOnInit(fromDate?: any, toDate?: any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    let finalFromDateVal="", finalToDateVal = "";
    if (fromDate) {
      let localeDateString = fromDate.toLocaleDateString();
      let locastringArray = localeDateString.split('/');
      if (locastringArray.length == 3) {
        finalFromDateVal = locastringArray[1] + '-' + locastringArray[0] + '-' + locastringArray[2];
      }
    }
    if (toDate) {
      let localeDateString = toDate.toLocaleDateString();
      let locastringArray = localeDateString.split('/');
      if (locastringArray.length == 3) {
        finalToDateVal = locastringArray[1] + '-' + locastringArray[0] + '-' + locastringArray[2];
      }
    }

    let actNumber = "";
    if(this.accountnumber != undefined && this.accountnumber != null){
      actNumber = this.accountnumber;
    }
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.From_count = (this.fromCount).toString();
    body.To_count = (this.toCount).toString();  
    body.ACCT_NUM = actNumber.toString();  
    body.fromDate = finalFromDateVal;
    body.toDate = finalToDateVal;

    this.baseService._makeRequest(Url.exceptionsXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.exceptionParsedData = parseData[0];
        this.totalCount = parseData[1];
        //this.dataSource.data = this.exceptionParsedData;
        this.exceptionParsedData.forEach((data) => {
          if (data.TranAmount) {
            if (this.radioValue == Constants.amountInRupees) {
              data.TranAmount = (data.TranAmount)
            } else {
              data.TranAmount = ((data.TranAmount) / 10000000)
            }
          }
        })
      })
    })
  }

  onExcelDownload(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let finalFromDateVal="", finalToDateVal = "";
    if (this.dateValue1) {
      let localeDateString = this.dateValue1.toLocaleDateString();
      let locastringArray = localeDateString.split('/');
      if (locastringArray.length == 3) {
        finalFromDateVal = locastringArray[1] + '-' + locastringArray[0] + '-' + locastringArray[2];
      }
    }
    if (this.dateValue2) {
      let localeDateString = this.dateValue2.toLocaleDateString();
      let locastringArray = localeDateString.split('/');
      if (locastringArray.length == 3) {
        finalToDateVal = locastringArray[1] + '-' + locastringArray[0] + '-' + locastringArray[2];
      }
    }

    let actNumber = "";
    if(this.accountnumber != undefined && this.accountnumber != null){
      actNumber = this.accountnumber;
    }

    let tailString =  "?requestUUID="+requestUUID+"&messageDateTime="+messageDateTime+
    "&fromDate="+finalFromDateVal+"&toDate="+finalToDateVal+"&ACCT_NUM="+actNumber+
    "&fromCount=1"+"&toCount="+this.toCount;
    
    let url =Url.exceptionPageDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');

  }

  onRefreshClick(){
    this.getXmlDataForExceptionsOnInit();
  }

  //select the rupees/crores conversion method
  onRadioButtonChange(value?: any) {
    this.getXmlDataForExceptionsOnInit(this.dateValue1,this.dateValue2);
  }

  //on search
  onExceptionsSearch(fromDate?: any, toDate?: any) {
    this.getXmlDataForExceptionsOnInit(fromDate, toDate);
  }
  // parse the XML data
  parseXML(data) {
    return new Promise(resolve => {
      var parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
      let itemArr = [];
      var parsedArr: any = [];
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE",
        "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"
      ];
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].SubsidiaryTranDetails;
        var totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];

        arr.forEach((dataPacketObj) => {
          let id = dataPacketObj.REC_CNT[0];
          for (var key in dataPacketObj) {
            let item = key;
            if (itemArr.length > 0) {
              const index = _.findIndex(itemArr, { no: +`${id}` });
              if (index == -1) {
                itemArr.push({ no: +`${id}`, [`${item}`]: dataPacketObj[key][0] })
              } else {
                if ((item == "SubsidiaryAcctOpenDate") || (item == "SubsidiaryTranDate")) {
                  let splitedDate = dataPacketObj[key][0].split('-');
                  let day = splitedDate[0];
                  let month = splitedDate[1];
                  let year = splitedDate[2];
                  let framedDate = new Date(`${month}-${day}-${year}`);
                  let NameOfTheMonth = monthNames[framedDate.getMonth()];
                  itemArr[index][item] = `${day}-${NameOfTheMonth}-${year}`;
                } else {
                  itemArr[index][item] = dataPacketObj[key][0];
                }
              }
            } else {
              itemArr.push({ no: +`${id}`, [`${item}`]: dataPacketObj[key][0] });
            }
          }
        });
        parsedArr.push(itemArr, totalCount);
        resolve(parsedArr);
      })
    });
  }
}


