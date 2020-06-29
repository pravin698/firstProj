import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AwardnumberpopupComponent } from '../awardnumberpopup/awardnumberpopup.component';

@Component({
  selector: 'app-awardnumber',
  templateUrl: './awardnumber.component.html',
  styleUrls: ['./awardnumber.component.scss']
})
export class AwardnumberComponent implements OnInit {
  dataSourcesawardnumber: any;
  pageSize: any;
  fromCount = 1;
  toCount = 10;
  radioValue2: string;
  totalCount: any;
  accountnumber:any = "";
  awardnumber:any = "";
  fromdate:any;
  todate:any;
  constructor(public baseService: BaseService, public dialog: MatDialog) {
    this.radioValue2 = "Amount in Rupees";
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getxmldataforAwardNumberOnInit();
  }

  openDialogAwardNumber(awardNumber?: any, accountNumber?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      actNumber: accountNumber,
      awardNumber: awardNumber
    }
    const dialogRef = this.dialog.open(AwardnumberpopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  displayedColumns: string[] = ['ACnumber', 'AwardNumber', 'AwardNumberDate', 'UniqueNumber', 'LimitDate', 'LimitNumber'];

  onRefreshClick(){
    this.getxmldataforAwardNumberOnInit();
  }

  onExcelDownloadClick(){

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let fromDate = this.fromdate;
    let toDate = this.todate;
    let finalVal = '';
    if (fromDate) {
      finalVal = fromDate.getDate() + '-' + (fromDate.getMonth()+1) + '-' + fromDate.getFullYear();
    }

    let finalValforodate = '';
    if (toDate) {
      finalValforodate = toDate.getDate() + '-' + (toDate.getMonth()+1) + '-' + toDate.getFullYear();
    }

    let tailString =  "?RequestUUID="+requestUUID+"&MessageDateTime="+messageDateTime+
                      "&ActNumber="+this.accountnumber+"&fromDate="+finalVal+"&toDate="+finalValforodate+
                      "&AwardNumber="+this.awardnumber+"&fromCount=1"+"&toCount="+this.toCount;

    let url =Url.awardNoMainPageDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');
  }

  onItemChange(value?: any) {
    this.getxmldataforAwardNumberOnInit();
  }

  pageEvent(event) {
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getxmldataforAwardNumberOnInit();
  }

  onSearchclick() {
    this.getxmldataforAwardNumberOnInit();
  }

  private getxmldataforAwardNumberOnInit() {

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
    body.ACCT_NUM = this.accountnumber;
    body.FromDate = finalVal;
    body.ToDate = finalValforodate;
    body.AWARD_NUM = this.awardnumber;
    body.FromCount = (this.fromCount).toString();
    body.ToCount = (this.toCount).toString();

    this.baseService._makeRequest(Url.awardnumnberXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    })
      .subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.dataSourcesawardnumber = parseData[0];
          this.totalCount = parseData[1];
          let value = this.radioValue2;
          this.dataSourcesawardnumber.forEach((data) => {
            if (data.TODAmt) {
              if (value == "Amount in Rupees") {
                data.TODAmt = (data.TODAmt)
              } else {
                data.TODAmt = ((data.TODAmt) / 10000000)
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].AWARDDetail;
        var totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].TotalRecord;
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });
        let resolvedArr = [arra,totalCount];
        resolve(resolvedArr);
      });
    });
  }
}
