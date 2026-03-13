import { RoutingService } from '@/core/services/routing.service';
import { OTRAS_AREAS_ROUTES } from '@/features/otras-areas/otras-areas.routes.constants';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { TimeFormatDirective } from '@/shared/directives/time-format.directive';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
  Location,
  LocationEnum,
  TransportationMode,
  TransportationStages,
} from '../../../interfaces/catalogs.interface';
import { TransportForm } from '../../../interfaces/guides-register.interface';
import { RegisterGuideService } from '../../../services/register-guide.service';

@Component({
  selector: 'app-transport-details-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ButtonComponent,
    NgClass,
    NgIf,
    DatePickerComponent,
    BsDatepickerModule,
    TimeFormatDirective,
    NgFor,
  ],
  templateUrl: './transport-details-form.component.html',
})
export class TransportDetailsFormComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private registerGuideService = inject(RegisterGuideService);
  private destroy$ = new Subject<void>();
  formUtils = FormUtils;
  locationEnum = LocationEnum;
  transportForm = this.formBuilder.group({
    stageCode: [null, Validators.required],
    mode: [null, Validators.required],
    scheduledOccurrenceDate: [null, Validators.required],
    scheduledOccurrenceTime: [null, Validators.required],
    arrivalLocationType: [null, Validators.required],
    arrivalId: ['', Validators.required],
    arrivalName: ['', Validators.required],
    arrivalScheduledDate: [null, Validators.required],
    arrivalScheduledTime: [null, Validators.required],
    departureLocationType: [null, Validators.required],
    departureId: ['', Validators.required],
    departureName: ['', Validators.required],
  });
  transportationStages: TransportationStages[] = [];
  transportationModes: TransportationMode[] = [];
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  arrivalIds: Location[] = [];
  departureIds: Location[] = [];
  scheduledOccurrenceDate: Date | undefined = undefined;
  arrivalScheduledDate: Date | undefined = undefined;
  isUpdating: boolean = false;
  transportTemporalId: number | null = null;

  ngOnInit(): void {
    this.getControlledPremises();
    this.getIataAirports();
    this.getTransportationStages();
    this.getTransportationModes();
    this.listenIdSelectsChanges();
    this.setValuesIfIsUpdating();
  }

  onSubmit(): void {
    this.transportForm.markAllAsTouched();
    if (this.transportForm.valid) {
      if (this.isUpdating) {
        let transportDetails = this.sessionStorage.get<TransportForm[]>('transportDetails');
        if (!!transportDetails) {
          try {
            transportDetails = transportDetails.map((transport) => {
              if (transport.temporalId === this.transportTemporalId) {
                return {
                  ...this.transportForm.value,
                  arrivalId: this.transportForm.value.arrivalId?.split('|')[1],
                  arrivalIdComplete: this.transportForm.value.arrivalId,
                  departureId: this.transportForm.value.departureId?.split('|')[1],
                  departureIdComplete: this.transportForm.value.departureId,
                  temporalId: transport.temporalId,
                } as unknown as TransportForm;
              }
              return {
                ...transport,
              };
            });
            this.registerGuideService.transportDetails = transportDetails;
            this.sessionStorage.set('transportDetails', transportDetails);
            this.sessionStorage.remove('transportDetailsToUpdate');
            this.registerGuideService.goToTabsPage();
          } catch (e) {
            // Ignore error if parsing fails
          }
        }
      } else {
        const transportDetails = {
          ...this.transportForm.value,
          arrivalId: this.transportForm.value.arrivalId?.split('|')[1],
          arrivalIdComplete: this.transportForm.value.arrivalId,
          departureId: this.transportForm.value.departureId?.split('|')[1],
          departureIdComplete: this.transportForm.value.departureId,
        } as unknown as TransportForm;
        this.registerGuideService.transportDetails = [
          ...(this.registerGuideService.transportDetails ?? []),
          { ...transportDetails, temporalId: Date.now() },
        ];
        this.sessionStorage.set('transportDetails', this.registerGuideService.transportDetails);
        this.registerGuideService.goToTabsPage();
      }
    }
  }

  onCancel(): void {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
    ]);
    this.sessionStorage.remove('transportDetailsToUpdate');
  }

  radioHasValue(controlName: string): boolean {
    const control = this.transportForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  private listenIdSelectsChanges() {
    this.transportForm.controls['arrivalId'].valueChanges
      .pipe(
        tap((value) => {
          if (!value) {
            return;
          }
          this.transportForm.controls['arrivalName'].setValue(value?.split('|')[0]);
        }),

        takeUntil(this.destroy$),
      )
      .subscribe();

    this.transportForm.controls['departureId'].valueChanges
      .pipe(
        tap((value) => {
          if (!value) {
            return;
          }
          this.transportForm.controls['departureName'].setValue(value.split('|')[0]);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.transportForm.controls['arrivalLocationType'].valueChanges
      .pipe(
        tap(() => this.transportForm.controls['arrivalName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.arrivalIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.arrivalIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.transportForm.controls['departureLocationType'].valueChanges
      .pipe(
        tap(() => this.transportForm.controls['departureName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.departureIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.departureIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getControlledPremises() {
    this.catalogsService
      .getControlledPremises()
      .pipe(
        tap((controlledPremises: Location[]) => {
          this.controlledPremises = controlledPremises;
          if (
            this.transportForm.controls['arrivalLocationType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.arrivalIds = controlledPremises;
          }

          if (
            this.transportForm.controls['departureLocationType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.departureIds = controlledPremises;
          }
        }),
        tap(() => this.setIds()),
        take(1),
      )
      .subscribe();
  }

  private setIds() {
    const transportDetails = this.sessionStorage.get<any>('transportDetails');

    if (!!transportDetails) {
      const arrivalId = transportDetails[0].arrivalId;
      const arrivalName = this.registerGuideService.getNameByLocation(this.arrivalIds, arrivalId);
      const arrivalIdValue = arrivalName + '|' + arrivalId;
      this.transportForm.controls['arrivalId'].setValue(arrivalIdValue);

      const departureId = transportDetails[0].departureId;
      const departureName = this.registerGuideService.getNameByLocation(
        this.departureIds,
        departureId,
      );
      const departureIdValue = departureName + '|' + departureId;
      this.transportForm.controls['departureId'].setValue(departureIdValue);
    }
  }

  private getTransportationStages() {
    this.catalogsService
      .getTransportationStages()
      .pipe(
        tap((transportationStages: TransportationStages[]) => {
          this.transportationStages = transportationStages;
        }),
        take(1),
      )
      .subscribe();
  }

  private getTransportationModes() {
    this.catalogsService
      .getTransportationModes()
      .pipe(
        tap((transportationModes: TransportationMode[]) => {
          this.transportationModes = transportationModes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getIataAirports() {
    this.catalogsService
      .getAirportsIata()
      .pipe(
        tap((iataAirports: Location[]) => {
          this.iataAirports = iataAirports;
          if (this.transportForm.controls['arrivalLocationType'].value === this.locationEnum.IATA) {
            this.arrivalIds = iataAirports;
          }
          if (
            this.transportForm.controls['departureLocationType'].value === this.locationEnum.IATA
          ) {
            this.departureIds = iataAirports;
          }
        }),

        tap(() => this.setIds()),
        take(1),
      )
      .subscribe();
  }

  private setValuesIfIsUpdating() {
    const transportDetails = this.sessionStorage.get<TransportForm>('transportDetailsToUpdate');

    if (!!transportDetails) {
      this.isUpdating = true;
      this.transportTemporalId = transportDetails.temporalId;
      try {
        const formValues: any = {};
        formValues.transportDetails = {
          ...transportDetails,
          arrivalId: transportDetails.arrivalIdComplete,
          departureId: transportDetails.departureIdComplete,
        };
        this.arrivalScheduledDate = new Date(transportDetails.arrivalScheduledDate);
        this.scheduledOccurrenceDate = new Date(transportDetails.scheduledOccurrenceDate);
        this.transportForm.patchValue(formValues.transportDetails);
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
