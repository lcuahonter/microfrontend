import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { formatDate, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  effect,
  inject,
  signal,
  OnDestroy,
  OnInit,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Subject, takeUntil, tap } from 'rxjs';
import { ParamsFlights, TypeSearch } from '../../../interfaces/air-waybill-forms.interface';
import { formatDateIso } from '@/shared/utils/serviceUtils';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-flight-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, DatePickerComponent, BsDatepickerModule],
  templateUrl: './flight-form.component.html',
})
export class FlightFormComponent implements OnInit, OnDestroy {
  @Input() customs: Custom[] = [];
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private airWaybillService = inject(AirWaybillService);
  private sessionStorage = inject(SessionStorageService);

  formUtils = FormUtils;
  flightForm = this.formBuilder.group(
    {
      startDate: [null],
      endDate: [null],
      numFlight: [''],
      custom: [null],
    },
    {
      validators: [this.validFlightSearch()],
    },
  );
  isEndDateDisabled = true;
  readonly minEndDate = signal<Date | undefined>(undefined);
  readonly maxEndDate = signal<Date | undefined>(undefined);
  private startDateSignal = toSignal(this.flightForm.controls['startDate']!.valueChanges, {
    initialValue: this.flightForm.get('startDate')!.value,
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

  private persistData() {
    const paramsToGetFlights = this.sessionStorage.get<ParamsFlights>('paramsToGetFlights');
    if (!!paramsToGetFlights) {
      try {
        const formValues: any = {};
        if (paramsToGetFlights.numVuelo) {
          formValues.numFlight = paramsToGetFlights.numVuelo;
        }
        if (paramsToGetFlights.fechaIni) {
          const startDate = new Date(paramsToGetFlights.fechaIni);
          if (!isNaN(startDate.getTime())) {
            formValues.startDate = startDate;
          }
        }
        if (paramsToGetFlights.fechaFin) {
          const endDate = new Date(paramsToGetFlights.fechaFin);
          if (!isNaN(endDate.getTime())) {
            formValues.endDate = endDate;
          }
        }
        if (paramsToGetFlights.aduana) {
          formValues.custom = paramsToGetFlights.aduana;
        }
        this.flightForm.patchValue(formValues);
        this.airWaybillService.paramsToGetFlights.set(paramsToGetFlights);

        if (!this.airWaybillService.checkFlightClicked()) {
          this.onSubmitForm.emit(TypeSearch.FLIGHT);
        }
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  submitForm() {
    this.flightForm.markAllAsTouched();
    if (this.flightForm.valid) {
      const { startDate, endDate, numFlight, custom } = this.flightForm.value;
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
      const params: ParamsFlights = {
        numVuelo: numFlight ?? '',
        fechaIni: startDateFormatted,
        fechaFin: endDateFormatted,
        aduana: custom ? (custom as any).clave ?? String(custom) : '',
        rfc: '',
      };

      this.airWaybillService.paramsToGetFlights.set(params);
      this.onSubmitForm.emit(TypeSearch.FLIGHT);
    }
  }

  resetForm() {
    this.flightForm.reset();
  }

  private listenEndDateChanges() {
    this.flightForm.controls['startDate'].valueChanges
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

  private validFlightSearch(): ValidatorFn {
    return (form): ValidationErrors | null => {
      const startDate = form.get('startDate')?.value;
      const endDate = form.get('endDate')?.value;
      const numFlight = form.get('numFlight')?.value;
      const custom = form.get('custom')?.value;

      const valid = numFlight;
      /*(numFlight && custom) ||
        (startDate && numFlight && custom) ||
        (startDate && endDate && numFlight && custom) ||
        (startDate && endDate && custom);*/

      if (valid) {
        form.setErrors(null);
        return null;
      } else {
        const formErrors = {
          startDateRequired: !startDate,
          endDateRequired: !endDate,
          numFlightRequired: !numFlight,
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
