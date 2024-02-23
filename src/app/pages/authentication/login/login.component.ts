import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../Services/login.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { TokenService } from '../../../Services/token.service';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class LoginComponent {

  loginFormGroup:FormGroup;
  hide = true;
  userCredential : any;
  expiryDate : number;

  constructor(private _formBuilder : FormBuilder,
              private router : Router, 
              public _dialog: MatDialog, 
              private _loginService : LoginService, 
              private _commonService : CommonService, 
              private _tokenService : TokenService, 
              private _commonSpinner : CommonSpinnerService)
  {
    this.loginFormGroup = this._formBuilder.group({
      UserId : ['',Validators.required],
      Password : ['',Validators.required]
    })
  }

  ngOnInit() 
  {
    if(localStorage.getItem('VendorToken'))
    {
      this.userCredential = this._tokenService.decryptToken(localStorage.getItem('VendorToken'));

      this.router.navigate(['pages/vendoradvancepages/dashboard'])
      // .then(() => 
      // {
      //   this._commonService.openSnackbar(`Welcome Back, ${this.userCredential.Username}`, snackbarStatus.Success);
      // });
    }
  }

  OpenForgotPasswordDialog(choice : string){
    this.loginFormGroup.reset();
    const dialogRef = this._dialog.open(ForgotPasswordDialogComponent, {
      disableClose: true,
      backdropClass: 'userActivationDialog',
      data : choice,
    }).afterClosed()
    .subscribe((res) => {
      if(res == "Change Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
      else if(res == "Forgot Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
    });
  }

  Login(){
    if(this.loginFormGroup.valid)
    {
      this._commonSpinner.showSpinner();
      this._loginService.authentication(this.loginFormGroup.value).subscribe({
        next : (response) => 
        {


          this._loginService.getPasswordValidity(this.loginFormGroup.value.UserId).then(
            (data) => 
            {
              this.expiryDate = data;

            if(this.expiryDate < 90)
            {


              // console.log(response);
              localStorage.setItem("VendorToken", response.Token);
              this._tokenService.getUserName(response.Token);
              this._commonSpinner.hideSpinner();
              this.router.navigate(['pages/vendoradvancepages/dashboard']).then(() => 
              {
                this._commonService.openSnackbar("Login Successfully", snackbarStatus.Success);
              });
            }
            else
            {
              this._commonSpinner.hideSpinner();
              this.loginFormGroup.reset();
              this.OpenForgotPasswordDialog("Change Password");
            }

      }
    ).catch((err) => 
    {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    })
        },error : (err) => {
          this._commonSpinner.hideSpinner();
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      })
    }
    else
    {
      if(this.loginFormGroup.controls.UserId.invalid && this.loginFormGroup.controls.Password.invalid)
      {
        this._commonService.openSnackbar("Enter User Id, Password", snackbarStatus.Danger);
        this.loginFormGroup.markAllAsTouched();
      }
      else if(this.loginFormGroup.controls.UserId.invalid)
      {
        this._commonService.openSnackbar("Enter User Id", snackbarStatus.Danger);
        this.loginFormGroup.controls.UserId.touched;
      }
      else if(this.loginFormGroup.controls.Password.invalid)
      {
        this._commonService.openSnackbar("Enter Password", snackbarStatus.Danger);
        this.loginFormGroup.controls.Password.touched;
      }
    }
  }

}
