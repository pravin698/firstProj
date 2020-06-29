import { Component, OnInit, Inject } from '@angular/core';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-awardnumberpopup',
  templateUrl: './awardnumberpopup.component.html',
  styleUrls: ['./awardnumberpopup.component.scss']
})
export class AwardnumberpopupComponent implements OnInit {
  dataSource: any;
  acnumber: any;
  awardnumber: any;
  displayedColumns: string[] = ['accountno', 'holdername', 'opendate', 'limitdate', 'limitamount'];

  constructor(public baseService: BaseService, public http: HttpClient, @Inject(MAT_DIALOG_DATA) data) {
    this.acnumber = data.actNumber;
    this.awardnumber = data.awardNumber;
  }

  ngOnInit() {
    this.getxmldataforAwardNumberPopup();
  }

  private getxmldataforAwardNumberPopup() {

    const headers =this.baseService.getHeaders();

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.AWARD_NUM = this.awardnumber;
    body.ACCT_NUM = this.acnumber;

    this.baseService._makeRequest(Url.awardnumberpopupXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.dataSource = parseData[0];
      });
    });
  }

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
}