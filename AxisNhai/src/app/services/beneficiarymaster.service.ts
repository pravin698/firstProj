import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import{beneficiarymasterElement} from '../models/beneficiarymaster';


@Injectable({
    providedIn: 'root'
  })
  export class BeneficiarymasterServices {
  
    list: beneficiarymasterElement[] = [
      {Sno: 1, beneficiaryname:'Abhishek', beneficiarybankaccount:454245, ifsicode:1234,  balance:12345, update:false, delete: true},
      {Sno: 1, beneficiaryname:'Abhishek', beneficiarybankaccount:454245, ifsicode:1234,  balance:12345, update:false, delete:true}
      ];
    list$: BehaviorSubject<beneficiarymasterElement[]> = new BehaviorSubject(this.list);

constructor() {


  }
}