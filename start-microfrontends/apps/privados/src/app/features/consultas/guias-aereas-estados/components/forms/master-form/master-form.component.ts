import { TypeSearch } from '@/features/consultas/guias-aereas/interfaces/air-waybill-forms.interface';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuidesService } from '../../../services/guides.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-master-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './master-form.component.html',
})
export class MasterFormComponent implements OnInit {
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private guidesService = inject(GuidesService);
  private sessionStorage = inject(SessionStorageService);
  formUtils = FormUtils;
  masterForm = this.formBuilder.group({
    guideMaster: ['', Validators.required],
  });

  ngOnInit(): void {
    this.persistData();
  }

  submitForm() {
    this.masterForm.markAllAsTouched();

    if (this.masterForm.valid) {
      const guideMaster = this.masterForm.controls['guideMaster'].value;
      this.guidesService.masterGuide.set(guideMaster);
      this.sessionStorage.set('guideMaster', guideMaster);

      this.onSubmitForm.emit(TypeSearch.MASTER);
    }
  }

  private persistData() {
    const guideMaster = this.sessionStorage.get<string>('guideMaster');
    if (!!guideMaster) {
      try {
        const formValues: any = {};
        formValues.guideMaster = guideMaster;

        this.masterForm.patchValue(formValues);
        this.guidesService.masterGuide.set(guideMaster);
        this.onSubmitForm.emit(TypeSearch.MASTER);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
