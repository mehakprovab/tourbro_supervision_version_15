import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.regConfig = this.fb.group({
        title: new FormControl('', [Validators.required]),
        message: new FormControl('', [Validators.required]),
        icon: new FormControl('http://yourwebsite.com/icon.png'),
        url: new FormControl('https://talontrips.com/'),
    });
}

onSubmit() {
    this.submitted = true;
    if (this.regConfig.invalid)
    return;
    let req = this.regConfig.value;
    this.subSunk.sink = this.apiHandlerService.apiHandler('sendToAllSubscribers', 'post', {}, {}, req)
    .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.swalService.alert.success(resp.msg);
        }
        else {
            this.swalService.alert.oops(resp.msg);
        }
    });
}

  ngOnDestroy() {
      this.subSunk.sink.unsubscribe()
  }

}
