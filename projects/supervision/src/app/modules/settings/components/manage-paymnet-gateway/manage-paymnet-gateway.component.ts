import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ExportAsService } from "ngx-export-as";
import { ApiHandlerService } from "projects/supervision/src/app/core/api-handlers";
import { SwalService } from "../../../../core/services/swal.service";
import { SubSink } from "subsink";
import { UtilityService } from "../../../../core/services/utility.service";

@Component({
  selector: "app-manage-paymnet-gateway",
  templateUrl: "./manage-paymnet-gateway.component.html",
  styleUrls: ["./manage-paymnet-gateway.component.scss"],
})
export class ManagePaymnetGatewayComponent implements OnInit {
  gateWayName: any;
  private subSunk = new SubSink();
  noData:boolean=true;
  displayColumn: { key: string; value: string }[] = [
    { key: "", value: "Sl No." },
    { key: "", value: "Payment Gateway Name" },
    { key: "", value: "Current Status" },
    { key: "", value: "Actions" },
  ];

  constructor(
    private router: Router,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private utility: UtilityService,
    private activatedRoute: ActivatedRoute,
    private exportAsService: ExportAsService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.getPaymentGateWay();
  }

  getPaymentGateWay() {
    this.noData=true;
    this.gateWayName=[];
    this.subSunk.sink = this.apiHandlerService.apiHandler("paymmentGateway", "post", {}, {}, {})
      .subscribe((resp) => {
        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
            this.noData=false;
            this.gateWayName = resp.data;
        }
        else{
            this.noData=false;
            this.gateWayName=[];
        }
    }, (err) => {
        this.noData = false;
        this.gateWayName = [];
    })
  }

  onClickActionUpdate(data: any): void {
    const response = {
      id: data.id,
      status: data.status == 1 ? 0 : 1,
    };
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("paymmentGatewayRequest", "post", {}, {}, response)
      .subscribe((resp) => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.swalService.alert.success(
            "Status has been updated successfully!"
          );
          this.getPaymentGateWay();
        } else {
          this.swalService.alert.error(resp.msg || "");
        }
      });
  }
  resetData() { }
}
