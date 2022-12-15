import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../core/services/data.service';
import { environment } from 'src/environments/environment';
import { CustomerModel } from '../core/models/customer.model';
import { Response } from '../core/models/response.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ITS-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  customerModel: CustomerModel = new CustomerModel();
  customers: CustomerModel[] = [];
  customersCount: number = 0;
  canSave: boolean = true;
  displayedColumns: string[] = [
    'id',
    'name',
    'class',
    'email',
    'phone',
    'comment',
  ];
  dataSource = new MatTableDataSource(this.customers);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private _service: DataService<CustomerModel>,
    private _toastService: ToastrService
  ) {}

  ngOnInit() {
    this._service
      .get(`${environment.ITS_TechnicalAssignmentApiUrl}/GetCustomers`)
      .subscribe((response: Response<CustomerModel[]>) => {
        if (this.checkErrors(response)) return;

        this.customers = response.results;
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    this.dataSource.data = this.customers;
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  selectRow(row: CustomerModel) {
    this.canSave = false;
    this.customerModel = { ...row };
  }

  save() {
    this._service
      .create(
        `${environment.ITS_TechnicalAssignmentApiUrl}/CreateCustomer`,
        this.customerModel
      )
      .subscribe((response: Response<CustomerModel[]>) => {
        debugger;
        if (this.checkErrors(response)) return;

        this.customers.push(response.results[0]);
        this._toastService.success('Added Successfully', 'Success');

        this.ngAfterViewInit();
        this.clear();
      });
  }

  update() {
    this._service
      .update(
        `${environment.ITS_TechnicalAssignmentApiUrl}/UpdateCustomer?id=${
          (this, this.customerModel.id)
        }`,
        this.customerModel
      )
      .subscribe((response: Response<CustomerModel[]>) => {
        if (this.checkErrors(response)) return;

        const index: number = this.customers.findIndex(
          (c) => c.id == this.customerModel.id
        );
        if (index !== -1) {
          this.customers[index] = this.customerModel;
        }

        this._toastService.success('Updated Successfully', 'Success');
        this.canSave = true;
        this.ngAfterViewInit();
        this.clear();
      });
  }

  delete() {
    this._service
      .delete(
        `${environment.ITS_TechnicalAssignmentApiUrl}/DeleteCustomer?id=${
          (this, this.customerModel.id)
        }`
      )
      .subscribe((response: Response<CustomerModel[]>) => {
        if (this.checkErrors(response)) return;

        this._toastService.success('Deleted Successfully', 'Success');
        const index: number = this.customers.indexOf(this.customerModel);
        if (index !== -1) {
          this.customers.splice(index, 1);
        }

        this.ngAfterViewInit();
        this.clear();
      });
  }

  emptyCustomerModel: CustomerModel = new CustomerModel();
  clear() {
    this.customerModel = { ...this.emptyCustomerModel };
    this.canSave = true;
  }

  checkErrors(response: Response<CustomerModel[]>) {
    if (response.status != 200) {
      response.messages.forEach((message) => {
        this._toastService.error(message, 'Error');
      });
      return true;
    }
    return false;
  }
}
