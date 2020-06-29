import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';

@Component({
  selector: 'app-calareconcilationstatement',
  templateUrl: './calareconcilationstatement.component.html',
  styleUrls: ['./calareconcilationstatement.component.scss']
})
export class CalareconcilationstatementComponent implements OnInit {
  dataSourcecala: any;
  //dataSource = new MatTableDataSource;
  pageSize: any;
  fromCount = 1;
  toCount = 10;
  radioValue2: string;
  totalCount: any;
  fromdate: any;
  todate: any;
  accountnumber: any = "";
  constructor(public baseService: BaseService) {
    this.radioValue2 = "Amount in Rupees";
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getxmldataforCALAOnInit();
  }

  onItemChange(value?: any) {
    this.getxmldataforCALAOnInit();
  }
  onSearchclick() {
    this.getxmldataforCALAOnInit();
  }

  pageEvent(event) {
    this.fromCount = (event.pageIndex * event.pageSize) + 1;
    this.toCount = (event.pageIndex + 1) * event.pageSize;
    this.getxmldataforCALAOnInit();
  }

  displayedColumns: string[] = ['no', 'accountnumber', 'accountname', 'totalsanctionedlimits', 'limitsutilizedperprevyear', 'limitsutilizedincurryear', 'unutilizedlimit', 'electtrf', 'tdstrf', 'otherdrtrf', 'returns', 'dddebit', 'clearingdebit', 'lessfundscrbcktoacctmiss', 'lessoutwardchequereturn', 'othercreditdepsits'];

  private getxmldataforCALAOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS20_${this.baseService.randomStr()}`;

    let fromDate = this.fromdate;
    let toDate = this.todate;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let finalVal = '';
    if (fromDate) {
      finalVal = fromDate.getDate() + '-' + (fromDate.getMonth()+1) + '-' + fromDate.getFullYear();
    }

    let finalValforodate = '';
    if (toDate) {
      finalValforodate = toDate.getDate() + '-' + (toDate.getMonth()+1) + '-' + toDate.getFullYear();
    }

let actnumber=""
if(this.accountnumber != undefined && this.accountnumber != null ){
  actnumber = this.accountnumber;
}
    body.acctId = actnumber.toString();
    body.from_date = finalVal;
    body.to_date = finalValforodate;
    body.RecFromNum = (this.fromCount).toString();
    body.RecToNum = (this.toCount).toString();

    this.baseService._makeRequest(Url.calareconsilation,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    })
      .subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.dataSourcecala = parseData[0];
          this.totalCount = parseData[1];
          //this.dataSource.data = this.dataSourcecala;
          let value = this.radioValue2;
          this.dataSourcecala.forEach((data) => {
            if (data.AllocatedLimits) {
              if (value == "Amount in Rupees") {
                data.AllocatedLimits = (data.AllocatedLimits)
              } else {
                data.AllocatedLimits = ((data.AllocatedLimits) / 10000000)
              }
            }
            if (data.UtilizedLimitTillPrvMonth) {
              if (value == "Amount in Rupees") {
                data.UtilizedLimitTillPrvMonth = (data.UtilizedLimitTillPrvMonth)
              } else {
                data.UtilizedLimitTillPrvMonth = ((data.UtilizedLimitTillPrvMonth) / 10000000)
              }
            }
            if (data.UtilizedLimitInCurrMonth) {
              if (value == "Amount in Rupees") {
                data.UtilizedLimitInCurrMonth = (data.UtilizedLimitInCurrMonth)
              } else {
                data.UtilizedLimitInCurrMonth = ((data.UtilizedLimitInCurrMonth) / 10000000)
              }
            }
            if (data.PaidForTDS) {
              if (value == "Amount in Rupees") {
                data.PaidForTDS = (data.PaidForTDS)
              } else {
                data.PaidForTDS = ((data.PaidForTDS) / 10000000)
              }
            }
            if (data.OtherDebit) {
              if (value == "Amount in Rupees") {
                data.OtherDebit = (data.OtherDebit)
              } else {
                data.OtherDebit = ((data.OtherDebit) / 10000000)
              }
            }
            if (data.ElecTrf) {
              if (value == "Amount in Rupees") {
                data.ElecTrf = (data.ElecTrf)
              } else {
                data.ElecTrf = ((data.ElecTrf) / 10000000)
              }
            }
            if (data.Returns) {
              if (value == "Amount in Rupees") {
                data.Returns = (data.Returns)
              } else {
                data.Returns = ((data.Returns) / 10000000)
              }
            }
            if (data.DDdebit) {
              if (value == "Amount in Rupees") {
                data.DDdebit = (data.DDdebit)
              } else {
                data.DDdebit = ((data.DDdebit) / 10000000)
              }
            }
            if (data.ClearingDr) {
              if (value == "Amount in Rupees") {
                data.ClearingDr = (data.ClearingDr)
              } else {
                data.ClearingDr = ((data.ClearingDr) / 10000000)
              }
            }
            if (data.CrBkToAcct) {
              if (value == "Amount in Rupees") {
                data.CrBkToAcct = (data.CrBkToAcct)
              } else {
                data.CrBkToAcct = ((data.CrBkToAcct) / 10000000)
              }
            }
            if (data.OutChqRet) {
              if (value == "Amount in Rupees") {
                data.OutChqRet = (data.OutChqRet)
              } else {
                data.OutChqRet = ((data.OutChqRet) / 10000000)
              }
            }
            if (data.OtherCredit) {
              if (value == "Amount in Rupees") {
                data.OtherCredit = (data.OtherCredit)
              } else {
                data.OtherCredit = ((data.OtherCredit) / 10000000)
              }
            }
            if (data.UnUtilizedLimit) {
              if (value == "Amount in Rupees") {
                data.UnUtilizedLimit = (data.UnUtilizedLimit)
              } else {
                data.UnUtilizedLimit = ((data.UnUtilizedLimit) / 10000000)
              }
            }
          })
        })

      });
  }
  // parse the XML data
  parseXML(data) {
    return new Promise(resolve => {
      var k: string | number;
      var a: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].CALASummaryDtl[0];
        let totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt;
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
        let resolvedArr = [itemArr, totalCount]
        resolve(resolvedArr);
      });
    });
  }

  onExcelDownload(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS20_${this.baseService.randomStr()}`;

    let fromDate = this.fromdate;
    let toDate = this.todate;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let finalVal = '';
    if (fromDate) {
      finalVal = fromDate.getDate() + '-' + (fromDate.getMonth()+1) + '-' + fromDate.getFullYear();
    }

    let finalValforodate = '';
    if (toDate) {
      finalValforodate = toDate.getDate() + '-' + (toDate.getMonth()+1) + '-' + toDate.getFullYear();
    }

    let tailString =  "?requestUUID="+requestUUID+"&messageDateTime="+messageDateTime+
    "&fromDate="+finalVal+"&toDate="+finalValforodate+
    "&recFromNo=1"+"&recToNo="+this.toCount+"&accNo="+this.accountnumber;
    
    let url =Url.calaStatementDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');

  }

  onRefreshClick()
  {
    this.getxmldataforCALAOnInit();
  }
}