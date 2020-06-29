import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-after-verify-user-name',
  templateUrl: './after-verify-user-name.component.html',
  styleUrls: ['./after-verify-user-name.component.scss']
})
export class AfterVerifyUserNameComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AfterVerifyUserNameComponent>,
    private router: Router) {

  }

  ngOnInit() {
  }

  onForgotUserOk() {
    this.dialogRef.close();
    this.router.navigateByUrl('/login');
  }

}
