import {Component, Input} from '@angular/core';
import { faPlus, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent {
 faStar = faStar
 faPlus= faPlus

  @Input() heading;
  @Input() subheading;
  @Input() icon;

}
