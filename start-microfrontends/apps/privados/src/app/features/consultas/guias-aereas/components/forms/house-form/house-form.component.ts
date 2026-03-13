import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { formatDateIso } from '@/shared/utils/serviceUtils';
import { formatDate, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ParamsHouseGuides, TypeSearch } from '../../../interfaces/air-waybill-forms.interface';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-house-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, DatePickerComponent, BsDatepickerModule],
  templateUrl: './house-form.component.html',
})
export class HouseFormComponent implements OnInit {
  @Input() customs: Custom[] = [];
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);
  today = new Date();

  formUtils = FormUtils;
  houseForm = this.formBuilder.group(
    {
      broadcastDate: [null],
      house: [''],
      custom: [null],
    },
    {
      validators: [this.validHouseSearch()],
    },
  );

  ngOnInit(): void {
    this.persistData();
  }

  submitForm() {
    this.houseForm.markAllAsTouched();

    if (this.houseForm.valid) {
      const { broadcastDate, custom, house } = this.houseForm.value;
      let broadcastDateFormatted = '';
      let endDateFormatted = '';
      if (broadcastDate) {
        broadcastDateFormatted = formatDateIso(broadcastDate);
        broadcastDateFormatted = formatDate(broadcastDateFormatted, 'yyyy/MM/dd', 'en-US');
      }

      const params: ParamsHouseGuides = {
        guiaHouse: house ?? '',
        fechaInicio: broadcastDateFormatted,
        fechaFin: endDateFormatted,
        aduana: custom ? (custom as any).clave ?? String(custom) : '',
        rfc: '',
        esFuncionario: '',
      };

      this.airWaybillService.paramsToGetHouseGuides.set(params);
      this.onSubmitForm.emit(TypeSearch.HOUSE);
    }
  }

  resetForm() {
    this.houseForm.reset();
  }

  private persistData() {
    const paramsToGetHouseGuides =
      this.sessionStorage.get<ParamsHouseGuides>('paramsToGetHouseGuides');
    if (!!paramsToGetHouseGuides) {
      try {
        const formValues: any = {};
        if (paramsToGetHouseGuides.guiaHouse) {
          formValues.house = paramsToGetHouseGuides.guiaHouse;
        }
        if (paramsToGetHouseGuides.fechaInicio) {
          const broadcastDate = new Date(paramsToGetHouseGuides.fechaInicio);
          if (!isNaN(broadcastDate.getTime())) {
            formValues.broadcastDate = broadcastDate;
          }
        }
        if (paramsToGetHouseGuides.aduana) {
          formValues.custom = paramsToGetHouseGuides.aduana;
        }
        this.houseForm.patchValue(formValues);
        this.airWaybillService.paramsToGetHouseGuides.set(paramsToGetHouseGuides);
        this.onSubmitForm.emit(TypeSearch.HOUSE);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  private validHouseSearch(): ValidatorFn {
    return (form): ValidationErrors | null => {
      const broadcastDate = form.get('broadcastDate')?.value;
      const house = form.get('house')?.value;
      const custom = form.get('custom')?.value;

      const valid =
        house ||
        custom ||
        broadcastDate ||
        (broadcastDate && house) ||
        (broadcastDate && house && custom) ||
        (broadcastDate && custom);

      if (valid) {
        form.setErrors(null);
        return null;
      } else {
        const formErrors = {
          broadcastDateRequired: !broadcastDate,
          houseRequired: !house,
          customRequired: !custom,
        };

        Object.keys(formErrors).forEach(
          (key) =>
            formErrors[key as keyof typeof formErrors] === false &&
            delete formErrors[key as keyof typeof formErrors],
        );

        form.setErrors(formErrors);
        return formErrors;
      }
    };
  }
}
