import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  RequerimientosState,
  RequerimientosStore,
} from '../../../estados/store/requerimientos.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectClaveComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select-clave/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { RequerimientosQuery } from '../../../estados/queries/requerimientos.query';
import data from '@libs/shared/theme/assets/json/funcionario/cat-tipo-requerimiento.json';

import { IniciarRequerimientoResponse, Observacion } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';


import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  ConsultaCatalogoService,
  CveEnumeracionConfig,
  InputFecha,
  InputFechaComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-capturar-requerimiento',
  standalone: true,
  imports: [CommonModule, CatalogoSelectClaveComponent, ReactiveFormsModule, TablaDinamicaComponent],
  templateUrl: './capturar-requerimiento.component.html',
  styleUrl: './capturar-requerimiento.component.scss',
})
export class CapturarRequerimientoComponent implements OnInit, OnDestroy, OnChanges {

  @Input() showTitle: boolean = true;

  @Input() isEvaluar: boolean = true;

  @Input() isAsignarAutorizador: boolean = true;

  /**
   * Declaración de variable para el formulario
   */
  formRequerimiento!: FormGroup;
  /**
   * Catálogo de tipo de requerimiento
   */
  catTipoRequerimiento!: Catalogo[];
  motivoTipoTramiteOpcions!: Catalogo[];
  fundamentoRequerimientoOpcions!: Catalogo[];
  autorizadorOpcions!: Catalogo[];
  tipoRequerimientoOpcions!: Catalogo[];
  /**
   * Notificador para destruir las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estado de la solicitud.
   */
  public solicitudRequerimientosState!: RequerimientosState;
  /**
   * Límite máximo de caracteres para el campo de justificación
   */
  readonly MAX_CHARS = 10000;

  @Input() procedureId: number = 260203;

  /** Indica si se debe mostrar el tipo de requerimiento */
  @Input() isTipoRequerimiento: boolean = true;

  /** Indica si se debe mostrar el área solicitante */
  @Input() isAreaSolicitante: boolean = true;

  /** Indica si se debe mostrar la justificación del requerimiento */
  @Input() isJustificacionRequerimiento: boolean = true;

  /** Indica si se debe mostrar el campo de fundamento del requerimiento. */
  @Input() isFundamento?: boolean = true;

  /** Datos de respuesta de la inicialización del requerimiento */
  @Input() iniciarResponse!: IniciarRequerimientoResponse;

  @Input() readonly: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() formChanged = new EventEmitter<any>();

  /** Dispara la validación y guardado del formulario desde el componente padre. */
  @Input() triggerGuardar: boolean = false;

  /**
   * Flag para mostrar mensaje de límite de caracteres alcanzado
   */
  public showCharLimitMessage = false;

  destinadoParaCatalogoParameter!:CveEnumeracionConfig;

  /** 
   * @property {Subject<void>} destroy$ 
   * @description Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**  * @description Variable que indica si se deben mostrar los campos en la interfaz.
   * @type {boolean}
   */
  public showFields: boolean = true;

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla: ConfiguracionColumna<Observacion>[] = [
    { encabezado: "Fecha de generación", clave: (e: Observacion) => e.fecha_observacion, orden: 1 },
    { encabezado: "Fecha de atención", clave: (e: Observacion) => e.fecha_atencion ?? undefined, orden: 2 },
    { encabezado: "Generada por", clave: (e: Observacion) => e.cve_usuario, orden: 3 },
    { encabezado: "Estatus", clave: (e: Observacion) => e.estado_observacion, orden: 4 },
    { encabezado: "Detalle", clave: (e: Observacion) => e.observacion, orden: 5 }
  ];

  /**
   * @description Variable que almacena las observaciones del dictamen
   */
  public observaciones: Observacion[] = [];

  constructor(
    private fb: FormBuilder,
    private requerimientosStore: RequerimientosStore,
    private solicitudRequerimientoQuery: RequerimientosQuery,
    private catalogoService: ConsultaCatalogoService,
    private validacionesService: ValidacionesFormularioService,
  ) {
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudRequerimientosState = seccionState;
          this.crearFormRequerimiento();
        })
      )
      .subscribe();

  }
  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
     
    //  this.catTipoRequerimiento = this.iniciarResponse?.alcances_requerimiento ?
    //      this.iniciarResponse.alcances_requerimiento as Catalogo[] : [];
    this.isTipoRequerimiento = this.catTipoRequerimiento?.length > 0;
    if((this.procedureId === 80101 || this.procedureId === 80103 || this.procedureId === 80104 )){
      this.showFields = false;
    }else{
      this.inicializarCatalogoOpciones();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iniciarResponse'] && changes['iniciarResponse'].currentValue) {
      this.patchFormValues();
      this.catTipoRequerimiento = this.iniciarResponse?.alcances_requerimiento
        ? (this.iniciarResponse.alcances_requerimiento as Catalogo[])
        : [];
      this.isTipoRequerimiento = this.catTipoRequerimiento.length > 0;
    }
    if (changes['procedureId'] && changes['procedureId'].currentValue) {
      this.destinadoParaCatalogoParameter =
        this.catalogoService.getCatalogoParameterConfig(this.procedureId);
    }
    if (changes['readonly'] && changes['readonly'].currentValue !== undefined && changes['readonly'].currentValue) {
      this.formRequerimiento.disable();
    }

    if (changes['triggerGuardar'] && changes['triggerGuardar'].currentValue !== undefined && changes['triggerGuardar'].currentValue) {
      this.markFormTouched();
    }
    if (changes['isFundamento'] && changes['isFundamento'].currentValue !== undefined) {
      const FUNDAMENTO_CONTROL = this.formRequerimiento.get('fundamento');
      if (FUNDAMENTO_CONTROL) {
        if (!this.isFundamento) {
          FUNDAMENTO_CONTROL?.removeValidators(Validators.required);
        } else {
          FUNDAMENTO_CONTROL?.addValidators(Validators.required);
        }
        FUNDAMENTO_CONTROL?.updateValueAndValidity();
      }
    }
    this.formRequerimiento.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.formChanged.emit(val);
      });
    this.observaciones = this.iniciarResponse?.observaciones ?? []; 
  }

  patchFormValues(): void {
    const SOURCE = this.getPatchSource();
    this.formRequerimiento.patchValue({
      tipoRequerimiento: SOURCE?.id_tipo_requerimiento || "",
      justificacion: SOURCE?.justificacion || "",
      motivo: SOURCE?.motivo || "",
      fundamento: SOURCE?.fundamento || "",
      siglas_participante_externo: SOURCE?.siglas_participante_externo || "",
      alcance_requerimiento: SOURCE?.alcance_requerimiento || "",
    });
  }

  private getPatchSource(): Partial<IniciarRequerimientoResponse> {
    const STATE = this.solicitudRequerimientosState;

    if (
      STATE &&
      (
        STATE.idTipoRequerimiento ||
        STATE.justificacion ||
        STATE.motivo ||
        STATE.fundamento ||
        STATE.siglas_participante_externo ||
        STATE.alcance_requerimiento
      )
    ) {
      return {
        id_tipo_requerimiento: STATE.idTipoRequerimiento,
        justificacion: STATE.justificacion,
        motivo: STATE.motivo,
        fundamento: STATE.fundamento,
        siglas_participante_externo: STATE.siglas_participante_externo,
        alcance_requerimiento: STATE.alcance_requerimiento,
      };
    }

    return this.iniciarResponse ?? {};
  }

  
  /**
   * Método para crear el formulario de la captura de requerimiento
   */
  crearFormRequerimiento(): void {
    this.formRequerimiento = this.fb.group({
      tipoRequerimiento: [
        this.solicitudRequerimientosState?.idTipoRequerimiento || '',
        this.isTipoRequerimiento ? [Validators.required] : [],
      ],
      justificacion: [
        this.solicitudRequerimientosState?.justificacion || '',
        this.isJustificacionRequerimiento
          ? [Validators.required]
          : [],
      ],
      motivo: [
        this.solicitudRequerimientosState?.motivo || '',
        [Validators.required],
      ],
      fundamento: [
        this.solicitudRequerimientosState?.fundamento || '',
        this.isFundamento ? [Validators.required] : [],
      ],
      siglas_participante_externo: [
        this.solicitudRequerimientosState?.siglas_participante_externo || '',
        [Validators.required],
      ],
      alcance_requerimiento: [
        this.solicitudRequerimientosState?.alcance_requerimiento || '',
        [Validators.required],
      ],
    });
  }

  inicializarCatalogoOpciones(): void {
    this.catalogoService
      .getEnumeracionEnum(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.tipoRequerimientoOpcions = DATOS;
        }
      });

      if (this.isAsignarAutorizador) {
        this.catalogoService
      .getAsignarAutorizador(this.procedureId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.autorizadorOpcions = DATOS;
        }
      });
      }
    

    this.catalogoService
      .getMotivoDelRequerimiento(this.procedureId, 'TIMTTR.RI')
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const DATOS = response.datos as Catalogo[];
        if (response) {
          this.motivoTipoTramiteOpcions = DATOS;
        }
      });
      
      if (this.isFundamento) {
        this.catalogoService
        .getFundamentoDelRequerimiento(this.procedureId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          const DATOS = response.datos as Catalogo[];
          if (response) {
            this.fundamentoRequerimientoOpcions = DATOS;
          }
        });
      }

      queueMicrotask(() => 
        this.patchFormValues()
      );
          
  }
  
  /**
   * Establece los valores en el store de tramite5701.
   *
   * @param {FormGroup} form - El formulario del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
   * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
   * @returns {void}
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof RequerimientosStore
  ): void {
    const VALOR = form.get(campo)?.value;
    if (VALOR === '1' || VALOR === '2') {
      this.requerimientosStore.setPestaniaSolicitudDocumento(true);
    } else {
      this.requerimientosStore.setPestaniaSolicitudDocumento(false); // agrega esto si no lo tenías
    }
    (this.requerimientosStore[metodoNombre] as (value: string) => void)(VALOR);
    this.requerimientosStore.setFormaValida(form.valid);
  }


  /**
   * Método para manejar el evento input del textarea
   * Controla el mensaje de límite de caracteres
   */
  onInput(): void {
    const CURRENT_VALUE =
      this.formRequerimiento.get('justificacion')?.value || '';
    this.showCharLimitMessage = CURRENT_VALUE.length >= this.MAX_CHARS;
    // this.setValoresStore(
    //   this.formRequerimiento,
    //   'justificacion',
    //   'setjustificacionRequerimientoValue'
    // );
  }

  // eslint-disable-next-line class-methods-use-this
  private markEnabledControlsAsTouched(formGroup: FormGroup): void {
      Object.values(formGroup.controls).forEach((control) => {
      if (!control.disabled) {
        control.markAsTouched();
      }
    });
  }

  /**
 * Marca como tocados los controles habilitados cuando el formulario es inválido.
 * Si el formulario es válido, emite el evento para continuar el flujo.
 */
  markFormTouched(): boolean {
    if (this.formRequerimiento.invalid) {
      this.markEnabledControlsAsTouched(this.formRequerimiento);
    }
    return this.formRequerimiento.valid;
  }

  /**
  * compo doc
  * @method isValid
  * @description 
  * Verifica si un campo específico del formulario es válido.
  * @param field El nombre del campo que se desea validar.
  * @returns {boolean | null} Un valor booleano que indica si el campo es válido.
  */
  public esValido(campo: string): boolean | null {
    return this.validacionesService.isValid(this.formRequerimiento, campo);
  }

  /**
   * Se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
