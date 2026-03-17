// Componente para la vista de los anexos dos y tres en el trámite 80103
import { AnexoEncabezado, DatosAnexotressUno } from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map } from 'rxjs';
import { ANEXO_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { AnexoDosYTresComponent } from '../../../../shared/components/anexo-dos-y-tres.component/anexo-dos-y-tres.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite80101Query } from '../../estados/tramite80101.query';
import { Tramite80101Store } from '../../estados/tramite80101.store';
import { Tramite80104Query } from '../../../../estados/queries/tramite80104.query';
import { takeUntil } from 'rxjs';
/*
  * Componente para mostrar la vista de los anexos dos y tres en el trámite 80103.
  *
  * Este componente utiliza el servicio `Tramite80101Query` para obtener los datos de los anexos
  * y el servicio `Tramite80101Store` para almacenar y gestionar el estado de los datos.
  *
  * @export
  * @class AnexoVistaDosYTresComponent
  */
@Component({
  selector: 'app-anexo-vista-dos-y-tres',
  standalone: true,
  imports: [CommonModule, AnexoDosYTresComponent],
  templateUrl: './anexo-vista-dos-y-tres.component.html',
  styleUrl: './anexo-vista-dos-y-tres.component.scss',
})
/*
  * Clase que representa el componente de la vista de los anexos dos y tres.
  *
  * @class AnexoVistaDosYTresComponent
  * @implements {OnInit}
  * @implements {OnDestroy}
  */
export class AnexoVistaDosYTresComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
   */
   @Input() formularioDeshabilitado: boolean = false;

  /**
   * Lista de encabezados del anexo dos.
   * @type {AnexoEncabezado[]}
   */
  public anexoDosTablaLista: AnexoEncabezado[] = [];

  /**
   * Lista de encabezados del anexo tres.
   * @type {AnexoEncabezado[]}>}
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
  public anexoConfig = {
    anexoDosTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
    anexoDosEncabezadoDeTabla: ANEXO_SERVICIO,
    anexoTresTablaSeleccionCheckbox: TablaSeleccion.CHECKBOX,
    anexoTresEncabezadoDeTabla: ANEXO_SERVICIO,
  };

  /**
   * Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido.
   *
   * @property {Subject<void>} destroyNotifier$
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario debe mostrarse en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Instancia del grupo de formulario para gestionar los controles y validación de la sección "Anexo Tres".
   * Este FormGroup se utiliza para encapsular los campos del formulario y su lógica de validación
   */
  public anexoTressFormGroup!: FormGroup;

  /**
   * Instancia del grupo de formulario para gestionar los controles y validación de la sección "Anexo Tres".
   * Este FormGroup se utiliza para encapsular los campos del formulario y su lógica de validación
   */
  public anexoTressDosFormGroup!: FormGroup;

/*
  * Constructor del componente.
  * @param {Tramite80101Query} query - Consulta para obtener los datos de los anexos.
*/
  constructor(private query: Tramite80101Query,
    private query80104: Tramite80104Query,
    private store: Tramite80101Store,
     private fb: FormBuilder,
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
/*
  * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
*/
  ngOnInit(): void {
    // Se suscribe a los cambios en la lista del Anexo Dos desde el store.  
    // Actualiza la variable local si la lista contiene elementos.
    this.query.anexoDosTableLista$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((anexoDosTablaLista) => {
        if (anexoDosTablaLista.length > 0) {
          this.anexoDosTablaLista = anexoDosTablaLista;
        }
      });
// Se suscribe a los cambios en la lista del Anexo Tres desde el store.  
// Actualiza la variable local si la lista contiene elementos.
      this.query.anexoTresTablaLista$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((anexoTresTablaLista) => {
        if (anexoTresTablaLista.length > 0) {
          this.anexoTresTablaLista = anexoTresTablaLista;
        }
      });
    this.inicializarFormularioDatosSubcontratista();
    this.obtenerDatosDelAlmacen();
    this.inicializarFormularioDatosDosSubcontratista();
    this.obtenerDatosDelAlmacenDos();
  }

/**
 * Obtiene los datos almacenados desde el estado `selectSolicitud$` y los asigna al formulario `anexoTressFormGroup`
 * y a la lista `anexoDosTablaLista`. Se asegura de limpiar la suscripción con `destroyNotifier$`.
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
 * Recupera datos desde el estado `selectSolicitud$` y los asigna al formulario `anexoTressDosFormGroup`
 * y a la lista `anexoTresTablaLista`. Utiliza `destroyNotifier$` para gestionar la suscripción de forma segura.
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
  obtenerAnexoDosDevolverLaLlamada(event: AnexoEncabezado[]): void {
    this.anexoDosTablaLista = event ? event : [];
    this.store.setAnnexoDosTableLista(this.anexoDosTablaLista);
  }

  /**
   * Método para obtener la devolución de llamada del anexo tres.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo tres.
   * @returns {void}
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
  modifierComplimentos(complimentos: DatosAnexotressUno): void {
    this.store.setDatosAnexoTres(complimentos);
  }

/**
     * Modifica los datos de los cumplimientos y los almacena en el estado.
     *
     * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
     * @returns void
     */
  modifierComplimentosDos(complimentos: DatosAnexotressUno): void {
    this.store.setDatosAnexoTresDos(complimentos);
  }

    /**
     * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
     * Limpia las suscripciones y actualiza los BehaviorSubject para ocultar las tablas.
     * @method ngOnDestroy
     */
    ngOnDestroy(): void {
      this.destroyNotifier$.next();
      this.destroyNotifier$.complete();
    }
}

