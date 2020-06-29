import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import { Url } from 'src/app/core/services/url';


@Component({
  selector: 'app-aeging',
  templateUrl: './aeging.component.html',
  styleUrls: ['./aeging.component.scss']
})
export class AegingComponent implements OnInit {
  displayedColumns: string[] = ['Heads', 'Total', 'to30days', 'to90days', 'to180days', 'morethan180days'];
  aegingParsedData: any;
  ageingCurConv:any;
  ageFromDate:any;
  month= [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  options: any = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'No Of Subsidiaries - Agewise Analysis'
    },
    xAxis: {
      categories: ['0 to 30 Days', '30 to 90 Days', '90 to 180 Days', '180+ Days']

    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'No of Subsidairy Accounts',
      data: [],
      color: '#b134eb'
    }]
  }
  subsidairyChartOptions: any = {};
  utillizationChartOptions: any = {};
  limitsSanctionedChartOptions: any = {};

  constructor(public baseService: BaseService) { 
    this.ageingCurConv = "Amount in Rupees";
  }

  ngOnInit() {
    this.getXmlDataForAgeingOnInit();
  }

  onRefreshClick(){
    this.getXmlDataForAgeingOnInit();
  }

  onExcelDownload(){
    let finDateVal = "";
    let dateVal = this.ageFromDate;
    
    if(dateVal){
      finDateVal = dateVal.getDate() + '-' + this.month[dateVal.getMonth()] + '-' + dateVal.getFullYear();
    }

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let url =Url.customerAgeingDownload +'?requestUUID='+requestUUID+'&messageDateTime='+messageDateTime+'&acctOpenDate='+finDateVal;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  private getXmlDataForAgeingOnInit() {
    const headers =this.baseService.getHeaders();

    let finDateVal = "";
    let dateVal = this.ageFromDate;

    if(dateVal){
      finDateVal = dateVal.getDate() + '-' + this.month[dateVal.getMonth()] + '-' + dateVal.getFullYear();
    }

    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;
    
    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.AcctOpenDate = finDateVal;

    this.baseService._makeRequest(Url.aegingXmlUrl,
      body, 
      'POST', {
      responseType: 'application/xml',
      headers: headers
    }).subscribe((res) => {
      this.parseXML(res,this.ageingCurConv).then((parseData) => {
        this.aegingParsedData = parseData;
        this.aegingParsedData.forEach((filteredData) => {
          this.options.series[0].data = [];
          if (filteredData.Heads == 'No of Subsidiary Accounts') {
            for (var key in filteredData) {
              if (key != 'Heads' && key != 'Total') {
                this.options.title.text ='No of Subsidiary Accounts - Agewise Analysis';
                this.options.series[0].name ='No of Subsidiary Accounts';
                this.options.series[0].color = '#b134eb';
                this.options.series[0].data.push(+filteredData[key]);
                this.subsidairyChartOptions  =  JSON.parse(JSON.stringify(this.options));
              }
            }
          }
          
           if (filteredData.Heads == 'Allocated Limits') {
            for (var key in filteredData) {
              if (key != 'Heads' && key != 'Total') {
                this.options.title.text ='Limits Sanctioned - Agewise Analysis';
                this.options.series[0].name ='Limits Sanctioned';
                this.options.series[0].color = '#00ccff';
                this.options.series[0].data.push(+filteredData[key]);
                this.limitsSanctionedChartOptions  = JSON.parse(JSON.stringify(this.options));
              }
            }
          }
        });

        this.prepareUtilizationPercentage(this.aegingParsedData);
        
        // columnchart with negative values
          Highcharts.chart('subsidairyColumnChart', this.subsidairyChartOptions);
          Highcharts.chart('utillizationColumnChart', this.utillizationChartOptions);
          Highcharts.chart('limitsSanctionedColumnChart', this.limitsSanctionedChartOptions);
      })
    });
  }
  prepareUtilizationPercentage(aegingParsedData: any) {
    if(aegingParsedData != undefined){
      let allocatedLimits:any;
      let untilizedLimits:any;
      for(let i=0;i<aegingParsedData.length;i++){
        let ageingEntry = aegingParsedData[i];
        if (ageingEntry.Heads == 'Allocated Limits') {
          allocatedLimits = ageingEntry;
        }else if(ageingEntry.Heads == 'Utilized Limits'){
          untilizedLimits = ageingEntry;
        }
      }

      for (var key in untilizedLimits) {
        if (key != 'Heads' && key != 'Total') {
          for (var alkey in allocatedLimits) {
            if (alkey != 'Heads' && alkey != 'Total' && alkey == key) {
              let percentageVal = (untilizedLimits[key]/allocatedLimits[alkey])*100;
              percentageVal = (Number)(percentageVal.toFixed(2));
              this.options.title.text ='Utilization Percentage - Agewise Analysis';
              this.options.series[0].name ='Utilization Percentage';
              this.options.series[0].color = '#34ebcd';
              this.options.series[0].data.push(percentageVal);
              this.utillizationChartOptions  =  JSON.parse(JSON.stringify(this.options));
            }
          }
        }
      }
    }
  }
  
  onItemChange(value?:any){
    this.getXmlDataForAgeingOnInit();
  }

  // on submit the date
  onSubmit(ageFromDate){
    this.getXmlDataForAgeingOnInit();
  }

  // parse the XML data
  parseXML(data,ageingCurConval) {
    return new Promise(resolve => {
      var k: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      let itemArr = [];
      parser.parseString(data, function (err, result) {
        var obj = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].CustDtls[0];
        let objCount = 0;
        let rowCount = 0;
        let rowArray: any = {};
        for (var k in obj) {

          if (objCount == 5) {
            objCount = 0;
            itemArr.push(rowArray);
            rowArray = {};
            rowCount = rowCount + 1;
          }
          let amount = obj[k][0];
          if (rowCount != 0){
            if(ageingCurConval == "Amount in Crores"){
              amount = amount/10000000;
              amount = parseFloat(amount).toFixed(2);
            }else{
              amount = parseFloat(amount).toFixed(2);
            }
          }

          if (objCount == 0) {
            if (rowCount == 0) {
              rowArray.Heads = "No of Subsidiary Accounts";
            } else if (rowCount == 1) {
              rowArray.Heads = "Allocated Limits";
            } else if (rowCount == 2) {
              rowArray.Heads = "Utilized Limits";
            } else if (rowCount == 3) {
              rowArray.Heads = "Un-Utilized Limits";
            }
            rowArray.Total = amount;
          } else if (objCount == 1) {
            rowArray.to30days = amount;
          } else if (objCount == 2) {
            rowArray.to90days = amount;
          } else if (objCount == 3) {
            rowArray.to180days = amount;
          } else if (objCount == 4) {
            rowArray.morethan180days = amount;
          }
          objCount = objCount + 1;
          if (objCount == 5 && rowCount == 3) {
            itemArr.push(rowArray);
          }
        }
        
        resolve(itemArr);
      });
    });
  }
}