import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { formatDateIso } from '@/shared/utils/serviceUtils';
import { formatDate, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Subject, takeUntil, tap } from 'rxjs';
import { ParamsCaat, TypeSearch } from '../../../interfaces/air-waybill-forms.interface';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-caat-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, DatePickerComponent, BsDatepickerModule],
  templateUrl: './caat-form.component.html',
})
export class CaatFormComponent implements OnInit, OnDestroy {
  @Input() customs: Custom[] = [];
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);
  formUtils = FormUtils;
  caatForm = this.formBuilder.group(
    {
      startDate: [null],
      endDate: [null],
      caat: [''],
      custom: [null],
    },
    {
      validators: [this.validCaatSearch()],
    },
  );
  isEndDateDisabled = true;
  readonly minEndDate = signal<Date | undefined>(undefined);
  readonly maxEndDate = signal<Date | undefined>(undefined);
  private startDateSignal = toSignal(this.caatForm.controls['startDate']!.valueChanges, {
    initialValue: this.caatForm.get('startDate')!.value,
  });

  rangeDateEffect = effect(
    () => {
      const start = this.startDateSignal() as Date | null;

      if (start instanceof Date) {
        const min = new Date(start);
        const max = new Date(start);
        max.setDate(start.getDate() + 6);
        this.minEndDate.set(min);
        this.maxEndDate.set(max);
      } else {
        this.minEndDate.set(undefined);
        this.maxEndDate.set(undefined);
      }
    },
    { allowSignalWrites: true },
  );

  ngOnInit(): void {
    this.listenEndDateChanges();
    this.persistData();
  }

  submitForm() {
    this.caatForm.markAllAsTouched();
    if (this.caatForm.valid) {
      const { startDate, endDate, caat, custom } = this.caatForm.value;
      let startDateFormatted = '';
      let endDateFormatted = '';
      if (startDate) {
        startDateFormatted = formatDateIso(startDate);
        startDateFormatted = formatDate(startDateFormatted, 'dd/MM/yyyy', 'en-US');
      }
      if (endDate) {
        endDateFormatted = formatDateIso(endDate);
        endDateFormatted = formatDate(endDateFormatted, 'dd/MM/yyyy', 'en-US');
      }
      const params: ParamsCaat = {
        caat: caat ?? '',
        fechaIni: startDateFormatted,
        fechaFin: endDateFormatted,
        aduana: custom ? (custom as any).clave ?? String(custom) : '',
        rfc: '',
      };

      this.airWaybillService.paramsToGetCaat.set(params);
      this.onSubmitForm.emit(TypeSearch.CAAT);
    }
  }

  resetForm() {
    this.caatForm.reset();
  }

  private persistData() {
    const paramsToGetCaat = this.sessionStorage.get<ParamsCaat>('paramsToGetCaat');
    if (!!paramsToGetCaat) {
      try {
        const formValues: any = {};
        if (paramsToGetCaat.fechaIni) {
          const startDate = new Date(paramsToGetCaat.fechaIni);
          if (!isNaN(startDate.getTime())) {
            formValues.startDate = startDate;
          }
        }
        if (paramsToGetCaat.fechaFin) {
          const endDate = new Date(paramsToGetCaat.fechaFin);
          if (!isNaN(endDate.getTime())) {
            formValues.endDate = endDate;
          }
        }
        if (paramsToGetCaat.caat) {
          formValues.caat = paramsToGetCaat.caat;
        }
        if (paramsToGetCaat.aduana) {
          formValues.custom = paramsToGetCaat.aduana;
        }
        this.caatForm.patchValue(formValues);
        this.airWaybillService.paramsToGetCaat.set(paramsToGetCaat);
        this.onSubmitForm.emit(TypeSearch.CAAT);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  private listenEndDateChanges() {
    this.caatForm.controls['startDate'].valueChanges
      .pipe(
        tap((value) => {
          if (!!value) {
            this.isEndDateDisabled = false;
          } else {
            this.isEndDateDisabled = true;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private validCaatSearch(): ValidatorFn {
    return (form): ValidationErrors | null => {
      const startDate = form.get('startDate')?.value;
      const endDate = form.get('endDate')?.value;
      const caat = form.get('caat')?.value;
      const custom = form.get('custom')?.value;

      const valid =
        (caat && custom) ||
        (startDate && caat && custom) ||
        (startDate && endDate && custom) ||
        (startDate && endDate && caat && custom);

      if (valid) {
        form.setErrors(null);
        return null;
      } else {
        const formErrors = {
          startDateRequired: !startDate,
          endDateRequired: !endDate,
          caatRequired: !caat,
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
