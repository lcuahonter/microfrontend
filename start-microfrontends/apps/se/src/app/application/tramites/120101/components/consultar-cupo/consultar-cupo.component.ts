import { Catalogo, CatalogoServices, ModeloDeFormaDinamica, TablaDinamicaComponent, doDeepCopy, esValidArray, esValidObject } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Dato, SolicitudTPLCANR } from '../../models/insumos.model';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SolicitudDeRegistroTpl120101State, Tramite120101Store } from '../../../../estados/tramites/tramite120101.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AmpliacionServiciosAdapter } from '../../adapters/ampliacion-servicios.adapter';
import { CONFIGURACION_PARA_ENCABEZADO_DE_TABLA } from '../../../120201/constantes/cupos-constantes.enum';
import { CONSULTAR_CUPO } from '../../constantes/solicitud-de-registro-tpl.enum';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { InstrumentoCupoTPLForm } from '../../../120201/models/cupos.model';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { SolicitudDeRegistroTplService } from '../../services/solicitud-de-registro-tpl.service';
import { Tramite120101Query } from '../../../../estados/queries/tramite120101.query';

/**
 * @component ConsultarCupoComponent
 * @description
 * Este componente representa la sección "Consultar Cupo" del trámite 120101. 
 * Permite al usuario consultar información relacionada con los cupos mediante un formulario dinámico y una tabla interactiva.
 * 
 * Funcionalidad:
 * - Renderiza dinámicamente los campos del formulario basados en la configuración definida en `CONSULTAR_CUPO`.
 * - Muestra una tabla dinámica con los datos obtenidos de los servicios relacionados con los cupos.
 * - Maneja la validación y el estado del formulario utilizando formularios reactivos de Angular.
 * - Interactúa con el estado global del trámite a través de `Tramite120101Store` y `Tramite120101Query`.
 * - Permite registrar y actualizar los valores del formulario dinámico en el servicio correspondiente.
 * - Proporciona métodos para buscar datos, manejar eventos de clic en filas de la tabla y gestionar cambios en los valores del formulario.
 * 
 * @selector consultar-cupo
 * @imports CommonModule, ReactiveFormsModule, FormasDinamicasComponent, TablaDinamicaComponent
 * @templateUrl ./consultar-cupo.component.html
 * @styleUrl ./consultar-cupo.component.scss
 */
@Component({
  selector: 'consultar-cupo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './consultar-cupo.component.html',
  styleUrl: './consultar-cupo.component.scss',
})

export class ConsultarCupoComponent implements OnInit, OnDestroy {

  /**
  * @property consultaState
  * @description
  * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
  */
  @Input() consultaState!: ConsultaioState;

  /**
 * @property emitirFilaClicControlador
 * @description
 * Emisor de eventos que se utiliza para manejar el clic en una fila de la tabla dinámica.
 * 
 * Funcionalidad:
 * - Emite un evento con los datos de la fila seleccionada en la tabla.
 * - Permite que el componente padre reciba y procese los datos de la fila seleccionada.
 * 
 * @type {EventEmitter<InstrumentoCupoTPLForm>}
 * 
 * @example
 * this.emitirFilaClicControlador.emit(filaSeleccionada);
 * // Emite los datos de la fila seleccionada al componente padre.
 */
  @Output() public emitirFilaClicControlador =
    new EventEmitter<InstrumentoCupoTPLForm>();

  /**
   * Evento de salida que emite un valor booleano para indicar la visibilidad de un componente.
   * 
   * @event
   * @type {EventEmitter<boolean>}
   * @description Emite `true` para mostrar el componente y `false` para ocultarlo.
   */
  @Output() public obtenerVisible =
    new EventEmitter<boolean>();

  /**
   * Evento de salida que emite un objeto con posibles mensajes de error relacionados con las fracciones.
   * 
   * @event
   * @property {string} [fraccionErrorUno] - Mensaje de error para la primera fracción, si existe.
   * @property {string} [fraccionErrorDos] - Mensaje de error para la segunda fracción, si existe.
   */
  @Output() public fraccionErrorEvent =
    new EventEmitter<{ fraccionErrorUno?: string; fraccionError?: boolean }>();

  /**
   * compo doc
   * @property consultarCupoFormData
   * @description
   * Esta propiedad contiene la configuración de los campos del formulario dinámico
   * utilizado en el componente. La configuración está basada en la constante
   * `CONSULTAR_CUPO`, que define los detalles de cada campo, como su
   * identificador, etiqueta, tipo de entrada, validadores, y más.
   *
   * Se utiliza para renderizar dinámicamente los campos del formulario y para
   * gestionar su comportamiento, como la validación y la interacción con los datos
   * obtenidos de los servicios.
   */
  public consultarCupoFormData: ModeloDeFormaDinamica[] = CONSULTAR_CUPO;

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof ConsultarCupoComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({}),
  });

  /**
   * compo doc
   * @getter ninoFormGroup
   * @description
   * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup`
   * dentro del formulario reactivo principal `forma`.
   * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
   *
   * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
   *
   * @example
   * const grupo = this.ninoFormGroup;
   * grupo.get('campo').setValue('nuevo valor');
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

  /**
   * Estado de la solicitud de la sección 120101.
   * @type {SolicitudDeRegistroTpl120101State}
   * @memberof BienFinalComponent
   */
  public solicitudDeRegistroState!: SolicitudDeRegistroTpl120101State;

  /** Subject para destruir el componente */
  public destroy$ = new Subject<void>();

  /**
   * Configuración para el encabezado de la tabla.
   */
  public configuracionParaEncabezadoDeTabla = CONFIGURACION_PARA_ENCABEZADO_DE_TABLA;

  /**
   * Configuración de la tabla dinámica.
   */
  public cuerpoTabla: InstrumentoCupoTPLForm[] = [];

  /**
   * Identificador único del trámite asociado a la consulta de cupo.
   * Este valor se utiliza para distinguir el tipo de trámite dentro de la aplicación.
   */
  tramiteId: string = '120101';

  /**
   * Mensaje de error asociado a la primera fracción.
   * 
   * Esta propiedad es opcional y almacena una cadena de texto que describe el error
   * relacionado con la validación o procesamiento de la primera fracción en el componente.
   */
  fraccionErrorUno?: string;

  /**
   * Indica si existe un error relacionado con la fracción.
   * 
   * Cuando es `true`, significa que se ha producido un error en la validación o procesamiento de la fracción.
   */
  fraccionError: boolean = false;

  /**
   * Indica si los campos obligatorios son visibles en la interfaz de usuario.
   * Cuando es `true`, los campos obligatorios se muestran al usuario.
   */
  obligatoriosVisible: boolean = true;

  /**
   * Arreglo que almacena los datos obtenidos relacionados con el mecanismo de cupo.
   * Cada elemento del arreglo es una instancia de la interfaz `Dato`.
   * 
   * @type {Dato[]}
   */
  buscarDatos: Dato[] = [];


  /**
 * @constructor
 * @description
 * Constructor del componente `ConsultarCupoComponent`. Inicializa las dependencias necesarias para el funcionamiento del componente.
 * 
 * Funcionalidad:
 * - `SolicitudDeRegistroTplService`: Servicio para interactuar con los datos relacionados con la solicitud de registro.
 * - `Tramite120101Store`: Store para gestionar el estado global del trámite 120101.
 * - `Tramite120101Query`: Query para consultar el estado global del trámite 120101.
 * - `ServicioDeFormularioService`: Servicio para registrar y gestionar formularios dinámicos.
 * 
 * @param {SolicitudDeRegistroTplService} solicitudDeRegistroTplService - Servicio para manejar datos de la solicitud de registro.
 * @param {Tramite120101Store} tramite120101Store - Store para gestionar el estado global del trámite.
 * @param {Tramite120101Query} tramite120101Query - Query para consultar el estado global del trámite.
 * @param {ServicioDeFormularioService} servicioDeFormularioService - Servicio para gestionar formularios dinámicos.
 */
  constructor(
    private solicitudDeRegistroTplService: SolicitudDeRegistroTplService,
    private tramite120101Store: Tramite120101Store,
    private tramite120101Query: Tramite120101Query,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private catalogoServices: CatalogoServices,
    private ampliacionServiciosAdapter: AmpliacionServiciosAdapter
  ) {
    //
  }

  /**
 * @method ngOnInit
 * @description
 * Este método se ejecuta al inicializar el componente `ConsultarCupoComponent`. 
 * Realiza las siguientes acciones:
 * 
 * Funcionalidad:
 * - Se suscribe al observable `selectSolicitudDeRegistroTpl$` del servicio `Tramite120101Query` 
 *   para obtener el estado de la sección "Solicitud de Registro".
 * - Verifica si el estado contiene la propiedad `cuerpoTabla` y agrega los elementos únicos a la tabla dinámica.
 * - Registra el formulario dinámico `consultarCupoForm` en el servicio `ServicioDeFormularioService`.
 * - Llama a los métodos `obtenerClasificacionRegimenDatos` y `obtenerPaisDatos` para cargar datos adicionales.
 * 
 * @example
 * // Al inicializar el componente:
 * this.ngOnInit();
 * // El estado de la solicitud se actualiza, el formulario se registra y los datos adicionales se cargan.
 */
  ngOnInit(): void {
    this.tramite120101Query.selectSolicitudDeRegistroTpl$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.solicitudDeRegistroState = seccionState;
          if (this.solicitudDeRegistroState['idSolicitud'] && this.solicitudDeRegistroState['idSolicitud'] !== '0') {
            this.obligatoriosVisible = false;
            this.obtenerVisible.emit(this.obligatoriosVisible);
          }
          if (
            this.solicitudDeRegistroState &&
            typeof this.solicitudDeRegistroState === 'object' &&
            this.solicitudDeRegistroState !== null &&
            'cuerpoTabla' in this.solicitudDeRegistroState
          ) {
            const DATOS = this.solicitudDeRegistroState['cuerpoTabla'] as InstrumentoCupoTPLForm[] || [];
            DATOS.forEach((item: InstrumentoCupoTPLForm) => {
              const IS_ALREADY_ADDED = this.cuerpoTabla.some((i: InstrumentoCupoTPLForm) => i.id === (item.id ?? -1));
              if (!IS_ALREADY_ADDED) {
                this.cuerpoTabla.push(item);
              }
            });
          }
        })
      )
      .subscribe();
    this.servicioDeFormularioService.registerForm('consultarCupoForm', this.ninoFormGroup);
    this.obtenerRegimenDatos();
    this.obtenerPaisDestinoDatos();
    this.obtenerTratadoData();
    if (this.consultaState?.readonly) {
      this.mostrarCampoDeDescripcion();
      this.obtenerTablaDatos();
    }
  }

/**
   * Método que obtiene los datos de las fracciones arancelarias desde el servicio.
   * Actualiza las opciones del formulario dinámico con los datos obtenidos.
   */
  public obtenerDatosFraccionArancelaria(FRACCION_ARANCELARIA_CODE:string): void {
    this.catalogoServices.fraccionHtsCatalogo(this.tramiteId, FRACCION_ARANCELARIA_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        const FRACCION_FIELD = this.consultarCupoFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'descripcion'
        ) as ModeloDeFormaDinamica;
        if (FRACCION_FIELD && !FRACCION_FIELD.opciones) {
          if (Array.isArray(resp.datos)) {
            FRACCION_FIELD.opciones = resp.datos as Catalogo[];
            this.ninoFormGroup.get(FRACCION_FIELD.campo)?.setValue(FRACCION_FIELD.opciones[0].clave);
          }
        }
      });
  }



  /**
   * Busca los datos de la tabla.
   * @description Este método se ejecuta cuando se hace clic en el botón de búsqueda.
   * @returns {void}
   */
  buscar(): void {
    if (!this.ninoFormGroup.touched) {
      this.ninoFormGroup.markAllAsTouched();
    }

    if (this.ninoFormGroup.valid) {
      this.obtenerTablaDatos();
    }
  }


  /**
   * Obtiene los datos del catálogo de tratados/acuerdos relacionados con el trámite actual
   * y actualiza las opciones del campo 'tratado' en el formulario dinámico.
   *
   * Realiza una petición al servicio `catalogoServices.tratadosAcuerdosCatalogo` usando el
   * identificador del trámite y el código de catálogo correspondiente. Al recibir la respuesta,
   * asigna las opciones obtenidas al campo 'tratado' si aún no tiene opciones definidas.
   *
   * La suscripción se cancela automáticamente cuando el componente se destruye.
   */
  obtenerTratadoData(): void {
    this.catalogoServices
      .tratadosAcuerdoCatalogo(this.tramiteId, "TITRAC.TA")
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp): void => {
        const TRATADO_FIELD = this.consultarCupoFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'tratado'
        ) as ModeloDeFormaDinamica;
        if (TRATADO_FIELD && !TRATADO_FIELD.opciones) {
          TRATADO_FIELD.opciones = resp.datos as Catalogo[];
        }
      });
  }

  /**
   * Obtiene los datos del catálogo de países de destino para el trámite actual.
   * Realiza una petición al servicio de catálogo utilizando el identificador del trámite y parámetros específicos.
   * Al recibir la respuesta, actualiza las opciones del campo 'pais' en el formulario dinámico si aún no han sido establecidas.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   *
   * @returns {void} No retorna ningún valor.
   */
  obtenerPaisDestinoDatos(): void {
    this.catalogoServices
      .paisDestinoCatalogo(this.tramiteId, { cveTratado: "SGPQFB045", cvePais: "TICERM.QFBA" })
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp): void => {
        const PAIS_FIELD = this.consultarCupoFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'pais'
        ) as ModeloDeFormaDinamica;
        if (PAIS_FIELD && !PAIS_FIELD.opciones) {
          PAIS_FIELD.opciones = resp.datos as Catalogo[];
        }
      });
  }

  /**
   * Obtiene los datos del régimen desde el servicio de catálogo y actualiza las opciones
   * del campo 'clasificacion' en el formulario dinámico de consultar cupo.
   *
   * Realiza una petición al servicio `clasificacionRegimenCatalogo` utilizando el `tramiteId`
   * y parámetros específicos, y asigna la respuesta como opciones del campo correspondiente
   * si aún no han sido establecidas.
   *
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   */
  obtenerRegimenDatos(): void {
    this.catalogoServices
      .clasificacionRegimenCatalogo(this.tramiteId, { tramite: 'TITPEX.130110', id: "01" })
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp): void => {
        const REGIMEN_FIELD = this.consultarCupoFormData.find(
          (datos: ModeloDeFormaDinamica) => datos.campo === 'clasificacion'
        ) as ModeloDeFormaDinamica;
        if (REGIMEN_FIELD && !REGIMEN_FIELD.opciones) {
          REGIMEN_FIELD.opciones = resp.datos as Catalogo[];
        }
      });
  }

  /**
 * @method obtenerTablaDatos
 * @description
 * Método que obtiene los datos para la tabla dinámica de cupos desde el servicio `SolicitudDeRegistroTplService`.
 * 
 * Detalles:
 * - Realiza una petición al servicio para obtener los datos de la tabla.
 * - Mapea la respuesta para estructurar cada elemento según el modelo `InstrumentoCupoTPLForm`.
 * - Asigna el resultado al arreglo `cuerpoTabla` y actualiza el estado global en el store.
 * - Si el estado de consulta es solo lectura (`readonly`), selecciona automáticamente la primera fila de la tabla.
 * 
 * @example
 * this.obtenerTablaDatos();
 * // Obtiene y muestra los datos de la tabla de cupos.
 */
  obtenerTablaDatos(): void {
    const NANO_FORM = this.forma.get('ninoFormGroup') as FormGroup;
    const NANO_FORM_VALUE = NANO_FORM.value;
    this.cuerpoTabla = [];
    this.fraccionError = false;
    this.fraccionErrorUno = undefined;
    const FRACCION_ERROR = { fraccionErrorUno: this.fraccionErrorUno, fraccionError: this.fraccionError };
    this.fraccionErrorEvent.emit(FRACCION_ERROR);
    const PAYLOAD = {
      instrumentoCupoTPL: {
        idTratadoAcuerdo: NANO_FORM_VALUE.tratado === 118 ? NANO_FORM_VALUE.tratado : 118,
        claveRegimen: NANO_FORM_VALUE.clasificacion === "REG.02" ? NANO_FORM_VALUE.clasificacion : "REG.02",
        clavePais: NANO_FORM_VALUE.pais === "CAN" ? NANO_FORM_VALUE.pais : "CAN",
        cveFraccion: NANO_FORM_VALUE.fraccionArancelaria ? NANO_FORM_VALUE.fraccionArancelaria : "",
        descripcionFraccion: "",
        idFraccionHtsUsa: ""
      }
    }
    this.solicitudDeRegistroTplService.getBuscarDatos(PAYLOAD).subscribe((resp) => {
      if (resp.codigo !== "00") {
        this.fraccionErrorUno = resp.codigo?.length > 1 ? resp.codigo : resp.causa;
        this.fraccionError = true;
        const FRACCION_ERROR = { fraccionErrorUno: this.fraccionErrorUno, fraccionError: this.fraccionError };
        this.fraccionErrorEvent.emit(FRACCION_ERROR);
      } else if (resp.codigo === "00") {

        this.fraccionError = false;
        this.fraccionErrorUno = undefined;
        const FRACCION_ERROR = { fraccionErrorUno: this.fraccionErrorUno, fraccionError: this.fraccionError };
        this.fraccionErrorEvent.emit(FRACCION_ERROR);
        this.mostrarCampoDeDescripcion();
        this.buscarDatos = resp.datos as Dato[];
        const TABLA_DATOS = this.ampliacionServiciosAdapter.mapBuscarTablaDatosList(resp.datos);
        this.tramite120101Store.setDynamicFieldValue('idMecanismo', TABLA_DATOS[0].idMecanismo);
        this.cuerpoTabla = TABLA_DATOS;
        this.tramite120101Store.setDynamicFieldValue('cuerpoTabla', this.cuerpoTabla);
      }

    });
  }

  /**
 * @method mostrarCampoDeDescripcion
 * @description
 * Este método verifica si el campo `fraccionArancelaria` tiene un valor en el formulario dinámico.
 * Si el valor existe, actualiza la configuración del campo `descripcion` para que sea visible en el formulario.
 * 
 * Funcionalidad:
 * - Obtiene el valor del campo `fraccionArancelaria` del grupo de formularios `ninoFormGroup`.
 * - Busca el índice del campo `descripcion` en la configuración del formulario dinámico (`consultarCupoFormData`).
 * - Si el campo `descripcion` existe, actualiza su propiedad `mostrar` a `true` para hacerlo visible.
 * 
 * @example
 * this.mostrarCampoDeDescripcion();
 * // Si `fraccionArancelaria` tiene un valor, el campo `descripcion` se muestra en el formulario.
 */
  public mostrarCampoDeDescripcion(): void {
    if (this.ninoFormGroup.get('fraccionArancelaria')?.value) {
      const INDEX = this.consultarCupoFormData.findIndex(item => item.campo === 'descripcion');
      if (INDEX !== -1) {
        this.consultarCupoFormData[INDEX] = { ...this.consultarCupoFormData[INDEX], mostrar: true };
      }
    }
  }

  /**
 * @method controladorDeClicsArchivo
 * @description
 * Este método maneja el evento de clic en una fila de la tabla dinámica.
 * Cuando se selecciona una fila, emite el evento con los datos de la fila seleccionada.
 * 
 * Funcionalidad:
 * - Verifica si el evento contiene datos válidos.
 * - Emite el evento utilizando el `EventEmitter` `emitirFilaClicControlador`.
 * 
 * @param {InstrumentoCupoTPLForm} event - Objeto que representa los datos de la fila seleccionada.
 * 
 * @example
 * this.controladorDeClicsArchivo(filaSeleccionada);
 * // Emite el evento con los datos de la fila seleccionada.
 */
  public controladorDeClicsArchivo(event: InstrumentoCupoTPLForm): void {
    if (event) {
      this.obligatoriosVisible = false;
      this.obtenerVisible.emit(this.obligatoriosVisible);
      this.getMostarDetaleDatos();
    }
  }

  /**
  * compo doc
  * @method establecerCambioDeValor
  * @description
  * Este método se utiliza para manejar los cambios en los valores de un formulario dinámico.
  * Recibe un evento que contiene el nombre del campo y su nuevo valor, y actualiza el estado
  * dinámico del formulario en el store correspondiente.
  * 
  * @param event - Un objeto que contiene el campo que ha cambiado y su nuevo valor.
  * El objeto tiene la estructura: `{ campo: string; valor: any }`.
  * 
  * @example
  * establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
  * // Actualiza el campo 'nombre' con el valor 'Juan' en el store dinámico.
  */
  establecerCambioDeValor(event: { campo: string; valor: object | string }): void {
    if (event) {
        if(event.campo==='fraccionArancelaria'){
      this.obtenerDatosFraccionArancelaria(event.valor as string);
    }
      this.tramite120101Store.setDynamicFieldValue(event.campo, event.valor);
      this.servicioDeFormularioService.setFormValue('consultarCupoForm', {
        [event.campo]: event.valor,
      });
    }
  }



  /**
   * Obtiene las terciarizadas disponibles para el trámite actual.
   *
   * Este método realiza una solicitud al servicio `solicitudDeRegistroTplService` para obtener el monto disponible
   * asociado al trámite identificado por `tramiteId`. El resultado de la petición es procesado para verificar
   * si la respuesta es válida y contiene datos. En caso de error, se maneja el código de error específico "01".
   *
   * @remarks
   * - Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * - Los datos obtenidos pueden ser procesados y asignados a una variable local para su uso posterior.
   *
   * @returns {void} No retorna ningún valor.
   */
  obtenerTerciarizadasDisponibles(): void {
    const PAYLOAD = {
    };

    this.solicitudDeRegistroTplService
      .getElMontoDisponible(this.tramiteId, PAYLOAD as SolicitudTPLCANR)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (esValidObject(response)) {
          const API_DATOS = doDeepCopy(response);
          if (esValidArray(API_DATOS.datos)) {
            //   this.disponiblesDatos = this._compartidaSvc.toDisponsibleFiscal(API_DATOS.datos);
          }
        }
      },
        (err) => {
          if (err.error.codigo === "01") {
            // this.rfcError=true;
          }
        });
  }



  /**
 * @method verificarLaValidezDelFormulario
 * @description
 * Este método verifica la validez de los formularios dinámicos asociados a los pasos del wizard.
 * @returns {boolean} - Indica si todos los formularios son válidos.
 */
  verificarLaValidezDelFormulario(): boolean {
    return (
      (this.servicioDeFormularioService.isFormValid('consultarCupoForm') ??
        false) &&
      this.isAllArraysFilledIn120101(['anexoUnoTabla1', 'anexoUnoTabla2'])
    );
  }

  /** Verifica que todos los arreglos indicados estén llenos en el formulario del trámite 120101. */
  isAllArraysFilledIn120101(array: string[]): boolean {
    return array.every(item => this.servicioDeFormularioService.isArrayFilled(item));
  }

  validarFormulario(): void {
    this.forma.markAllAsTouched();
  }


  /**
   * Obtiene y muestra el detalle de los datos asociados a la búsqueda actual.
   * 
   * Este método toma el primer elemento de `buscarDatos` como payload y realiza una solicitud
   * al servicio `solicitudDeRegistroTplService` para obtener el detalle correspondiente.
   * Si la respuesta contiene datos, oculta los campos obligatorios, emite el cambio de visibilidad
   * y adapta los datos recibidos para emitir el primer elemento de la tabla resultante.
   * 
   * @remarks
   * Utiliza el operador `takeUntil` para gestionar la suscripción y evitar fugas de memoria.
   * 
   * @returns {void}
   */
  getMostarDetaleDatos(): void {
    const PAYLOAD = this.buscarDatos[0];
    this.solicitudDeRegistroTplService.getMostrarDetalle(PAYLOAD).pipe(takeUntil(this.destroy$)).subscribe((resp) => {
      if (resp.datos) {
        this.obligatoriosVisible = false;
        this.obtenerVisible.emit(this.obligatoriosVisible);
        const DATOSMOTARDETALE = [resp.datos];
        const TABLA_DATOS = this.ampliacionServiciosAdapter.mapBuscarTablaDatosList(DATOSMOTARDETALE);
        if (Array.isArray(TABLA_DATOS) && TABLA_DATOS.length > 0) {
          this.emitirFilaClicControlador.emit(TABLA_DATOS[0]);
        }
      }
    });
  }


  /**
  * @method ngOnDestroy
  * @description
  * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente 
  * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones 
  * activas y evitar fugas de memoria en la aplicación.
  * 
  * Funcionalidad:
  * - Notifica a través del `Subject` `destroy$` que el componente será destruido.
  * - Completa el `Subject` para liberar los recursos asociados.
  * 
  * @example
  * ngOnDestroy(): void {
  *   this.destroy$.next();
  *   this.destroy$.complete();
  * }
  */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
