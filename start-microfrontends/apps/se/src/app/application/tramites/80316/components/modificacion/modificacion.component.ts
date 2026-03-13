import { Catalogo, CatalogoSelectComponent, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud80316State, Tramite80316Store } from '../../estados/tramite80316.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelModificacion } from '../../models/datos-tramite.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80316Query } from '../../estados/tramite80316.query';

/**
 * Componente `ModificacionComponent` utilizado para gestionar y mostrar los datos relacionados con la modificación de un trámite.
 * Este componente es independiente (standalone) y utiliza formularios reactivos, tablas dinámicas y catálogos.
 */
@Component({
  selector: 'app-modificacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './modificacion.component.html',
  styleUrls: ['./modificacion.component.scss'],
})
export class ModificacionComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Constructor del componente `ModificacionComponent`.
   * Inicializa los servicios necesarios para gestionar el estado del trámite y los datos de modificación.
   * 
   * @param {FormBuilder} fb - Servicio para crear formularios reactivos.
   * @param {SolicitudService} solicitudService - Servicio para gestionar las solicitudes.
   * @param {Tramite80316Store} tramite80316Store - Store para gestionar el estado del trámite.
   * @param {Tramite80316Query} tramite80316Query - Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    public solicitudService: SolicitudService,
    private tramite80316Store: Tramite80316Store,
    private tramite80316Query: Tramite80316Query,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Grupo de formulario para el formulario de modificación.
   * Contiene los campos necesarios para gestionar los datos del trámite.
   * 
   * @type {FormGroup}
   */
  modificacionForm!: FormGroup;

/**
 * Evento que se emite cuando cambia la validez del formulario.
 * Contiene un valor booleano que indica si el formulario es válido o no.
 * 
 * @type {EventEmitter<boolean>}
 */
  @Output() validityChange = new EventEmitter<boolean>();
  /**
   * Observable para notificar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas y evitar fugas de memoria.
   * 
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Identificador del procedimiento.
   * Utilizado para cargar datos específicos del trámite.
   * 
   * @type {number}
   */
  private idProcedimiento: number = 80316;

  /**
   * Estado actual del trámite.
   * Contiene los datos relacionados con la modificación del trámite.
   * 
   * @type {Solicitud80316State}
   */
  public derechoState: Solicitud80316State = {} as Solicitud80316State;

  /**
   * Lista de solicitantes.
   */
  public solicitudState!: Solicitud80316State;

  /**
   * Define los datos que se mostrarán en la tabla dinámica.
   * 
   * @type {DatosDelModificacion[]}
   */
  datosTabla: DatosDelModificacion[] = [];

  /**
   * Catálogo de actividades productivas.
   * Contiene las opciones disponibles para seleccionar una actividad productiva.
   * 
   * @type {Catalogo[]}
   */
  actividadProductiva!: Catalogo[];

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación del formulario.
   * @param service Servicio para obtener los datos de asignación.
   */
      @Input() isContinuarTriggered: boolean = false;
  /**
   * Método que se ejecuta al inicializar el componente.
   * Configura el formulario, carga los datos de modificación y los datos de la tabla.
   */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    
    this.tramite80316Query.selectSolicitud$?.pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data: Solicitud80316State) => { 
            this.solicitudState = data;
          });

            if(this.isContinuarTriggered){
      this.validarFormularios();
    }
    this.inicializarFormulario();
    this.inicializarEstadoFormulario();
    this.loadDatosModificacion();
    this.inicializaCatalogos();
  }

  /**
  * @method inicializarEstadoFormulario
  * @description Inicializa el estado del formulario según el modo de solo lectura.
  * 
  * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
  * En caso contrario, habilita los controles del formulario
  * 
  * @returns {void}
  */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.modificacionForm?.disable();
    } else {
      this.modificacionForm?.enable();
    }
  }

  /**
   * Inicializa el formulario reactivo con los valores actuales del estado.
   */
  inicializarFormulario(): void {
    this.modificacionForm = this.fb.group({
      rfc: [this.solicitudState?.rfc],
      federal: [this.solicitudState?.federal],
      tipo: [this.solicitudState?.tipo],
      programa: [this.solicitudState?.programa],
      actividadActual: [this.solicitudState?.actividadActual],
      actividadProductiva: [this.solicitudState?.actividadProductiva, Validators.required]
    });
      this.modificacionForm.statusChanges
    .pipe(takeUntil(this.destroyNotifier$))
    .subscribe(status => {
      const IS_VALID = status === 'VALID';
      this.validityChange.emit(IS_VALID);
    });
  }

    /**
   * Método que se ejecuta cuando hay cambios en las propiedades de entrada del componente.
   * @return {void}
   * No retorna ningún valor.
   */
  ngOnChanges(): void { 
     if(this.isContinuarTriggered){
      this.validarFormularios();
    }
  }
/**
 * Valida los formularios del componente y emite el estado de validez.
 * Si el formulario no es válido, marca todos los controles como tocados para mostrar los errores.
 * 
 * @returns {void}
 */
  validarFormularios(): void {
     const IS_VALID = this.modificacionForm.valid;

  this.validityChange.emit(IS_VALID);

  if (!IS_VALID) {
    this.modificacionForm.markAllAsTouched();
  } 
 }
  /**
   * Método para cargar los datos de modificación desde el servicio.
   * Asigna los datos obtenidos a la propiedad `datosModificacion`.
   * @returns {void}
   */
  loadDatosModificacion(): void {
    this.solicitudService
      .getDatosModificacion()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta) => { 
        if (respuesta?.datos) { 
          this.modificacionForm.patchValue({
            rfc: respuesta.datos.rfc,
            federal: respuesta.datos.federal,
            tipo: respuesta.datos.tipo,
            programa: respuesta.datos.programa,
            actividadActual: respuesta.datos.actividadActual,
            actividadProductiva: respuesta.datos.actividadProductiva,
          });
        }
      });
  }
  /**
   * Inicializa los catálogos necesarios para el formulario.
   * Carga los datos de actividades productivas desde el servicio.
   */
  public inicializaCatalogos(): void {
    this.solicitudService.getActividadProductiva(this.idProcedimiento.toString()).pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe((data) => { 
      this.actividadProductiva = data.datos ||[];
    });
  }

  /**
   * Establece valores en el store del trámite.
   * 
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Nombre del campo en el formulario.
   * @param {keyof Tramite80316Store} metodoNombre - Nombre del método en el store.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite80316Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite80316Store[metodoNombre] as (valor: unknown) => void)(VALOR);
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y limpia las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(); // Notifica a todos los observables que deben completar.
    this.destroyNotifier$.unsubscribe(); // Cancela cualquier suscripción activa.
  }
}
