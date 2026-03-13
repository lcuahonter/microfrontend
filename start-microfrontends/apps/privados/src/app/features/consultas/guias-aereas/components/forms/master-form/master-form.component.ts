import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { formatDateIso } from '@/shared/utils/serviceUtils';
import { formatDate, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
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
import { ParamsMasterGuides, TypeSearch } from '../../../interfaces/air-waybill-forms.interface';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-master-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, DatePickerComponent, BsDatepickerModule],
  templateUrl: './master-form.component.html',
})
export class MasterFormComponent implements OnInit, OnDestroy {
  @Input() customs: Custom[] = [];
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);

  formUtils = FormUtils;
  masterForm = this.formBuilder.group(
    {
      startDate: [null],
      endDate: [null],
      master: [''],
      custom: [null],
    },
    {
      validators: [this.validMasterSearch()],
    },
  );
  isEndDateDisabled = true;
  readonly minEndDate = signal<Date | undefined>(undefined);
  readonly maxEndDate = signal<Date | undefined>(undefined);
  private startDateSignal = toSignal(this.masterForm.controls['startDate']!.valueChanges, {
    initialValue: this.masterForm.get('startDate')!.value,
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
    this.masterForm.markAllAsTouched();

    if (this.masterForm.valid) {
      const { startDate, endDate, master, custom } = this.masterForm.value;
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
      const params: ParamsMasterGuides = {
        numGuia: master ?? '',
        fechaInicio: startDateFormatted,
        fechaFin: endDateFormatted,
        aduana: custom ? (custom as any).clave ?? String(custom) : '',
        rfc: '',
      };

      this.airWaybillService.paramsToGetMaster.set(params);
      this.onSubmitForm.emit(TypeSearch.MASTER);
    }
  }

  resetForm() {
    this.masterForm.reset();
  }

  listenEndDateChanges() {
    this.masterForm.controls['startDate'].valueChanges
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

  private validMasterSearch(): ValidatorFn {
    return (form): ValidationErrors | null => {
      const start = form.get('startDate')?.value;
      const end = form.get('endDate')?.value;
      const master = form.get('master')?.value;
      const custom = form.get('custom')?.value;

      const valid =
        custom ||
        master ||
        (custom && master) ||
        (start && custom) ||
        (start && master) ||
        (start && end);

      if (valid) {
        form.setErrors(null);
        return null;
      } else {
        const formErrors = {
          startDateRequired: !start,
          endDateRequired: !end,
          masterRequired: !master,
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

  private persistData() {
    const paramsToGetMaster = this.sessionStorage.get<ParamsMasterGuides>('paramsToGetMaster');

    if (!!paramsToGetMaster) {
      try {
        const formValues: any = {};
        if (paramsToGetMaster.numGuia) {
          formValues.master = paramsToGetMaster.numGuia;
        }
        if (paramsToGetMaster.fechaInicio) {
          const startDate = new Date(paramsToGetMaster.fechaInicio);
          if (!isNaN(startDate.getTime())) {
            formValues.startDate = startDate;
          }
        }
        if (paramsToGetMaster.fechaFin) {
          const endDate = new Date(paramsToGetMaster.fechaFin);
          if (!isNaN(endDate.getTime())) {
            formValues.endDate = endDate;
          }
        }
        if (paramsToGetMaster.aduana) {
          formValues.custom = paramsToGetMaster.aduana;
        }
        this.masterForm.patchValue(formValues);
        this.airWaybillService.paramsToGetMaster.set(paramsToGetMaster);
        this.onSubmitForm.emit(TypeSearch.MASTER);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
