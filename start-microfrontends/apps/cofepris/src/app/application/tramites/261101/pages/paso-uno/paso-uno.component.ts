import {
  Catalogo,
  ConfiguracionColumna,
} from '@libs/shared/data-access-user/src';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CONFIGURACIONCOLUMNA } from '../../enum/solicitud-permiso.enum';
import { CatalogoServices } from '@libs/shared/data-access-user/src';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261101.query'
import { DatosProcedureState } from '../../../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261101.store';
import { DatosSolicitudService } from '../../../261101/services/datoSolicitude.service';
import { ManifiestosComponent } from '../../../../shared/components/manifiestos-declaraciones/manifiestos-declaraciones.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { RepresentanteLegalComponent } from '../../../../shared/components/representante-legal/representante-legal.component';
import { SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject } from 'rxjs';
import { TercerosRelacionadosFabricanteComponent } from '../../components/terceros-relacionados-fabricante/terceros-relacionados-fabricante.component';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
import { ID_PROCEDIMIENTO } from '../../enum/mercancias.enum';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';


/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit,OnDestroy {
   /**
     * Holds the current radio value for tipoTramite, used for child component binding.
     */
    public tipoTramite: string = '';

   @ViewChild('pagoDeDerechos') pagoDeDerechos!: PagoDeDerechosContenedoraComponent;
 
   /**
       * @property {number} confirmarSinPagoDeDerechos
       * @description
       * Indica si se ha confirmado la continuación sin pago de derechos.
       */
    @Input() confirmarSinPagoDeDerechos: number = 0;
   
    
  /**
   * El índice de la pestaña actualmente seleccionada.
   */
  indice: number = 1;

  /**
   * Formulario reactivo para capturar los datos del pago de derechos.
   */
  formularioPagoDerechos!: FormGroup;

  /**
   * Estado actual de la solicitud de permiso.
   */
  estadoSolicitudPermiso!: DatosProcedureState;

  /**
   * Lista de trámites asociados que se mostrarán en la tabla.
   */
  tramiteAsociados!: TramiteAsociados[];


    /**
     * Configuración de las columnas de la tabla para mostrar los trámites asociados.
     */
    configuracionTabla: ConfiguracionColumna<TramiteAsociados>[] =
      CONFIGURACIONCOLUMNA;
  
  /**
   * Lista de bancos disponibles para seleccionar.
   */
  banco!: Catalogo[];
  /**
  * @property {string} idProcedimiento
  * @description
  * Identificador del procedimiento.
  */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Observable utilizado para limpiar las suscripciones al destruir el componente.
   * Esto ayuda a evitar fugas de memoria.
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

      /** 
   * Estado de consulta que almacena la información del estado actual del proceso.
   * Este estado se actualiza a través de un observable y se utiliza para determinar
   * el flujo de la lógica del componente.
   */
      public consultaState!:ConsultaioState;
        /**
     * Referencia al componente SolicitanteComponent para acceder a sus métodos y propiedades.
     */
    @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

    @ViewChild(PagoDeDerechosContenedoraComponent)
       pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
    
  
    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
    public esDatosRespuesta: boolean = false;
      /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

    /** Datos de bancos obtenidos desde el catálogo */
  banco_data: Catalogo[] = [];
  
  // @ViewChild(DatosDelSolicitudModificacionComponent) datosSolicitudComponent!: DatosDelSolicitudModificacionComponent;
  
     DatosDelSolicitudDatos: any;
  
     @ViewChild(ManifiestosComponent) manifiestosComponent!: ManifiestosComponent;
  
     @ViewChild(RepresentanteLegalComponent) representanteLegalComponent!: RepresentanteLegalComponent;
  
  /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias.
   */
  constructor(
    private formBuilder: FormBuilder,
    private datosSolicitudService: DatosSolicitudService,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaQuery: ConsultaioQuery,
    private catalogoService: CatalogoServices
  ) { 
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
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Configura las suscripciones necesarias y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.query.selectProrroga$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSolicitudPermiso: DatosProcedureState) => {
        this.estadoSolicitudPermiso = estadoSolicitudPermiso;
      });

    this.datosSolicitudService
      .obtenerTramitesAsociados()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((tramiteAsociados: TramiteAsociados[]) => {
        this.tramiteAsociados = tramiteAsociados;
      });

    this.datosSolicitudService.inicializaPagoDeDerechosDatosCatalogos();
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
    /* Carga los datos de los catálogos necesarios */
    this.catalogoService.bancosCatalogo(String(this.idProcedimiento)).subscribe(response => {
      this.banco_data = (response.datos?.map((item: any) => {
        return {
          id: item.clave,
          descripcion: item.descripcion
        };
      })) || [];
    });
  }

  /**
   * Crea el formulario reactivo para capturar los datos del pago de derechos.
   * Algunos campos, como `claveDeReferencia`, `cadenaPagoDependencia` y `impPago`,
   * están deshabilitados porque no deben ser editados por el usuario.
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
   * Establece valores en el store según el campo y el método proporcionados.
   * $event Objeto que contiene el formulario, el campo y el nombre del método.
   */
  setValoresStore($event: {
    formularioPagoDerechos: FormGroup;
    campo: string;
  }): void {
    const VALOR = $event.formularioPagoDerechos.get($event.campo)?.value;
    this.store.establecerDatos({[$event.campo]: VALOR});
  }
  /**
   * Selecciona una pestaña estableciendo su índice.
   * i El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    if (i === 4) {
      this.banco = this.datosSolicitudService.banco;
      this.crearformularioPagoDerechos();
    }
    this.indice = i;
  }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
    guardarDatosFormulario(): void {
      this.datosSolicitudService
        .getRegistroPasoUnoData().pipe(
          takeUntil(this.notificadorDestruccion$)
        )
        .subscribe((resp) => {                
          if(resp){
          this.esDatosRespuesta = true;
          this.datosSolicitudService.actualizarEstadoFormulario(resp);
          } 
       });
      }

       validarPasoUno():boolean{
       
// const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
// const ESTERCEROS_VALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor() ?? false;
// return (DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && ESTERCEROS_VALIDO &&REPRESENTANTE_LEGAL_VALIDO ) ? true : false;
return ( MANIFIESTOS_VALIDO &&REPRESENTANTE_LEGAL_VALIDO ) ? true : false;

  }

  validarContenedor(): boolean {
    // const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
    const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
    const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
    // return (
    //   DATOS_SOLICITUD_VALIDO &&
    //   MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO
    // ) ? true : false;
    return (
      MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO
    ) ? true : false;
  }

   /**
   * Valida todos los pasos del formulario.
   *
   * Invoca los métodos de validación de los componentes hijos:
   * - ContenedorDeDatosSolicitudComponent
   * - TercerosRelacionadosVistaComponent
   * - PagoDeDerechosContenedoraComponent
   *
   * @returns {boolean}
   * - `true` si todos los componentes son válidos.
   * - `false` si alguno no es válido o no está disponible.
   */
    validarTodosLosPasos(): boolean {
      // const DATOS_SOLICITUD_VALIDO = this.datosSolicitudComponent?.formularioSolicitudValidacion() ?? false;
      const MANIFIESTOS_VALIDO = this.manifiestosComponent?.validarClickDeBoton() ?? false;
      const REPRESENTANTE_LEGAL_VALIDO = this.representanteLegalComponent?.validarClickDeBoton() ?? false;
      // const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
      const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;
      // return (ESTERCEROSVALIDO && PAGOVALIDO && DATOS_SOLICITUD_VALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO )? true : false;
            return ( PAGOVALIDO && MANIFIESTOS_VALIDO && REPRESENTANTE_LEGAL_VALIDO )? true : false;

    }

     /**
           * @method datasolicituActualizar
           * Actualiza el estado del formulario de datos de la solicitud en el store.
           *
           * @param {DatosSolicitudFormState} event - Nuevo estado del formulario de datos de la solicitud.
           */
          datasolicituActualizar(event: DatosSolicitudFormState): void {
            // this.store.updateDatosSolicitudFormState(event);
          }

      /**
   * Método que se ejecuta al destruir el componente.
   * Notifica a los observables suscritos que deben finalizar mediante el `destroyNotifier$`.
   * Esto asegura que no haya fugas de memoria al eliminar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}
