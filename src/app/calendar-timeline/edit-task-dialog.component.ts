import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-task-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Task bearbeiten' : 'Task hinzufügen' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" style="width:100%;margin-bottom:16px;">
        <mat-label>Task Name</mat-label>
        <input matInput [(ngModel)]="data.taskName" autofocus />
      </mat-form-field>
      <mat-form-field appearance="fill" style="width:100%;">
        <mat-label>Dauer (Minuten)</mat-label>
        <input matInput type="number" [(ngModel)]="data.taskDuration" min="5" max="240" step="5" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" (click)="onSave()">Speichern</button>
      <button mat-raised-button color="warn" *ngIf="data.isEdit" (click)="onDelete()">Löschen</button>
      <button mat-button (click)="onCancel()">Abbrechen</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [FormsModule]
})
export class EditTaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave() {
    this.dialogRef.close({ action: 'save', data: this.data });
  }
  onDelete() {
    this.dialogRef.close({ action: 'delete', data: this.data });
  }
  onCancel() {
    this.dialogRef.close({ action: 'cancel' });
  }
}
