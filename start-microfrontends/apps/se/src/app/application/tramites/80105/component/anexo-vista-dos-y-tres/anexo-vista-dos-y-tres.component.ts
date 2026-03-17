import { AnexoEncabezado, DatosAnexotressUno } from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, Input } from '@angular/core';
import { ConfiguracionColumna, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map } from 'rxjs';
import { ANEXO_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { AnexoDosYTresComponent } from '../../../../shared/components/anexo-dos-y-tres.component/anexo-dos-y-tres.component';
import { AnexoTresComponent } from '../../../../shared/components/anexo-tres/anexo-tres.component';
import { CONFIGURACION_DOS_DATOS } from '../../constantes/nuevo-programa.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FraccionArancelariaDescripcion } from '../../../../shared/models/empresas.model';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Tramite80104Query } from '../../../../estados/queries/tramite80104.query';
import { takeUntil } from 'rxjs';

/**
 * Componente para la visualización y gestión de los anexos dos y tres del trámite 80105.
 * Permite mostrar, editar y validar los datos relacionados con fracciones arancelarias y descripciones.
 * Incluye formularios reactivos, suscripciones a estados y configuración de tablas dinámicas.
 *
 * @author Equipo de desarrollo VUCEM
 * @version 1.0
 */
@Component({
  selector: 'app-anexo-vista-dos-y-tres',
  standalone: true,
  imports: [CommonModule, AnexoTresComponent, AnexoDosYTresComponent],
  templateUrl: './anexo-vista-dos-y-tres.component.html',
  styleUrl: './anexo-vista-dos-y-tres.component.scss',
})
/**
 * Componente principal para la gestión de los anexos dos y tres.
 * Implementa OnInit y OnDestroy para el ciclo de vida y limpieza de suscripciones.
 */
export class AnexoVistaDosYTresComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   */
    /**
     * Indica si el formulario está deshabilitado (solo lectura).
     * @type {boolean}
     */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Lista de encabezados del anexo dos.
   * @type {AnexoEncabezado[]}
   */
    /**
     * Lista de encabezados para la tabla del anexo dos.
     * @type {AnexoEncabezado[]}
     */
  public anexoDosTablaLista: AnexoEncabezado[] = [];

  /**
   * Lista de encabezados del anexo tres.
   * @type {AnexoEncabezado[]}>}
   */
    /**
     * Lista de encabezados para la tabla del anexo tres.
     * @type {AnexoEncabezado[]}
     */
  public anexoTresTablaLista: AnexoEncabezado[] = [];

  /**
   * Configuración del anexo.
   * @type {Object}
   * @property {TablaSeleccion} anexoDosTablaSeleccionCheckbox - Selección de tabla del anexo dos.
   * @property {ANEXO_SERVICIO} anexoDosEncabezadoDeTabla - Encabezado de tabla del anexo dos.
   * @property {TablaSeleccion} anexoTresTablaSeleccionCheckbox - Selección de tabla del anexo tres.
   * @property {ANEXO_SERVICIO} anexoTresEncabezadoDeTabla - Encabezado de tabla del anexo tres.
   */
    /**
     * Configuración de selección y encabezados para las tablas de anexos.
     */
  public anexoConfig = {
    anexoDosTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
    anexoDosEncabezadoDeTabla: ANEXO_SERVICIO,
    anexoTresTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
    anexoTresEncabezadoDeTabla: ANEXO_SERVICIO,
  };

  /*
  * Almacena la configuración de las pestañas del primer paso.
  */
  /**
   * Configuración de columnas para la tabla de fracciones arancelarias.
   */
   configuracionDosDatos: ConfiguracionColumna<FraccionArancelariaDescripcion>[] =CONFIGURACION_DOS_DATOS

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
   */
    /**
     * Indica si el formulario debe mostrarse en modo solo lectura.
     * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
     */
  public esFormularioSoloLectura: boolean = false; 

  /**
   * Instancia del grupo de formulario para gestionar los controles y validación de la sección "Anexo Tres".
   * Este FormGroup se utiliza para encapsular los campos del formulario y su lógica de validación
   */
    /**
     * Formulario reactivo para la sección de Anexo Tres.
     */
  public anexoTressFormGroup!: FormGroup;

  /**
   * Instancia del grupo de formulario para gestionar los controles y validación de la sección "Anexo Tres".
   * Este FormGroup se utiliza para encapsular los campos del formulario y su lógica de validación
   */
    /**
     * Formulario reactivo para la sección de Anexo Tres Dos.
     */
  public anexoTressDosFormGroup!: FormGroup;

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
    /**
     * Notificador para limpiar suscripciones al destruir el componente.
     */
  private destroyNotifier$: Subject<void> = new Subject();

    /**
     * Constructor del componente. Inicializa servicios y suscripciones a estados.
     * @param query Consulta de estado para el trámite 80101
     * @param store Almacén de estado para el trámite 80101
     * @param fb FormBuilder para formularios reactivos
     * @param query80104 Consulta de estado para el trámite 80104
     * @param consultaQuery Consulta de estado general
     */
  constructor(private query: Tramite80101Query,
    private store: Tramite80101Store,
    private fb: FormBuilder,
    private query80104: Tramite80104Query,
    private consultaQuery: ConsultaioQuery
  ) {
     this.consultaQuery.selectConsultaioState$
       .pipe(
         takeUntil(this.destroyNotifier$),
         map((seccionState) => {
           this.esFormularioSoloLectura = seccionState.readonly;
         })
       )
       .subscribe()
  }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Suscribe a los observables de las tablas y inicializa los formularios.
     */
  ngOnInit(): void {
    this.query.anexoDosTableLista$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((anexoDosTablaLista) => {
        if (anexoDosTablaLista.length > 0) {
          this.anexoDosTablaLista = anexoDosTablaLista ?? [];
        }
      });

      this.query.anexoTresTablaLista$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((anexoTresTablaLista) => {
        if (anexoTresTablaLista.length > 0) {
          this.anexoTresTablaLista = anexoTresTablaLista ?? [];
        }
      });
    this.inicializarFormularioDatosSubcontratista();
    this.obtenerDatosDelAlmacen();
    this.inicializarFormularioDatosDosSubcontratista();
    this.obtenerDatosDelAlmacenDos();
  }

  /**
   * Recupera los datos del almacén para "Anexo Tres" y actualiza el grupo de formulario con los valores recibidos.
   * 
   * Se suscribe al observable `selectDatosAnexoTres$` del servicio de consulta,
   * escucha hasta que el componente sea destruido y establece el valor del grupo de formulario
   * con los datos emitidos. Además, registra los datos recibidos en la consola para fines de depuración.
   *
   * @remarks
   * Este método debe llamarse para sincronizar el grupo de formulario con los datos más recientes del almacén.
   */
    /**
     * Recupera los datos del almacén para "Anexo Tres" y actualiza el grupo de formulario con los valores recibidos.
     * Sincroniza el grupo de formulario con los datos más recientes del almacén.
     */
  obtenerDatosDelAlmacen(): void {
   this.query80104.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.anexoTressFormGroup.setValue({
          fraccionArancelaria: state.fraccionArancelaria,
          descripcion: state.descripcion
        });
        this.anexoDosTablaLista = (state.anexoDos || []).map((item: unknown) => {
          const TYPED_ITEM = item as { fraccionArancelaria?: string; descripcion?: string; estatus?: string | boolean };
          return {
            fraccionArancelaria: TYPED_ITEM.fraccionArancelaria ?? '',
            descripcion: TYPED_ITEM.descripcion ?? '',
            encabezadoFraccion: TYPED_ITEM.fraccionArancelaria ?? '',
            encabezadoDescripcion: TYPED_ITEM.descripcion ?? '',
            estatus: typeof TYPED_ITEM.estatus === 'boolean'
              ? TYPED_ITEM.estatus
              : TYPED_ITEM.estatus === 'true'
          };
        });
      });
  }

      /**
     * Recupera datos del segundo almacén (Almacén Dos) suscribiéndose al observable `selectDatosAnexoTressDos$`.
     * Actualiza el `anexoTressFormGroup` con los datos recibidos.
     * La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor.
     *
     * @remarks
     * Este método se utiliza normalmente para poblar el grupo de formulario con datos del almacén.
     */
      /**
       * Recupera datos del segundo almacén (Almacén Dos) suscribiéndose al observable `selectDatosAnexoTressDos$`.
       * Actualiza el `anexoTressDosFormGroup` con los datos recibidos.
       */
    obtenerDatosDelAlmacenDos(): void {
   this.query80104.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
        this.anexoTressDosFormGroup.setValue({
          fraccionArancelaria: state.fraccionTres,
          descripcion: state.descripcionTres
        });
        this.anexoTresTablaLista = (state.anexoTres || []).map((item: unknown) => {
          const TYPED_ITEM = item as { fraccionArancelaria?: string; descripcion?: string; estatus?: string | boolean };
          return {
            fraccionArancelaria: TYPED_ITEM.fraccionArancelaria ?? '',
            descripcion: TYPED_ITEM.descripcion ?? '',
            encabezadoFraccion: TYPED_ITEM.fraccionArancelaria ?? '',
            encabezadoDescripcion: TYPED_ITEM.descripcion ?? '',
            estatus: typeof TYPED_ITEM.estatus === 'boolean'
              ? TYPED_ITEM.estatus
              : TYPED_ITEM.estatus === 'true'
          };
        });
      });
  }

    /**
       * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
       * @method inicializarFormularioDatosSubcontratista
       */
      /**
       * Inicializa el formulario de datos del subcontratista para Anexo Tres.
       */
    inicializarFormularioDatosSubcontratista(): void {
      this.anexoTressFormGroup = this.fb.group({
        fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
        descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      });
    }
  
      /**
       * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
       * @method inicializarFormularioDatosSubcontratista
       */
      /**
       * Inicializa el formulario de datos del subcontratista para Anexo Tres Dos.
       */
    inicializarFormularioDatosDosSubcontratista(): void {
      this.anexoTressDosFormGroup = this.fb.group({
        fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
        descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      });
    }

  /**
   * Método para obtener la devolución de llamada del anexo dos.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo dos.
   * @returns {void}
   */
    /**
     * Callback para actualizar la lista de encabezados del anexo dos y almacenarla en el estado.
     * @param event Lista de encabezados del anexo dos
     */
  obtenerAnexoDosDevolverLaLlamada(event: AnexoEncabezado[]): void {
    this.anexoDosTablaLista = event ? event : [];
    this.store.setAnnexoDosTableLista(this.anexoDosTablaLista);
  }

  /**
   * Método para obtener la devolución de llamada del anexo tres.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo tres.
   * @returns {void}
   */
    /**
     * Callback para actualizar la lista de encabezados del anexo tres y almacenarla en el estado.
     * @param event Lista de encabezados del anexo tres
     */
  obtenerAnexoTresDevolverLaLlamada(event: AnexoEncabezado[]): void {
    this.anexoTresTablaLista = event ? event : [];
    this.store.setAnnexoTresTableLista(this.anexoTresTablaLista);
  }

    /**
       * Modifica los datos de los cumplimientos y los almacena en el estado.
       *
       * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
       * @returns void
       */
      /**
       * Modifica los datos de los cumplimientos y los almacena en el estado para Anexo Tres.
       * @param complimentos Datos a actualizar
       */
    modifierComplimentos(complimentos: DatosAnexotressUno): void {
      this.store.setDatosAnexoTres(complimentos);
    }
  
  /**
       * Modifica los datos de los cumplimientos y los almacena en el estado.
       *
       * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
       * @returns void
       */
      /**
       * Modifica los datos de los cumplimientos y los almacena en el estado para Anexo Tres Dos.
       * @param complimentos Datos a actualizar
       */
    modifierComplimentosDos(complimentos: DatosAnexotressUno): void {
      this.store.setDatosAnexoTresDos(complimentos);
    }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     * @method ngOnDestroy
     */
      /**
       * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
       * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
       */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}

