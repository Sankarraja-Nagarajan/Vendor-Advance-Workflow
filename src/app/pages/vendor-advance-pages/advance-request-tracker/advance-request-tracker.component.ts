import { Component, ViewEncapsulation } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorService } from '../../../Services/vendor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { TokenService } from '../../../Services/token.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { FileSaverService } from '../../../Services/file-saver.service';
import { TrackingDialogComponent } from '../tracking-dialog/tracking-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-advance-request-tracker',
  templateUrl: './advance-request-tracker.component.html',
  styleUrls: ['./advance-request-tracker.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AdvanceRequestTrackerComponent {

  vendorForm : FormGroup;
  userDetails : any;
  purchaseVerifiers : any;
  trackingNo : number;
  showapproval : boolean = true;
  showapprovalReject : boolean = true;
  showDownloadAttachment : boolean = false;
  approveColumns : string [] = ['Role-col', 'Name-col', 'Status-col'];
  approveDataSource = new MatTableDataSource();
  files : any;

  spl = [
    {
      Sg : 'A',
      Description : 'Down payment'
    },
    {
      Sg : 'B',
      Description : 'Bill of exchange receivable'
    },
    {
      Sg : "C",
      Description : "RE Rent deposit (N/A)"
    },
    {
      Sg : "D",
      Description : "Advance from Customer"
    },
    {
      Sg : "E",
      Description : "Reserve for bad debut"
    },
    {
      Sg : "F",
      Description : "Down payment request"
    },
    {
      Sg : "G",
      Description : "Guarantees given"
    },
    {
      Sg : "H",
      Description : " Dealer (AFM) deposit"
    },
    {
      Sg : "I",
      Description : "BR: Vendor Operation (N/A)"
    }, 
    {
      Sg : "J",
      Description : "RE Advance Pymt request (N/A)"
    },
    {
      Sg : "K",
      Description : "RE AP operating costs (N/A)"
    },
    {
      Sg : "M",
      Description : "EMD - Scrap dealers"
    },
    {
      Sg : "O",
      Description : "Other Biling for Tools Etc"
    },
    {
      Sg : "P",
      Description : " Payment request"
    },
    {
      Sg : "Q",
      Description : "B/e residual risk"
    },
    {
      Sg : "R",
      Description : "B/e payment request"
    },
    {
      Sg : "S",
      Description : "Check/bill of exch."
    },
    {
      Sg : "T",
      Description : "Down payment (N/A)"
    },
    {
      Sg : "U",
      Description : "RE AP sales-based rent (N/A)"
    },
    {
      Sg : "W",
      Description : "Bill of exch.(bankable)"
    },
    {
      Sg : "Z",
      Description : "Interest receivable (N/A)"
    },
    {
      Sg : "A",
      Description : " Down payment on current assets"
    },
    {
      Sg : "B",
      Description : " Salary Advance - Employees"
    },
    {
      Sg : "C",
      Description : " Down payment for services"
    },
    {
      Sg : "D",
      Description : " Discounts (N/A)"
    },
    {
      Sg : "E",
      Description : "Other Advances-Employees"
    },
    {
      Sg : "F",
      Description : "Down payment request"
    },
    {
      Sg : "G",
      Description : "Guarantee received"
    },
    {
      Sg : "H",
      Description : " Security deposit (N/A)"
    },
    {
      Sg : "I",
      Description : " Interest Accured - ICD's"
    },
    {
      Sg : "J",
      Description : " Advance for provision"
    },
    {
      Sg : "L",
      Description : " Deposit for leased premises"
    },
    {
      Sg : "M",
      Description : "Fixed asset down premises"
    },
    {
      Sg : "N",
      Description : " Stale Check"
    },
    {
      Sg : "O",
      Description : "Other despoit made by use"
    },
    {
      Sg : "P",
      Description : " Payment request"
    },
    {
      Sg : "R",
      Description : " Retention on credentials"
    },
    {
      Sg : "S",
      Description : " Check/bill of exch."
    },
    {
      Sg : "T",
      Description : "Travel advance to Employees"
    },
    {
      Sg : "V",
      Description : "Festivals Advance - Employees"
    },
    {
      Sg : "W",
      Description : " Bill of exch."
    },
    {
      Sg : "X",
      Description : "Loans - Employees"
    }, 
    {
      Sg : "Y",
      Description : "Welfare Fund Advance"
    }
  ];

constructor(private _vendorService : VendorService, 
            private _fb : FormBuilder, 
            private _commonService : CommonService, 
            private _tokenService : TokenService, 
            private _datepipe : DatePipe, 
            private _activatedRouter : ActivatedRoute, 
            private _commonSpinner : CommonSpinnerService, 
            private _router : Router, 
            private _fileSaver : FileSaverService, 
            public _dialog: MatDialog){

  this.vendorForm = _fb.group({
    TrackingNo : ['', Validators.required],
    PurchaseDocumentNo : ['', Validators.required],
    Installment : '',
    DocumentCategory : '',
    CompanyCode : '',
    DocumentType : '',
    DocumentDate : '',
    VendorCode : '',
    VendorName : '',
    PurchaseGroup : '',
    PurchaseGroupName : '',
    NetValue : '',
    AdvanceHistory : '',
    Currency : '',
    Amount : ['', Validators.required],
    IndenterName : '',
    IndenterMail : '',
    splIndicator : '',
    PurchaseVerifier : ['', Validators.required],
    Comments : '',
  })

}


ngOnInit() 
{

  this.userDetails = this._tokenService.decryptToken(localStorage.getItem('VendorToken'));

  if(this.userDetails.Role == "I")
  {
    this.showapprovalReject = false;
    this.showapproval = false;
    this.showDownloadAttachment = false;
  }
  else if(this.userDetails.Role == "A")
  {
    this.showapproval = false;
    this.showapprovalReject = true;
    this.showDownloadAttachment = true;
  }

  this.getPurchaseVerifiers();

  this._activatedRouter.queryParams.subscribe({
    next : (response) => 
    {
      this.trackingNo = response.TrackingNo;
      if(this.trackingNo)
      {
        this.GetVendorDetailsToApprove()
        this.GetVendorApprovals();
      }
    }
  })

  if(!this.trackingNo)
  {
    this.showapproval = true;
    // this.showDownloadAttachment = true;
    this.getTrackingNo();
  }


}


getTrackingNo()
{
  this._vendorService.getTrackNo().subscribe({
    next : (response) => 
    {
      this.vendorForm.controls.TrackingNo.patchValue(response);
      this.trackingNo = response;
    }
  })
}


getVendorDetails()
{
  if(this.vendorForm.controls.PurchaseDocumentNo.valid)
  {
    this._vendorService.getVendorDetails(this.vendorForm.value.PurchaseDocumentNo).subscribe({
      next : (response) => 
      {
        this.vendorForm.patchValue(response);
        
        this.vendorForm.controls.IndenterMail.patchValue(this.userDetails.Email);

        this.vendorForm.controls.DocumentDate.patchValue(this.changeDate(new Date()));

        this.vendorForm.controls.splIndicator.patchValue("A");

        this.vendorForm.controls.IndenterName.patchValue(this.userDetails.Username);

        this.vendorForm.value.Vendor = response.VendorCode;

        this.changeCategory(response.DocumentCategory);

      },error : (err) => {
        this.vendorForm.reset();
        this.getTrackingNo();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }
  else
  {
    this.vendorForm.controls.PurchaseDocumentNo.markAsTouched();
    this._commonService.openSnackbar("Enter Po Number", snackbarStatus.Danger);
  }
}


getPurchaseVerifiers()
{
  this._vendorService.getPurchaseVerifierList().subscribe({
    next : (response) => 
    {
      this.purchaseVerifiers = response
    }
  })
}

GetVendorDetailsToApprove()
{
  this._vendorService.GetVendorDetailsToApprove(this.trackingNo).subscribe({
    next : (response) => 
    {
      this.vendorForm.patchValue(response);
      this.vendorForm.controls.VendorCode.patchValue(response.Vendor);
      this.vendorForm.controls.PurchaseGroupName.patchValue(response.Description);
      this.changeCategory(response.DocumentCategory);
      this.vendorForm.controls.DocumentDate.patchValue(this.changeDate(response.DocumentDate));
    }
  })
}


GetVendorApprovals()
{
  this._vendorService.GetVendorApprovals(this.trackingNo).subscribe({
    next : (response) => 
    {
      this.approveDataSource = new MatTableDataSource(response);
      this.showDownloadAttachment = true;
      if(this.userDetails.Role == "A")
      {
        this.checkStatus(response);
      }
    },error : (err) => {
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    },
  })
}


checkStatus(data)
{
  data.forEach(element => {
    if(element.UserId == this.userDetails.UserId)
    {
      if(element.Status == "Approved" || element.Status == "Rejected")
      {
        this.showapproval = false;
        this.showapprovalReject = false;  
        this.showDownloadAttachment = true;
      }
    }
  });
}


changeCategory(category)
{
  if(category == "F")
  {
    this.vendorForm.controls.DocumentCategory.patchValue("Purchasing Order");
  }
  if(category == "L")
  {
    this.vendorForm.controls.DocumentCategory.patchValue("Scheduling Agreement");
  }
}


 // File Upload Method
 onUploadFileChange(event)
 {
   this.files = event.target.files[0];
   this._commonService.openSnackbar("Uploaded Successfully", snackbarStatus.Success);
 }

execute()
{
  this.saveVendorDetails();
}


saveVendorDetails()
{
  if(this.vendorForm.valid)
  {

    if(this.files)
    {

      this._commonSpinner.showSpinner();

      const formData = new FormData();
      this.vendorForm.value.DocumentDate = new Date();
      formData.append("VendorDetails", JSON.stringify(this.vendorForm.value));
      formData.append(this.files.name, this.files, this.files.name);

      this._vendorService.saveVendorDetails(formData).subscribe({
        next : (response) => 
        {
          this._commonSpinner.hideSpinner();
          this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
          this._router.navigate(['/pages/vendoradvancepages/dashboard'])
        },error : (err) => {
          this._commonSpinner.hideSpinner();
          if(err == "Tracking No Already Exists")
          {
            this.addTracking();
          }
          else
          {
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          }
        },
      })
    }
    else
    {
      this._commonService.openSnackbar("Attachment is Mandatory", snackbarStatus.Danger);
    }
  }
  else
  {
    if(this.vendorForm.controls.PurchaseDocumentNo.invalid && 
      this.vendorForm.controls.Amount.invalid && 
      this.vendorForm.controls.PurchaseVerifier.invalid)
      {
        this.vendorForm.markAllAsTouched();
        this._commonService.openSnackbar("Enter Mandatory Fields", snackbarStatus.Danger);
      }
    else if(this.vendorForm.controls.PurchaseDocumentNo.invalid)
    {
      this.vendorForm.controls.PurchaseDocumentNo.markAsTouched();
      this._commonService.openSnackbar("Enter Po Number", snackbarStatus.Danger);
    }
    else if(this.vendorForm.controls.Amount.invalid)
    {
      this.vendorForm.controls.Amount.markAsTouched();
      this._commonService.openSnackbar("Enter Amount Number", snackbarStatus.Danger);
    }
    else if(this.vendorForm.controls.PurchaseVerifier.invalid)
    {
      this.vendorForm.controls.PurchaseVerifier.markAsTouched();
      this._commonService.openSnackbar("Select PurchaseVerifier", snackbarStatus.Danger);
    }
  }
}


getApprovalDocument()
{
  this._commonSpinner.showSpinner();
  this._vendorService.GetApprovalDocument(this.trackingNo).subscribe({
    next : async (response) => 
    {
      this._commonSpinner.hideSpinner();
      await this._fileSaver.downloadFile(response);
    },error : (err) => {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    },
  })
}

// Approved Method
approve()
{
  this._commonSpinner.showSpinner();
  this._vendorService.approveVendorDetails(this.userDetails.UserId, this.trackingNo, this.vendorForm.value.Comments).subscribe({
    next : (response) => 
    {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
      this._router.navigate(['/pages/vendoradvancepages/dashboard'])
    },error : (err) => {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    },
  })
}

// Rejected Method
reject()
{
  this._commonSpinner.showSpinner();
  this._vendorService.rejectVendorDetails(this.userDetails.UserId, this.trackingNo, this.vendorForm.value.Comments).subscribe({
    next : (response) => 
    {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(response.Message, snackbarStatus.Success);
      this._router.navigate(['/pages/vendoradvancepages/dashboard'])
    },error : (err) => {
      this._commonSpinner.hideSpinner();
      this._commonService.openSnackbar(err, snackbarStatus.Danger);
    },
  })
}

/** Change Date Format Method */
changeDate(date)
{
  var changeDate = this._datepipe.transform(date, 'dd/MM/yyyy');
  return changeDate;
}


addTracking()
{
  const dialogRef = this._dialog.open(TrackingDialogComponent, {
    disableClose: true,
    backdropClass: 'userActivationDialog',
  }).afterClosed().subscribe((res) => {
    if(res == "Add")
    {
      this.getTrackingNo();
      this.getVendorDetails();
    }
  });
}



}
