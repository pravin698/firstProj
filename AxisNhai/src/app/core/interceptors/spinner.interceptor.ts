import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {


    constructor(private spinnerService: Ng4LoadingSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /// start the loader
        this.showLoader();
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                /// Time to finish the loader
                this.onEnd();
            }
        },
            (err: any) => {
                /// Oops error ! End the loader
                this.onEnd();
            }));
    }


    private onEnd(): void {
        this.spinnerService.hide();
    }
    private showLoader(): void {
        this.spinnerService.show();
    }
}
