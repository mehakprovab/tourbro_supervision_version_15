import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from '../../../core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalService } from '../../../core/services/swal.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from '../../auth.service';
import { RegisterInfoComponent } from '../register-info/register-info.component';
@Component({
  selector: 'app-b2b-register',
  templateUrl: './b2b-register.component.html',
  styleUrls: ['./b2b-register.component.scss']
})
export class B2bRegisterComponent implements OnInit {
  domainInfo: any;
    selectRegisterForm:FormGroup
    dhcSelect: boolean = false;
    dmcSelect: boolean = false;
    asSelect: boolean = false;
    tsSelect: boolean = false;
    hpsSelect: boolean = false;
    disableDMC: boolean = false;
    disableDHC: boolean = false;

  constructor(  private apiHandlerService: ApiHandlerService,
     private fb: FormBuilder,
     private router: Router,
     private swalService: SwalService,
     private dialog: MatDialog,
     private authService: AuthService
  ) { }

  ngOnInit() {
    this.getDomainInfo();
    this.selectCreateForm();
  }
      selectCreateForm() {
        this.selectRegisterForm = this.fb.group({
            DHC:[''],
        });
      }
  getDomainInfo() {
 this.apiHandlerService.apiHandler('ManageDomain', 'POST', {}, {}, {})
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.domainInfo = res.data[0];
                }
            }, (err: HttpErrorResponse) => {
                // log.debug(err);
                console.error(err);
            });
    }

    navigateToSupplier(): void {
      this.router.navigate(['']);
    }

selectedSuppliers: string[] = []; // keep it at component level

onSupplierSelect(supplierType: string) {
  let flag = false;

  if (supplierType === 'DHC') {
    this.dhcSelect = !this.dhcSelect;
    this.disableDHC = this.dhcSelect;
    flag = this.dhcSelect;
  }
  if (supplierType === 'DMC') {
    this.dmcSelect = !this.dmcSelect;
    flag = this.dmcSelect;
  }
  if (supplierType === 'AS') {
    this.asSelect = !this.asSelect;
    flag = this.asSelect;
  }
  if (supplierType === 'TS') {
    this.tsSelect = !this.tsSelect;
    flag = this.tsSelect;
  }
  if (supplierType === 'HPS') {
    this.hpsSelect = !this.hpsSelect;
    flag = this.hpsSelect;
  }

  if (this.hpsSelect || this.dmcSelect || this.tsSelect || this.asSelect) {
    this.disableDMC = true;
  } else {
    this.disableDMC = false;
  }

  // ✅ Add or remove from array
  if (flag) {
    if (!this.selectedSuppliers.includes(supplierType)) {
      this.selectedSuppliers.push(supplierType);
    }
  } else {
    this.selectedSuppliers = this.selectedSuppliers.filter(s => s !== supplierType);
  }
  this.authService.selectedSuppliers.next(this.selectedSuppliers);
  localStorage.setItem('selectedSuppliers', JSON.stringify(this.selectedSuppliers));
  console.log("Selected Suppliers:", this.selectedSuppliers);
}

    onProceed() {
     
      if (this.dhcSelect || this.dmcSelect || this.asSelect || this.tsSelect || this.hpsSelect) {
        if (this.dhcSelect && !this.dmcSelect && !this.asSelect && !this.tsSelect && !this.hpsSelect) {
          this.router.navigate(['/auth/supplier-b2b']);
        }
        // if (this.dhcSelect && (this.dmcSelect || this.asSelect || this.tsSelect || this.hpsSelect) ) {
        //   let config = new MatDialogConfig();
        //   config.height = '600px';
        //   config.width = '1000px';
        //   config.panelClass = "copy-items-modal-register";
        //   config.disableClose = true;
        //   let copyDialog = this.dialog.open(RegisterInfoComponent, config);
        //   copyDialog.afterClosed().subscribe(result => {
        //       if (result) {
        //         this.router.navigate(['/auth/supplier-b2b']);
        //       }
        //   });
        //   }
        if (!this.dhcSelect &&( this.dmcSelect || this.asSelect || this.tsSelect || this.hpsSelect)) {
          this.router.navigate(['/auth/supplier'])
        }
      } else {
        this.swalService.alert.oops("Please Select any on service")
      }
    }
}
