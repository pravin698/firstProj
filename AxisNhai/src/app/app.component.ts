import { Component, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserService } from './core/services/user/user.service';
import { StateServiceService } from './core/services/state-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AxisNhai';
  showHead: boolean = false;

  constructor(private router: Router,private userService: UserService) {
    // on route change to '/login', set the variable showHead to false
      // router.events.forEach((event) => {
      //   if (event instanceof NavigationStart) {
      //     if (event['url'] == '/login') {
      //       this.showHead = false;
      //     } else {
      //       this.showHead = true;
      //     }
      //   }
      // });
    }

  //   // Keep me Signed in
  // public doUnload(): void {
  //   this.doBeforeUnload();
  // }

  // Keep me Signed in
  public doBeforeUnload(event): void {
    let isFromPopUp = localStorage.getItem('popUpManagement');
    if(isFromPopUp == 'true'){
      return;
    }
    this.userService.logout();
    setTimeout(()=>function(){
      console.log('Waiting for logout');
    },10000);
  }
}
