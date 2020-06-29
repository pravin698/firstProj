import { Component, OnInit, ViewChild, Directive } from '@angular/core';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatTableDataSource, MatPaginator, MatDatepicker } from '@angular/material';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment from 'moment';
import { FormControl } from '@angular/forms';

//import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/Adapters/app-date-adapter";

// tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment, Moment} from 'moment';

//const moment = _rollupMoment || _moment;

/**
 * 
 * export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
 * 
 * ,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
 */
@Component({
  selector: 'app-datewiselimit',
  templateUrl: './datewiselimit.component.html',
  styleUrls: ['./datewiselimit.component.scss']
})
export class DatewiselimitComponent implements OnInit {
  dataSources: any;
  radioValue2: string;
  dataSources2 = new MatTableDataSource;
  dataSources3 = new MatTableDataSource;
  dataSources4 = new MatTableDataSource;
  roParsedData: any;
  poParsedData: any;
  calaParsedData: any;
  pageSize: any = 10;

  //limitAsOnMonth:any = new FormControl(moment());
  limitAsOndate: any;
  limitAsOnMonth: any;

  fromDate: any = "";
  toDate: any = "";

  dateSelected: any = new Date();
  rofromCount: any = 1;
  rotoCount: any = 10;
  pdfromCount: any = 1;
  pdtoCount: any = 10;
  calafromCount: any = 1;
  calatoCount: any = 10;
  rototalCount: any;
  pdtotalCounts: any;  
  totalCountCALA: any;
  roPageSize:any = 10;
  pdPageSize:any = 10;
  calaPageSize:any = 10;

  constructor(public baseService: BaseService) {
    this.radioValue2 = "Amount in Rupees";
  }

  ngOnInit() {
    this.getXmlDataForDateLimitOnInit();
    this.dateSelected = (this.dateSelected.getMonth() + 1) + "/" + this.dateSelected.getDate() + "/" +  this.dateSelected.getFullYear();
    let date = new Date();
    this.fromDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    this.toDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }

  onSearchclick() {
    this.getXmlDataForDateLimitOnInit();
  }

  prepareDate(){
    if (this.limitAsOndate) {
      let date = this.limitAsOndate;
      if (date == undefined) {
        date = new Date();
      }
      this.fromDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      this.toDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      this.dateSelected = (date.getMonth() + 1) + "-" +date.getDate() + "-" + date.getFullYear();
    } else if (this.limitAsOnMonth) {
      let date = this.limitAsOnMonth;
      if (date == undefined) {
        date = new Date();
      }
      var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.fromDate ="1-" + (date.getMonth() + 1) + "-" + date.getFullYear(); //1st Day of the month
      this.toDate =  lastDayOfMonth.getDate() + "-" + (lastDayOfMonth.getMonth() + 1) + "-" + lastDayOfMonth.getFullYear();
      this.dateSelected = (date.getMonth() + 1) + "-" +"1-" + date.getFullYear() +' TO '+(lastDayOfMonth.getMonth() + 1) + "-" +lastDayOfMonth.getDate() + "-" + lastDayOfMonth.getFullYear();
    }else{
      let date = new Date();
      this.fromDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
      this.toDate =  date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    }
  }

  onItemChange(value?: any) {
    this.getXmlDataForDateLimitOnInit();
  }

  pageEventForRO(event) {
    this.rofromCount = (event.pageIndex * event.pageSize) + 1;
    this.rotoCount = (event.pageIndex + 1) * event.pageSize;
    this.prepareDate();
    this.getROData();
  }

  pageEventForPD(event) {
    this.pdfromCount = (event.pageIndex * event.pageSize) + 1;
    this.pdtoCount = (event.pageIndex + 1) * event.pageSize;
    this.prepareDate();
    this.getPDData();
  }

  pageEventForCALA(event) {
    this.calafromCount = (event.pageIndex * event.pageSize) + 1;
    this.calatoCount = (event.pageIndex + 1) * event.pageSize;
    this.prepareDate();
    this.getCALAData();
  }

  displayedColumns: string[] = ['no', 'zone', 'subsidiaries', 'limitsgranted', 'limitUnutilized', 'limitUtilized'];

  displayedColumns2: string[] = ['no', 'RegionalOffices', 'subsidiaries', 'limitsgranted', 'limitUnutilized', 'limitUtilized'];

  displayedColumns3: string[] = ['no', 'RegionalOffices', 'ProjectDirector', 'subsidiaries', 'limitsgranted', 'limitUnutilized', 'limitUtilized'];

  displayedColumns4: string[] = ['no', 'zone', 'state', 'RegionalOffices', 'ProjectDirector', 'AccountNo', 'limitsgranted', 'limitUnutilized', 'limitUtilized'];
  /*
    chosenYearHandler(normalizedYear: moment.Moment) {
      const ctrlValue = this.limitAsOnMonth.value;
      ctrlValue.year(normalizedYear.year ? normalizedYear.year() : 2020);
      this.limitAsOnMonth.setValue(ctrlValue);
    }
  
    chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
      const ctrlValue = this.limitAsOnMonth.value;
      ctrlValue.month(normalizedMonth.month?normalizedMonth.month():3);
      this.limitAsOnMonth.setValue(ctrlValue);
      datepicker.close();
    }
  */
  private getXmlDataForDateLimitOnInit(value?: any, radioBtnValue1?: any, date?: any) {

    this.prepareDate();

    this.getZoneData();

    this.getROData();

    this.getPDData();

    this.getCALAData();

  }

  onZoneRefreshClick(){
    this.getZoneData();
  }

  onZoneExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.datewiseZoneDownload +'?requestUUID='+requestUUID+'&messageDateTime='+messageDateTime+'&fromDate='+this.fromDate+'&toDate='+this.toDate;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getZoneData() {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    body.from_date = this.fromDate;
    body.to_date = this.toDate;

    this.baseService._makeRequest(Url.datewisezoneXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res).then((parseData) => {
        this.dataSources = parseData[0];
        let value = this.radioValue2;
        this.dataSources.forEach((data) => {
          if (data.AllocatedLimit) {
            let finVal = data.AllocatedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.AllocatedLimit = parseFloat(finVal).toFixed(2);
          }
          if (data.UnUtilizedLimit) {
            let finVal = data.UnUtilizedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.UnUtilizedLimit = parseFloat(finVal).toFixed(2);
          }
          if (data.UtilizedLimit) {
            let finVal = data.UtilizedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.UtilizedLimit = parseFloat(finVal).toFixed(2);
          }
          if (data.TotalAllocatedLimit) {
            let finVal = data.TotalAllocatedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.TotalAllocatedLimit = parseFloat(finVal).toFixed(2);
          }
          if (data.TotalUtilizedLimit) {
            let finVal = data.TotalUtilizedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.TotalUtilizedLimit = parseFloat(finVal).toFixed(2);
          }
          if (data.TotalUnUtilizedLimit) {
            let finVal = data.TotalUnUtilizedLimit;
            if (value != "Amount in Rupees") {
              finVal = finVal/10000000; 
            }
            data.TotalUnUtilizedLimit = parseFloat(finVal).toFixed(2);
          }
        })
      });
    });
  }

  onRORefreshClick(){
    this.getROData();
  }

  onROExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.datewiseRODownload +'?requestUUID='+requestUUID+'&messageDateTime='+
    messageDateTime+'&fromDate='+this.fromDate+'&toDate='+this.toDate+'&recFromNo=1'+"&recToNo="+this.rotoCount;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getROData(fromDate?: any, toDate?: any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    body.from_date = this.fromDate;
    body.to_date = this.toDate;

    body.RecFromNum = (this.rofromCount).toString();
    body.RecToNum = (this.rotoCount).toString();

    this.baseService._makeRequest(Url.datewiseroXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseROXML(res).then((parseData) => {
        this.roParsedData = parseData[0];
        this.rototalCount = parseData[1];
        this.dataSources2.data = this.roParsedData;
        let value = this.radioValue2;
        this.roParsedData.forEach((data) => {
          if (data.AllocatedLimit) {
            if (value == "Amount in Rupees") {
              data.AllocatedLimit = (data.AllocatedLimit)
            } else {
              data.AllocatedLimit = ((data.AllocatedLimit) / 10000000)
            }
          }
          if (data.UnutilizedLimit) {
            if (value == "Amount in Rupees") {
              data.UnutilizedLimit = (data.UnutilizedLimit)
            } else {
              data.UnutilizedLimit = ((data.UnutilizedLimit) / 10000000)
            }
          }
          if (data.UsedLimit) {
            if (value == "Amount in Rupees") {
              data.UsedLimit = (data.UsedLimit)
            } else {
              data.UsedLimit = ((data.UsedLimit) / 10000000)
            }
          }
        })
      });
    });
  }

  onPDRefreshClick(){
    this.getPDData();
  }

  onPDExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.datewisePDDownload +'?requestUUID='+requestUUID+'&messageDateTime='+
    messageDateTime+'&fromDate='+this.fromDate+'&toDate='+this.toDate+'&recFromNo=1'+
    "&recToNo="+this.rotoCount;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getPDData(fromDate?: any, toDate?: any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    body.from_date = this.fromDate;
    body.to_date = this.toDate;

    body.RecFromNum = (this.pdfromCount).toString();
    body.RecToNum = (this.pdtoCount).toString();

    this.baseService._makeRequest(Url.datewisepoXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parsePOXML(res).then((parseData) => {
        this.poParsedData = parseData[0];
        this.pdtotalCounts = parseData[1];
        this.dataSources3.data = this.poParsedData;
        let value = this.radioValue2;
        this.poParsedData.forEach((data) => {
          if (data.AllocatedLimit) {
            if (value == "Amount in Rupees") {
              data.AllocatedLimit = (data.AllocatedLimit)
            } else {
              data.AllocatedLimit = ((data.AllocatedLimit) / 10000000)
            }
          }
          if (data.UnutilisedLimit) {
            if (value == "Amount in Rupees") {
              data.UnutilisedLimit = (data.UnutilisedLimit)
            } else {
              data.UnutilisedLimit = ((data.UnutilisedLimit) / 10000000)
            }
          }
          if (data.UsedLimit) {
            if (value == "Amount in Rupees") {
              data.UsedLimit = (data.UsedLimit)
            } else {
              data.UsedLimit = ((data.UsedLimit) / 10000000)
            }
          }
        })
      });
    });
  }

  onCALARefreshClick(){
    this.getCALAData();
  }

  onCALAExcelDownload(){
    let messageDateTime = new Date().toISOString().slice(0, -1);
    let requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let url =Url.datewiseCalaDownload +'?requestUUID='+requestUUID+'&messageDateTime='+
    messageDateTime+'&fromDate='+this.fromDate+'&toDate='+this.toDate+'&recFromNo=1'+
    "&recToNo="+this.rotoCount;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getCALAData(fromDate?: any, toDate?: any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;

    body.from_date = this.fromDate;
    body.to_date = this.toDate;

    body.RecFromNum = (this.calafromCount).toString();
    body.RecToNum = (this.calatoCount).toString();

    //For CALA
    this.baseService._makeRequest(Url.datewisecalaXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseCALAXML(res).then((parseData) => {
        this.calaParsedData = parseData[0];
        this.totalCountCALA = parseData[1];
        this.dataSources4.data = this.calaParsedData;
        let value = this.radioValue2;
        this.calaParsedData.forEach((data) => {
          if (data.AllocatedLimits) {
            if (value == "Amount in Rupees") {
              data.AllocatedLimits = (data.AllocatedLimits)
            } else {
              data.AllocatedLimits = ((data.AllocatedLimits) / 10000000)
            }
          }
          if (data.UtilizedLimit) {
            if (value == "Amount in Rupees") {
              data.UtilizedLimit = (data.UtilizedLimit)
            } else {
              data.UtilizedLimit = ((data.UtilizedLimit) / 10000000)
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
      });
    });
  }

  // parse the XML data for zone
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Records;
        var arrs = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Record;
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });

        arrs.forEach(element => {
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

  // parse the XML data for Regional office
  parseROXML(data) {
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Records;
        var totalCount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });
        let resolvedArr = [arra, totalCount]
        resolve(resolvedArr);
      });
    });
  }

  // parse the XML data for Project Director
  parsePOXML(data) {
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].Records;
        var totalCounts = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];
        let arra = [];

        arr.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });
        let resolvedArr = [arra, totalCounts]
        resolve(resolvedArr);
      });
    });
  }

  // parse the XML data for CALA
  parseCALAXML(data) {
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

        var totalCountCALA = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];
        let arra = [];
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
        let resolvedArr = [itemArr, totalCountCALA]
        resolve(resolvedArr);


      });
    });
  }
}

// export const MY_FORMATS_MMYYY = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

// @Directive({
//   selector: '[dfMMYYYY]',
//   providers: [{
//     provide: DateAdapter,
//     useClass: MomentDateAdapter,
//     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
//   },
//   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_MMYYY },
//   ],
// })
// export class CustomDateFormat1 {
// }

// export const DATE_FORMAT_MMDDYYYY = {
//   parse: {
//     dateInput: 'MM/DD/YYYY',
//   },
//   display: {
//     dateInput: 'MM/DD/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

// @Directive({
//   selector: '[dfMMDDYYYY]',
//   providers: [
//     { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_MMDDYYYY },
//   ],
// })
// export class CustomDateFormat2 {
// }