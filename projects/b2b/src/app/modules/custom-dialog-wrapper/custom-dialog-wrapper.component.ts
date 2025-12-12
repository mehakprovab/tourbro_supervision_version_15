import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-dialog-wrapper',
  templateUrl: './custom-dialog-wrapper.component.html',
  styleUrls: ['./custom-dialog-wrapper.component.scss']
})
export class CustomDialogWrapperComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CustomDialogWrapperComponent>
  ) {}

  get component() {
    return this.data.component;
  }

  get title() {
    return this.data.title;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
