import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import xml2js from 'xml2js';
import * as _ from 'lodash';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubsidiaryaccountComponent } from '../subsidiaryaccount/subsidiaryaccount.component';
import { Constants } from 'src/app/core/services/constants';

@Component({
  selector: 'app-projectdirectors',
  templateUrl: './projectdirectors.component.html',
  styleUrls: ['./projectdirectors.component.scss']
})
export class ProjectdirectorsComponent implements OnInit {
  dataSources: any;
  radioValue1: string;
  radioValue2: string;
  totalCount: any;
  pageSize: any = 10;
  fromCount = 1;
  toCount = 10;
  projecrParsedData: any;
  //dataSource = new MatTableDataSource;
  //dataSource: any;
  pageIndex = 0;

  //@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  constructor(public dialog: MatDialog, public baseService: BaseService, public http: HttpClient) {
    this.radioValue1 = "Account Number";
    this.radioValue2 = "Amount in Rupees";
    this.pageSize = 10;
  }

  ngOnInit() {
    this.getxmldataforpddetailsOnInit();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['no', 'projectname', 'projectlocation', 'regionalname', 'regionallocation', 'zonename', 'subsidiaryaccount', 'totlelimit', 'usedlimit', 'fundused'];
  // dataSource = new MatTableDataSource<PeriodicElement> (ELEMENT_DATA);

  openDialogSubsidiaryAccount(ProjectDirectorName?: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      pdName: ProjectDirectorName
    }
    const dialogRef = this.dialog.open(SubsidiaryaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  private getxmldataforpddetailsOnInit(value?: any, radioBtnValue1?: any, date?: any) {
    const headers =this.baseService.getHeaders();
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let body: any = {};
    body.RequestUUID = requestUUID;
    body.MessageDateTime = messageDateTime;
    body.From_count = (this.fromCount).toString();
    body.To_count = (this.toCount).toString();

    this.baseService._makeRequest(Url.projectdirectorsXmlUrl,
      body,
      'POST', {
      responseType: 'application/xml',
      headers: headers
    })
      .subscribe((res) => {
        this.parseXML(res).then((parseData) => {
          this.totalCount = parseData[1];
          this.projecrParsedData = parseData[0];
         // this.dataSource.data = this.projecrParsedData;
          let value = this.radioValue2;
          this.projecrParsedData.forEach((data) => {
            if (data.TotLimit) {
              if (value == "Amount in Rupees") {
                data.TotLimit = (data.TotLimit)
              } else {
                data.TotLimit = ((data.TotLimit) / 10000000)
              }
            }
            if (data.UsedLimit) {
              if (value == "Amount in Rupees") {
                data.UsedLimit = (data.UsedLimit)
              } else {
                data.UsedLimit = ((data.UsedLimit) / 10000000)
              }
            }
          });
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
        var arr = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0];
        var totalcount = result.FIXML.Body[0].executeFinacleScriptResponse[0].executeFinacleScript_CustomData[0].totRecCnt[0];
        let arra = [];
        let subAccount = arr.PDDetails;
        subAccount.forEach(element => {
          for (a in element) {
            element[a] = element[a][0];
          }
          arra.push(element);
        });
        let resolvedArr = [arra, totalcount]
        resolve(resolvedArr);
      });
    });
  }

  onItemChange(value?: any) {
    this.getxmldataforpddetailsOnInit();
  }

  // search method with input
  onSearch() {
    this.getxmldataforpddetailsOnInit();
  }

  // on submit the date
  onSubmit() {
    this.onSearch();
  }

  pageEvent(event) {
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getxmldataforpddetailsOnInit();
  }

  onExcelDownload(){
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS09_${this.baseService.randomStr()}`;

    let tailString =  "?requestUUID="+requestUUID+"&messageDateTime="+messageDateTime+
    "&fromCount=1"+"&toCount="+this.toCount;
    
    let url =Url.PDDetailsReqDownload +tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300"); 
    localStorage.setItem('popUpManagement','false');
  }


  onRefreshClick()
  {
    this.getxmldataforpddetailsOnInit();
  }
}

