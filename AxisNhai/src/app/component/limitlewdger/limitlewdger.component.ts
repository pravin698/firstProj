import { Component, OnInit, Inject } from '@angular/core';
import xml2js from 'xml2js';
import * as _ from 'lodash'; 
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-limitlewdger',
  templateUrl: './limitlewdger.component.html',
  styleUrls: ['./limitlewdger.component.scss']
})
export class LimitlewdgerComponent implements OnInit {
  dataSource:any;
  totalCount:any;
  actNumber:any;
  isLoading = true;
  month= [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  constructor(public baseService: BaseService, public http: HttpClient,@Inject(MAT_DIALOG_DATA) data) {
    this.actNumber = data.actNumber;
  }

  ngOnInit() {
    this.getXmlDataForAccountsOnInit();
  }

  onExcelDownload(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    let date = new Date();
    let fromDate = date.getDate()+"-"+this.month[date.getMonth()]+"-"+date.getFullYear();
    let toDate = date.getDate()+"-"+this.month[date.getMonth()]+"-"+date.getFullYear();
    let acctNo = this.actNumber;

    let url =Url.accountDetailsInfoDownload +'?requestUUID='+requestUUID+'&messageDateTime='+
    messageDateTime+'&acctFromDate='+fromDate+'&acctToDate='+toDate+'&acctId='+acctNo;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  private getXmlDataForAccountsOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    let date = new Date();
    body.FromDate = date.getDate()+"-"+this.month[date.getMonth()]+"-"+date.getFullYear();
    body.ToDate = date.getDate()+"-"+this.month[date.getMonth()]+"-"+date.getFullYear();
    body.AcctNo = this.actNumber;

    this.baseService._makeRequest(Url.accounthyperlinkAccountNoXmlUrl, 
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.dataSource = parseData[0];

        this.dataSource.data = this.dataSource;
        this.totalCount = parseData[1];
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
      });
    }, (error) => {
      this.isLoading = false;
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].AccountInquiry[0].AcctDtls;
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
           arra.push(element);
        });
        let resolvedArr = [arra]
        resolve(resolvedArr);
      });
    });
  }
    
  displayedColumns: string[] = ['no','dateoflimit','limitgrant','limitresanction','limitremoval','limitutilized','balancelimit'];
}