import { AnexoEncabezado, DatosAnexotressUno } from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { ANEXO_SERVICIO } from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { AnexoDosYTresComponent } from '../../../../shared/components/anexo-dos-y-tres.component/anexo-dos-y-tres.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';

@Component({
  selector: 'app-contenedor-annexo-dos-tres',
  standalone: true,
  imports: [CommonModule, AnexoDosYTresComponent],
  templateUrl: './contenedor-annexo-dos-tres.component.html',
  styleUrl: './contenedor-annexo-dos-tres.component.scss',
})
/**
 * @component
 * @name ContenedorAnnexoDosTresComponent
 * @description Componente encargado de gestionar los anexos dos y tres en el trámite 80102.
 * Este componente permite visualizar y manejar los datos de los anexos dos y tres, así como sus encabezados.
 *
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) y estado (`Tramite80102Store`) 
 * para manejar y observar los datos relacionados con los anexos. Además, implementa el ciclo de vida 
 * de Angular para limpiar las suscripciones al destruirse.
 */
export class ContenedorAnnexoDosTresComponent implements OnInit, OnDestroy {
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
   * Constructor de la clase ContenedorAnnexoDosTresComponent.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   * @param {Tramite80102Store} store - Servicio para manejar el estado del trámite.
   */

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


  constructor(
    private query: Tramite80102Query,
    private store: Tramite80102Store, private consultaQuery: ConsultaioQuery,private fb: FormBuilder,
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
   * Suscribe a los datos de las tablas de anexos dos y tres y actualiza las listas correspondientes.
   * @returns {void}
   */
  ngOnInit(): void {
    this.query.anexoDosTableLista$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((anexoDosTablaLista) => {
        if (anexoDosTablaLista.length > 0) {
          this.anexoDosTablaLista = anexoDosTablaLista;
        }
      });

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
   * Recupera los datos del almacén para "Anexo Tres" y actualiza el grupo de formulario con los valores recibidos.
   * 
   * Se suscribe al observable `selectDatosAnexoTres$` del servicio de consulta,
   * escucha hasta que el componente sea destruido y establece el valor del grupo de formulario
   * con los datos emitidos. Además, registra los datos recibidos en la consola para fines de depuración.
   *
   * @remarks
   * Este método debe llamarse para sincronizar el grupo de formulario con los datos más recientes del almacén.
   */
  obtenerDatosDelAlmacen(): void {
    this.query.selectDatosAnexoTres$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosAnexoTres) => {
        this.anexoTressFormGroup.setValue(datosAnexoTres);
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
    obtenerDatosDelAlmacenDos(): void {
    this.query.selectDatosAnexoTressDos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosAnexoTres) => {
        this.anexoTressDosFormGroup.setValue(datosAnexoTres);
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
  public obtenerAnexoDosDevolverLaLlamada(event: AnexoEncabezado[]): void {
    this.anexoDosTablaLista = event ? event : [];
    this.store.setAnnexoDosTableLista(this.anexoDosTablaLista);
  }

  /**
   * Método para obtener la devolución de llamada del anexo tres.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo tres.
   * @returns {void}
   */
  public obtenerAnexoTresDevolverLaLlamada(event: AnexoEncabezado[]): void {
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
