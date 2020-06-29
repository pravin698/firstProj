import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatDialogConfig, MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { ROProjectDirectorsComponent } from '../roproject-directors/roproject-directors.component';
import { SubsidiaryaccountComponent } from '../subsidiaryaccount/subsidiaryaccount.component';
@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {
  dataSource: any;
  radioValue1: string;
  radioValue2: string;

  constructor(public dialog: MatDialog,public baseService: BaseService, public http: HttpClient) {
    this.radioValue2 = "Amount in Rupees";
  }

  ngOnInit() {
    this.getXmlDataForZoneOnInit();
  }
  onExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.zonewiseDetailsDownload +'?requestUUID='+requestUUID+'&messageDateTime='+messageDateTime;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  onRefreshClick(){
    this.getXmlDataForZoneOnInit();
  }

  getXmlDataForZoneOnInit() {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    this.baseService._makeRequest(Url.zoneXmlUrl,
      body,
      'POST',
      {
        responseType: 'application/xml',
        headers: headers
      }).subscribe((res) => {
        this.parseXMLHeads(res).then((parseData) => {
          parseData = this.adjustZoneData(parseData);

          this.dataSource = parseData;
          let value = this.radioValue2;
          this.dataSource.forEach((data) => {
            if (data.TotLimit) {
              if (value == "Amount in Rupees") {
                data.TotLimit = (data.TotLimit)
              } else {
                data.TotLimit = ((data.TotLimit) / 10000000)
              }
            }
          });

          this.dataSource.forEach((data) => {
            if (data.UsedLimit) {
              if (value == "Amount in Rupees") {
                data.UsedLimit = (data.UsedLimit)
              } else {
                data.UsedLimit = ((data.UsedLimit) / 10000000)
              }
            }
          });

        })
      })
  }

  // parse the XML Heads table
  parseXMLHeads(data) {
    return new Promise(resolve => {
      var parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].ZoneDetails;
        if(arr){
          arr.forEach((element) => {
            for (var key in element) {
              var zoneName = element['zone'][0];
              if (itemArr.length > 0) {
                const index = _.findIndex(itemArr, { zone: zoneName });
                if (index == -1) {
                  itemArr.push({ [`${key}`]: element[key][0] });
                } else {
                  itemArr[index][key] = element[key][0];
                }
              } else {
                itemArr.push({ [`${key}`]: element[key][0] });
              }
            }
          });
        }
      
        resolve(itemArr);
      });
    });
  }

  adjustZoneData(itemArr) {
    const eastIndex = _.findIndex(itemArr,function(o) {
      return ((o.zone).toLowerCase()).includes(("EAST").toLowerCase());
    });
    const westIndex = _.findIndex(itemArr,function(o) {
        return ((o.zone).toLowerCase()).includes(("WEST").toLowerCase());
    });
    const northIndex = _.findIndex(itemArr,function(o) {
        return ((o.zone).toLowerCase()).includes(("NORTH").toLowerCase());
    });
    const southIndex = _.findIndex(itemArr,function(o) {
        return ((o.zone).toLowerCase()).includes(("SOUTH").toLowerCase());
    });
    if (eastIndex == -1) {
      itemArr.push({ zone: 'EAST', NumOfPd: 0, NumOfSubsdiaryAcct: 0, TotLimit: 0, UsedLimit: 0, FundUsedPerc: 0 });
    }
    if (westIndex == -1) {
      itemArr.push({ zone: 'WEST', NumOfPd: 0, NumOfSubsdiaryAcct: 0, TotLimit: 0, UsedLimit: 0, FundUsedPerc: 0 });
    }
    if (northIndex == -1) {
      itemArr.push({ zone: 'NORTH', NumOfPd: 0, NumOfSubsdiaryAcct: 0, TotLimit: 0, UsedLimit: 0, FundUsedPerc: 0 });
    }
    if (southIndex == -1) {
      itemArr.push({ zone: 'SOUTH', NumOfPd: 0, NumOfSubsdiaryAcct: 0, TotLimit: 0, UsedLimit: 0, FundUsedPerc: 0 });
    }

    itemArr = this.calculateSummary(itemArr);
    
    return itemArr;
  }

  calculateSummary(itemArr){
    let totPDCount=0,totSubActCount=0,totLimit = 0,totUsed=0,totFudUsed=0;
    itemArr.forEach((zoneObj) => {
      totPDCount= totPDCount+parseFloat(zoneObj.NumOfPd);
      totSubActCount = totSubActCount+parseFloat(zoneObj.NumOfSubsdiaryAcct);
      totLimit = totLimit+parseFloat(zoneObj.TotLimit);
      totUsed = totUsed+parseFloat(zoneObj.UsedLimit);
      totFudUsed = totFudUsed+parseFloat(zoneObj.FundUsedPerc);
    });
    itemArr.push({ zone: 'ALL', NumOfPd: totPDCount, NumOfSubsdiaryAcct: totSubActCount, TotLimit: totLimit, UsedLimit: totUsed, FundUsedPerc: totFudUsed });
    return itemArr;
  }

  displayedColumns: string[] = ['zone', 'noofpd', 'noofchildacc', 'totallimit', 'usedlimit', 'fundsused'];

  onItemChange(value?: any) {
    this.getXmlDataForZoneOnInit();
  }

  getProjectDirectors(zoneName?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      zoneName: zoneName
    }
    const dialogRef = this.dialog.open(ROProjectDirectorsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getSubSidiaryAct(zoneName?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      zoneName: zoneName
    }
    const dialogRef = this.dialog.open(SubsidiaryaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  
}
