/**
 * Componente que representa el primer paso del proceso de modificación de permiso de salida del territorio.
 * Este componente gestiona la configuración de trámites asociados, el formulario de pago de derechos y la navegación entre pestañas.
 */
import { Catalogo, ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, map } from 'rxjs';
import { CONFIGURACIONCOLUMNA } from '../../../../shared/constantes/shared2614/tramite-asociados.enum';

import { Destinatario } from '../../../../shared/constantes/shared2614/destinatario.enum';
import { Solicitud2614State } from '../../../../estados/tramites/tramite2614.store';
import { SolicitudModificacionPermisoInternacionService } from '../../../../shared/services/shared2614/solicitud-modificacion-permiso-internacion.service';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';
import { takeUntil } from 'rxjs';

import { DatosDeLaSolicitudContenedoraComponent } from '../../components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud-contenedora.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
/**
 * Decorador que define el componente Angular para el primer paso del proceso.
 * Incluye el selector del componente y la ruta de su plantilla HTML.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
/**
 * Clase que representa el componente Angular para el primer paso del proceso.
 * Implementa las interfaces OnInit y OnDestroy para gestionar el ciclo de vida del componente.
 */
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * datosContainer property to provide unified access to child components and forms
   */
  get datosContainer(): {
    datosFormComponent: { formulario: FormGroup | null },
    tercerosContainer: { component: { terceros: Destinatario[] } },
    establecimientoContainer: { component: { establishmentForm: FormGroup | null } },
    mercanciaContainer: { component: { mercanciaTabla: unknown[] } },
    pagosContainer: { component: { pagosForm: FormGroup | null } }
  } {
    return {
      datosFormComponent: {
        formulario: this.datosDeLaSolicitudContenedoraComponent?.datosDeLaSolicitudComponent?.formulario || null
      },
      tercerosContainer: {
        component: {
          terceros: Array.isArray(this.tercerosRelacionadosContenedoraComponent?.tercerosRelacionadosComponent?.destinatarioDatos)
            ? (this.tercerosRelacionadosContenedoraComponent.tercerosRelacionadosComponent.destinatarioDatos as unknown as Destinatario[])
            : Array.isArray(this.estadoSolicitudPermiso?.destinatarioDatos)
              ? (this.estadoSolicitudPermiso.destinatarioDatos as unknown as Destinatario[])
              : []
        }
      },
      establecimientoContainer: {
        component: {
          establishmentForm: null as FormGroup | null
        }
      },
      mercanciaContainer: {
        component: {
          mercanciaTabla: [] as unknown[]
        }
      },
      pagosContainer: {
        component: {
          pagosForm: this.formularioPagoDerechos || null
        }
      }
    };
  }

  /**
   * Referencia al componente DatosDeLaSolicitudContenedoraComponent.
   * Se utiliza para acceder a las funcionalidades del componente de solicitud.
   * @type {DatosDeLaSolicitudContenedoraComponent}
   */
  @ViewChild(DatosDeLaSolicitudContenedoraComponent, { static: false })
  datosDeLaSolicitudContenedoraComponent!: DatosDeLaSolicitudContenedoraComponent;

  /**
   * Referencia al componente TercerosRelacionadosContenedoraComponent.
   * Se utiliza para acceder a las funcionalidades del componente de solicitud.
   * @type {TercerosRelacionadosContenedoraComponent}
   */
  @ViewChild(TercerosRelacionadosContenedoraComponent, { static: false })
  tercerosRelacionadosContenedoraComponent!: TercerosRelacionadosContenedoraComponent;
  /**
   * Índice de la pestaña seleccionada.
   */
  indice: number = 1;

  /**
   * Configuración de las columnas de la tabla de trámites asociados.
   */
  configuracionTabla: ConfiguracionColumna<TramiteAsociados>[] = CONFIGURACIONCOLUMNA;

  /**
   * Lista de trámites asociados obtenidos.
   */
  tramiteAsociados!: TramiteAsociados[];

  /**
   * Subject utilizado para manejar la destrucción de suscripciones.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * Formulario para el pago de derechos.
   */
  formularioPagoDerechos!: FormGroup;

  /**
   * Lista de bancos disponibles.
   */
  banco!: Catalogo[];

  /**
   * Estado actual de la solicitud de permiso.
   */
  estadoSolicitudPermiso!: Solicitud2614State;
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta cargado desde el store.
   * Contiene datos como modo de solo lectura y valores del formulario.
   */
  public consultaState!: ConsultaioState;
      /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
      esFormularioSoloLectura: boolean = false;
  /**
   * Constructor del componente.
   * Param formBuilder Constructor para formularios reactivos.
   * Param solicitudPermisoService Servicio para manejar datos relacionados con la solicitud de permiso.
   * Param tramite2614Store Store para gestionar el estado del trámite.
   * Param tramite2614Query Query para obtener datos del estado del trámite.
   */
  constructor(
    private formBuilder: FormBuilder,
    private solicitudPermisoService: SolicitudModificacionPermisoInternacionService,
    private tramite2614Store: Tramite2614Store,
    private tramite2614Query: Tramite2614Query,
    private consultaQuery: ConsultaioQuery
  ) {
    this.inicializarDatosSolicitud();
      this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.notificadorDestruccion$),
      map((seccionState: { readonly: boolean })=>{
        this.esFormularioSoloLectura = seccionState.readonly;
      })
    )
    .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene el estado de la solicitud y los trámites asociados, e inicializa los datos de los catálogos.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.notificadorDestruccion$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
    
    // Restaurar datos al cargar el componente
    this.restoreTabData();
  }

  /**
   * Restaura los datos de los stores a los componentes cuando se inicializa o cambia de pestaña
   */
  private restoreTabData(): void {
    // Esperar un tick para asegurar que los componentes están inicializados
    setTimeout(() => {
      try {
        if (this.estadoSolicitudPermiso) {
          // Restaurar datos de terceros si existen en el store
          if (this.estadoSolicitudPermiso.destinatarioDatos && this.estadoSolicitudPermiso.destinatarioDatos.length > 0) {
            if (this.tercerosRelacionadosContenedoraComponent?.tercerosRelacionadosComponent) {
              this.tercerosRelacionadosContenedoraComponent.tercerosRelacionadosComponent.tableData = 
                ([...this.estadoSolicitudPermiso.destinatarioDatos] as unknown[])
                  .map(item => PasoUnoComponent.mapDestinatairoItem(item)) as Destinatario[];
      
            }
          }

          // Restaurar datos del formulario de pago si existen
          if (this.formularioPagoDerechos && this.estadoSolicitudPermiso) {
            const PAYMENT_FIELDS = ['claveDeReferencia', 'cadenaPagoDependencia', 'bancoClave', 'llaveDePago', 'fecPago', 'impPago'];
            const STATE_AS_RECORD = this.estadoSolicitudPermiso as unknown as Record<string, unknown>;
            const HAS_PAYMENT_DATA = PAYMENT_FIELDS.some(field => STATE_AS_RECORD[field]);
            
            if (HAS_PAYMENT_DATA) {
              PAYMENT_FIELDS.forEach(field => {
                const CONTROL = this.formularioPagoDerechos.get(field);
                if (CONTROL && STATE_AS_RECORD[field]) {
                  CONTROL.setValue(STATE_AS_RECORD[field]);
                }
              });
      
            }
          }
        }
      } catch (error) {
        console.warn('Error al restaurar datos de pestañas:', error);
      }
    }, 100);
  }
    /**
  * Obtiene los datos de la solicitud desde un servicio y actualiza el estado del formulario.  
  * Si la respuesta es válida, activa el indicador de datos cargados.
  */
  guardarDatosFormulario(): void {
       this.solicitudPermisoService
      .getDatosDeLaSolicitud().pipe(
        takeUntil(this.notificadorDestruccion$)
      )
      .subscribe((resp) => {
        if(resp){
        this.esDatosRespuesta = true;
        this.solicitudPermisoService.actualizarEstadoFormulario(resp);
        }else {
          this.esDatosRespuesta = false;
        }
      });
  }
  /**
   * Cambia la pestaña seleccionada y, si es la pestaña de pago, inicializa el formulario de pago.
   * Guarda el estado actual antes de cambiar de pestaña para preservar los datos.
   * Param i Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    // Guardar datos de la pestaña actual antes de cambiar
    this.saveCurrentTabData();
    
    if (i === 4) {
      this.banco = this.solicitudPermisoService.banco;
      this.crearformularioPagoDerechos();
    }
    this.indice = i;
    
    // Restaurar datos de la nueva pestaña después de cambiar
    setTimeout(() => this.restoreTabData(), 50);
  }

  /**
   * Guarda los datos de la pestaña actual en el store correspondiente
   */
  private saveCurrentTabData(): void {
    try {
      // Guardar datos del formulario principal si existe
      if (this.datosDeLaSolicitudContenedoraComponent?.datosDeLaSolicitudComponent?.formulario) {
        const FORM_DATA = this.datosDeLaSolicitudContenedoraComponent.datosDeLaSolicitudComponent.formulario.getRawValue();
        this.tramite2614Store.actualizarEstado(FORM_DATA);

      }

      // Guardar datos de terceros relacionados si existen
      if (this.tercerosRelacionadosContenedoraComponent?.tercerosRelacionadosComponent?.tableData) {
        const TERCEROS_DATA = this.tercerosRelacionadosContenedoraComponent.tercerosRelacionadosComponent.tableData;
        if (TERCEROS_DATA && TERCEROS_DATA.length > 0) {
          this.tramite2614Store.actualizarEstado({ destinatarioDatos: TERCEROS_DATA });
  
        }
      }

      // Guardar datos de pago si existen
      if (this.formularioPagoDerechos && this.formularioPagoDerechos.valid) {
        const PAGO_DATA = this.formularioPagoDerechos.getRawValue();
        this.tramite2614Store.actualizarEstado(PAGO_DATA);

      }

    } catch (error) {
      console.warn('Error al guardar datos de la pestaña:', error);
    }
  }

  /**
   * Inicializa los datos de la solicitud, incluyendo el estado actual y los trámites asociados.
   */
  inicializarDatosSolicitud(): void {
    this.tramite2614Query.selectSolicitud$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSolicitudPermiso: Solicitud2614State) => {
        this.estadoSolicitudPermiso = estadoSolicitudPermiso;
        // Restaurar datos cuando el estado se actualiza
        setTimeout(() => this.restoreTabData(), 100);
      });

    this.solicitudPermisoService
      .obtenerTramitesAsociados()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe(tramiteAsociados => {
        this.tramiteAsociados = tramiteAsociados;
      });

    this.solicitudPermisoService.inicializaPagoDeDerechosDatosCatalogos();
  }

  /**
   * Crea el formulario reactivo para el pago de derechos.
   */
  crearformularioPagoDerechos(): void {
    this.formularioPagoDerechos = this.formBuilder.group({
      claveDeReferencia: new FormControl(
        this.estadoSolicitudPermiso.claveDeReferencia,
        Validators.required
      ),
      cadenaPagoDependencia: new FormControl(
        this.estadoSolicitudPermiso.cadenaPagoDependencia,
        Validators.required
      ),
      bancoClave: new FormControl(
        this.estadoSolicitudPermiso.bancoClave,
        Validators.required
      ),
      llaveDePago: new FormControl(
        this.estadoSolicitudPermiso.llaveDePago,
        Validators.required
      ),
      fecPago: new FormControl(
        this.estadoSolicitudPermiso.fecPago,
        Validators.required
      ),
      impPago: new FormControl(
        this.estadoSolicitudPermiso.impPago,
        [Validators.required, Validators.min(0)]
      ),
    });
  }

  /**
   * Actualiza el estado del store con los valores del formulario.
   * Param $event Evento que contiene el formulario y el campo a actualizar.
   */
  setValoresStore($event: {
    formularioPagoDerechos: FormGroup;
    campo: string;
  }): void {
    const VALOR = $event.formularioPagoDerechos.get($event.campo)?.value;
    this.tramite2614Store.actualizarEstado({ [$event.campo]: VALOR });
  }

  /**
   * Maps a destinatario item from store data to the expected table format
   */
private static mapDestinatairoItem(item: unknown): Destinatario {
  const DATA = item as Record<string, unknown>;
  const GET_STRING = (KEY: string): string => {
    const VALUE = DATA[KEY];
    return typeof VALUE === 'string' ? VALUE : '';
  };
  const GET_NUMBER = (KEY: string): number => {
    const VALUE = DATA[KEY];
    if (typeof VALUE === 'number') { return VALUE; }
    if (typeof VALUE === 'string' && VALUE.trim() !== '' && !isNaN(Number(VALUE))) { return Number(VALUE); }
    return 0;
  };
  return {
    id: GET_NUMBER('id'),
    nombre: GET_STRING('nombre') || GET_STRING('denominacion'),
    rfc: GET_STRING('rfc'),
    curp: GET_STRING('curp'),
    telefono: GET_STRING('telefono'),
    correoElectronico: GET_STRING('correoElectronico') || GET_STRING('email'),
    calle: GET_STRING('calle'),
    numeroExterior: GET_STRING('numeroExterior'),
    numeroInterior: GET_STRING('numeroInterior'),
    pais: GET_STRING('pais') || 'México',
    colonia: GET_STRING('colonia'),
    municipio: GET_STRING('municipio') || GET_STRING('delegacionMunicipio'),
    localidad: GET_STRING('localidad'),
    estado: GET_STRING('entidadFederativa') || GET_STRING('estado'),
    estado2: GET_STRING('estado2'),
    codigo: GET_STRING('codigo') || GET_STRING('codigoPostal') || GET_STRING('cp') || '',
    primerApellido: GET_STRING('primerApellido') || GET_STRING('apellidoPaterno'),
    segundoApellido: GET_STRING('segundoApellido') || GET_STRING('apellidoMaterno'),
    denominacion: GET_STRING('denominacion') || GET_STRING('nombre'),
    domicilio: GET_STRING('domicilio'),
    codigopostal: GET_STRING('codigoPostal') || GET_STRING('cp'),
    lada: GET_NUMBER('lada'),
    tipoPersona: GET_STRING('tipoPersona'),
  };
}
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}