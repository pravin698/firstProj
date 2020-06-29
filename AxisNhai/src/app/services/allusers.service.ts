import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

import { AllUsersElement } from '../models/allusers';

@Injectable({
  providedIn: 'root'
})
export class AllUsersService {

  list: AllUsersElement[] = [
    {firstname: 'Siddharth', lastname:'leafd',Email:'leafdsid@gmail.com',Rolename:'Central',Rolevalue:'-',mobilenumber:454245,Loginname:'sidleafd',Isactive:true,Edit:false,changepassword:false},
    {firstname: 'Siddharth', lastname:'leafd',Email:'leafdsid@gmail.com',Rolename:'Central',Rolevalue:'-',mobilenumber:454245,Loginname:'sidleafd',Isactive:true,Edit:false,changepassword:false},
    {firstname: 'Siddharth', lastname:'leafd',Email:'leafdsid@gmail.com',Rolename:'Central',Rolevalue:'-',mobilenumber:454245,Loginname:'sidleafd',Isactive:true,Edit:false,changepassword:false}
  ];
  list$: BehaviorSubject<AllUsersElement[]> = new BehaviorSubject(this.list);

  constructor() {
  }


  update(index, field, value) {
    this.list = this.list.map((e, i) => {
      if (index === i) {
        return {
          ...e,
          [field]: value
        }
      }
      return e;
    });
    this.list$.next(this.list);
    
  }

  getControl(index, fieldName) {
    
  }
}