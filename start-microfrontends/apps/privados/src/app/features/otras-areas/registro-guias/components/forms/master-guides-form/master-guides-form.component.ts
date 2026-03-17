import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import {
  Code,
  Location,
  LocationEnum,
  OperationType,
  Rol,
  TransportSplit,
  UnitsWeight,
} from '../../../interfaces/catalogs.interface';
import { MasterGuideForm } from '../../../interfaces/guides-register.interface';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { IntegerOnlyDirective } from '@/shared/directives/integer-only.directive';
declare const $: any;

@Component({
  selector: 'app-master-guides-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ButtonComponent,
    NgClass,
    NgIf,
    NgForOf,
    MaxLengthDirective,
    DialogComponent,
    IntegerOnlyDirective,
  ],
  templateUrl: './master-guides-form.component.html',
})
export class MasterGuidesFormComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private registerGuideService = inject(RegisterGuideService);
  private destroy$ = new Subject<void>();
  locationEnum = LocationEnum;
  weightUnits: UnitsWeight[] = [];
  iataAirports: Location[] = [];
  controlledPremises: Location[] = [];
  issueIds: Location[] = [];
  originIds: Location[] = [];
  finalIds: Location[] = [];
  operationTypes: OperationType[] = [];
  codesHandling: Code[] = [];
  codesSpecial: Code[] = [];
  codesSSH: Code[] = [];
  codesSSR: Code[] = [];
  transportSplitOptions: TransportSplit[] = [];
  formUtils = FormUtils;
  masterGuideForm = this.formBuilder.group({
    transportSplitDescription: [null, Validators.required],
    waybillNumber: [null, [Validators.required, this.formUtils.waybillNumber()]],
    grossWeightMeasure: [null, Validators.required],
    grossWeightUnitCode: [null, Validators.required],
    totalPieceQuantity: [null, Validators.required],
    description: [null, Validators.required],
    originType: [null, Validators.required],
    originId: [null, Validators.required],
    originName: [null],
    finalType: [null, Validators.required],
    finalId: [null, Validators.required],
    finalName: [null],
    subjectCode: [null, Validators.required],
    maneuverType: ['Special Handling Codes'],
    maneuverDescription: [null],
    maneuverCode: [null],
    specialType: ['Special Handling Codes'],
    specialDescription: [null],
    specialCode: [null],
  });

  ngOnInit(): void {
    this.getIataAirports();
    this.getControlledPremises();
    this.getUnitsWeight();
    this.getOperationTypes();
    this.getCodesSPH();
    this.getCodesSSR();
    this.getTransportationSplit();
    this.loadFromSessionStorage();
    this.listenIdSelectsChanges();
  }

  private listenIdSelectsChanges() {
    this.masterGuideForm.controls['originId'].valueChanges
      .pipe(
        tap((value) => {
          this.masterGuideForm.controls['originName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterGuideForm.controls['finalId'].valueChanges
      .pipe(
        tap((value) => {
          this.masterGuideForm.controls['finalName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterGuideForm.controls['originType'].valueChanges
      .pipe(
        tap(() => this.masterGuideForm.controls['originName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.originIds = this.iataAirports;
          }

          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.originIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterGuideForm.controls['finalType'].valueChanges
      .pipe(
        tap(() => this.masterGuideForm.controls['finalName'].setValue(null)),
        tap((value) => {
          if (value === this.locationEnum.IATA) {
            this.finalIds = this.iataAirports;
          }
          if (value === this.locationEnum.CONTROLLED_PREMISES) {
            this.finalIds = this.controlledPremises;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterGuideForm.controls['maneuverType'].valueChanges
      .pipe(
        tap(() => this.masterGuideForm.controls['maneuverCode'].setValue(null)),
        tap((value) => {
          if (value === 'SpecialHandlingCodes') {
            this.codesHandling = this.codesSSH;
          }
          if (value === 'Dangerous') {
            this.codesHandling = this.codesSSR;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.masterGuideForm.controls['specialType'].valueChanges
      .pipe(
        tap(() => this.masterGuideForm.controls['specialCode'].setValue(null)),
        tap((value) => {
          if (value === 'SpecialHandlingCodes') {
            this.codesSpecial = this.codesSSH;
          }
          if (value === 'Dangerous') {
            this.codesSpecial = this.codesSSR;
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onSubmit() {
    this.masterGuideForm.markAllAsTouched();

    if (this.masterGuideForm.valid) {
      const guideNumber = this.masterGuideForm.controls['waybillNumber'].value || '';
      this.catalogsService
        .getGuide(guideNumber, '740')
        .pipe(
          tap((res: string) => {
            if (res === 'NO') {
              this.displayGuideExists();
            } else {
              const master = this.masterGuideForm.value as unknown as MasterGuideForm;
              this.registerGuideService.masterGuideForm = [
                ...(this.registerGuideService.masterGuideForm ?? []),
                {
                  ...master,
                  originRealId: this.registerGuideService.getIdByLocation(
                    this.originIds,
                    this.masterGuideForm.controls['originId'].value || '',
                  ),
                  finalRealId: this.registerGuideService.getIdByLocation(
                    this.finalIds,
                    this.masterGuideForm.controls['finalId'].value || '',
                  ),
                  temporalId: Date.now(),
                },
              ];
              this.sessionStorage.set('masterGuideForm', this.registerGuideService.masterGuideForm);
              this.onCancel();
            }
          }),
          take(1),
        )
        .subscribe();
    }
  }

  onCancel() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.TIPO_CARGA,
    ]);
  }

  displayGuideExists() {
    $('#guideExists').modal();
  }

  radioHasValue(controlName: string) {
    const control = this.masterGuideForm.get(controlName);
    return !!control && control.value !== null && control.value !== '';
  }

  private getCodesSPH() {
    this.catalogsService
      .getCodesSPH()
      .pipe(
        tap((codes: Code[]) => {
          this.codesSSH = codes;
          this.codesHandling = codes;
          this.codesSpecial = codes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getCodesSSR() {
    this.catalogsService
      .getCodesSSR()
      .pipe(
        tap((codes: Code[]) => {
          this.codesSSR = codes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getTransportationSplit() {
    this.catalogsService
      .getTransportationSplit()
      .pipe(
        tap((transportSplitOptions: TransportSplit[]) => {
          this.transportSplitOptions = transportSplitOptions;
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
          if (this.masterGuideForm.controls['finalType'].value === this.locationEnum.IATA) {
            this.finalIds = this.iataAirports;
          }

          if (
            this.masterGuideForm.controls['finalType'].value ===
            this.locationEnum.CONTROLLED_PREMISES
          ) {
            this.finalIds = this.controlledPremises;
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private getOperationTypes() {
    this.catalogsService
      .getOperationTypes()
      .pipe(
        tap((operationTypes: OperationType[]) => {
          this.operationTypes = operationTypes;
        }),
        take(1),
      )
      .subscribe();
  }

  private getControlledPremises() {
    this.catalogsService
      .getControlledPremises()
      .pipe(
        tap((controlledPremises: Location[]) => {
          this.controlledPremises = controlledPremises;
        }),
        take(1),
      )
      .subscribe();
  }

  private getUnitsWeight() {
    this.catalogsService
      .getUnitsWeight()
      .pipe(
        tap((weightUnits: UnitsWeight[]) => {
          this.weightUnits = weightUnits;
        }),
        take(1),
      )
      .subscribe();
  }

  private loadFromSessionStorage() {
    const masterGuideForm = this.sessionStorage.get<any>('masterGuideForm');

    if (!!masterGuideForm) {
      try {
        this.masterGuideForm.patchValue(masterGuideForm);
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
