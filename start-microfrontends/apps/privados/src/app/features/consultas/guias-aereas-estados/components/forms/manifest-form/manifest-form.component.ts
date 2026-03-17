import { TypeSearch } from '@/features/consultas/guias-aereas/interfaces/air-waybill-forms.interface';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuidesService } from '../../../services/guides.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-manifest-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './manifest-form.component.html',
})
export class ManifestFormComponent implements OnInit {
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private guidesService = inject(GuidesService);
  private sessionStorage = inject(SessionStorageService);

  formUtils = FormUtils;
  manifestForm = this.formBuilder.group({
    guideManifest: ['', Validators.required],
  });

  ngOnInit(): void {
    this.persistData();
  }

  submitForm() {
    this.manifestForm.markAllAsTouched();

    if (this.manifestForm.valid) {
      const guideManifest = this.manifestForm.controls['guideManifest'].value;
      this.guidesService.manifestGuide.set(guideManifest);
      this.sessionStorage.set('guideManifest', guideManifest);

      this.onSubmitForm.emit(TypeSearch.MANIFEST);
    }
  }

  private persistData() {
    const guideManifest = this.sessionStorage.get<string>('guideManifest');
    if (!!guideManifest) {
      try {
        const formValues: any = {};
        formValues.guideManifest = guideManifest;

        this.manifestForm.patchValue(formValues);
        this.guidesService.manifestGuide.set(guideManifest);
        this.onSubmitForm.emit(TypeSearch.MANIFEST);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
