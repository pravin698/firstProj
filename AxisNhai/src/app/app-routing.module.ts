import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AccountComponent } from './component/account/account.component';
import { HomeComponent } from './component/home/home.component';
import { FinancialsummarryComponent } from './component/financialsummarry/financialsummarry.component';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { RegsitrationComponent } from './component/regsitration/regsitration.component';
import { ZoneComponent } from './component/zone/zone.component';
import { StateComponent } from './component/state/state.component';
import { RegionalofficeComponent } from './component/regionaloffice/regionaloffice.component';
import { ProjectdirectorsComponent } from './component/projectdirectors/projectdirectors.component';
import { BackdatedfinancialsummaryComponent } from './component/backdatedfinancialsummary/backdatedfinancialsummary.component';
import { TransactionComponent } from './component/transaction/transaction.component';
import { BeneficiarymasterComponent } from './component/beneficiarymaster/beneficiarymaster.component';
import { DatewiselimitComponent } from './component/datewiselimit/datewiselimit.component';
import { LoginLayoutComponent } from './layout/login/login-layout/login-layout.component';
import { MainLayoutComponent } from './layout/main/main-layout/main-layout.component';
import { ExceptionComponent } from './component/exception/exception.component';
import { AwardnumberComponent } from './component/awardnumber/awardnumber.component';
import { AegingComponent } from './component/aeging/aeging.component';
import { CalareconcilationstatementComponent } from './component/calareconcilationstatement/calareconcilationstatement.component';
import { LimitlewdgerComponent } from './component/limitlewdger/limitlewdger.component';
import { TotallimitsComponent } from './component/totallimits/totallimits.component';
import { HomebackdatedComponent } from './component/homebackdated/homebackdated.component';
import { AwardnumberpopupComponent } from './component/awardnumberpopup/awardnumberpopup.component';
import { SubsidiaryaccountComponent } from './component/subsidiaryaccount/subsidiaryaccount.component';
import { BeneficiarypopupComponent } from './component/beneficiarypopup/beneficiarypopup.component';
import { ROProjectDirectorsComponent } from './component/roproject-directors/roproject-directors.component';
import { UsermanagementComponent } from './component/usermanagement/usermanagement.component';
import { ForgotyourpasswordComponent } from './component/forgotyourpassword/forgotyourpassword.component';
import { OtpforgotyourpasswordComponent } from './component/otpforgotyourpassword/otpforgotyourpassword.component';
//import { OtpforgotyourpasswordComponent } from './component/otpforgotyourpassword/otpforgotyourpassword.component';
import { DeleteusermanagementdatapopupComponent } from './component/deleteusermanagementdatapopup/deleteusermanagementdatapopup.component';
import { UseraccountComponent } from './component/useraccount/useraccount.component';
import { EnterotpforgotpasswordComponent } from './component/enterotpforgotpassword/enterotpforgotpassword.component';
//import { OtpforgotyourusernameComponent } from './component/otpforgotyourusername/otpforgotyourusername.component';
import { ForgotyourusernameComponent } from './component/forgotyourusername/forgotyourusername.component';

//import { ForgotyourusernameComponent } from './component/forgotyourusername/forgotyourusername.component';
import { OtpforgotyourusernameComponent } from './component/otpforgotyourusername/otpforgotyourusername.component';
import { EnterotpforgotusernameComponent } from './component/enterotpforgotusername/enterotpforgotusername.component';
import { AfterVerifyUserNameComponent } from './component/after-verify-user-name/after-verify-user-name.component';
import { AfterVerifypasswordComponent } from './component/after-verifypassword/after-verifypassword.component';
import { NewuserComponent } from './component/newuser/newuser.component';
import { UserchangeworlflowComponent } from './component/userchangeworkflowfolder/userchangeworlflow/userchangeworlflow.component';

import { LockunlockpreviewComponent } from './component/userchangeworkflowfolder/popupsonpreviewbutton/lockunlockpreview/lockunlockpreview.component';
import { CreateuserpreviewComponent } from './component/userchangeworkflowfolder/popupsonpreviewbutton/createuserpreview/createuserpreview.component';


const routes: Routes = [
  //{path:'', redirectTo:'/login', pathMatch:'full'},
  //{path:'login', component:LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login', component: LoginLayoutComponent, data: { title: 'First Component' },
    children: [
      { path: '', component: LoginComponent },
      { path: 'otp', component: OtpforgotyourpasswordComponent },
      { path: 'forgotyourpassword', component: ForgotyourpasswordComponent },
      { path: 'otpforgotyourpassword', component: OtpforgotyourpasswordComponent },
      { path: 'forgotyourusername', component: ForgotyourusernameComponent },
      { path: 'otpforgotyourusername', component: OtpforgotyourusernameComponent },
      { path: 'verifyOtpforusername', component: AfterVerifyUserNameComponent },
      { path: 'verifyOtpforpassword', component: AfterVerifypasswordComponent }

    ]
  },
  {
    path: 'main', component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'homebackdated', component: HomebackdatedComponent },
      { path: 'account', component: AccountComponent },
      { path: 'financialsummary', component: FinancialsummarryComponent },
      { path: 'forgetpassword', component: ForgetpasswordComponent },
      { path: 'registration', component: RegsitrationComponent },
      { path: 'zone', component: ZoneComponent },
      { path: 'state', component: StateComponent },
      { path: 'regionaloffice', component: RegionalofficeComponent },
      { path: 'projectdirectors', component: ProjectdirectorsComponent },
      { path: 'backdatedfinancialsummary', component: BackdatedfinancialsummaryComponent },
      { path: 'transaction', component: TransactionComponent },
      { path: 'beneficiarymaster', component: BeneficiarymasterComponent },
      { path: 'datewiselimit', component: DatewiselimitComponent },
      { path: 'exceptions', component: ExceptionComponent },
      { path: 'awardnumber', component: AwardnumberComponent },
      { path: 'aeging', component: AegingComponent },
      { path: 'calareconcilationstatement', component: CalareconcilationstatementComponent },
      { path: 'limitlewdger', component: LimitlewdgerComponent },
      { path: 'totallimit', component: TotallimitsComponent },
      { path: 'awardnumberpopup', component: AwardnumberpopupComponent },
      { path: 'subsidiaryaccountpopup', component: SubsidiaryaccountComponent },
      { path: 'beneficiarypopup', component: BeneficiarypopupComponent },
      { path: 'pdrelatetoroPopup', component: ROProjectDirectorsComponent },
      { path: 'usermanagement', component: UsermanagementComponent },
      //{path:'beneficiarypopup', component:beneficiarypopupComponent},
      { path: 'pdrelatetoroPopup', component: ROProjectDirectorsComponent },
      { path: 'forgotyourpassword', component: ForgotyourpasswordComponent },
      { path: 'otpforgotyourpassword', component: OtpforgotyourpasswordComponent },
      { path: 'deleteuserdatapopup', component: DeleteusermanagementdatapopupComponent },
      { path: 'useraccount', component: UseraccountComponent },
      { path: 'enetrotpforgotpassword', component: EnterotpforgotpasswordComponent },
      { path: 'useraccount/:id', component: UseraccountComponent },
      { path: 'enterotpforgotusername', component: EnterotpforgotusernameComponent },
      { path: 'newuser', component: NewuserComponent },
      {path:'userchangeworkflow',component:UserchangeworlflowComponent},
      
      {path:'lockunlockpreview',component:LockunlockpreviewComponent},
      {path:'createuserpreview',component:CreateuserpreviewComponent}
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
