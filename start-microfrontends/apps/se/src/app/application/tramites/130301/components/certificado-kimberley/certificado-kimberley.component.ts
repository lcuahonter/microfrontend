import { Catalogo, CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud130301State, Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadoKimberleyForma } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar el formulario del Certificado Kimberley.
 */
@Component({
  selector: 'app-certificado-kimberley',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent
  ],
  templateUrl: './certificado-kimberley.component.html',
  styleUrl: './certificado-kimberley.component.scss',
})
export class CertificadoKimberleyComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para el Certificado Kimberley.
   */
  certificadoKimberley!: FormGroup;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Notificador para manejar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos del formulario del Certificado Kimberley.
   */
  public certificadoKimberleyDatos: CertificadoKimberleyForma[] = [];

  /**
   * Lista de estados obtenidos del servicio.
   */
  public estado: Catalogo[] = [];

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Tramite value (procedureId) from ConsultaioQuery
   */
  public tramite: number = 130301;

  /**
   * Controla si el campo paisEmisorCertificado debe estar deshabilitado.
   */
  public isPaisEmisorCertificadoDisabled: boolean = true;

  /**
   * Controla si el campo paisDeOrigen debe estar deshabilitado.
   */
  public isPaisDeOrigenDisabled: boolean = true;

  /**
   * Controla si el campo mixed debe estar deshabilitado.
   */
  public esMezcladoDesactivado: boolean = true;

  /** Lista de nombres de campos del formulario certificadoKimberley. */
  /** Se usan para asignar valores y desactivar controles en el formulario. */
  private readonly kimberleyFields: string[] = [
    'certificadosEmitidos',
    'numeroCertificadokimberley',
    'nombreIngles',
    'nombreExportador',
    'direccionExportador',
    'nombreImportador',
    'direccionImportador',
    'numeroEnLetra',
    'numeroEnLetraIngles',
    'numeroFactura',
    'cantidadQuilates',
    'valorDiamantes',
    'paisEmisorCertificado',
    'mixed',
    'paisDeOrigen'
  ];

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param service Servicio para obtener datos del Certificado Kimberley.
   * @param tramite130301Store Almacén de estado para el trámite 130301.
   * @param tramite130301Query Consulta de estado para el trámite 130301.
   */
  constructor(
    private fb: FormBuilder,
    private service: SolicitudProrrogaService,
    public tramite130301Store: Tramite130301Store,
    private tramite130301Query: Tramite130301Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Inicializar campos como deshabilitados desde el constructor
    this.isPaisEmisorCertificadoDisabled = true;
    this.isPaisDeOrigenDisabled = true;
    this.esMezcladoDesactivado = true;
    
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          // Extract tramite value (procedureId) here
          this.tramite = Number(seccionState.procedureId);
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.esMezcladoDesactivado = true;
    this.inicializarEstadoFormulario();
    this.obtenerEstadoList();
  }

  /**
   * Inicializa el formulario con datos del store y aplica validaciones.
   * También aplica configuración de solo lectura si es necesario.
   * @method inicializarEstadoFormulario
   */
  inicializarEstadoFormulario(): void {
    this.tramite130301Query
      .selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormulario();
    if (this.esFormularioSoloLectura) {
      Object.keys(this.certificadoKimberley.controls).forEach((key) => {
        this.certificadoKimberley.get(key)?.disable();
      });
      // También deshabilitar los campos select especiales y mixed
      this.isPaisEmisorCertificadoDisabled = true;
      this.isPaisDeOrigenDisabled = true;
      this.esMezcladoDesactivado = true;
    } else {
      // Habilitar solo los campos que no están en kimberleyFields
      Object.keys(this.certificadoKimberley.controls).forEach((key) => {
        if (!this.kimberleyFields.includes(key)) {
          this.certificadoKimberley.get(key)?.enable();
        }
      });
      
      // Asegurar que los campos específicos estén deshabilitados
      this.deshabilitarCamposKimberley();
   }
  }

/** Asigna valores desde certificadoKimberleyDatos al formulario y desactiva los campos especificados. */
/** Solo actualiza campos definidos en los datos y luego los deshabilita en el FormGroup certificadoKimberley. */
private patchAndDisableKimberleyFields(): void {
    const DATA = this.certificadoKimberleyDatos?.[0] || {};
    this.kimberleyFields.forEach(field => {
      if (DATA[field as keyof CertificadoKimberleyForma] !== undefined) {
        this.certificadoKimberley.get(field)?.patchValue(DATA[field as keyof CertificadoKimberleyForma]);
      }
      this.certificadoKimberley.get(field)?.disable();
    });
  }

/** Desactiva únicamente los campos especificados en kimberleyFields. */
private deshabilitarCamposKimberley(): void {
    // Deshabilitar campos select especiales usando propiedades booleanas
    this.isPaisEmisorCertificadoDisabled = true;
    this.isPaisDeOrigenDisabled = true;
    this.esMezcladoDesactivado = true;
    
    // Deshabilitar el resto de campos usando el método tradicional
    this.kimberleyFields.forEach(field => {
      if (field !== 'paisEmisorCertificado' && field !== 'paisDeOrigen' && field !== 'mixed') {
        this.certificadoKimberley.get(field)?.disable();
      }
    });
  }

 /**
  * Crea y configura un formulario reactivo para gestionar los datos del Certificado Kimberley con campos deshabilitados y validaciones requeridas.
  */
  crearFormulario():void{
    this.certificadoKimberley = this.fb.group({
      certificadosEmitidos: [{ value: '', disabled: true }],
      numeroCertificadokimberley: [{ value: '', disabled: true }],
      paisEmisorCertificado: [{ value: this.solicitudState?.paisEmisorCertificado, disabled: true }],
      nombreIngles: [{ value: '', disabled: true }],
      mixed: [{ value: true, disabled: this.esFormularioSoloLectura || this.esMezcladoDesactivado }],
      paisDeOrigen: [{ value: this.solicitudState?.paisDeOrigen, disabled: true }],
      nombreExportador: [{ value: '', disabled: true }],
      direccionExportador: [{ value: '', disabled: true }],
      nombreImportador: [{ value: '', disabled: true }, Validators.required],
      direccionImportador: [{ value: '', disabled: true }, Validators.required],
      numeroEnLetra: [{ value: '', disabled: true }, Validators.required],
      numeroEnLetraIngles: [{ value: '', disabled: true }, Validators.required],
      numeroFactura: [{ value: '', disabled: true }, Validators.required],
      cantidadQuilates: [{ value: '', disabled: true }, Validators.required],
      valorDiamantes: [{ value: '', disabled: true }, Validators.required],
    });
  }

  /**
   * Obtiene los datos del formulario desde el servicio.
   */
  obtenerFormDatos(): void {
    this.certificadoKimberley.patchValue({
      certificadosEmitidos: this.solicitudState?.certificadoKimberleyForma?.certificadosEmitidos,
      numeroCertificadokimberley: this.solicitudState?.certificadoKimberleyForma?.numeroCertificadokimberley,
      nombreIngles: this.solicitudState?.certificadoKimberleyForma?.nombreIngles,
      nombreExportador: this.solicitudState?.certificadoKimberleyForma?.nombreExportador,
      direccionExportador: this.solicitudState?.certificadoKimberleyForma?.direccionExportador,
      nombreImportador: this.solicitudState?.certificadoKimberleyForma?.nombreImportador,
      direccionImportador: this.solicitudState?.certificadoKimberleyForma?.direccionImportador,
      numeroEnLetra: this.solicitudState?.certificadoKimberleyForma?.numeroEnLetra,
      numeroEnLetraIngles: this.solicitudState?.certificadoKimberleyForma?.numeroEnLetraIngles,
      numeroFactura: this.solicitudState?.certificadoKimberleyForma?.numeroFactura,
      cantidadQuilates: this.solicitudState?.certificadoKimberleyForma?.cantidadQuilates,
      valorDiamantes: this.solicitudState?.certificadoKimberleyForma?.valorDiamantes,
      paisEmisorCertificado: this.solicitudState?.certificadoKimberleyForma?.paisEmisorCertificado,
      mixed: this.solicitudState?.certificadoKimberleyForma?.mixed,
      paisDeOrigen: this.solicitudState?.certificadoKimberleyForma?.paisDeOrigen
    });

    if (!this.esFormularioSoloLectura) {
      this.deshabilitarCamposKimberley();
    }
  }

  /**
   * Obtiene la lista de estados desde el servicio.
   */
  obtenerEstadoList(): void {
    this.service
      .obtenerEstadoList()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.estado = Array.isArray(datos) ? datos : [];
      });
  }

  /**
   * Establece valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el store.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130301Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130301Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método de limpieza al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores de validación.
   */
  public markAllAsTouched(): void {
    if (this.certificadoKimberley) {
      this.certificadoKimberley.markAllAsTouched();
    }
  }
}