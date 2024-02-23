import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private _httpService : HttpService) { }

  getTrackNo()
  {
    return this._httpService.get(`RequestTracker/GetTrackingNo`);
  }

  // Get Method for Vendor Details
  getVendorDetails(poNumber : number) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetVendorDetails?poNumber=${poNumber}`);
  }

  getPurchaseVerifierList() : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetPurchaseVerifierList`);
  }

  saveVendorDetails(vendordetails) : Observable<any>
  {
    return this._httpService.postFile('RequestTracker/SaveVendorDetails', vendordetails);
  }

  GetVendorDetailsToApprove(trackingNo) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetVendorDetailsToApprove?trackingNo=${trackingNo}`);
  }

  GetVendorApprovals(trackingNo) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetVendorApprovals?trackingNo=${trackingNo}`);
  }

  GetApprovalDocument(trackingNo) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetApprovalDocument?trackingNo=${trackingNo}`);
  }

  getVendorDetailsList(userId) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/GetVendorDetailsList?userId=${userId}`);
  }

  approveVendorDetails(userId, trackingNo, comments) : Observable<any>
  {
    return this._httpService.get(`RequestTracker/ApproveVendorDetails?userId=${userId}&trackingNo=${trackingNo}&comments=${comments}`);
  }

  rejectVendorDetails(userId, trackingNo, comments) : Observable<any>
  {
    return this._httpService.delete(`RequestTracker/RejectVendorDetails?userId=${userId}&trackingNo=${trackingNo}&comments=${comments}`);
  }

  downloadExcel(selectedTrackingNo) : Observable<any>
  {
    return this._httpService.post(`RequestTracker/DownloadExcel`, selectedTrackingNo);
  }



}
