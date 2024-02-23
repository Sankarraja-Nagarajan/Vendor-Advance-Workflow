import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceRequestTrackerComponent } from './advance-request-tracker/advance-request-tracker.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AuthGuard } from '../../Guards/auth.guard';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { TrackingDialogComponent } from './tracking-dialog/tracking-dialog.component';
import { MasterDataUploadComponent } from './master-data-upload/master-data-upload.component';
import { MatTooltipModule } from '@angular/material/tooltip';



const routes : Routes = [
  {
  path : 'advancerequesttracker',
  component : AdvanceRequestTrackerComponent,
  canActivate : [AuthGuard]
},
{
  path : 'dashboard',
  component : DashboardComponent,
  canActivate : [AuthGuard]
},
{
  path : 'tracking-dialog',
  component : TrackingDialogComponent
},
{
  path : 'master-data-upload',
  component : MasterDataUploadComponent
},
{
  path : '',
  redirectTo : 'advancerequesttracker',
  pathMatch : 'full'
}
]


@NgModule({
  declarations: [
    AdvanceRequestTrackerComponent,
    DashboardComponent,
    TrackingDialogComponent,
    MasterDataUploadComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    NgxSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class VendorAdvancePagesModule { }
