import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataUploadService {

  constructor(private _httpService : HttpService) { }

  

  getMasterTableColumnAndCount() : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetMasterTableColumnAndCount`);
  }




  getTableColumns(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetTableColumns?tableName=${tableName}`);
  }
  




  // Bsak Master Data Upload

  getBsakTableData(materialDocumentNo) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetBsakTableData?materialDocumentNo=${materialDocumentNo}`);
  }

  getBsakMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetBsakMasterData?tableName=${tableName}`);
  }

  UploadDataBsakTable(bsakData) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataBsakTable`, bsakData);
  }



  // Ekbe Master Data Upload

  getEkbeTableData(purchasingDocument) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkbeTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkbeMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkbeMasterData?tableName=${tableName}`);
  }

  UploadDataEkbeTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataEkbeTable`, data);
  }




  // Ekbe Master Data Upload

  getEkkoTableData(purchasingDocument) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkkoTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkkoMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkkoMasterData?tableName=${tableName}`);
  }

  UploadDataEkkoTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataEkkoTable`, data);
  }





  // Konv Master Data Upload

  getKonvTableData(documentCoditionNo) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetKonvTableData?documentCoditionNo=${documentCoditionNo}`);
  }

  getKonvMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetKonvMasterData?tableName=${tableName}`);
  }

  UploadDataKonvTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataKonvTable`, data);
  }






  // Lfa1 Master Data Upload

  getLfa1TableData(vendor) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetLfa1TableData?vendor=${vendor}`);
  }

  getLfa1MasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetLfa1MasterData?tableName=${tableName}`);
  }

  UploadDataLfa1Table(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataLfa1Table`, data);
  }






  // Lfa1 Master Data Upload

  getPrpsTableData(wbsElement) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetPrpsTableData?wbsElement=${wbsElement}`);
  }

  getPrpsMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetPrpsMasterData?tableName=${tableName}`);
  }

  UploadDataPrpsTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataPrpsTable`, data);
  }





  // T024 Master Data Upload

  getT024TableData(purchasingGroup) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetT024TableData?purchasingGroup=${purchasingGroup}`);
  }

  getT024MasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetT024MasterData?tableName=${tableName}`);
  }

  UploadDataT024Table(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataT024Table`, data);
  }







  // UserCredential Master Data Upload

  getUserCredentialsTableData(userId) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetUserCredentialTableData?userId=${userId}`);
  }

  getUserCredentialsMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetUserCredentialMasterData?tableName=${tableName}`);
  }

  UploadDataUserCredentialsTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataUserCredentialTable`, data);
  }




  // UserRoles Master Data Upload

  getUserRolesTableData(role) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetUserRolesTableData?role=${role}`);
  }

  getUserRolesMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetUserRolesMasterData?tableName=${tableName}`);
  }

  UploadDataUserRolesTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataUserRolesTable`, data);
  }







  // Zfi_Pmverifs Master Data Upload

  getZfi_PmverifsTableData(userId) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZfi_PmverifsTableData?userId=${userId}`);
  }

  getZfi_PmverifsMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZfi_PmverifsMasterData?tableName=${tableName}`);
  }

  UploadDataZfi_PmverifsTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataZfi_PmverifsTable`, data);
  }






  // Zfi_T_Wroles Master Data Upload

  getZfi_T_WrolesTableData(companyCode) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZfi_T_WrolesTableData?companyCode=${companyCode}`);
  }

  getZfi_T_WrolesMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZfi_T_WrolesMasterData?tableName=${tableName}`);
  }

  UploadDataZfi_T_WrolesTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataZfi_T_WrolesTable`, data);
  }







  // Zpr_Mail Master Data Upload

  getZpr_MailTableData(userId) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZpr_MailTableData?userId=${userId}`);
  }

  getZpr_MailMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetZpr_MailMasterData?tableName=${tableName}`);
  }

  UploadDataZpr_MailTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataZpr_MailTable`, data);
  }







  // Ekpos Master Data Upload

  getEkposTableData(purchasingDocument) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkposTableData?purchasingDocument=${purchasingDocument}`);
  }

  getEkposMasterData(tableName) : Observable<any>
  {
    return this._httpService.get(`MasterTable/GetEkposMasterData?tableName=${tableName}`);
  }

  UploadDataEkposTable(data) : Observable<any>
  {
    return this._httpService.post(`MasterTable/UploadDataEkposTable`, data);
  }






}
