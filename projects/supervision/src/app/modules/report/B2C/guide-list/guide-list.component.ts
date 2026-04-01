import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-guide-list',
  templateUrl: './guide-list.component.html',
  styleUrls: ['./guide-list.component.scss']
})
export class GuideListComponent implements OnInit {
filteredList: any[] = [];
  guideList: any[] = [];
searchText=''
  showModal = false;
  selectedItem: any;

  modalForm: FormGroup;
  isModalSubmit = false;

  constructor(
    private apiHandler: ApiHandlerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getGuideList();

    this.modalForm = this.fb.group({
     guide_name: ['', [Validators.required]],
  guide_mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  // meeting_point: ['', Validators.required],
  // note: ['', Validators.required],
  price: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }
onSearch() {
  const val = this.searchText.toLowerCase();

  this.filteredList = this.guideList.filter(item =>
    item.name.toLowerCase().includes(val) ||
    item.city.toLowerCase().includes(val) ||
    item.hotel.toLowerCase().includes(val) ||
    item.phone.includes(val)
  );
}
getGuideList() {
  this.apiHandler.apiHandler('guideList', 'POST', {}, {}, {})
    .subscribe((res: any) => {
      this.guideList = (res.data.data || []).map(item => ({
        ...item,
        status: item.status ? item.status : 1
      }));

      this.filteredList = [...this.guideList]; // ✅ init
    });
}

  // ✅ STATUS CHANGE
onStatusChange(item: any) {

  this.selectedItem = item;

  // ✅ OPEN MODAL ONLY FOR APPROVED
  if (item.status == 2) {
    this.showModal = true;

    // optional prefill
    this.modalForm.patchValue({
      guide_name: item.guide_name || '',
      guide_mobile: item.guide_mobile || '',
      price: ''
    });

  } else {

    // ✅ DIRECT API CALL for Pending / Rejected
    const payload = {
      id: item.id,
      status: item.status,
      guide_name: '',
      guide_mobile: '',
      price: ''
    };

    this.apiHandler.apiHandler('updateGuideStatus', 'POST', {}, {}, payload)
      .subscribe(() => {
        this.getGuideList();
      });
  }
}

  // ✅ CLOSE MODAL
  closeModal() {
    this.showModal = false;
    this.modalForm.reset();
    this.isModalSubmit = false;
  }

  // ✅ SUBMIT MODAL
  submitModal() {
    this.isModalSubmit = true;

  if (this.modalForm.invalid) {
    this.modalForm.markAllAsTouched(); // ✅ KEY FIX
    return;
  }

    const payload = {
      id: this.selectedItem.id,
      status: this.selectedItem.status,
      guide_name: this.modalForm.value.guide_name,
      guide_mobile: this.modalForm.value.guide_mobile,
      // meeting_point: this.modalForm.value.meeting_point,
      // note: this.modalForm.value.note,
      price: this.modalForm.value.price
    };

    this.apiHandler.apiHandler('updateGuideStatus', 'POST', {}, {}, payload)
      .subscribe(() => {
        this.closeModal();
        this.getGuideList();
      });
  }
}