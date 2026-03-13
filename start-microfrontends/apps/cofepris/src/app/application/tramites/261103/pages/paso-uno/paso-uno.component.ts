import {
  Catalogo,
  ConfiguracionColumna,
} from '@libs/shared/data-access-user/src';
import { AfterViewInit, Component, Input, OnDestroy, OnInit,ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CONFIGURACIONCOLUMNA } from '../../enum/solicitud-permiso.enum';
import { DatosProcedureQuery } from '../../estados/tramites261103.query'
import { DatosProcedureState } from '../../estados/tramites261103.store';
import { DatosProcedureStore } from '../../estados/tramites261103.store';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos-new/pago-de-derechos.component';

import { Subject } from 'rxjs';
import { TramiteAsociados } from '../../../../shared/models/tramite-asociados.model';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

import { TramitesAsociadosSeccionComponent } from '../../../../shared/components/tramites-asociados-seccion/tramites-asociados-seccion.component';

import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos/pago-de-derechos.component';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';


/**
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit, OnDestroy,AfterViewInit {
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
 @Input()
  formularioDeshabilitado: boolean = false;
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
    @ViewChild('contenedorDeDatosSolicitudComponent') contenedorDeDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;
     @ViewChild(PagoDeDerechosContenedoraComponent)
        pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;
    
        @ViewChild('tercerosRelacionadosVistaComponent')
        tercerosRelacionadosVistaComponent!: TercerosRelacionadosVistaComponent;
      @Input() confirmarSinPagoDeDerechos: number = 0;

    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
    public esDatosRespuesta: boolean = false;
      /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
      esFormularioSoloLectura: boolean = false; 
      private componentesInicializados: boolean = false;

         idProcedimiento: number = 261103;
         /** Referencia al componente de trámites asociados */
         @ViewChild('TramitesAsociadoComponent')
         tramitesAsociadoComponent!: TramitesAsociadosSeccionComponent;
  /**
   /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias.
   */
  constructor(
    private formBuilder: FormBuilder,
    private modificacionPermisoImportacionMedicamentosService: ModificacionPermisoImportacionMedicamentosService,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaQuery: ConsultaioQuery,
  ) {
    //no hacer nada
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

   

    this.modificacionPermisoImportacionMedicamentosService.inicializaPagoDeDerechosDatosCatalogos();
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
      this.getRegistrarDatos();
      this.esDatosRespuesta = true;
    }
  }
 /**
   * Angular lifecycle hook que se ejecuta después de que la vista del componente ha sido inicializada.
   * Asegura que todas las referencias ViewChild estén disponibles.
   */
  ngAfterViewInit(): void {
    // Agregar un pequeño delay para asegurar que todos los componentes hijos estén completamente inicializados
    setTimeout(() => {
      this.componentesInicializados = true;
    }, 0);
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
        [PagoDeDerechosComponent.fechaLimValidator()]
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
      this.banco = this.modificacionPermisoImportacionMedicamentosService.banco;
      this.crearformularioPagoDerechos();
    }
    this.indice = i;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }

      /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
      guardarDatosFormulario(): void {
        this.modificacionPermisoImportacionMedicamentosService
          .getRegistroPasoUnoData().pipe(
            takeUntil(this.notificadorDestruccion$)
          )
          .subscribe((resp) => {                
            if(resp){
            this.esDatosRespuesta = true;
            this.modificacionPermisoImportacionMedicamentosService.actualizarEstadoFormulario(resp);
            } 
         });
        }


        getRegistrarDatos(): void {
          this.modificacionPermisoImportacionMedicamentosService
            .getRegistrarDatos()
            .pipe(takeUntil(this.notificadorDestruccion$))
            .subscribe((resp) => {
              if (resp) {
                this.esDatosRespuesta = true;
                this.modificacionPermisoImportacionMedicamentosService.actualizarEstadoFormulario(resp);
              }
            });
        }
// Add these methods to your PasoUnoComponent for 261103
// ...existing code...
// ...existing code...
validarPasoUno(): boolean {
  if (!this.componentesInicializados) {
    return false;
  }

// ...existing code...
  if (!this.contenedorDeDatosSolicitudComponent || !this.tercerosRelacionadosVistaComponent) {
    return false;
  }

  try {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent.validarContenedor();
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent.validarContenedor();

  

    return ESTABVALIDO && ESTERCEROSVALIDO;
  } catch (error) {
    return false;
  }
}
/**
 * Valida todos los pasos del proceso.
 * @returns 
 */

validarTodosLosPasos(): boolean {
  if (!this.componentesInicializados) {
    return false;
  }

  try {
    const ESTABVALIDO = this.contenedorDeDatosSolicitudComponent?.validarContenedor() ?? false;
    const ESTERCEROSVALIDO = this.tercerosRelacionadosVistaComponent?.validarContenedor() ?? false;
    const PAGOVALIDO = this.pagoDeDerechosContenedoraComponent?.validarContenedor() ?? false;

    return ESTABVALIDO && ESTERCEROSVALIDO && PAGOVALIDO;
  } catch (error) {
    console.error('Error during validarTodosLosPasos:', error);
    return false;
  }
}

}