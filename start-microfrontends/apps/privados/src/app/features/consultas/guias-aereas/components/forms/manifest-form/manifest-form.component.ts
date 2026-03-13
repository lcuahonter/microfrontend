import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
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
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Subject, takeUntil, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Custom } from '@/features/consultas/manifiesto-aereo/interfaces/catalogos.interface';
import {
  Manisfest,
  ParamsManifests,
  TypeSearch,
} from '../../../interfaces/air-waybill-forms.interface';
import { formatDateIso } from '@/shared/utils/serviceUtils';
import { AirWaybillService } from '../../../services/air-waybill.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-manifest-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, DatePickerComponent, BsDatepickerModule],
  templateUrl: './manifest-form.component.html',
})
export class ManifestFormComponent implements OnInit, OnDestroy {
  @Input() customs: Custom[] = [];
  @Output() onSubmitForm = new EventEmitter<TypeSearch>();
  @ViewChild(DatePickerComponent) datePickerComponent!: DatePickerComponent;
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private airWaybillService = inject(AirWaybillService);
  formUtils = FormUtils;
  manifestForm = this.formBuilder.group(
    {
      startDate: [null],
      endDate: [null],
      manifest: [''],
      custom: [null],
    },
    {
      validators: [this.validManifestSearch()],
    },
  );
  isEndDateDisabled = true;
  readonly minEndDate = signal<Date | undefined>(undefined);
  readonly maxEndDate = signal<Date | undefined>(undefined);
  private startDateSignal = toSignal(this.manifestForm.controls['startDate']!.valueChanges, {
    initialValue: this.manifestForm.get('startDate')!.value,
  });
  private sessionStorage = inject(SessionStorageService);

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
    this.manifestForm.markAllAsTouched();

    if (this.manifestForm.valid) {
      const { startDate, endDate, manifest, custom } = this.manifestForm.value;
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
      const params: ParamsManifests = {
        idManifiesto: manifest ?? '',
        fechaIni: startDateFormatted,
        fechaFin: endDateFormatted,
        aduana: custom ? (custom as any).clave ?? String(custom) : '',
        rfc: '',
      };

      this.airWaybillService.paramsToGetManifests.set(params);
      this.onSubmitForm.emit(TypeSearch.MANIFEST);
    }
  }

  resetForm() {
    this.manifestForm.reset();
  }

  private persistData() {
    const paramsToGetManifests = this.sessionStorage.get<ParamsManifests>('paramsToGetManifests');
    if (!!paramsToGetManifests) {
      try {
        const formValues: any = {};
        if (paramsToGetManifests.idManifiesto) {
          formValues.manifest = paramsToGetManifests.idManifiesto;
        }
        if (paramsToGetManifests.fechaIni) {
          const startDate = new Date(paramsToGetManifests.fechaIni);
          if (!isNaN(startDate.getTime())) {
            formValues.startDate = startDate;
          }
        }
        if (paramsToGetManifests.fechaFin) {
          const endDate = new Date(paramsToGetManifests.fechaFin);
          if (!isNaN(endDate.getTime())) {
            formValues.endDate = endDate;
          }
        }
        if (paramsToGetManifests.aduana) {
          formValues.custom = paramsToGetManifests.aduana;
        }
        this.manifestForm.patchValue(formValues);
        this.airWaybillService.paramsToGetManifests.set(paramsToGetManifests);

        if (!this.airWaybillService.checkManifestClicked()) {
          this.onSubmitForm.emit(TypeSearch.MANIFEST);
        }
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }

  private listenEndDateChanges() {
    this.manifestForm.controls['startDate'].valueChanges
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

  private validManifestSearch(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      if (!(form instanceof FormGroup)) return null;

      const controls = form.controls;
      const get = (f: string) => controls[f]?.value;
      const hasValue = (v: any) =>
        v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '');

      const start = hasValue(get('startDate'));
      const end = hasValue(get('endDate'));
      const manifest = hasValue(get('manifest'));
      const custom = hasValue(get('custom'));

      const missingEndWhenStart = start && !end && !manifest; // endDate only required if startDate is set without manifest

      // Allow startDate + manifest to be valid even if endDate/custom are empty
      if (start && manifest) {
        form.setErrors(null);
        return null;
      }

      const valid =
        manifest || // solo manifiesto
        (start && end) || // fechas completas
        (custom && manifest) || // aduana + manifiesto
        (custom && start && end); // aduana + fechas

      if (valid && !missingEndWhenStart) {
        form.setErrors(null);
        return null;
      }

      const formErrors: ValidationErrors = {
        startDateRequired: !start,
        endDateRequired: !end || missingEndWhenStart,
        manifestRequired: !manifest,
        customRequired: !custom,
      };

      Object.keys(formErrors).forEach((key) => !formErrors[key] && delete formErrors[key]);

      form.setErrors(formErrors);
      return formErrors;
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
