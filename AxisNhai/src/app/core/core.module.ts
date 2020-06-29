import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CsrfService } from './services/csrf/csrf.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { JwtInterceptor } from './interceptors/token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[CsrfService,
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },]
})
export class CoreModule { }
