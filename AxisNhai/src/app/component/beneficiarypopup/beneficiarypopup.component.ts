import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { BaseService } from 'src/app/core/base.service';
import { Url } from 'src/app/core/services/url';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-beneficiarypopup',
  templateUrl: './beneficiarypopup.component.html',
  styleUrls: ['./beneficiarypopup.component.scss']
})
export class BeneficiarypopupComponent implements OnInit {
  BenificiarypopupFormGroup: FormGroup;
  // beneficiaryName:any = "";
  // accountnumber:any = "";
  // ifscCode:any = "";
  // amount:any = "";
  // debitact:any = "";
  // calaActName:any = "";
  durationInSeconds = 5;
  upladUrl = "";
  uploadedFile: File;
  file:any;
  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder,public baseService: BaseService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,private dialogRef:MatDialogRef<BeneficiarypopupComponent>) { }

  ngOnInit() {
    this.upladUrl = Url.uploadBeneficiaryDetails;
    this.BenificiarypopupFormGroup = this.fb.group({
      BenificiaryNamecontorl: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9_-]*$/)]),
      ActNumbercontorl: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]*$/)]),
      Ifsccodecontorl: new FormControl('', [Validators.pattern(/^[A-Z0-9]*$/)]),
      amountcontorl: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
      debitactcontorl: new FormControl('', [Validators.pattern(/^[0-9]*$/)]),
      calaactcontorl: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9]*$/)])
    });
  }

  getURL(){
    return Url.uploadBeneficiaryDetails;
  }
  onSave(event){

    if(this.BenificiarypopupFormGroup.controls["BenificiaryNamecontorl"].value == "" || this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value == "" || this.BenificiarypopupFormGroup.controls["Ifsccodecontorl"].value == "" 
    ||this.BenificiarypopupFormGroup.controls["amountcontorl"].value == "" || this.BenificiarypopupFormGroup.controls["debitactcontorl"].value == "" || this.BenificiarypopupFormGroup.controls["calaactcontorl"].value == "" ){
      this._snackBar.open("Please fill all beneficiary details", "", {
        duration: 2000,
      });
      return;
    }
    if (this.BenificiarypopupFormGroup.valid) {
    let actNumber = "";
    if(this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value != null && this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value != undefined &&this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value != ""){
      actNumber = this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value;
    }

    let amountVal = "";
    if(this.BenificiarypopupFormGroup.controls["amountcontorl"].value != null && this.BenificiarypopupFormGroup.controls["amountcontorl"].value != undefined && this.BenificiarypopupFormGroup.controls["amountcontorl"].value != ""){
      amountVal = this.BenificiarypopupFormGroup.controls["amountcontorl"].value;
    }

    let debitactVal = "";
    if(this.BenificiarypopupFormGroup.controls["debitactcontorl"].value != null && this.BenificiarypopupFormGroup.controls["debitactcontorl"].value != undefined && this.BenificiarypopupFormGroup.controls["debitactcontorl"].value != ""){
      debitactVal =this.BenificiarypopupFormGroup.controls["debitactcontorl"].value;
    }
  
    let body: any = {};
    var messageDateTime = new Date().toISOString().slice(0, -1);
    var requestUUID = `SS20_${this.baseService.randomStr()}`;    
    body.requestuuid = requestUUID;
    body.messagedatetime = messageDateTime;
    body.beneficiaryname = this.BenificiarypopupFormGroup.controls["BenificiaryNamecontorl"].value;
    body.accountnumber = this.BenificiarypopupFormGroup.controls["ActNumbercontorl"].value;
    body.ifsccode = this.BenificiarypopupFormGroup.controls["Ifsccodecontorl"].value;
    body.amount = this.BenificiarypopupFormGroup.controls["amountcontorl"].value;
    body.debitact = this.BenificiarypopupFormGroup.controls["debitactcontorl"].value;
    body.calactname = this.BenificiarypopupFormGroup.controls["calaactcontorl"].value;
    body.createddate = new Date().toISOString();
    body.updateddate = new Date().toISOString();
  
    const headers =this.baseService.getHeaders();
    
    this.baseService._makeRequest(Url.saveBeneficiaryMaster,
      body,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res == 'Success'){
        this._snackBar.open("Beneficiary details saved successfully", "", {
          duration: 2000,
        });
        this.dialogRef.close('success');
      }else{
        this._snackBar.open("Beneficiary details save operation failed", "", {
          duration: 2000,
        });
      }
    });
  }
  }

  readFile(fileEvent: any) {
    this.uploadedFile = fileEvent.target.files[0];
    let fileType = this.uploadedFile.type;
    if(this.uploadedFile.type == ""){
      fileType = (this.uploadedFile.name).split('.')[1];
    }
    if (!(fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          fileType == 'application/vnd.ms-excel'  || fileType == 'text/csv'  || fileType == 'csv')) {
        // clear the input 
        this._snackBar.open("Invalid file type uploaded", "", {
          duration: 2000,
        });
        this.file = '';
        this.uploadedFile = null;
        return false;
    }
  }

  uploadFile(){
    if(this.uploadedFile && this.uploadFile != null){
    const fileUpload = new FormData();
    fileUpload.set('file', this.uploadedFile);
    //fileUpload.set('enctype',"multipart/form-data");
    const headers =this.baseService.getHeaders();
    
    this.baseService._makeRequest(Url.uploadBeneficiaryDetails,
      fileUpload,
      'POST', {
      responseType: 'application/text',
      headers: headers
    }).subscribe((res:string) => {
      if(res == 'Success'){
        this._snackBar.open("File uploaded successfully", "", {
          duration: 2000,
        });
        this.dialogRef.close('success');
      }else{
        this._snackBar.open("File upload failed", "", {
          duration: 2000,
        });
      }
    });
  } else {
    this._snackBar.open("Please choose file to upload", "", {
      duration: 2000,
    });
  }
}

  onTemplateDownload(event){
    let url =Url.beneficiaryUploadTemplate;
    localStorage.setItem('popUpManagement','true');
    window.open(url, "_self", "width=600,height=300");
    localStorage.setItem('popUpManagement','false');
  }
}
