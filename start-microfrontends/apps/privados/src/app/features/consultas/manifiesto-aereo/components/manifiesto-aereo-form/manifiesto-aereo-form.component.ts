import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { BsDatepickerConfig, BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FormUtils } from '@shared/utils/formUtils';
import { formatDateIso } from '@shared/utils/serviceUtils';
import { RoutingService } from '@core/services/routing.service';
import { APP_ROUTES, STORE_FRONT_ROUTES } from '@app/routes.constants';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { Custom, StatusDocument } from '../../interfaces/catalogos.interface';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { CatologosService } from '../../services/catalogos/catologos.service';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import {
  ParamsMessages,
  TypeDocument,
  TypeCode,
  SearchBy,
} from '../../interfaces/consultas-aereos.interface';
import { MANIFIESTO_AEREO_ROUTES } from '../../services/manifiesto-aereo.routes.constants';
@Component({
  selector: 'app-manifiesto-form-aereo',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgFor, NgIf, BsDatepickerModule, ButtonComponent, DatePickerComponent],
  templateUrl: './manifiesto-aereo-form.component.html',
  styleUrls: ['./manifiesto-aereo-form.component.scss'],
})
export class ManifiestoAereoFormComponent implements OnInit, OnDestroy {
  private routing = inject(RoutingService);
  private catalogosService = inject(CatologosService);
  private consultasAereosService = inject(ConsultasAereosService);
  private formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private localeService = inject(BsLocaleService);
  today = new Date();
  formUtils = FormUtils;
  myForm = this.formBuilder.group(
    {
      searchType: [null, Validators.required],
      typeDocument: [''],
      date: [null],
      transportCompany: [null],
      caat: [''],
      iata: [''],
      companyName: [{ value: '', disabled: true }],
      otherCode: [{ value: '', disabled: true }],
      customClearance: [''],
      customsTransshipment: [''],
      guideNumber: [''],
      guideSelect: [''],
    },
    {
      validators: [
        this.formUtils.conditionalRequiredValidator('searchType', 'document', 'typeDocument'),
        this.formUtils.conditionalRequiredValidator('searchType', 'date', 'date'),
        this.formUtils.conditionalRequiredValidator('transportCompany', 'CAAT', 'caat'),
        this.formUtils.conditionalRequiredValidator('transportCompany', 'IATA', 'iata'),
        this.formUtils.conditionalRequiredValidator('searchType', 'document', 'guideNumber'),
      ],
    },
  );
  bsConfig = this.initDateConfig();
  aduanas: Custom[] = [];
  estadoDocumentos: StatusDocument[] = [];
  trasportCompanyName = signal<string>('');
  typeDocument = TypeDocument;
  typeCode = TypeCode;
  searchBy = SearchBy;

  ngOnInit(): void {
    this.getAduanas();
    this.getEstadoDocumentos();
    this.listenCodesChanges();
  }

  submitForm(): void {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const {
        typeDocument,
        searchType,
        transportCompany,
        guideSelect,
        date,
        customClearance,
        customsTransshipment,
        guideNumber,
        caat,
        iata,
        otherCode,
      } = this.myForm.value;

      let dateFormatted = '';
      if (date) {
        dateFormatted = formatDateIso(date);
      }

      const paramsMensaje: ParamsMessages = {
        buscarPor: searchType ?? '',
        tipoDocumentoTransporte: typeDocument ?? '',
        tipoCodigo: transportCompany ?? '',
        cveCodigo: String(transportCompany) === 'CAAT' ? caat ?? '' : iata ?? '',
        estadoDocumento: guideSelect ?? '',
        fecha: dateFormatted,
        otroCodigo: otherCode ?? '',
        aduanaDespacho: customClearance ?? '',
        aduanaTransbordo: customsTransshipment ?? '',
        numeroManifiestoGuia: guideNumber ?? '',
        rfc: '',
        rol: '',
        filtroConsulta: typeDocument === TypeDocument.manifest,
      };

      this.consultasAereosService.setParamsToGetMessage(paramsMensaje);
      this.routing.navigate([
        STORE_FRONT_ROUTES.CONSULTAS,
        MANIFIESTO_AEREO_ROUTES.RESULTADOS_MANIFIESTO_AEREO,
      ]);
    }
  }

  getAduanas(): void {
    this.catalogosService
      .getAduanas()
      .pipe(
        tap((aduanas) => {
          this.aduanas = aduanas;
        }),
        take(1),
      )
      .subscribe();
  }

  getEstadoDocumentos(): void {
    this.catalogosService
      .getEstadoDocumentos()
      .pipe(
        tap((estadoDocumentos) => {
          this.estadoDocumentos = estadoDocumentos;
        }),
        take(1),
      )
      .subscribe();
  }

  listenCodesChanges(): void {
    this.myForm
      .get('caat')
      ?.valueChanges.pipe(
        tap((value: string | null) => {
          if (value?.length === 4) {
            this.consultasAereosService
              .getTransportCompanyCaat(value)
              .pipe(
                tap((response) => {
                  if (response.codigo === '00') {
                    this.myForm.controls['companyName'].setValue(response.datos?.nombre);
                  } else {
                    this.myForm.controls['companyName'].setValue('');
                  }
                }),
                take(1),
              )
              .subscribe();
          } else if ((value?.length ?? 0) < 4) {
            this.myForm.controls['companyName'].setValue('');
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.myForm
      .get('iata')
      ?.valueChanges.pipe(
        tap((value: string | null) => {
          if (value?.length === 3) {
            this.consultasAereosService
              .getTransportCompanyIata(value)
              .pipe(
                tap((response) => {
                  if (response.codigo === '00') {
                    this.myForm.controls['companyName'].setValue(response.datos?.nombre);
                    this.myForm.controls['otherCode'].setValue(response.datos?.iata);
                  } else {
                    this.myForm.controls['companyName'].setValue('');
                    this.myForm.controls['otherCode'].setValue('');
                  }
                }),
                take(1),
              )
              .subscribe();
          } else if ((value?.length ?? 0) < 3) {
            this.myForm.controls['companyName'].setValue('');
            this.myForm.controls['otherCode'].setValue('');
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.myForm
      .get('transportCompany')
      ?.valueChanges.pipe(
        tap((vale) => {
          this.myForm.controls['companyName'].setValue('');
          this.myForm.controls['otherCode'].setValue('');
          this.myForm.controls['caat'].setValue('');
          this.myForm.controls['iata'].setValue('');
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private initDateConfig(): Partial<BsDatepickerConfig> {
    this.localeService.use('es');
    return {
      containerClass: 'theme-default',
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: false,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
