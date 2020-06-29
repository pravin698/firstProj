import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt/jwt.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import 'rxjs/add/operator/do';
import { UserService } from '../services/user/user.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private dialogRef: MatDialog,private jwtService: JwtService,
        private router: Router,private _snackBar: MatSnackBar,private userService:UserService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let jwtJoken = this.jwtService.getToken();
        if (jwtJoken && jwtJoken !== null) {
            request = request.clone({
                setHeaders: {
                    Authorization: `${jwtJoken}`
                }
            });
        }

        // return next.handle(request).do(
        // (event: HttpEvent<any>) => {
           
        // }, (err: any) => {
        //     console.log(err instanceof HttpErrorResponse);
        //     if (err instanceof HttpErrorResponse) {
        //       console.log(err);
        //     }
        // });
       
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {}
        },(event: any) => {
            //If it is coming here means it is an error , so error ok also will be redirected to login page
            if(event == "Forbidden" || event == "OK" ) {
                this.dialogRef.closeAll();
                
                this._snackBar.open("Token Expired, Redirecting to login page", "", {
                    duration: 8000,
                });

                this.userService.logout();
                //this.router.navigateByUrl('/login');
            }
        }));
    }
}