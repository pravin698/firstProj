// import { Inject, Injectable, Optional } from '@angular/core';
// import { DateAdapter, NativeDateAdapter } from '@angular/material';

// export class AppDateAdapter extends NativeDateAdapter {
//   parse(value: any): any {
//     if (value) {
//       const timestamp = typeof value === 'number' ? value : Date.parse(value);
//       let date_regex = /([0-9]{2}[0-9]{1}\d{1})-([0]{1}[1-9]{1}|[1]{1}[0-2]{1})-([0]{1}[1-9]{1}|[12]{1}\d{1}|[3]{1}[01]{1})/; // Can you own regex or remove it.
//       if (date_regex.test(value)) {
//         return isNaN(timestamp) ? null : new Date(timestamp);
//       } else {
//         return new Date(undefined);
//       }
//     }
//     else {
//       return;
//     }

//   }
//   format(date: Date, displayFormat: Object): string {
//     if (displayFormat == "input") {
//       let day = date.getDate();
//       let month = date.getMonth() + 1;
//       let year = date.getFullYear();
//       let finalDate = `${year}-${this._to2digit(month)}-${this._to2digit(day)}`; // FORMAT IS YYYY-MM-DD  while default format is mm/dd/yyyy
//       return finalDate;
//     } else {

//       return date.toDateString();
//     }
//   }

//   private _to2digit(n: number) {
//     return ('00' + n).slice(-2);
//   }
// }


// export const APP_DATE_FORMATS =
// {
//   parse: {
//     dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
//   },
//   display: {
//     //dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
//     dateInput: 'input',
//     monthYearLabel: { month: 'short', year: 'numeric', day: 'numeric' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'short', month: 'long' },
//   }
// }