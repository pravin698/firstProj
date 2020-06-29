import { Component, OnInit } from '@angular/core';

import { MatDialogConfig, MatDialog } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { BeneficiarypopupComponent } from '../beneficiarypopup/beneficiarypopup.component';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Url } from 'src/app/core/services/url';

@Component({
  selector: 'app-beneficiarymaster',
  templateUrl: './beneficiarymaster.component.html',
  styleUrls: ['./beneficiarymaster.component.scss']
})
export class BeneficiarymasterComponent implements OnInit {
  totalCount: any;
  pageSize:any = 10;
  fromCount: any = 1;
  toCount: any = 10;
  dataSource: any;

  constructor(public baseService: BaseService, public dialog: MatDialog) {  }

  displayedColumns: string[] = ['no', 'beneficiaryname', 'beneficiarybankaccount', 'ifsccode', 'balance', 'debitAct', 'calaActName'];
  
  ngOnInit() {
    this.getBeneficiaryDate();
  }

  pageEvent(event){
    this.fromCount = (event.pageIndex*event.pageSize)+1;
    this.toCount =  (event.pageIndex+1)*event.pageSize;
    this.getBeneficiaryDate();
  }

  onExcelDownloadClick(){
    
    let tailString =  "?fromCount=1"+"&toCount="+this.toCount;

    let url =Url.beneficiaryMasterDownload+tailString;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }

  getBeneficiaryDate() {
    const headers =this.baseService.getHeaders();
    
    let url = Url.beneficiaryMaster+"?fromCount="+this.fromCount+'&toCount='+this.toCount;

    this.baseService._makeRequest(url,
      {},
      'GET', {
      responseType: 'application/json',
      headers: headers
    }).subscribe((res:string) => {
      if(res){
        let beneficiaryMasterData = JSON.parse(res);
        if(beneficiaryMasterData){
          this.dataSource = beneficiaryMasterData[0];
          this.totalCount = beneficiaryMasterData[1];
        }
      }
    });
  }

  getDateRefresh(){
    this.getBeneficiaryDate();
  }
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = false;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(BeneficiarypopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'success'){
        this.getBeneficiaryDate();
      }
    });
  }
}