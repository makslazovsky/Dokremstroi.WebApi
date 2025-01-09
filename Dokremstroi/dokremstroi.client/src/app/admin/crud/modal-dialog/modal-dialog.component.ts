import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css'],
})
export class ModalDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      fields: { name: string; label: string; type: string; required: boolean }[];
      initialValues?: any; // Данные для редактирования
    }
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const controls: any = {};
    this.data.fields.forEach((field) => {
      controls[field.name] = [
        this.data.initialValues?.[field.name] || '', // Используем начальные значения, если они есть
        field.required ? Validators.required : null,
      ];
    });
    this.form = this.fb.group(controls);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value); // Возвращаем данные формы
    }
  }
}
