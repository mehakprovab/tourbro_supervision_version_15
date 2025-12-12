import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  @ViewChild('acc', { static: false }) accordion!: NgbAccordion; // Added static option
  lastPanelId: string | null = null;
  defaultPanelId: string = "panel1";
  protected subs = new SubSink();
  respData: any[] = []; // Defined as an array for better type checking

  constructor(
    private apiHandlerService: ApiHandlerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFaqList();
  }

  panelShadow($event: NgbPanelChangeEvent): void {
    const { nextState, panelId } = $event;
    const activePanelElem = document.getElementById(panelId);

    if (!this.accordion.isExpanded(panelId) && activePanelElem) {
      activePanelElem.parentElement.classList.add("open");
    }

    if (!this.lastPanelId) this.lastPanelId = this.defaultPanelId;

    if (this.lastPanelId) {
      const lastPanelElem = document.getElementById(this.lastPanelId);

      if (this.lastPanelId === panelId && nextState === false) {
        activePanelElem.parentElement.classList.remove("open");
      } else if (this.lastPanelId !== panelId && nextState === true) {
        lastPanelElem.parentElement.classList.remove("open");
      }
    }

    this.lastPanelId = panelId;
  }

  getFaqList(): void {
    const filter = {
      faq: 1,
      data_source: "b2c"
    };

    this.subs.sink = this.apiHandlerService
      .apiHandler('listAgentFaq', 'post', {}, {}, filter)
      .subscribe(
        (resp) => {
          this.respData =
            (resp.statusCode === 200 || resp.statusCode === 201) &&
            resp.data &&
            resp.data.length > 0
              ? resp.data
              : [];
          console.log("respData", this.respData);
          this.cdr.detectChanges(); // Ensure view updates after data retrieval
        },
        (err) => {
          console.error(err);
          this.respData = [];
        }
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // Clean up subscriptions
  }
}
