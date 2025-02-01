import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.css'],
    standalone: false
})
export class ModalDialogComponent implements OnInit {
  form!: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log('Dialog data:', this.data);
    this.buildForm();
  }

  private buildForm(): void {
    const controls: any = {};
    if (this.data.fields) {
      this.data.fields.forEach((field: any) => {
        controls[field.name] = [
          this.data.initialValues?.[field.name] || '',
          field.required ? Validators.required : null,
        ];
      });
      this.form = this.fb.group(controls);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      formData.images = this.selectedFiles;
      this.dialogRef.close(formData);
    }
  }
}
