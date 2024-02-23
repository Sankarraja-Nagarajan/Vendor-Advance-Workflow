import { Component } from '@angular/core';
import { MasterDataUploadService } from '../../../Services/master-data-upload.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSaverService } from '../../../Services/file-saver.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'ngx-master-data-upload',
  templateUrl: './master-data-upload.component.html',
  styleUrls: ['./master-data-upload.component.scss']
})
export class MasterDataUploadComponent {


  //masterTables  = ['Bsak', 'Ekbe', 'Ekko', 'Ekpo', 'Konv', 'Lfa1', 'Prps', 'To24', 'UserCredential', 'UserRole', 'Zfi_pmverifs', 'Zfi_T_wroles', 'Zpr_mail'];

  masterTables : any [] = [];
  tableColumns : any [] = [];
  showTable : boolean = false;
  showSearchBtn : boolean = false;
  tableName : any;
  activeTable : string;
  notes : string;

  masterTableFormGroup : FormGroup;

  masterTablesFields : any [] = [];

  dataSource = new MatTableDataSource();


  constructor(private _masterTableUploadService : MasterDataUploadService, 
              private _commonService : CommonService, 
              private _commonSpinner : CommonSpinnerService, 
              private _fb : FormBuilder, 
              private _fileSaver : FileSaverService) 
  {
    this.masterTableFormGroup = this._fb.group({});
  }



  ngOnInit()
  {
    this.getUploadMasterTables();
  }


  CardClicked(name : string){
    this.activeTable = name;
    this.tableName = name;
   }



  getUploadMasterTables()
  {
    this._masterTableUploadService.getMasterTableColumnAndCount().subscribe({
      next : (response) => 
      {
        this.masterTables = response;
      },error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }


  selectTable(data)
  {
    //this.getTableColumns(data);
    this.setMasterTableFormGroup(data);
  }

  getTableColumns(tableName)
  {
    this._masterTableUploadService.getTableColumns(tableName).subscribe({
      next : (response) => 
      {
        if(response)
        {
          this.tableColumns = response;
          //this.showTable = true;
        }
      },error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger)
      },
    })
  }


  setMasterTableFormGroup(data)
  {
    this.selectDataFromTable(data, "Add");
  }


  addControl(fields)
  {
    fields.forEach(element => {
      this.masterTableFormGroup.addControl(element.Label, this._fb.control('', Validators.required));
    });
  }





  searchDataFromTable()
  {
    console.log(this.tableName);
    this.selectDataFromTable(this.tableName, "Search");
  }

  downloadMasterData()
  {
    this.selectDataFromTable(this.tableName, "Download")
  }



  downloadTemplate()
  {
    console.log(this.tableColumns);
    if (this.tableColumns && this.tableColumns.length > 0) {

      const workSheet = XLSX.utils.aoa_to_sheet([this.tableColumns]);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');
      const fileName = this.tableName + '_Master_Data_Template(Vendor_Advance).xlsx';
      XLSX.writeFile(workBook, fileName);

    }
  }



  async uploadMasterData(event: any)
  {
    const file : File = event.target.files[0];

    if(file)
    {
      const fileName : string = file.name.toLocaleLowerCase();
      if(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))
      {

        const reader = new FileReader();
        
        reader.onload = (e: any) => 
        {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const table : any [] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });

          const extractedColumns: string[] = Object.keys(table[0]);

          // Check if extracted columns match the expected columns
          const columnsMatch = this.checkColumnsMatch(this.tableColumns, extractedColumns);

          if (columnsMatch) 
          {
            // Proceed with further processing
            console.log(table);

            this._commonSpinner.showSpinner();

            this.selectTableToUploadData(table);
            

          } 
          else 
          {
            // Show an error message
            console.error('Columns do not match the expected format.');
            this._commonService.openSnackbar("Columns do not match the expected format.", snackbarStatus.Warning);
          }
        };
        
        reader.readAsBinaryString(file);

      }
      else
      {
        this._commonService.openSnackbar("Invalid file format. Please upload a valid Excel file (.xlsx or .xls) and try again.", snackbarStatus.Warning);
      }
    }
  }



  checkColumnsMatch(expectedColumns: string[], extractedColumns: string[]): boolean {
    // Compare lengths
    if (expectedColumns.length !== extractedColumns.length) {
      return false;
    }
  
    // Compare each column name
    for (let i = 0; i < expectedColumns.length; i++) {
      if (expectedColumns[i] !== extractedColumns[i]) {
        return false;
      }
    }
  
    return true;
  }

  

  selectTableToUploadData(table)
  {
    if(this.tableName)
    {
      switch(this.tableName)
      {
        case "Bsak":
          this._masterTableUploadService.UploadDataBsakTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Ekbe":
          this._masterTableUploadService.UploadDataEkbeTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Ekko":
          this._masterTableUploadService.UploadDataEkkoTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Konv":
          this._masterTableUploadService.UploadDataKonvTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Lfa1":
          this._masterTableUploadService.UploadDataLfa1Table(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Prps":
          this._masterTableUploadService.UploadDataPrpsTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "T024":
          this._masterTableUploadService.UploadDataT024Table(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "UserCredentials":
          this._masterTableUploadService.UploadDataUserCredentialsTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "UserRoles":
          this._masterTableUploadService.UploadDataUserRolesTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Zfi_Pmverifs":
          this._masterTableUploadService.UploadDataZfi_PmverifsTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Zfi_T_Wroles":
          this._masterTableUploadService.UploadDataZfi_T_WrolesTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Zpr_Mail":
          this._masterTableUploadService.UploadDataZpr_MailTable(table).subscribe({
            next : (response) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
              this.getUploadMasterTables();
            }, error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          });
          break;
        case "Ekpos":
        this._masterTableUploadService.UploadDataEkposTable(table).subscribe({
          next : (response) => 
          {
            this._commonSpinner.hideSpinner();
            this._commonService.openSnackbar(response.Result, snackbarStatus.Success);
            this.getUploadMasterTables();
          }, error : (err) => {
            this._commonSpinner.hideSpinner();
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        });
        break;
      }
    }
  }




  selectDataFromTable(selectedTableName, type)
  {
    this.notes = "";
    this.dataSource = new MatTableDataSource();
    switch(selectedTableName)
    {
      case "Bsak":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "MaterialDocumentNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getBsakTableData(this.masterTableFormGroup.value.MaterialDocumentNo).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Material Document No", snackbarStatus.Danger);
          }
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getBsakMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekbe":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getEkbeTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getEkbeMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekko":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getEkkoTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getEkkoMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Konv":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "DocumentCoditionNo",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getKonvTableData(this.masterTableFormGroup.value.DocumentCoditionNo).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Document Codition No", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getKonvMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Lfa1":
        this.tableName = selectedTableName;
        this.notes = "bukrs/sperr from LFB1";
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "Vendor",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getLfa1TableData(this.masterTableFormGroup.value.Vendor).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Vendor", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getLfa1MasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Prps":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "WbsElement",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getPrpsTableData(this.masterTableFormGroup.value.WbsElement).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Wbs Element", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getPrpsMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "T024":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "PurchasingGroup",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getT024TableData(this.masterTableFormGroup.value.PurchasingGroup).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Purchasing Group", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getT024MasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserCredentials":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getUserCredentialsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter User Id", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getUserCredentialsMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "UserRoles":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "Role",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getUserRolesTableData(this.masterTableFormGroup.value.Role).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Role", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getUserRolesMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zfi_Pmverifs":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getZfi_PmverifsTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter User Id", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getZfi_PmverifsMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zfi_T_Wroles":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "CompanyCode",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getZfi_T_WrolesTableData(this.masterTableFormGroup.value.CompanyCode).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Company Code", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getZfi_T_WrolesMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Zpr_Mail":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "UserId",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getZpr_MailTableData(this.masterTableFormGroup.value.UserId).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter User Id", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getZpr_MailMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
      case "Ekpos":
        this.tableName = selectedTableName;
        if(type == "Add")
        {
          this.showTable = false;
          this.removeControls(this.masterTablesFields);
          this.masterTablesFields = [
            {
              Label : "PurchasingDocument",
            }
          ];
          this.addControl(this.masterTablesFields);
          this.showSearchBtn = true;
          this.getTableColumns(this.tableName);
        }
        else if(type == "Search")
        {
          if(this.masterTableFormGroup.valid)
          {
            this._masterTableUploadService.getEkposTableData(this.masterTableFormGroup.value.PurchasingDocument).subscribe({
              next : (response) => 
              {
                this.showTable = true;
                this.getTableColumns(this.tableName);
                this.dataSource = new MatTableDataSource(response);
              },error : (err) => {
                this._commonService.openSnackbar(err, snackbarStatus.Danger);
              },
            })
          }
          else
          {
            this._commonService.openSnackbar("Enter Purchasing Document", snackbarStatus.Danger);
          } 
        }
        else  if(type == "Download")
        {
          this.showTable = false;
          this._commonSpinner.showSpinner();
          this._masterTableUploadService.getEkposMasterData(this.tableName).subscribe({
            next : async (response) => 
            {
              if(response)
              {
                this._commonSpinner.hideSpinner();
                await this._fileSaver.downloadFile(response);
              }
            },error : (err) => {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            },
          })
        }
        break;
    }
  }



  // Method to remove controls
  removeControls(fields: any[]) {
    fields.forEach(field => {
      this.masterTableFormGroup.removeControl(field.Label);
    });
  }
  



  getTooltipMessage(data: any): string {
    switch (data.TableName) {
        case 'Bsak':
            return "augbl / gjahr / belnr " ;
        case 'Ekko':
            return 'ebeln / bukrs / bstyp / bsart / lifnr / ekgrp / waers';
        case 'Ekpos':
            return "knttp / ebeln / ebelp / bukrs / werks / netpr / peinh / afnam / loekz" ;
        case 'Lfa1':
            return 'lifnr / bukrs / sperr / name1';
        case 'T024':
            return "ekgrp / eknam" ;
        case 'Konv':
            return 'knumv / kposn / Kschl / kwert';
        case 'Ekbe':
            return "ebeln / ebelp / vgabe / giahr / belnr / wrbtr" ;
    }
}




}
