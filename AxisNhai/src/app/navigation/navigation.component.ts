import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { StateServiceService } from '../core/services/state-service.service';
import { BaseService } from '../core/base.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Url } from '../core/services/url';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit,OnChanges {

  navicData: any;
  constructor(private stateService: StateServiceService,private router: Router, private _snackBar: MatSnackBar, public baseService: BaseService) { }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  OnChanges(){

  }

  @ViewChild('drawer', { static: true }) input: ElementRef;
  
  ngOnInit() {
    let url = Url.navicNormal;
    try {
      let data:any  = this.stateService.data;
      url  = data[0].Url;
    } catch (error) {
      
    }
    let body: any = {};
    const headers =this.baseService.getHeaders();

    this.baseService._makeRequest(url,
      body,
      'GET', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res){
        let response = JSON.parse(res);
        this.navicData = response.NavicTree;
        let navigation:any = this.input;
        navigation.toggle();
        navigation.toggle();
      }
    });
  }
}
