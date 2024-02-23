import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from '../../../Services/common.service';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { TokenService } from '../../../Services/token.service';
import { VendorService } from '../../../Services/vendor.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { DashboardTable } from '../../../Models/dashboardTable';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { FileSaverService } from '../../../Services/file-saver.service';



@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  tableData :any[] = [];
  displayedColumns : string [] = [];
  dataSource = new  MatTableDataSource();
  dashboardTable = new DashboardTable();
  activeCard : number = 0;
  userDetails : any;
  showExport : boolean  = false;
  showDownload : boolean = false;

  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private _commonSpinnerService : CommonSpinnerService, 
              private _tokenService : TokenService, 
              private _vendorService : VendorService, 
              private _commonService : CommonService, 
              private _router : Router, 
              private _commonSpinner : CommonSpinnerService, 
              private _fileSaver : FileSaverService){

  }

  ngOnInit() 
  {
    this.userDetails = this._tokenService.decryptToken(localStorage.getItem('VendorToken'));
    if(this.userDetails.Role == "I")
    {
      this.displayedColumns = ['TrackingNO','PO_Number','PurchasingGroup','Amount','AdvanceHistory','Currency', 'Review'];
    }
    else
    {
      this.displayedColumns = ['TrackingNO','PO_Number','PurchasingGroup','Amount','AdvanceHistory','Currency', 'Status'];
    }
    this.getVendorDetails();
    this.CardClicked(1);
  }




      /** Whether the number of selected elements matches the total number of rows. */
 isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}

/** The label for the checkbox on the passed row */
checkboxLabel(row?: any): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}


/** Select the Tracking Numbers */
selectTrackingNo()
{

  this.CardClicked(5);

  this.showExport = true;
  this.showDownload = true;

  this.displayedColumns = [
    'SELECET',
    'TrackingNO', 
    'PO_Number', 
    'PurchasingGroup', 
    'Amount', 
    'AdvanceHistory', 
    'Currency', 
    'Review'
  ];

  var data = [];
  this.tableData.forEach(element => {
    if(element.Status == "Completed")
    {
      data.push(element);
    }
  });

  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}



/** Download the Excel Format based on the selected Tracking Numbers */
download()
{
  if(this.selection.selected.length > 0)
  {

    this._commonSpinner.showSpinner();
    this.showExport = true;

    var selectedTrackingNo : number [] = [];
    this.selection.selected.forEach(element => {
      selectedTrackingNo.push(element.TrackingNo);
    });

    this._vendorService.downloadExcel(selectedTrackingNo).subscribe({
      next : async (response) => 
      {
        this._commonSpinner.hideSpinner();
        await this._fileSaver.downloadFile(response);
      },error : (err) => {
        this._commonSpinner.hideSpinner();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })


  this.displayedColumns = [
    'TrackingNO', 
    'PO_Number', 
    'PurchasingGroup', 
    'Amount', 
    'AdvanceHistory', 
    'Currency', 
    'Review'
  ];

  this.selection.clear();
  this.showDownload = false;

  this.dataSource = new MatTableDataSource(this.tableData);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  }
  else
  {
    this._commonService.openSnackbar("Selected Tracking No has been Download", snackbarStatus.Warning);
  }
}

/** Cancel the Downloading */
cancelDownload()
{
  this.displayedColumns = [
    'TrackingNO', 
    'PO_Number', 
    'PurchasingGroup', 
    'Amount', 
    'AdvanceHistory', 
    'Currency', 
    'Review'
  ];

  this.CardClicked(1);

  this.selection.clear();
  this.showDownload = false;
  this.dataSource = new MatTableDataSource(this.tableData);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}



checkStatus(data)
{
  this._router.navigate(['/pages/vendoradvancepages/advancerequesttracker'], { queryParams : { TrackingNo : data.TrackingNo } });
}



  getVendorDetails()
  {
    this._vendorService.getVendorDetailsList(this.userDetails.UserId).subscribe({
      next : (response) => 
      {
        this.tableData = response;
        this.dataSource = new MatTableDataSource(this.tableData);
        this.dataSource.paginator = this.paginator;
        this.getCount(this.tableData);
      },
      error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  view(trackingNo)
  {
    this._router.navigate(['/pages/vendoradvancepages/advancerequesttracker'], {queryParams : { TrackingNo : trackingNo}});
  }

  approve(trackingNo)
  {
    this._router.navigate(['/pages/vendoradvancepages/advancerequesttracker'], {queryParams : { TrackingNo : trackingNo}});
  }

  CardClicked(cardnumber : number){
    this.activeCard = cardnumber;
   }

   selectStatus(status)
   {
    if(status == "All")
    {
      this.dataSource = new MatTableDataSource(this.dashboardTable.allVendorDetails);
    }
    if(status == "Pending")
    {
      this.dataSource = new MatTableDataSource(this.dashboardTable.pendingVendorDetails);
    }
    if(status == "Approved")
    {
      this.dataSource = new MatTableDataSource(this.dashboardTable.approvedVendorDetails);
    }
    if(status == "Completed")
    {
      this.dataSource = new MatTableDataSource(this.dashboardTable.completedVendorDetails);
    }
    if(status == "Rejected")
    {
      this.dataSource = new MatTableDataSource(this.dashboardTable.rejectedVendorDetails);
    }
    this.dataSource.paginator = this.paginator;
   }


   getCount(tableData)
   {
    this.dashboardTable.allVendorDetails = tableData;
    if(this.userDetails.Role != "A")
    {
      tableData.forEach(element => {
        if(element.Status == "Pending")
        {
            this.dashboardTable.pendingVendorDetails.push(element);
        }
        else if(element.Status == "Completed")
        {
            this.dashboardTable.completedVendorDetails.push(element);
        }
        else if(element.Status == "Rejected")
        {
            this.dashboardTable.rejectedVendorDetails.push(element);
        }
      });
    }
    else
    {
      tableData.forEach(element => {
        if(element.Status == "Active")
        {
            this.dashboardTable.pendingVendorDetails.push(element);
        }
        else if(element.Status == "Approved")
        {
            this.dashboardTable.approvedVendorDetails.push(element);
        }
        else if(element.Status == "Rejected")
        {
            this.dashboardTable.rejectedVendorDetails.push(element);
        }
      });
    }
   }


}
