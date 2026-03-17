import { TypeSearch } from '@/features/consultas/guias-aereas/interfaces/air-waybill-forms.interface';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuidesService } from '../../../services/guides.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-house-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './house-form.component.html',
})
export class HouseFormComponent implements OnInit {
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private guidesService = inject(GuidesService);
  private sessionStorage = inject(SessionStorageService);
  formUtils = FormUtils;
  houseForm = this.formBuilder.group({
    guideHouse: ['', Validators.required],
    caat: ['', Validators.required],
  });

  ngOnInit(): void {
    this.persistData();
  }

  submitForm() {
    this.houseForm.markAllAsTouched();
    if (this.houseForm.valid) {
      const guideHouse = this.houseForm.controls['guideHouse'].value;
      this.guidesService.houseGuide.set(guideHouse);
      this.sessionStorage.set('houseGuide', guideHouse);

      const caat = this.houseForm.controls['caat'].value;
      this.guidesService.caat.set(caat);
      this.sessionStorage.set('caat', caat);

      this.onSubmitForm.emit(TypeSearch.HOUSE);
    }
  }

  private persistData() {
    const guideHouse = this.sessionStorage.get<string>('houseGuide');
    const caat = this.sessionStorage.get<string>('caat');
    if (!!caat && !!guideHouse) {
      try {
        const formValues: any = {};
        formValues.caat = caat;
        formValues.guideHouse = guideHouse;

        this.houseForm.patchValue(formValues);
        this.guidesService.houseGuide.set(guideHouse);
        this.guidesService.caat.set(caat);
        this.onSubmitForm.emit(TypeSearch.HOUSE);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
