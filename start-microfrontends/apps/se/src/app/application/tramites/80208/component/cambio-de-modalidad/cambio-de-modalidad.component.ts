import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CONFIGURACION_DOMICILIOS,ConfiguracionColumna } from '../../modelos/cambio-de-modalidad.model';
import {
  Catalogo,
  CatalogoServices,
  CategoriaMensaje,
  ConsultaioQuery,
  Notificacion,
  NotificacionesComponent,
  SeccionLibQuery,
  SeccionLibStore,
  TipoNotificacionEnum,
} from '@ng-mf/data-access-user';
import { EmpresaNacional, EmpresasNacionalesResponse, ServicioDtosKey, ServicioItemResponse } from '../../../../shared/models/modelo-interface.model';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CONFIGURACION_SERVICIO } from '../../modelos/cambio-de-modalidad.model';
import { CambioModalidadQuery } from '../../estados/tramite80208.query';
import { CambioModalidadService } from '../../service/cambio-modalidad.service';
import{ CambioModalidadState } from '../../estados/tramite80208.store';
import { CambioModalidadStore } from '../../estados/tramite80208.store';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
import { ServicioInfo } from '../../modelos/cambio-de-modalidad.model';
import { ServiciosService } from '../../../../shared/services/servicios.service';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';

/**
 * @Component - Decorador que define el componente Angular para el cambio de modalidad.
 *
 * @selector app-cambio-de-modalidad - Selector CSS usado para identificar este componente en las plantillas.
 * @templateUrl ./cambio-de-modalidad.component.html - Ruta al archivo de plantilla HTML del componente.
 * @styleUrls ['./cambio-de-modalidad.component.scss'] - Ruta al archivo de estilos SCSS del componente.
 * @standalone true - Indica que el componente es independiente y no requiere un módulo Angular.
 * @imports - Módulos y componentes importados para su uso en este componente.
 *   - TablaDinamicaComponent - Componente para mostrar tablas dinámicas.
 *   - ReactiveFormsModule - Módulo para formularios reactivos.
 *   - CommonModule - Módulo con directivas comunes de Angular.
 *   - CatalogoSelectComponent - Componente para selección de catálogos.
 *   - TituloComponent - Componente para mostrar títulos.
 */
@Component({
  selector: 'app-cambio-de-modalidad',
  templateUrl: './cambio-de-modalidad.component.html',
  styleUrls: ['./cambio-de-modalidad.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    ReactiveFormsModule,
    CommonModule,
    CatalogoSelectComponent,
    TituloComponent,
    FormsModule,
    NotificacionesComponent,
  ],
  providers: [NotificacionesService],
}) 

/**
 * @class CambioDeModalidadComponent
 * @description
 * Clase que implementa la lógica para gestionar el cambio de modalidad.
 */
export class CambioDeModalidadComponent implements OnInit, OnDestroy {

  /**
   * @property tablaSeleccion - Tipo de selección de la tabla (Radio o Checkbox).
   * @description
   * Propiedad que define el tipo de selección para la tabla, utilizando la enumeración `TablaSeleccion`.
   * Por defecto, se establece como `TablaSeleccion.RADIO`, indicando que la selección será mediante botones de opción.
   * @type {TablaSeleccion}
   * @default TablaSeleccion.RADIO
   */
  tablaSeleccion: TablaSeleccion = TablaSeleccion.RADIO;

  /**
   * @property configuracionTabla - Configuración de las columnas de la tabla para los servicios.
   * @description
   * Arreglo de objetos tipo `ConfiguracionColumna<ServicioInfo>` que define la estructura y configuración
   * de las columnas de la tabla que muestra los servicios. Se inicializa con la constante `CONFIGURACION_SERVICIO`.
   * @type {ConfiguracionColumna<ServicioInfo>[]}
   */
  configuracionTabla: ConfiguracionColumna<ServicioInfo>[] = CONFIGURACION_SERVICIO;
  
  /**
     * Configuración de columnas para la tabla de domicilios.
     * @property {ConfiguracionColumna<ServicioInmex>[]} configuracionTabla
     */
    configuracionTablaImmex: ConfiguracionColumna<EmpresaNacional>[] =
      CONFIGURACION_DOMICILIOS;
  /**
   * @property ServiciosDatos - Datos de los servicios disponibles.
   * @description
   * Arreglo de objetos tipo `ServicioInfo` que contiene la información de los servicios disponibles.
   * Cada objeto incluye propiedades como `descripcionDelServicio`, `tipoDeServicio` y `estatus`.
   * Se inicializa con un ejemplo de servicio relacionado con el blindaje de vehículos.
   * @type {ServicioInfo[]}
   */
  ServiciosDatos: ServicioInfo[] = [
  ];

  /**
   * @property autorizadosDatos - Datos de los servicios autorizados.
   * @description
   * Arreglo de objetos tipo `ServicioInfo` que contiene la información de los servicios autorizados.
   * Cada objeto incluye propiedades como `descripcionDelServicio`, `tipoDeServicio` y `estatus`.
   * Se inicializa con un ejemplo de servicio relacionado con el blindaje de vehículos.
   * @type {ServicioInfo[]}
   */
  autorizadosDatos: ServicioInfo[] = [];
  /**
   * Valor predeterminado para la selección de aduanas.
   * @property {number} predeterminado
   */
  predeterminado = -1;

  /**
   * @property unsubscribe$ - Subject para manejar la desuscripción de observables.
   * @description
   * Un `Subject<void>` utilizado para emitir una señal que cancela las suscripciones a observables
   * cuando el componente es destruido, previniendo fugas de memoria.
   * @type {Subject<void>}
   */
  public unsubscribe$ = new Subject<void>();

  /**
   * @property cambioDeModalidadForm - Formulario para el cambio de modalidad.
   * @description
   * Un `FormGroup` que contiene los controles del formulario reactivo para gestionar los datos
   * relacionados con el cambio de modalidad.
   * @type {FormGroup}
   */
  cambioDeModalidadForm!: FormGroup;

  /**
   * @property serviciosImmxForm - Formulario para los servicios IMMX.
   * @description
   * Un `FormGroup` que contiene los controles del formulario reactivo para gestionar los datos
   * de los servicios IMMX.
   * @type {FormGroup}
   */
  serviciosImmxForm!: FormGroup;

   /**
   * RFC de la empresa.
   * @property {string} rfcEmpresa
   */
   rfcEmpresa: string = '';

   /**
   * Número del programa IMMEX.
   * @property {string} numeroPrograma
   */
  numeroPrograma: string = '';

  /**
   * Tiempo del programa IMMEX.
   * @property {string} tiempoPrograma
   */
  tiempoPrograma: string = '';

  
   /**
     * Datos de empresas nacionales.
     * @property {ServicioInmex[]} datos
     */
    datos: EmpresaNacional[] = [];

    /**
       * Empresas seleccionadas.
       * @property {ServicioInmex[]} empresasSeleccionados
       */
      empresasSeleccionados: EmpresaNacional[] = [];

  /**
   * @property serviciosImmx - Lista de servicios IMMX disponibles.
   * @description
   * Un arreglo de objetos tipo `Catalogo` que contiene la lista de servicios IMMX disponibles.
   * @type {Catalogo[]}
   */
  serviciosImmx!: Catalogo[];

  /**
   * @property domiciliosSeleccionados - Lista de domicilios seleccionados.
   * @description
   * Un arreglo de objetos tipo `ServicioInfo` que contiene los domicilios seleccionados por el usuario.
   * Se utiliza para almacenar los servicios seleccionados en la interfaz.
   * @type {ServicioInfo[]}
   */

  domiciliosSeleccionados:ServicioInfo[] = [];

  /**
   * @property autorizadosSeleccionados - Lista de servicios autorizados seleccionados.
   */
  autorizadosSeleccionados:ServicioInfo[] = [];

  /**
   * @property cambioDeModalidad - Lista de cambios de modalidad disponibles.
   * @description
   * Un arreglo de objetos tipo `CambioModalidad` que contiene la lista de opciones de cambio de modalidad.
   * @type {CambioModalidad[]}
   */
  cambioDeModalidad!: Catalogo[];

  /**
   * @property espectaculoServiciosImmx - Indica si se deben mostrar los servicios IMMX.
   * @description
   * Propiedad booleana que controla la visibilidad de los servicios IMMX en la interfaz.
   * Por defecto, se inicializa en `false`.
   * @type {boolean}
   * @default false
   */
  espectaculoServiciosImmx: boolean = false;

  /**
   * @property destroyNotifier$ - Subject para manejar la destrucción del componente.
   * @description
   * Un `Subject<void>` privado utilizado para emitir una señal cuando el componente es destruido,
   * facilitando la limpieza de recursos.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property tramiteState - Estado del trámite de cambio de modalidad.
   * @description
   * Objeto que contiene el estado del trámite de cambio de modalidad, definido por la interfaz `CambioModalidadState`.
   * Se inicializa como un objeto vacío y se utilizará para almacenar el estado del formulario y otros datos relevantes.
   * @type {CambioModalidadState}
   */

  tramiteState:CambioModalidadState= {} as CambioModalidadState;

  /**
   * @property esFormularioSoloLectura - Indica si el formulario está en modo solo lectura.
   * 
   * @description
   * Propiedad booleana que determina si el formulario de cambio de modalidad debe ser de solo lectura.
   * Por defecto, se inicializa en `false`, permitiendo la edición del formulario.
   * 
   * @type {boolean}
   * @default false
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * @property serviciosImmexServId - Identificador del servicio IMMX seleccionado.
   */
  public serviciosImmexServId: string = '';

  /**
   * @property tramiteID - Identificador del trámite.
   */
  public tramiteID:string ='80208';

     /**
     * @public
     * @property {Notificacion} nuevaNotificacion
     * @description Representa una nueva notificación que se utilizará en el componente.
     * @command Este campo debe ser inicializado antes de su uso.
     */
   public nuevaNotificacion!: Notificacion;

   
  /**
 * @property {boolean} esHabilitarElDialogo
 * Indica si el diálogo de confirmación para agregar servicios está habilitado y visible.
 */

  esHabilitarElDialogo: boolean = false;
  /**
   * Indica si el diálogo de confirmación para eliminar servicios está habilitado y visible.
   * @property {boolean} esEliminar
   */
  esEliminar: boolean = false;
  /**
   * Indica si el diálogo de confirmación para eliminar empresas nacionales está habilitado y visible.
   * @property {boolean} esEliminar
   */

  esAgregarDos: boolean = false;

  /**
   * Indica si el diálogo de confirmación para eliminar empresas nacionales está habilitado y visible.
   * @property {boolean} esEliminar
   */

  esEliminarDos: boolean = false;
  /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   */

  rowNotSeleccionada: boolean = false;

  /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   * */

  noRowSelected: boolean = false;

   /**
   * Indica si se han recibido datos de respuesta.
   * @property {boolean} esDatosRespuesta
   * */
   noRowSelectedTablaC: boolean = false;

    /**
 * Referencia a la tabla dinámica A.
 * @property {TablaDinamicaComponent<ServicioInfo>} tablaA
 */
@ViewChild('tablaA') tablaA!: TablaDinamicaComponent<ServicioInfo>;

  /**
   * @constructor
   * @description Constructor del componente que inicializa los servicios y dependencias necesarias.
   * @param {FormBuilder} fb - Constructor de formularios.
   * @param {CambioModalidadService} modalidadService - Servicio para gestionar los cambios de modalidad.
   * @param {CambioModalidadQuery} cambioModalidadQuery - Consulta para obtener el estado del cambio de modalidad.
   * @param {CambioModalidadStore} cambioModalidadStore - Store para manejar el estado del cambio de modalidad.
   * @param {SeccionLibQuery} seccionQuery - Consulta para obtener el estado de la sección.
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado de la sección.
   */

  constructor(
    public fb: FormBuilder,
    public modalidadService: CambioModalidadService,
    public cambioModalidadQuery: CambioModalidadQuery,
    public cambioModalidadStore: CambioModalidadStore,
    public seccionQuery: SeccionLibQuery,
    public seccionStore: SeccionLibStore,
    public consultaioQuery: ConsultaioQuery,
    public serviciosService: ServiciosService,
    private notificacionesService: NotificacionesService,
     private catalogoServices: CatalogoServices,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * @method ngOnInit
   * @description Método de inicialización del componente.
   */
  ngOnInit(): void {      
         
    this.cambioModalidadQuery.selectCambioModalidad$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.cambioDeModalidadForm.patchValue({
            cambioDeModalidad: seccionState.cambioDeModalidad,
            folio: seccionState.folio,
            ano: seccionState.ano
          })
          
          if (Number(seccionState.cambioDeModalidad) > 0) {
            this.espectaculoServiciosImmx = true;
          }

          this.cambioDeModalidadForm.patchValue({
            serviciosImmx: seccionState.serviciosImmx                       
          });
          this.rfcEmpresa = seccionState.rfcEmpresa;
          this.numeroPrograma = seccionState.numeroPrograma;
          this.tiempoPrograma = seccionState.tiempoPrograma;
          this.datos = seccionState.datos;
          this.ServiciosDatos = seccionState.ServiciosDatos;
          
        })
      )
      .subscribe();
      this.inicializarForm();
      this.getCargarDatos();
      this.getCambioDeModalidad(this.tramiteID);
      this.getServiciosImmx(this.tramiteID);
      this.getTablaDatos();
  }

  /**
   * @method inicializarForm - Inicializa los formularios para el cambio de modalidad y servicios IMMX.
   * 
   * @description
   * Este método crea y configura dos formularios reactivos utilizando `FormBuilder` (`fb`):
   * 1. `cambioDeModalidadForm`: Un formulario con los controles `seleccionaLaModalidad`, `folio`, `ano`, `seleccionaModalidad` y `cambioDeModalidad`.
   *    - Los controles `seleccionaLaModalidad`, `folio`, `ano` y `seleccionaModalidad` se inicializan con valores del estado `cambioDeModalidadState` y están deshabilitados por defecto.
   *    - El control `cambioDeModalidad` se inicializa con el valor de `cambioModalidadState`.
   * 2. `serviciosImmxForm`: Un formulario con un único control `serviciosImmx`, inicializado con el valor de `cambioModalidadState`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  inicializarForm(): void {
    this.cambioDeModalidadForm = this.fb.group({
      seleccionaLaModalidad: [
        {
          value: this.tramiteState?.seleccionaLaModalidad,
          disabled: true,
        },
      ],
      folio: [{ value: this.tramiteState?.folio, disabled: true }],
      ano: [{ value: this.tramiteState?.ano, disabled: true }],
      seleccionaModalidad: [
        {
          value: this.tramiteState?.seleccionaModalidad,
          disabled: true,
        },
      ],
      cambioDeModalidad: [{ value: this.tramiteState?.cambioDeModalidad, disabled: false }],
      serviciosImmx: [{ value: this.tramiteState?.serviciosImmx, disabled: false }],
      rfcEmpresa: [{ value: this.tramiteState?.rfcEmpresa, disabled: false }],
      numeroPrograma: [{ value: this.tramiteState?.numeroPrograma, disabled: false }],
      tiempoPrograma: [{ value: this.tramiteState?.tiempoPrograma, disabled: false }],
    });
  }

  /**
   * @method inicializarEstadoFormulario - Inicializa el estado del formulario de cambio de modalidad.
   * 
   * @description
   * Este método verifica si el formulario está en modo solo lectura (`esFormularioSoloLectura`).
   * Si es verdadero, llama al método `guardarDatosFormulario` para configurar el formulario en modo solo lectura.
   * De lo contrario, llama al método `inicializarForm` para inicializar el formulario en modo editable.
   * 
   * @returns {void} No retorna ningún valor.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarForm();
    }
  }
  
  /**
   * Maneja los cambios en los campos de entrada y actualiza el estado correspondiente
   * en el store de ampliación de servicios.
   *
   * @param fieldName - El nombre del campo que ha cambiado.
   * @param newValue - El nuevo valor asignado al campo.
   */
  enCambioDeCampo(fieldName: string, newValue: string): void {
    switch (fieldName) {
      case 'rfcEmpresa':
        this.cambioModalidadStore.actualizarEstado({rfcEmpresa: newValue});
        break;
      case 'numeroPrograma':
        this.cambioModalidadStore.actualizarEstado({numeroPrograma: newValue});
        break;
      case 'tiempoPrograma':
        this.cambioModalidadStore.actualizarEstado({tiempoPrograma: newValue});
        break;
      default:
        break;
    }
  }

  /**
   * Agrega servicios a la ampliación.
   * @method agregarServiciosAmpliacion
   */


  agregarServiciosAmpliacion(event?: Event): void {
    // Prevent event propagation to avoid triggering parent form validation
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Verificar si se ha seleccionado un servicio
    if (!this.serviciosImmexServId || this.serviciosImmexServId === '-1') {
      this.formularioValidacionModal('Debe elegir en la pestaña de servicios, el servicio que se realizará a las mercancías a capturar');
      return;
    }

    const ID = this.serviciosImmexServId;
    
    // Verificar duplicados ANTES de realizar la llamada API
    const ISDUPLICATE = this.ServiciosDatos.some(item => item.idServicio === ID);
    if (ISDUPLICATE) {
      this.doConfirmAgregar();
      return; 
    }

    const PAYLOAD = {
      servicio: ID,
      servicioSeleccionado: this.autorizadosDatos.map(item => ({
        idServicio: Number(item.idServicio),
        claveServicio: Number(item.claveServicio)
      })),
      modalidad: this.tramiteID,
      idPrograma: "121579"
    };

    this.serviciosService.postServiciosImmexTabla(this.tramiteID, PAYLOAD).pipe(
      map((data: BaseResponse<Partial<ServicioItemResponse[]>>) => {
        if(data.codigo !== '00') {
            this.notificacionesService.showNotification({
            tipoNotificacion: TipoNotificacionEnum.TOASTR,
            categoria: CategoriaMensaje.ERROR,
            modo: '',
            titulo: 'Error',
            mensaje: `${data.error}`,
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: ''
          });
          return [];
        }
        return (data.datos ?? [])
          .filter((item): item is ServicioItemResponse => item !== undefined && item.descripcion !== null)
          .map(item => ({
            idServicio: String(item.idServicio), // Convertir a string para coincidir con la interfaz
            descripcion: item.descripcion,
            tipoServicio: item.tipoServicio,
            descripcionTipo: item.descripcionTipo,
            claveServicio: item.claveServicio
          })) as unknown as ServicioInfo[];
      }),
      filter((datosImmex: ServicioInfo[]) => datosImmex.length > 0),
    ).subscribe({
      next: (datosImmex: ServicioInfo[]) => {

        const CUERPODATOS: ServicioInfo = {
          idServicio: String(datosImmex[0]?.idServicio || ID), // Convertir a string
          descripcion: datosImmex[0]?.descripcion,
          tipoServicio: datosImmex[0]?.tipoServicio,
          descripcionTipo: datosImmex[0]?.descripcionTipo,
          claveServicio: datosImmex[0]?.claveServicio,
        };

        this.cambioModalidadStore.actualizarEstado({
          ServiciosDatos: [...this.ServiciosDatos, CUERPODATOS]
        });
        this.cambioModalidadStore.setServicios(this.ServiciosDatos);
      }
    });
  }


  
 /**
  * Actualiza el grid de empresas nacionales.
  * @method actualizaGridEmpresasNacionales
  * 
  * @return {void}
  */
  getTablaDatos(): void {
    this.serviciosService.postServiciosAutorizadosTabla(this.tramiteID,{
      rfc: 'NOV0509053I7',
      numeroPrograma: '2',
      idPrograma: '121579',
      tipoPrograma: 'TICPSE.IMMEX'
    })
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1),
        filter((data: BaseResponse<ServicioDtosKey>) => data.codigo === '00'),
        map((data: BaseResponse<ServicioDtosKey>) => {
          const SERVICIOS_ITEMS = data.datos?.servicioDtos || [];
          return SERVICIOS_ITEMS
            .filter((item: ServicioItemResponse) => item.idServicio !== null && item.idServicio !== undefined)
            .map((item: ServicioItemResponse) => ({
              idServicio: String(item.idServicio),
              descripcion: item.descripcion,
              descripcionTipo: item.descripcionTipo,
              descripcionTestado: item.descripcionTestado,
              estatus: item.estatus,
              desEstatus: item.desEstatus,
              idSolicitud: item.idSolicitud ? String(item.idSolicitud) : undefined,
              solicitud: item.solicitud,
              tipoServicio: item.tipoServicio,
              claveServicio: item.claveServicio,
              fecIniVigencia: item.fecIniVigencia,
              fecFinVigencia: item.fecFinVigencia
            } as unknown)) as ServicioInfo[];
        })
      )
      .subscribe({
        next: (datosAutorizados: ServicioInfo[]) => {
          this.autorizadosDatos = datosAutorizados;
          this.cambioModalidadStore.datosAutorizados(this.autorizadosDatos);
        }
      });
  }
  
  /**
   * Elimina un servicio seleccionado del grid de servicios.
   * 
   * @method eliminarServiciosGrid
   * 
   * @description
   * Este método busca el índice del primer servicio en `ServiciosDatos` que coincida con la descripción del servicio
   * del primer domicilio seleccionado (`domiciliosSeleccionados[0]?.['descripcionDelServicio']`).
   * Si se encuentra el servicio, lo elimina del arreglo `ServiciosDatos` y actualiza el estado en el store.
   * Finalmente, limpia la selección de domicilios.
   * 
   * @returns {void} No retorna ningún valor.
   */
  eliminarServiciosGrid(): void {
    const INDICE = this.ServiciosDatos.findIndex(
      (item: ServicioInfo) =>
        item.claveServicio === this.domiciliosSeleccionados[0]?.['claveServicio']
    );
  
    if (INDICE !== -1) {
      const DATOS_IMMEX_ACTUALIZADOS = [...this.ServiciosDatos];
      DATOS_IMMEX_ACTUALIZADOS.splice(INDICE, 1);
      this.ServiciosDatos = DATOS_IMMEX_ACTUALIZADOS;
      this.domiciliosSeleccionados=[];
  
        this.cambioModalidadStore.actualizarEstado({
        ServiciosDatos: this.ServiciosDatos
      });

      this.tablaA?.clearSelection();
    }
  }
  
  /**
   * @method guardarDatosFormulario - Configura el estado del formulario de cambio de modalidad.
   * 
   * @description
   * Este método inicializa el formulario llamando a `inicializarForm`. Luego, verifica si el formulario
   * está en modo solo lectura (`esFormularioSoloLectura`). Si es verdadero, deshabilita el formulario
   * utilizando `disable`; de lo contrario, lo habilita con `enable`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  guardarDatosFormulario(): void {
    this.inicializarForm();
    if (this.esFormularioSoloLectura) {
      this.cambioDeModalidadForm.disable();
    } else {
      this.cambioDeModalidadForm.enable();
    }
  }

  /**
   * @method getCargarDatos - Carga datos simulados en el formulario de cambio de modalidad.
   * 
   * @description
   * Este método realiza una solicitud al `modalidadService` para obtener datos simulados mediante `getDatosSimulados`.
   * Utiliza el operador `pipe` con `takeUntil` para cancelar la suscripción cuando el sujeto `unsubscribe$` emite un valor,
   * evitando fugas de memoria. Al recibir los datos, actualiza los valores del formulario `cambioDeModalidadForm` con los datos obtenidos
   * utilizando el método `patchValue`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  getCargarDatos(): void {
    this.modalidadService
      .getDatosSimulados()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.cambioDeModalidadForm.patchValue(data);
        this.cambioModalidadStore.actualizarEstado({
          folio: data.folio,
          ano: data.ano,
          seleccionaModalidad: data.seleccionaModalidad,
          seleccionaLaModalidad: data.seleccionaLaModalidad
        });
      });
  }

  /**
   * @method getServiciosImmx - Obtiene los datos de servicios IMMX desde el servicio.
   * 
   * @description
   * Este método realiza una solicitud al `modalidadService` para obtener los datos de los servicios IMMX.
   * Al recibir la respuesta, actualiza la propiedad `serviciosImmx` con los datos obtenidos.
   * Luego, serializa los datos de `serviciosImmx` a una cadena JSON y actualiza el estado en el store
   * mediante el método `setCambioModalidad` del `cambioModalidadStore`.
   * 
   * @returns {void} No retorna ningún valor.
   */
  getServiciosImmx(tramiteID: string): void {
    this.catalogoServices.immexCatalogo(tramiteID).subscribe((data) => {
      this.serviciosImmx = data.datos ?? [];
    });
  }

  /**
   * @method getCambioDeModalidad - Obtiene los datos de cambio de modalidad desde el servicio.
   * 
   * @description
   * Este método realiza una solicitud al `modalidadService` para obtener los datos de cambio de modalidad.
   * Al recibir la respuesta, actualiza la propiedad `cambioDeModalidad` con los datos obtenidos.
   * Luego, verifica si existe un valor seleccionado en el formulario (`cambioDeModalidadForm`) y, si es así,
   * llama al método `toggleServiciosImmx` pasando el identificador seleccionado (`SELECCIONADAID`).
   * 
   * @returns {void} No retorna ningún valor.
   */
  getCambioDeModalidad(tramiteID: string): void {
    this.modalidadService.getCambioDeModalidad(tramiteID).subscribe((data) => {
      this.cambioDeModalidad = ((data.datos as unknown) as Catalogo[]).map((item: Catalogo) => ({
      id: item.id ?? item.clave,
      descripcion: item.descripcion
    }));
      const SELECCIONADAID =
        this.cambioDeModalidadForm.get('cambioDeModalidad')?.value;
      if (SELECCIONADAID) {
        this.toggleServiciosImmx(SELECCIONADAID);
      }
    });
  }

  /**
   * @method toggleServiciosImmx - Alterna la visibilidad de los servicios IMMX según la selección.
   * 
   * @description
   * Este método controla la visibilidad de los servicios IMMX basándose en el identificador seleccionado (`SELECCIONADAID`).
   * Si no se proporciona un identificador válido o si `cambioDeModalidad` está vacío, desactiva la visibilidad de los servicios.
   * Busca la opción seleccionada en `cambioDeModalidad` comparando el `id` con `SELECCIONADAID`. Si la descripción de la opción seleccionada
   * es 'SERVICIOS' (en mayúsculas), activa la visibilidad de los servicios. Finalmente, actualiza el estado en el store con el identificador seleccionado.
   * 
   * @param {any} SELECCIONADAID - Identificador de la opción seleccionada, usado para buscar en `cambioDeModalidad`.
   * @returns {void} No retorna ningún valor.
   */
  toggleServiciosImmx(SELECCIONADAID: string): void {
    if (!SELECCIONADAID || !this.cambioDeModalidad.length) {
      this.espectaculoServiciosImmx = false;
      return;
    }
    const OPCIONSELECCIONADA = this.cambioDeModalidad.find(
      (item) => item.id.toString() === SELECCIONADAID
    );
    this.espectaculoServiciosImmx =
      OPCIONSELECCIONADA?.descripcion?.toUpperCase() === 'SERVICIOS';
    this.cambioModalidadStore.actualizarEstado({cambioDeModalidad:SELECCIONADAID});
  }

  /**
   * @method seleccionarDesplegable - Maneja la selección de un elemento en un desplegable.
   * 
   * @description
   * Este método se ejecuta cuando se selecciona un elemento en un componente desplegable. Si el evento contiene un identificador (`id`),
   * llama al método `toggleServiciosImmx` pasando el `id` convertido a cadena.
   * 
   * @param {any} event - Objeto del evento que contiene la información de la selección, incluyendo el `id` del elemento seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  seleccionarDesplegable(): void {
   
       this.toggleServiciosImmx(this.cambioDeModalidadForm.value.cambioDeModalidad.toString());
  this.cambioModalidadStore.actualizarEstado({
        cambioDeModalidad: this.cambioDeModalidadForm.value.cambioDeModalidad.toString()
      });

       }
  /**
   * @method seleccionarDesplegableServicios - Maneja la selección de servicios en un desplegable.
   * 
   * @description
   * Este método se ejecuta cuando se selecciona un servicio en el formulario `serviciosImmxForm`.
   * Actualiza el estado del store `cambioModalidadStore` con el valor seleccionado de los servicios IMMX.
   * 
   * @returns {void} No retorna ningún valor.
   */

  seleccionarDesplegableServicios(): void {
    const ID = this.cambioDeModalidadForm.value?.serviciosImmx.toString() || '';
    this.serviciosImmexServId = ID;
    this.cambioModalidadStore.actualizarEstado({
      serviciosImmx: ID
    });
  }
   /**
     * Selecciona domicilios.
     * @method seleccionarDomicilios
     * @param {any} domicilios - Domicilios seleccionados.
     */
    seleccionarDomicilios(domicilios: ServicioInfo): void {
      this.domiciliosSeleccionados = [{ ...domicilios }];
      this.cambioModalidadStore.setDomiciliosSeleccionados(this.domiciliosSeleccionados);
    }

  /**
   * Selecciona autorizados.
   * @method seleccionarAutorizados
   * @param {any} autorizados - Autorizados seleccionados.
   */

  seleccionarAutorizados(autorizados: ServicioInfo): void {
    if (!autorizados) {
      this.autorizadosSeleccionados = [];
      return;
    }
    this.autorizadosSeleccionados= [{ ...autorizados }];
    this.tablaA?.clearSelection();
  }


   /**
     * Elimina empresas nacionales.
     * @method eliminarEmpresasNacionales
     */
    eliminarEmpresasNacionales(): void {
      const INDICE = this.datos.findIndex(
        (item: EmpresaNacional) =>
          item.idServicio === this.empresasSeleccionados[0]?.idServicio
      );
      if (INDICE !== -1) {
        const DATOSACTUALIZADOS = [...this.datos];
        DATOSACTUALIZADOS.splice(INDICE, 1);
        this.cambioModalidadStore.actualizarEstado({datos:DATOSACTUALIZADOS});
        this.empresasSeleccionados = [];
        this.rfcEmpresa = '';
        this.numeroPrograma = '';
        this.tiempoPrograma = '';
        this.cambioModalidadStore.actualizarEstado(
          { rfcEmpresa: '', numeroPrograma: '', tiempoPrograma: '' }
        )
      }
    }
   
     /**
   * Actualiza el grid de empresas nacionales.
   * @method actualizaGridEmpresasNacionales
   */
  actualizaGridEmpresasNacionales(): void {

this.serviciosService.postServiciosEmpresasNacionales(this.tramiteID,{
      rfcEmpresaNacional: this.rfcEmpresa,
      idServicio: this.domiciliosSeleccionados[0]?.idServicio ?? "8",
      descripcionServicio: this.domiciliosSeleccionados[0]?.descripcion || this.autorizadosSeleccionados[0]?.descripcion || "",
      modalidad: this.tramiteID,
      numeroPrograma: this.numeroPrograma,
      tiempoPrograma: this.tiempoPrograma,
      idServicioAutorizado: this.autorizadosSeleccionados[0]?.idServicio || ""
    })
      .pipe(
        takeUntil(this.destroyNotifier$),
        shareReplay(1),
        filter((data: BaseResponse<EmpresasNacionalesResponse>) => data.codigo === '00'),
        map((data: BaseResponse<EmpresasNacionalesResponse>) => {
          if(data?.datos?.empresasNacionales === null) {
            const ERROR_MSG = data?.datos?.resultado ? data.datos.resultado : data?.mensaje;
            this.notificacionesService.showNotification({
            tipoNotificacion: TipoNotificacionEnum.TOASTR,
            categoria: CategoriaMensaje.ERROR,
            modo: '',
            titulo: 'Error',
            mensaje: `${ERROR_MSG}`,
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: ''
          });
            return [];
          }
          const SERVICIOS_ITEMS = data.datos?.empresasNacionales || [];
          return SERVICIOS_ITEMS
            .filter((item: EmpresaNacional) => item.idServicio !== null && item.idServicio !== undefined)
            .map((item: EmpresaNacional) => ({
                idCompuestoEmpresa: item.idCompuestoEmpresa,
                idServicioAutorizado: item.idServicioAutorizado,
                idServicio: item.idServicio,
                descripcionServicio: item.descripcionServicio,
                rfc: item.rfc,
                razonSocial: item.razonSocial,
                numeroPrograma: item.numeroPrograma,
                tiempoPrograma: item.tiempoPrograma
            } as unknown)) as EmpresaNacional[];
        }
      ))
      .subscribe({
        next: (empresas: EmpresaNacional[]) => {
          // Actualizar solo el store con los nuevos datos sin duplicar
          this.cambioModalidadStore.setDatos(empresas);
          
          this.cambioDeModalidadForm.get('rfcEmpresa')?.setValue('');
          this.cambioDeModalidadForm.get('numeroPrograma')?.setValue('');
          this.cambioDeModalidadForm.get('tiempoPrograma')?.setValue('');

          this.rfcEmpresa = '';
          this.numeroPrograma = '';
          this.tiempoPrograma = '';
         
        }
      });  
  }
  /**
     * Selecciona empresas.
     * @method seleccionarEmpresas
     * @param {any} empresas - Empresas seleccionadas.
     */
    seleccionarEmpresas(empresas: EmpresaNacional): void {
       if (!empresas) {
      this.empresasSeleccionados = [];
      return;
    }
    
    this.empresasSeleccionados = [{ ...empresas }];
    this.cambioModalidadStore.setEmpresasSeleccionados(this.empresasSeleccionados);
    }

  /**
   * @method ngOnDestroy - Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   *
   * @description
   * Este método envía una señal al sujeto `unsubscribe$` para notificar la finalización de las suscripciones
   * y completa el sujeto para liberar recursos, evitando fugas de memoria.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

    /**
   * Establecer valores en el store del trámite.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo.
   * @param metodoNombre Nombre del método en el store.s
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof CambioModalidadStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.cambioModalidadStore[metodoNombre] as (valor: unknown) => void)(VALOR);
  }


  
    /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
   
    this.esHabilitarElDialogo = false;
  }
  /**
   * Método para cerrar el modal de eliminación.
   * @param {boolean} evento - Indica si se debe proceder con la eliminación.
   * @return {void}
   */
  cerrarModalEliminar(evento:boolean): void {
    if(evento===true){
    this.eliminarServiciosGrid();
    }
    this.esEliminar=false;
  }
/**
 * Actualiza el grid de empresas nacionales.
 * @method actualizaGridEmpresasNacionales
 * @return {void}
 * 
 */
  cerrarModalAgregar(): void {
    this.esAgregarDos=false;
  }

  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  cerrarEliminarDos(evento:boolean): void {
    if(evento===true){
    this.eliminarEmpresasNacionales();}
    this.esEliminarDos=false;
    
  }
  /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */
  cerrarNoRow(): void {
    this.noRowSelected=false;
  }
  /**
   * Cierra la notificación de fila no seleccionada.
   * @method cerrarNotSeleccainda
   * @return {void}
   * 
   */
  cerrarNotSeleccainda(): void {
    
    this.rowNotSeleccionada=false;
  }

   /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */
  cerrarNoRowTablaC(): void {
    this.noRowSelectedTablaC=false;
  }
  
  /**
   * Muestra una notificación de confirmación al intentar agregar un servicio duplicado.
   * @method doConfirmAgregar
   * @returns {void} Este método no retorna ningún valor.
   */
 
  doConfirmAgregar(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'El servicio que intenta ingresar ya ha sido registrado anteriormente.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.esHabilitarElDialogo = true;
  }
 /**
  * Muestra una notificación de confirmación al intentar eliminar un servicio.
  * @method doConfirmEliminar
  * @return {void} Este método no retorna ningún valor.
  */
  doConfirmEliminar(): void {
    if(this.domiciliosSeleccionados[0]?.idServicio===undefined || this.domiciliosSeleccionados.length === 0){
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Debe seleccionar el Servicio que desea eliminar',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.noRowSelected = true;

    }
    else{
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Esta seguro de eliminar el(los) servicio(s) seleccionado(s)?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
      alineacionBtonoCerrar: 'justify-content-start flex-row-reverse'
    };
    this.esEliminar = true;}}
    /**
     * Muestra una notificación de confirmación al intentar agregar un servicio.
     * @method agregarEmpresa
     * @return {void} Este método no retorna ningún valor.
     *  
     * */
    agregarEmpresa(): void {
      if(this.rfcEmpresa.trim() === ''){
        this.formularioValidacionModal('Introduzca un RFC válido');
        return;
      } else if(this.numeroPrograma.trim() === ''){
        this.formularioValidacionModal('Introduzca un no. de Programa valido');
        return;
      } else if(this.tiempoPrograma.trim() === ''){
        this.formularioValidacionModal('Introduzca un Año valido');
        return;
      }else if((this.domiciliosSeleccionados.length===0 &&this.autorizadosSeleccionados.length===0)|| (this.domiciliosSeleccionados[0]?.idServicio===undefined&&this.autorizadosSeleccionados[0]?.idServicio===undefined)){
        this.formularioValidacionModal('Debe seleccionar un Servicio.');
        return;
      }
        this.actualizaGridEmpresasNacionales();
    }

    /**
     * Muestra una notificación de confirmación al intentar agregar un servicio.
     * @method doAgregarDos
     * @return {void} Este método no retorna ningún valor.
     *  
     * */
    doAgregarDos(): void {
      if((this.domiciliosSeleccionados.length===0 &&this.autorizadosSeleccionados.length===0)|| (this.domiciliosSeleccionados[0]?.idServicio===undefined&&this.autorizadosSeleccionados[0]?.idServicio===undefined)){
        this.nuevaNotificacion = {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ALERTA,
          modo: 'modal',
          titulo: '',
          mensaje: 'Debe seleccionar un Servicio.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
        this.rowNotSeleccionada = true;
      } else {
        this.actualizaGridEmpresasNacionales();
      }
    }

    formularioValidacionModal(mensaje:string): void {
  this.rowNotSeleccionada = true;
  this.nuevaNotificacion = {
  tipoNotificacion: TipoNotificacionEnum.ALERTA,
  categoria: CategoriaMensaje.ALERTA,
  modo: 'modal',
  titulo: '',
  mensaje: mensaje,
  cerrar: false,
  txtBtnAceptar: 'Aceptar',
  txtBtnCancelar: '',
  };
}

    /**
     * Muestra una notificación de confirmación al intentar eliminar un servicio.
     * @method eliminarEmpresa
     * @return {void} Este método no retorna ningún valor.
     * */
    eliminarEmpresa(): void {
      if(this.empresasSeleccionados.length===0){
        this.nuevaNotificacion = {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ALERTA,
          modo: 'modal',
          titulo: '',
          mensaje: 'Selecciona un registro.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
          this.noRowSelectedTablaC = true;
      }
      else{
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: '¿Está seguro de eliminar el servicio seleccionado?',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: 'Cancelar',
      };
      this.esEliminarDos = true;}}

    /**
     * Valida el formulario de cambio de modalidad.
     * 
     * @method validarFormulario
     * @description
     * Este método verifica que los campos requeridos del formulario tengan valores válidos.
     * Valida que los campos 'cambioDeModalidad' y 'serviciosImmx' no tengan el valor "-1" (valor por defecto/sin selección).
     * Si algún campo es inválido, actualiza el estado de error correspondiente en el store y retorna false.
     * Si todos los campos son válidos, limpia los estados de error y retorna true.
     * 
     * @returns {boolean} True si el formulario es válido, false en caso contrario.
     */
    validarFormulario(): boolean {
      let VALID = true;
      if(this.cambioDeModalidadForm.get('cambioDeModalidad')?.value === "-1"){
        this.cambioModalidadStore.setCambioError(true);
        VALID = false;
      }
      else if(this.ServiciosDatos.length === 0){
        this.cambioModalidadStore.setCambioError(false);
        this.cambioModalidadStore.setserviciosImmxError(true);
        VALID = false;
      }
      else{
        this.cambioModalidadStore.setCambioError(false);
        this.cambioModalidadStore.setserviciosImmxError(false);
        VALID = true;
      }
      return VALID;
    }

}
