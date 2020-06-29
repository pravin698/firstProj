import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { AccountComponent } from './component/account/account.component';
import { HeaderComponent } from './component/shared/header/header.component';
import { FooterComponent } from './component/shared/footer/footer.component';
import { FinancialsummarryComponent } from './component/financialsummarry/financialsummarry.component';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { RegsitrationComponent } from './component/regsitration/regsitration.component';
import {MatDatepickerModule, MatInputModule,MatNativeDateModule, MatRadioModule} from '@angular/material';
import { ZoneComponent } from './component/zone/zone.component';
import { StateComponent } from './component/state/state.component';
import { RegionalofficeComponent } from './component/regionaloffice/regionaloffice.component';
import { ProjectdirectorsComponent } from './component/projectdirectors/projectdirectors.component';
import { BackdatedfinancialsummaryComponent } from './component/backdatedfinancialsummary/backdatedfinancialsummary.component';
import { TransactionComponent } from './component/transaction/transaction.component';
import { BeneficiarymasterComponent } from './component/beneficiarymaster/beneficiarymaster.component';
import { DatewiselimitComponent } from './component/datewiselimit/datewiselimit.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginLayoutComponent } from './layout/login/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main/main-layout/main-layout.component';
import { ExceptionComponent } from './component/exception/exception.component';
import { CalareconcilationstatementComponent } from './component/calareconcilationstatement/calareconcilationstatement.component';
import { AwardnumberComponent } from './component/awardnumber/awardnumber.component';
import {MatBadgeModule} from '@angular/material/badge'
import { AegingComponent } from './component/aeging/aeging.component';
import { LimitlewdgerComponent } from './component/limitlewdger/limitlewdger.component';
import { TotallimitsComponent } from './component/totallimits/totallimits.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FocusableDirective } from './directives/focusable.directive';
import { EditableComponent } from './editable/editable.component';
import { ViewModeDirective } from './editable/view-mode.directive';
import { EditModeDirective } from './editable/edit-mode.directive';
import { EditableOnEnterDirective } from './editable/edit-on-enter.directive';
import { HomebackdatedComponent } from './component/homebackdated/homebackdated.component';
import { AwardnumberpopupComponent } from './component/awardnumberpopup/awardnumberpopup.component';
import { SubsidiaryaccountComponent } from './component/subsidiaryaccount/subsidiaryaccount.component';
import { BeneficiarypopupComponent } from './component/beneficiarypopup/beneficiarypopup.component';
import { ROProjectDirectorsComponent } from './component/roproject-directors/roproject-directors.component';
import { UsermanagementComponent } from './component/usermanagement/usermanagement.component';
import { ForgotyourpasswordComponent } from './component/forgotyourpassword/forgotyourpassword.component';
import { OtpforgotyourpasswordComponent } from './component/otpforgotyourpassword/otpforgotyourpassword.component';
import { DeleteusermanagementdatapopupComponent } from './component/deleteusermanagementdatapopup/deleteusermanagementdatapopup.component';
import { UseraccountComponent } from './component/useraccount/useraccount.component';

import { EnterotpforgotpasswordComponent } from './component/enterotpforgotpassword/enterotpforgotpassword.component';
import { ForgotyourusernameComponent } from './component/forgotyourusername/forgotyourusername.component';
import { OtpforgotyourusernameComponent } from './component/otpforgotyourusername/otpforgotyourusername.component';
import { EnterotpforgotusernameComponent } from './component/enterotpforgotusername/enterotpforgotusername.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { AfterVerifyUserNameComponent } from './component/after-verify-user-name/after-verify-user-name.component';
import { AfterVerifypasswordComponent } from './component/after-verifypassword/after-verifypassword.component';
import { BotDetectCaptchaModule } from 'angular-captcha';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NewuserComponent } from './component/newuser/newuser.component';
import { UserchangeworlflowComponent } from './component/userchangeworkflowfolder/userchangeworlflow/userchangeworlflow.component';

import { LockunlockpreviewComponent } from './component/userchangeworkflowfolder/popupsonpreviewbutton/lockunlockpreview/lockunlockpreview.component';
import { CreateuserpreviewComponent } from './component/userchangeworkflowfolder/popupsonpreviewbutton/createuserpreview/createuserpreview.component';
import { CustomCurrencyPipe } from './utilities/pipes/currency.pipe';
import { CurrencyPipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomebackdatedComponent,
    LoginComponent,
    AccountComponent,
    HeaderComponent,
    FooterComponent,
    FinancialsummarryComponent,
    ForgetpasswordComponent,
    RegsitrationComponent,
    ZoneComponent,
    StateComponent,
    RegionalofficeComponent,
    ProjectdirectorsComponent,
    BackdatedfinancialsummaryComponent,
    TransactionComponent,
    ProjectdirectorsComponent,
    BeneficiarymasterComponent,
    DatewiselimitComponent,
    NavigationComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    ExceptionComponent,
    AwardnumberComponent,
    AegingComponent,
    CalareconcilationstatementComponent,
    LimitlewdgerComponent,
    TotallimitsComponent,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
    FocusableDirective, 
    EditableOnEnterDirective,
    AwardnumberpopupComponent,
    SubsidiaryaccountComponent,
    BeneficiarypopupComponent,
    ROProjectDirectorsComponent,
    UsermanagementComponent,
    ROProjectDirectorsComponent,
    ForgotyourpasswordComponent,
    OtpforgotyourpasswordComponent,
    DeleteusermanagementdatapopupComponent,
    UseraccountComponent,
    EnterotpforgotpasswordComponent,
    ForgotyourusernameComponent,
    EnterotpforgotusernameComponent,
    OtpforgotyourusernameComponent,
    AfterVerifyUserNameComponent,
    AfterVerifypasswordComponent,
    NewuserComponent,
    UserchangeworlflowComponent,
    LockunlockpreviewComponent,
    CreateuserpreviewComponent,
    CustomCurrencyPipe
  ],
  imports: [
    BrowserModule,
    NgOtpInputModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatBadgeModule,
    CoreModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BotDetectCaptchaModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
