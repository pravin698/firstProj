import { Component, OnInit, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import xml2js from 'xml2js';
import * as _ from 'lodash'; 
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-subsidiaryaccount',
  templateUrl: './subsidiaryaccount.component.html',
  styleUrls: ['./subsidiaryaccount.component.scss']
})
export class SubsidiaryaccountComponent implements OnInit {
  pdName:any = "";
  roName:any = "";
  stateName:any = "";
  zoneName:any = "";
  fromCount:any = 1;
  toCount:any = 10;
  totalCount:any;
  pageSize:any = 10;
  dataSources = new MatTableDataSource;
  constructor(public baseService: BaseService, public http: HttpClient,@Inject(MAT_DIALOG_DATA) data) {
    this.pdName = data.pdName ? data.pdName : "";
    this.roName = data.roName ? data.roName : "";
    this.stateName = data.stateName ? data.stateName : "";
    this.zoneName = data.zoneName ? data.zoneName : "";
  }

  ngOnInit() {
    this.getXmlDataForSubsidiaryAccountOnInit();
  }
  displayedColumns: string[] = ['srno', 'subsidiaryaccountno','subsidiaryactName','totallimit','usedlimit','fundusedpercent','actBalance'];

  pageEvent(event) {
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getXmlDataForSubsidiaryAccountOnInit();
  }

  private getXmlDataForSubsidiaryAccountOnInit() {
    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
  
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.From_count = (this.fromCount).toString();
    body.To_count = (this.toCount).toString();
    let url = Url.subsidiaryaccountXmlUrl;    
    if(this.pdName != ""){
      body.PD_NAME = this.pdName;
    }else if(this.roName != ""){
      body.RegionalOffice = this.roName;
      url = Url.roSubsidiaryaccountXmlUrl;
    }else if(this.stateName != ""){
      body.State = this.stateName;
      url = Url.statesubsidiaryActUrl;
    }else if(this.zoneName != ""){
      body.zone = this.zoneName;
      url = Url.zonesubsidiaryActUrl;
    }
    this.baseService._makeRequest(url, 
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.dataSources.data = parseData[0];
        this.totalCount = parseData[1];       
      });
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].PDDetails;
        var totalcount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
           arra.push(element);
        });
        let resolvedArr = [arra,totalcount]
        resolve(resolvedArr);
      });
    });
  }
}
