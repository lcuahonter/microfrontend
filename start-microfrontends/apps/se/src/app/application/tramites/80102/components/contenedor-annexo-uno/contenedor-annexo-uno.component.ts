import {
  ANEXO_IMPORTACION_SERVICIO,
  ANEXO_I_SERVICIO,
} from '../../../../shared/constantes/anexo-dos-y-tres.enum';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AnexoDosEncabezado,
  AnexoUnoEncabezado,
  DatosComplimento,
  ProveedorClienteTabla,
  RutaNombre,

} from '../../../../shared/models/nuevo-programa-industrial.model';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { AnexoUnoComponent } from '../../../../shared/components/anexo-uno/anexo-uno.component';
import { CommonModule } from '@angular/common';
import { ComplementarFraccionVistaComponent } from '../complementar-fraccion-vista/complementar-fraccion-vista.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ContenedorProveedorClienteComponent } from '../contenedor-proveedor-cliente/contenedor-proveedor-cliente.component';
import { ProveedorPorArchivoVistaComponent } from '../proveedor-por-archivo-vista/proveedor-por-archivo-vista.component';
import { ProyectoImmexVistaComponent } from '../proyecto-immex-vista/proyecto-immex-vista.component';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Tramite80102Query } from '../../estados/tramite80102.query';
import { Tramite80102Store } from '../../estados/tramite80102.store';

import { AutorizacionProgrmaNuevoService } from '../../services/autorizacion-programa-nuevo.service';



@Component({
  selector: 'app-contenedor-annexo-uno',
  standalone: true,
  imports: [CommonModule, AnexoUnoComponent,ContenedorProveedorClienteComponent,ComplementarFraccionVistaComponent,ProyectoImmexVistaComponent,ProveedorPorArchivoVistaComponent],
  templateUrl: './contenedor-annexo-uno.component.html',
  styleUrl: './contenedor-annexo-uno.component.scss',
})
/**
 * @component
 * @name ContenedorAnnexoUnoComponent
 * @description Componente encargado de gestionar el anexo uno y el anexo de importación en el trámite 80102.
 * Este componente permite visualizar y manejar los datos de los anexos, así como sus encabezados.
 *
 * @usageNotes
 * Este componente utiliza servicios de consulta (`Tramite80102Query`) y estado (`Tramite80102Store`)
 * para manejar y observar los datos relacionados con los anexos. Además, implementa el ciclo de vida
 * de Angular para limpiar las suscripciones al destruirse.
 */
export class ContenedorAnnexoUnoComponent implements OnInit, OnDestroy {
  /**
   * Configuración del anexo Uno.
   * @type {Object}
   * @property {TablaSeleccion} anexoUnoTablaSeleccionRadio - Selección de tabla del anexo Uno.
   * @property {ANEXO_I_SERVICIO} anexoUnoEncabezadoDeTabla - Encabezado de tabla del anexo Uno.
   */
  public anexoUnoConfig = {
    anexoUnoTablaSeleccionRadio: TablaSeleccion.RADIO,
    anexoUnoEncabezadoDeTabla: ANEXO_I_SERVICIO,
  };

  /**
   * Configuración del anexo de importación.
   * @type {Object}
   * @property {TablaSeleccion} anexoDosTablaSeleccionRadio - Selección de tabla del anexo Dos.
   * @property {ANEXO_IMPORTACION_SERVICIO} anexoDosEncabezadoDeTabla - Encabezado de tabla del anexo Dos.
   */
  public anexoImportacionConfig = {
    anexoDosTablaSeleccionRadio: TablaSeleccion.RADIO,
    anexoDosEncabezadoDeTabla: ANEXO_IMPORTACION_SERVICIO,
  };


  /**
    * FormGroup para el Anexo Uno.
    * 
    * Representa el formulario reactivo asociado al Anexo Uno. 
    * Contiene los controles y validaciones necesarias para capturar o modificar los datos del Anexo Uno.
    * Se inicializa posteriormente, normalmente en el `ngOnInit` o en el constructor del componente.
    */
  public anexoUnoFormGroup!: FormGroup;

  /**
   * FormGroup para el Anexo Dos.
   * 
   * Representa el formulario reactivo asociado al Anexo Dos. 
   * Contiene los controles y validaciones necesarias para capturar o modificar los datos del Anexo Dos.
   * Se inicializa posteriormente, generalmente en el `ngOnInit` o en el constructor del componente.
   */
  public anexoDosFormGroup!: FormGroup;

  /**
   * Lista de encabezados del anexo Uno.
   * @type {AnexoEncabezado[]}
   */
  public anexoUnoTablaLista: AnexoUnoEncabezado[] = [];

  /**
   * Lista de encabezados del anexo dos.
   * @type {AnexoEncabezado[]}
   */
  public anexoDosTablaLista: AnexoDosEncabezado[] = [];

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
   * Controla la visibilidad del popup de proveedor-cliente.
   * Se utiliza para mostrar u ocultar el popup correspondiente en la interfaz.
   */
  public mostrarProveedorClientePopup: boolean = false;

  /**
   * Controla la visibilidad del popup de complementar fracción.
   * Se utiliza para mostrar u ocultar el popup correspondiente en la interfaz.
   */
  public mostrarComplementarFraccionPopup: boolean = false;

  /**
   * Controla la visibilidad del popup de proyecto IMMEX.
   * Se utiliza para mostrar u ocultar el popup correspondiente en la interfaz.
   */
  public mostrarProyectoImmexPopup: boolean = false;

  /**
   * Controla la visibilidad del popup de proveedor por archivo.
   * Se utiliza para mostrar u ocultar el popup correspondiente en la interfaz.
   */
  public mostrarProveedorPorArchivoPopup: boolean = false;

  proveedorClienteDatosTablaId?:string;

/**
 * Identificador de la tabla seleccionada.
 * 
 * @type {string}
 */
  public selectedTableId: string = '';
  
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.Add commentMore actions
   */
  @Input() formularioDeshabilitado: boolean = false;

/**
 * Fracción seleccionada por el usuario.
 * 
 * Puede ser una cadena o `null` si no hay ninguna seleccionada.
 * 
 * @type {string | null}
 */
  public selectedFraccion: string | null = null;

  /**
   * Constructor de la clase ContenedorAnnexoUnoComponent.
   * @param {Router} router - Servicio de Angular para la navegación.
   * @param {ActivatedRoute} activatedRoute - Servicio de Angular para obtener información sobre la ruta actual.
   * @param {Tramite80102Store} store - Servicio para manejar el estado del trámite.
   * @param {Tramite80102Query} query - Servicio para consultar el estado del trámite.
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Tramite80102Store,
    private query: Tramite80102Query, 
    private autorizacionProgrmaNuevoService: AutorizacionProgrmaNuevoService,
    private consultaQuery: ConsultaioQuery, private fb: FormBuilder,
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
   * Suscribe a los datos de las tablas de importación y exportación y actualiza las listas correspondientes.
   * @returns {void}
   */
  ngOnInit(): void {
    this.query.selectImportarTablsDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((importarTablsDatos) => {
        if (importarTablsDatos.length > 0) {
          this.anexoUnoTablaLista = importarTablsDatos;
        }
      });

    this.query.selectExportarTablsDatos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((exportarTablsDatos) => {
        if (exportarTablsDatos.length > 0) {
          this.anexoDosTablaLista = exportarTablsDatos;
        }
      });
    this.inicializarFormularioDatosSubcontratista();
    this.obtenerDatosDelAlmacen();
    this.inicializarFormularioDatosDosSubcontratista();
    this.obtenerDatosDosDelAlmacen();
  }


  /**
     * Obtiene los datos del almacén y los asigna al formulario de información de registro.
     * Se suscribe al observable `infoRegisterEstado$` para obtener los datos, y cuando se reciben,
     * se actualiza la propiedad `infoRegistro` y se establece el valor del formulario `formularioInfoRegistro`.
     *
     * @method obtenerDatosDelAlmacen
     */
  obtenerDatosDelAlmacen(): void {
    this.query.selectDatosComplimentos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosComplimentos) => {
        this.anexoUnoFormGroup.setValue(datosComplimentos);
      });
  }


  obtenerDatosDosDelAlmacen(): void {
    this.query.selectDatosComplimentosDos$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datosComplimentos) => {
        this.anexoDosFormGroup.setValue(datosComplimentos);
      });
  }


  /**
     * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
     * @method inicializarFormularioDatosSubcontratista
     */
  inicializarFormularioDatosSubcontratista(): void {
    this.anexoUnoFormGroup = this.fb.group({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  /**
   * Inicializa el formulario de datos del subcontratista con los datos obtenidos o con valores vacíos si no hay datos disponibles.
   * @method inicializarFormularioDatosSubcontratista
   */
  inicializarFormularioDatosDosSubcontratista(): void {
    this.anexoDosFormGroup = this.fb.group({
      fraccionArancelaria: ['', [Validators.required, Validators.maxLength(10)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  /**
     * Modifica los datos de los cumplimientos y los almacena en el estado.
     *
     * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
     * @returns void
     */
  modifierComplimentos(complimentos: DatosComplimento): void {
    this.store.setDatosComplimento(complimentos);
  }

  /**
   * Modifica los datos de los cumplimientos y los almacena en el estado.
   *
   * @param complimentos - Objeto de tipo `DatosComplimentos` que contiene los datos de los cumplimientos a actualizar.
   * @returns void
   */
  modifierDosComplimentos(complimentos: DatosComplimento): void {
    this.store.setDatosComplimentoDos(complimentos);
  }

    /**
   * Maneja el cambio en los datos de la tabla actualizando el estado local y notificando al servicio.
   * Sincroniza el valor con el servicio `nuevoProgramaIndustrialService`.
   */
  datosDeLaTablaCambiados(value: boolean): void {
    this.autorizacionProgrmaNuevoService.setTieneDatosDeTabla(value);
  }
  /**
   * Método para obtener la devolución de llamada del anexo Uno.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo Uno.
   * @returns {void}
   */
  public obtenerAnexoUnoDevolverLaLlamada(event: AnexoUnoEncabezado[]): void {
    this.anexoUnoTablaLista = event ? event : [];
    this.store.setImportarDatosTabla(this.anexoUnoTablaLista);
  }
  /**
   * Método para obtener la devolución de llamada del anexo Dos.
   * @param {T[]} event - Evento que contiene la lista de encabezados del anexo Dos.
   * @returns {void}
   */
  public obtenerAnexoDosDevolverLaLlamada(event: AnexoDosEncabezado[]): void {
    this.anexoDosTablaLista = event ? event : [];
    this.store.setExportarDatosTabla(this.anexoDosTablaLista);
  }

  /**
   * Método para manejar la navegación a la fracción de complemento.
   * @param {RutaNombre} event - Evento que contiene la información de la ruta.
   * @returns {void}
   */
  public rutaLaFraccionDeComplemento(event: RutaNombre): void {
    if (event && event.catagoria && event.id && event.datos) {
      this.proveedorClienteDatosTablaId=event.id;
      this.store.setAnnexoUnoSeccionActiva(event.id);
      this.store.setDatosParaNavegar(event.datos);

      if (event && event.catagoria === 'complementar-fraccion' && event.datos) {
        this.selectedFraccion = event.datos.encabezadoFraccion;
        this.selectedTableId = event.id;
        this.mostrarComplementarFraccionPopup = true;
      } else if (event.catagoria === 'contenedor-proveedor-cliente') {
        this.mostrarProveedorClientePopup = true;
      } else if (event.catagoria === 'proyecto-immex') {
        this.mostrarProyectoImmexPopup = true;
      } else if (event.catagoria === 'proveedor-por-archivo') {
        this.mostrarProveedorPorArchivoPopup = true;
      }
    }
  }

/**
 * Cierra el popup para complementar la fracción.
 * Establece la bandera `mostrarComplementarFraccionPopup` en `false` para ocultar el popup.
 */
   cerrarComplementarFraccion(): void {
    this.mostrarComplementarFraccionPopup = false;
  }

/**
 * Cierra el contenedor o popup de proveedor-cliente.
 * Establece la bandera `mostrarProveedorClientePopup` en `false` para ocultar el contenedor.
 */
  cerrarContenedorProveedorCliente(): void {
    this.mostrarProveedorClientePopup = false;
  }

/**
 * Cierra el popup del proyecto IMMEX.
 * Establece la bandera `mostrarProyectoImmexPopup` en `false` para ocultar el popup.
 */
  cerrarProyectoImmex(): void {
    this.mostrarProyectoImmexPopup = false;
  }

/**
 * Cierra el popup de proveedor por archivo.
 * Establece la bandera `mostrarProveedorPorArchivoPopup` en `false` para ocultar el popup.
 */
  cerrarProveedorPorArchivo(): void {
    this.mostrarProveedorPorArchivoPopup = false;
  }

/**
 * Actualiza los datos de la tabla de proveedor/cliente en el store.
 *
 * @param event - Arreglo de objetos de tipo ProveedorClienteTabla que contiene los datos a establecer en la tabla.
 */
 public datosActualizadosProveedorCliente($event: ProveedorClienteTabla[]): void {
  if(this.proveedorClienteDatosTablaId==='IMPORT'){
       this.store.setProveedorClienteDatosTablaUno($event);
  }else{
       this.store.setProveedorClienteDatosTablaDos($event); 
  }

  }

  /**
   * Guarda los valores complementarios de una fracción en la tabla correspondiente.
   *
   * Dependiendo del tipo de tabla seleccionada (`IMPORT` o no), actualiza los valores
   * de moneda y volumen (mensual y anual) en la lista correspondiente (`anexoUnoTablaLista` o `anexoDosTablaLista`)
   * usando la descripción de la fracción como identificador.
   *
   * @param data Objeto que contiene la información de la fracción a complementar:
   *  - descripcion: Identificador de la fracción.
   *  - monedaNacionalMensual: Valor mensual en moneda nacional (opcional).
   *  - monedaNacionalDeDosPeriodos: Valor anual en moneda nacional (opcional).
   *  - volumenMensual: Volumen mensual (opcional).
   *  - twoPeriodVolume: Volumen anual (opcional).
   */
  onGuardarComplementarFraccion(data: {
    descripcion: string;
    monedaNacionalMensual?: number;
    monedaNacionalDeDosPeriodos?: number;
    volumenMensual?: number;
    twoPeriodVolume?: number;
  }): void {
    if (this.selectedTableId === 'IMPORT') {
      const IDX = this.anexoUnoTablaLista.findIndex(
        (item) => item.encabezadoFraccion === data.descripcion
      );
      if (IDX !== -1) {
        this.anexoUnoTablaLista[IDX].encabezadoValorEnMonedaMensual =
          data.monedaNacionalMensual ?? 0;
        this.anexoUnoTablaLista[IDX].encabezadoValorEnMonedaAnual =
          data.monedaNacionalDeDosPeriodos ?? 0;
        this.anexoUnoTablaLista[IDX].encabezadoVolumenMensual =
          data.volumenMensual ?? 0;
        this.anexoUnoTablaLista[IDX].encabezadoVolumenAnual =
          data.twoPeriodVolume ?? 0;
        this.anexoUnoTablaLista = [...this.anexoUnoTablaLista]; 
      }
    } else {
      const IDX = this.anexoDosTablaLista.findIndex(
        (item) => item.encabezadoFraccion === data.descripcion
      );
      if (IDX !== -1) {
        this.anexoDosTablaLista[IDX].encabezadoValorEnMonedaMensual =
          data.monedaNacionalMensual ?? 0;
        this.anexoDosTablaLista[IDX].encabezadoValorEnMonedaAnual =
          data.monedaNacionalDeDosPeriodos ?? 0;
        this.anexoDosTablaLista[IDX].encabezadoVolumenMensual =
          data.volumenMensual ?? 0;
        this.anexoDosTablaLista[IDX].encabezadoVolumenAnual =
          data.twoPeriodVolume ?? 0;
        this.anexoDosTablaLista = [...this.anexoDosTablaLista];
    }
  }
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
