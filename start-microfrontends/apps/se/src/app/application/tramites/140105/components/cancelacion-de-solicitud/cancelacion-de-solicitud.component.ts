import { AfterViewInit,ElementRef,ViewChild } from '@angular/core';
import {CategoriaMensaje,TipoNotificacionEnum} from '@ng-mf/data-access-user';
import { Subject, map, take, takeUntil } from 'rxjs';
import { Cancelacion } from '../../models/cancelacion-de-solicitus.model';
import { Component } from '@angular/core';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DesistimientoDePermisoState } from '../../estados/desistimiento-de-permiso.store';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Modal } from 'bootstrap';
import {Notificacion} from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';



@Component({
  selector: 'app-cancelacion-de-solicitud',
  templateUrl: './cancelacion-de-solicitud.component.html',
  styleUrl: './cancelacion-de-solicitud.component.scss',
})


export class CancelacionDeSolicitudComponent implements OnInit, OnDestroy,AfterViewInit {
  /**
   * Formulario para capturar los datos de la solicitud.
   */
  solicitudForm?: FormGroup;
  /**
   * Sujeto para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotificationSubject$ = new Subject<void>();
  /**
   * Formulario para capturar el motivo de cancelación.
   */
  public cancelacionForm!: FormGroup;

    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @descripcion
   * Instancia del modal de modificación.
   */
  modalInstanceDos!: Modal;

  /**
   * Instancia del modal para gestionar archivos.
   *
   * Se utiliza para abrir o cerrar el modal de archivos.
   */
  modalInstances: Modal | null = null;
  /**
   * RFC del solicitante obtenido del store.
   */
  rfcSolicitante: string = '';

  /**
   * Clave de entidad federativa obtenida del store.
   */
  claveEntidadFederativa: string = 'SIN';

  /**
   * ID del tipo de trámite obtenido del store.
   */
  idTipoTramite: number = 140105;

  

  /**
   * Configuración de las columnas de la tabla de solicitudes de cancelación.
   */
  configuracionColumnasSolicitud: ConfiguracionColumna<Cancelacion>[] = [
    { encabezado: 'Folio trámite', clave: (fila) => fila.folioTramite, orden: 1 },
    { encabezado: 'Tipo solicitud', clave: (fila) => fila.tipoDeSolicitud, orden: 2 },
    { encabezado: 'Régimen', clave: (fila) => fila.regimen, orden: 3 },
    { encabezado: 'Clasificación régimen', clave: (fila) => fila.cdr, orden: 4 },
    { encabezado: 'Condición de la mercancía', clave: (fila) => fila.condicionDeLaMercancia, orden: 5 },
    { encabezado: 'Fracción arancelaria', clave: (fila) => fila.fraccionArancelaria, orden: 6 },
    { encabezado: 'Unidad de medida', clave: (fila) => fila.umt, orden: 7 },
    { encabezado: 'Cantidad solicitada', clave: (fila) => fila.cantidad, orden: 8 },
    { encabezado: 'Valor solicitado', clave: (fila) => fila.usd, orden: 9 },
  ];
   /**
   * Configuración para la selección de filas en la tabla.
   */
  tipoSeleccionSolicitud: TablaSeleccion = TablaSeleccion.CHECKBOX;
  /**
   * Almacena los registros de cancelación para mostrar en la tabla.
   */
  cuerpoTablaCancelacion: Cancelacion[] = [];

  cuerpoTablaSeleccionado: Cancelacion[] = [];

  /**
   * Referencia al elemento del modal para buscar mercancías.
   *
   * Se utiliza para abrir o cerrar el modal de búsqueda.
   */
  @ViewChild('modalBuscar') modalBuscar!: ElementRef;

  
  /**
   * Indica si el usuario tiene permiso para realizar ciertas acciones.
   */
  public datosDePermiso: boolean = false;

  /**
   * Flag to track if we have data from API search to prevent hardcoded data override
   */
  private hasApiSearchData: boolean = false;

  /**
   * @descripcion
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   *
   * Se utiliza para cerrar el modal de manera programada.
   */
@ViewChild('closeModal') closeModal!: ElementRef;

/**
     * @public
     * @property {Notificacion} nuevaNotificacion
     * @description Representa una nueva notificación que se utilizará en el componente.
     * @command Este campo debe ser inicializado antes de su uso.
     */
public nuevaNotificacion!: Notificacion;
/**
     * @public
     * @property {Notificacion} nuevaNotificacion
     * @description Representa una nueva notificación que se utilizará en el componente.
     * @command Este campo debe ser inicializado antes de su uso.
     */
public nuevaNotificacionUno!: Notificacion;


  /**
   * Formulario utilizado para capturar el número de folio del trámite.
   * Este formulario incluye validaciones requeridas y de patrón numérico.
   */
  public busquedaForm!: FormGroup;
  /**
   * Indica si una fila de la tabla está seleccionada.
   * Cuando es `true`, significa que al menos una fila ha sido seleccionada por el usuario.
   * Esto puede ser útil para habilitar o deshabilitar acciones basadas en la selección.
   * */
  esRowSelected: boolean = false;
  
  /**
   * Indica si se está en el proceso de eliminación de registros.
   * Cuando es `true`, significa que el usuario ha iniciado una acción para eliminar uno o más registros.
   * Esto puede activar la visualización de un modal de confirmación o habilitar opciones relacionadas con la eliminación.
   * */
  esEliminarDos: boolean = false;

  /**
   * Indica si se está ejecutando una búsqueda de permiso.
   * Cuando es `true`, previene múltiples llamadas simultáneas a la API.
   */
  public isLoadingBusquedaPermiso: boolean = false;
  /**
   * Constructor del componente.
   * 
   * @param fb Servicio para la creación de formularios reactivos.
   * @param servicioDeMensajesService Servicio para la gestión de mensajes y datos compartidos.
   * @param consultaQuery Consulta para obtener el estado de la sección de consulta.
   * @param desistimientoQuery Consulta para obtener el motivo de cancelación.
   */
  constructor(
    private fb: FormBuilder,
    private servicioDeMensajesService: ServicioDeMensajesService,
    private consultaQuery: ConsultaioQuery,
    private desistimientoQuery: DesistimientoQuery
  ) { this.establecerBusquedaForm();

  }
   /**
   * Método que se ejecuta al iniciar el componente.
   * Inicializa los formularios de solicitud y cancelación, 
   * así como sus validaciones. También suscribe a los datos 
   * del servicio de mensajes para actualizar la tabla y los datos
   * de la solicitud de cancelación.
   */
  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      folioTramite: ['', Validators.required],
      tipoSolicitud: ['', Validators.required],
      regimen: ['', Validators.required],
      clasificacionRegimen: ['', Validators.required],
      condicionMercancia: ['', Validators.required],
      fraccionArancelaria: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      cantidadSolicitada: ['', [Validators.required]],
      valorSolicitado: ['', [Validators.required]],
    });
    this.cancelacionForm = this.fb.group({
     motivoCancelacion: ['', [Validators.required, Validators.maxLength(250)]],
    });

    this.establecerBusquedaForm();
    
    this.initializeStoreData();
    this.suscribirseAStoreData();

    this.servicioDeMensajesService.datos$.subscribe((datos) => {
      this.datosDePermiso = datos;
      // Only handle motivo cancelacion from store, no hardcoded data
      if (this.datosDePermiso) {
        this.desistimientoQuery.selectMotivoCancelacion$ 
         .pipe(takeUntil(this.destroyNotificationSubject$))
      .subscribe(data => {
          this.cancelacionForm.patchValue({
      motivoCancelacion: data,
    });       
      });  
      }
    });
    this.servicioDeMensajesService.obtenerDatos()
      .pipe(takeUntil(this.destroyNotificationSubject$))
      .subscribe(data => {
        if (Array.isArray(data?.datos)) {
          this.cuerpoTablaCancelacion = data.datos as Cancelacion[];
          this.cancelacionForm.patchValue({
            motivoCancelacion: data.motivoCancelacion,
          });       
        } else {
          this.cuerpoTablaCancelacion = [];
        }
      });

      
      this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotificationSubject$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          if(this.esFormularioSoloLectura === true) {
            this.cancelacionForm.get('motivoCancelacion')?.disable();
          }
        })
      )
      .subscribe();
  }

  /**
   * Inicializa los datos del store con información del usuario si están vacíos.
   * Esto asegura que tengamos los datos necesarios para el payload.
   */
  private initializeStoreData(): void {
    this.desistimientoQuery.selectTramite$
      .pipe(takeUntil(this.destroyNotificationSubject$))
      .subscribe((storeData) => {
        // Si el RFC está vacío, podemos establecer un valor predeterminado o obtenerlo de otro lugar
        if (!storeData.rfc) {
          // Aquí podrías obtener el RFC de:
          // 1. Un servicio de autenticación
          // 2. Session storage
          // 3. Un servicio de usuario global
          // 4. O pedir al usuario que lo ingrese
          
          // Por ejemplo, podrías hacer:
          // const userRfc = this.authService.getCurrentUserRfc();
          // if (userRfc) {
          //   this.servicioDeMensajesService.actualizarEstadoFormulario({ rfc: userRfc });
          // }
          
          // this.servicioDeMensajesService.actualizarEstadoFormulario({ rfc: "AAL0409235E6" });
        }

        // Inicializar clave_entidad_federativa si está vacía
        if (!storeData.claveEntidadFederativa) {
          // Podrías obtener esto de:
          // 1. Ubicación del usuario
          // 2. Configuración del sistema
          // 3. Selección del usuario
          // 4. Servicio de geolocalización
          
          // Ejemplo:
          // const userState = this.locationService.getUserState();
          // if (userState) {
          //   this.servicioDeMensajesService.actualizarEstadoFormulario({ 
          //     claveEntidadFederativa: userState 
          //   });
          // }
        }

        // Inicializar idTipoTramite si está vacío o incorrecto
        if (!storeData.idTipoTramite || storeData.idTipoTramite !== 140105) {
          // Este valor generalmente es fijo para cada componente/trámite
          // pero podría venir de:
          // 1. Configuración del componente
          // 2. Parámetros de la ruta
          // 3. Configuración del sistema
          
          // Para este trámite específico, asegurar que sea 140105:
          this.servicioDeMensajesService.actualizarEstadoFormulario({ 
            idTipoTramite: 140105 
          });
        }
      });
  }

  /**
   * Suscribe a los valores del store y los mantiene actualizados en propiedades locales.
   * Similar al patrón usado en 80205 suscribirseAFields().
   */
  private suscribirseAStoreData(): void {
    this.desistimientoQuery.selectTramite$
      .pipe(
        takeUntil(this.destroyNotificationSubject$),
        map((state) => ({
          rfc: state.rfc,
          claveEntidadFederativa: state.claveEntidadFederativa,
          idTipoTramite: state.idTipoTramite,
          idSolicitud: state.idSolicitud,
          folioCancelar: state.folioCancelar,
        }))
      )
      .subscribe((storeValues) => {
        this.rfcSolicitante = storeValues.rfc || 'AAL0409235E6';
        this.claveEntidadFederativa = storeValues.claveEntidadFederativa || 'SIN';
        this.idTipoTramite = storeValues.idTipoTramite || 140105;
      });
  }

   /**
   * @description Actualiza las ventas totales en el store y recalcula el reporte.
   * @param evento - Evento del input para capturar el valor introducido.
   */
   motivoCancelacion(evento: Event): void {
    const VALUE = (evento.target as HTMLInputElement).value;
    this.servicioDeMensajesService.actualizarEstadoFormulario({ motivoCancelacion: VALUE }); 
  }


  /**
   * Muestra el formulario modal para buscar mercancías.
   * @return void
   * */
  showForm():void{
    
    if (this.modalInstances) {
      this.modalInstances.show();
    }
  }

   /**
   * Inicializa el formulario de búsqueda de trámites.
   * Contiene el campo `tramite` con validaciones de requerido y solo números.
   */
   public establecerBusquedaForm(): void {
    this.busquedaForm = this.fb.group({
      tramite: ['', [Validators.required,]]
    });
  }
  
  /**
   * Cierra el modal activo.
   *
   * Este método utiliza la referencia al botón de cierre del modal para cerrarlo
   * y resetea el estado de validación del formulario de mercancía.
   */
  cerrarModal(): void {
   
    if (this.closeModal) {
      this.closeModal.nativeElement.click();
    
    }

    if (this.modalInstances) {
      this.modalInstances.hide();
    }
   
    // Resetear el estado de loading cuando se cierra el modal
    this.isLoadingBusquedaPermiso = false;
  }

   /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de que la vista del componente se haya inicializado.
   * Inicializa el modal de modificación.
   */
   ngAfterViewInit(): void {
 
    if (this.modifyModal) {
      this.modalInstanceDos = new Modal(this.modifyModal.nativeElement);
    }

    if (this.modalBuscar) {
      this.modalInstances = new Modal(this.modalBuscar.nativeElement);
    }
  }

   /**
   * @descripcion
   * Abre el modal de modificación con los datos seleccionados.
   * @param disponiblesDatos - Los datos seleccionados para modificación.
   */
   abrirModificarModal(): void {
    const TRAMITEVALUE = this.busquedaForm.get('tramite')?.value;
 
    if (!TRAMITEVALUE || TRAMITEVALUE === '') {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "El Folio de Trámite es un dato requerido",
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return 
    }
    if(TRAMITEVALUE.length < 25){
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "El Folio de Trámite no puede ser menor de 25 carácteres",
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return 
    }
     if(TRAMITEVALUE.length > 25){
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "El Folio de Trámite no puede ser mayor de 25 carácteres",
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return 
    }
    if(this.modalInstanceDos) {
      this.modalInstanceDos.show();
    }
  
    }

  /**
   * Busca permisos para cancelación basado en el folio del trámite.
   * @method buscarPermisoCancelacion
   */
  buscarPermisoCancelacion(event?: Event): void {
 
    if (this.isLoadingBusquedaPermiso) {
      return;
    }

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Validar el formulario antes de proceder
    if (this.busquedaForm.invalid) {
      this.busquedaForm.markAllAsTouched();
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "El Folio de Trámite es un dato requerido",
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    const TRAMITE_VALUE = this.busquedaForm.get('tramite')?.value;

    // Validar longitud del folio
    if (TRAMITE_VALUE.length !== 25) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "El Folio de Trámite debe tener exactamente 25 caracteres",
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    
    this.servicioDeMensajesService.actualizarEstadoFormulario({ folioCancelar: TRAMITE_VALUE });

    // Validar que tengamos los datos necesarios del store
    if (!this.rfcSolicitante) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "No se encontraron los datos del solicitante. Intente recargar la página.",
        cerrar: false,
        tiempoDeEspera: 3000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    // Obtener el estado actual del store una sola vez usando take(1) para evitar subscription continua
    this.desistimientoQuery.selectTramite$
      .pipe(
        take(1), // Solo tomar el primer valor, no crear subscription continua
        map((storeState: DesistimientoDePermisoState) => ({
          id_solicitud: storeState.idSolicitud || this.idTipoTramite,
          rfc_solicitante: storeState.rfc || this.rfcSolicitante,
          clave_entidad_federativa: storeState.claveEntidadFederativa || this.claveEntidadFederativa,
          id_tipo_tramite: storeState.idTipoTramite || this.idTipoTramite,
          folio_cancelar: storeState.folioCancelar || TRAMITE_VALUE
        }))
      )
      .subscribe((PAYLOAD) => {
        this.ejecutarBusquedaPermiso(PAYLOAD);
      });
  }

  /**
   * Ejecuta la búsqueda del permiso con el payload proporcionado.
   * @param payload - Datos necesarios para la búsqueda del permiso
   */
  /**
   * Ejecuta la búsqueda del permiso con el payload proporcionado.
   * @param payload - Datos necesarios para la búsqueda del permiso
   */
  private ejecutarBusquedaPermiso(PAYLOAD: {
    id_solicitud: number;
    rfc_solicitante: string;
    clave_entidad_federativa: string;
    id_tipo_tramite: number;
    folio_cancelar: string;
  }): void {
    // Establecer loading state
    this.isLoadingBusquedaPermiso = true;

    this.servicioDeMensajesService.buscarPermisoCancelacion(PAYLOAD)
      .pipe(takeUntil(this.destroyNotificationSubject$))
      .subscribe({
            next: (response) => this.handleSearchResponse(response),
            error: (error) => this.handleSearchError(error)
          });
  }

  /**
   * Handles successful search response
   */
  private handleSearchResponse(response: { codigo: string; datos?: unknown; error?: string }): void {
    this.isLoadingBusquedaPermiso = false;
    
    // Always open the modal like 140104, regardless of API response
    if (this.modalInstanceDos) {
      this.modalInstanceDos.show();
    }
    
    if (response.codigo === '00' && response.datos) {
      this.processSuccessfulSearchData(response.datos);
    } else {
      this.showSearchErrorMessage(response.error);
    }
  }

  /**
   * Processes successful search data
   */
  private processSuccessfulSearchData(datos: unknown): void {
    this.datosDePermiso = true;
    
    const API_DATOS = this.mapApiResponseData(datos);

    // Only create data mapping if we have meaningful API response
    if (API_DATOS.numFolioTramite || API_DATOS.idResolucion || API_DATOS.regimen) {
      const MAPPED_DATA = this.createMappedCancelacionData(API_DATOS);
      
      this.cuerpoTablaCancelacion = [MAPPED_DATA];
      this.servicioDeMensajesService.actualizarDatosForma(this.cuerpoTablaCancelacion);
      this.hasApiSearchData = true;
      
      this.showSuccessMessage();
    } else {
      this.showEmptyDataMessage();
    }
  }

  /**
   * Maps API response data to typed interface
   */
  private mapApiResponseData(datos: unknown): {
    numFolioTramite?: string;
    tipoSolicitud?: string;
    regimen?: string;
    clasificacionRegimen?: string;
    condicionMercancia?: string;
    fraccion?: string;
    unidadMedidaUMT?: string;
    cantidadSolicitada?: string;
    valorSolicitado?: string;
    idResolucion?: string;
    numeroResolucion?: string;
    cantidadImportarExportar?: string;
    vigenciaResolucion?: string;
    valorAutorizado?: string;
    inicioResolucion?: string;
    cantidadImportarExportarSolicitada?: string;
    general?: string;
  } {
    return datos as unknown as {
      numFolioTramite?: string;
      tipoSolicitud?: string;
      regimen?: string;
      clasificacionRegimen?: string;
      condicionMercancia?: string;
      fraccion?: string;
      unidadMedidaUMT?: string;
      cantidadSolicitada?: string;
      valorSolicitado?: string;
      idResolucion?: string;
      numeroResolucion?: string;
      cantidadImportarExportar?: string;
      vigenciaResolucion?: string;
      valorAutorizado?: string;
      inicioResolucion?: string;
      cantidadImportarExportarSolicitada?: string;
      general?: string;
    };
  }

  /**
   * Creates mapped cancelacion data from API response
   */
  private createMappedCancelacionData(API_DATOS: {
    numFolioTramite?: string;
    tipoSolicitud?: string;
    regimen?: string;
    clasificacionRegimen?: string;
    condicionMercancia?: string;
    fraccion?: string;
    unidadMedidaUMT?: string;
    cantidadSolicitada?: string;
    valorSolicitado?: string;
    idResolucion?: string;
    numeroResolucion?: string;
    cantidadImportarExportar?: string;
    vigenciaResolucion?: string;
    valorAutorizado?: string;
    inicioResolucion?: string;
    cantidadImportarExportarSolicitada?: string;
    general?: string;
  }): Cancelacion {
    return {
      folioTramite: API_DATOS.numFolioTramite || '',
      tipoDeSolicitud: API_DATOS.tipoSolicitud || '',
      regimen: API_DATOS.regimen || '',
      cdr: API_DATOS.clasificacionRegimen || '',
      condicionDeLaMercancia: API_DATOS.condicionMercancia || '',
      fraccionArancelaria: API_DATOS.fraccion || '',
      umt: API_DATOS.unidadMedidaUMT || '',
      cantidad: API_DATOS.cantidadSolicitada || '',
      usd: API_DATOS.valorSolicitado || '',
      idResolucion: API_DATOS.idResolucion || '',
      numeroResolucion: API_DATOS.numeroResolucion || '',
      clasificacionRegimen: API_DATOS.clasificacionRegimen || '',
      // Additional fields needed for guardar payload
      cantidadImportarExportar: API_DATOS.cantidadImportarExportar || '',
      vigenciaResolucion: API_DATOS.vigenciaResolucion || '',
      valorAutorizado: API_DATOS.valorAutorizado || '',
      inicioResolucion: API_DATOS.inicioResolucion || '',
      cantidadImportarExportarSolicitada: API_DATOS.cantidadImportarExportarSolicitada || '',
      general: API_DATOS.general || '',
      valorSolicitado: API_DATOS.valorSolicitado || ''
    };
  }

  /**
   * Shows success message when permit is found
   */
  private showSuccessMessage(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.TOASTR,
      categoria: CategoriaMensaje.EXITO,
      modo: 'action',
      titulo: '',
      mensaje: 'Permiso encontrado exitosamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Shows message when API returns empty data
   */
  private showEmptyDataMessage(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: 'No se encontraron datos para el folio especificado. Puede continuar con el motivo de cancelación.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Shows error message when search fails
   */
  private showSearchErrorMessage(error?: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: error || 'No se encontró el permiso especificado. Puede continuar con el motivo de cancelación.',
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Handles search API errors
   */
  private handleSearchError(error: { status?: number; error?: { mensaje?: string }; message?: string }): void {
    this.isLoadingBusquedaPermiso = false;
    
    // Always open the modal even on API errors, like 140104
    if (this.modalInstanceDos) {
      this.modalInstanceDos.show();
    }
    
    const ERROR_MESSAGE = this.buildErrorMessage(error);

    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'action',
      titulo: '',
      mensaje: ERROR_MESSAGE,
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Builds appropriate error message based on error status
   */
  private buildErrorMessage(error: { status?: number; error?: { mensaje?: string }; message?: string }): string {
    let errorMessage = 'El Folio de Trámite que ingresó no pertenece a PEXIM. Puede continuar con el motivo de cancelación.';
    
    if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Error en los datos enviados. Verifique el formato del folio y continúe con el motivo de cancelación.';
          break;
        case 401:
          errorMessage = 'No tiene autorización para realizar esta consulta. Puede continuar con el motivo de cancelación.';
          break;
        case 404:
          errorMessage = 'El Folio de Trámite que ingresó no fue encontrado en el sistema. Puede continuar con el motivo de cancelación.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Puede continuar con el motivo de cancelación.';
          break;
        default:
          if (error.error?.mensaje) {
            errorMessage = error.error.mensaje + '. Puede continuar con el motivo de cancelación.';
          } else if (error.message) {
            errorMessage = error.message + '. Puede continuar con el motivo de cancelación.';
          }
      }
    }
    
    return errorMessage;
  }

  

   /**
   * @descripcion
   * Cierra el modal de modificación.
   */
   cerrarModificarModal(): void {
    if (this.modalInstances) {
      this.modalInstances.hide();
      this.busquedaForm.reset();
    }
    if (this.modalInstanceDos) {
    
      this.modalInstanceDos.hide();
    }
  }


  /**
   * Método que se ejecuta al destruir el componente.
   * Limpia los datos de permiso en el servicio de mensajes
   * para evitar posibles fugas de memoria o actualizaciones 
   * innecesarias cuando el componente ya no está activo.
   */
  ngOnDestroy(): void {
    this.servicioDeMensajesService.establecerDatosDePermiso(false);
    this.destroyNotificationSubject$.next();
    this.destroyNotificationSubject$.complete();
  }

  /**
   * Método que se ejecuta al realizar una búsqueda.
   * Envía un mensaje al servicio para indicar que se ha iniciado una búsqueda.
   * 
   * @param event Evento que desencadena la búsqueda.
   */

  public busqueda(_event: Event): void {
    this.servicioDeMensajesService.enviarMensaje(true);
  }

   /**
   * Obtiene los datos del subfabricante por eliminar.
   * @method cueroEliminar
   * @param {SubfabricanteDireccionModelo[]} event - Evento con los datos del subfabricante por eliminar.
   */
   cuerpoTablaSelectionEliminar(
    event: Cancelacion[]
  ): void {
    this.cuerpoTablaSeleccionado = event;
  }

  
    /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
    cerrarTabla(): void {
   
      this.esRowSelected = false;
    }

     /**
   * Elimina las empresas nacionales seleccionadas del grid.
   * @method eliminarEmpresasNacionales
   * @return {void}
   */

  cerrarEliminarDos(evento:boolean): void {
    this.esEliminarDos=false;
    if(evento===true){
      this.cuerpoTablaCancelacion = [];
      this.servicioDeMensajesService.actualizarDatosForma(this.cuerpoTablaCancelacion as Cancelacion[]);
      this.cuerpoTablaSeleccionado=[];
     }
    
  }
   /**
   * Método que se ejecuta al eliminar un registro de la tabla.
   * Limpia el contenido de la tabla de cancelación y actualiza los datos 
   * en el servicio de mensajes.
   * 
   * @param event Evento que desencadena la eliminación.
   */
   eliminarRegistro(): void {
    if(this.cuerpoTablaSeleccionado.length === 0){
      this.nuevaNotificacionUno = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'action',
        titulo: '',
        mensaje: "Seleccione un registro a eliminar.",
        cerrar: false,
        tiempoDeEspera: 200,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };  
    this.esRowSelected= true;
    }
      else{
        this.nuevaNotificacionUno= {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ALERTA,
          modo: 'modal',
          titulo: '',
          mensaje: '¿Esta seguro que desea eliminar el registro marcado?',
          cerrar: false,
          tiempoDeEspera: 200,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        };
        this.esEliminarDos = true;
      }
  
   
  }


}
