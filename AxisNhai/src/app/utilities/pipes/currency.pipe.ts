import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';


@Pipe({ name: 'customCurrencyPipe' })
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) { }
  transform(value: number): string {
    /// To display the currency in INR format and empty string to suppress the symbol
    return this.currencyPipe.transform(value, 'INR', '');
  }
}