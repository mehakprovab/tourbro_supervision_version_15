import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
 filteredList: any[] = [];
  guideList: any[] = [];
  searchText = '';

  constructor(private apiHandler: ApiHandlerService) {}

  ngOnInit(): void {
    this.getGuideList();
  }

onSearch() {
  const val = this.searchText.toLowerCase().trim();

  this.filteredList = this.guideList.filter(item =>
    (item.name && item.name.toLowerCase().includes(val)) ||
    (item.heading && item.heading.toLowerCase().includes(val)) ||
    (item.description && item.description.toLowerCase().includes(val)) ||
    (item.stars && item.stars.toString().includes(val))
  );
}

  getGuideList() {
    this.apiHandler.apiHandler('reviewList', 'POST', {}, {}, {})
      .subscribe((res: any) => {
      this.guideList = (res.data.data || []).map((item:any) => ({
  ...item
}));

        this.filteredList = [...this.guideList];
      });
  }

  // ✅ Publish toggle API
onPublishChange(item: any, isChecked: boolean) {
  // Map checkbox to status
  // 1 = Approved, 0 = Rejected
  const newStatus = isChecked ? 1 : 0;

  const payload = {
    id: item.id,
    status: newStatus
  };

  this.apiHandler.apiHandler('updateReviewStatus', 'POST', {}, {}, payload)
    .subscribe(() => {
      // Update local item.status so badge updates immediately
      item.status = newStatus;

      // Optional: refresh list from server
      this.getGuideList();
    });
}

}