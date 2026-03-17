import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { PERMISO_MAQUILA } from '../../modelos/modificación-del-permiso-sanitario-de-importación-de-insumo.model';

import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { DatosDomicilioLegalState, DatosDomicilioLegalStore } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos, ListaPasosWizard, Notificacion, RegistroSolicitudService, WizardComponent, esValidObject, getValidDatos, } from '@libs/shared/data-access-user/src';
import { DomicilioState, DomicilioStore } from '../../../../shared/estados/stores/domicilio.store';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS } from '../../constantes/certificados.enum';
import { Subject, takeUntil } from 'rxjs';
import { Tramite260904State, Tramite260904Store } from '../../estados/tramite260904.store';
import { DatosDelSolicituteSeccionQuery } from '../../../../shared/estados/queries/datos-del-solicitute-seccion.query';
import { GuardarAdapter_260904 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite260904Query } from '../../estados/tramite260904.query';

import { DatosDomicilioLegalQuery } from '../../../../shared/estados/queries/datos-domicilio-legal.query';
import { DomicilioQuery } from '../../../../shared/estados/queries/domicilio.query';
import { ToastrService } from 'ngx-toastr';

/**
 * Representa una acción que se puede ejecutar mediante un botón.
 * 
 * @property accion - El nombre o tipo de la acción a realizar (por ejemplo, "sumar", "restar").
 * @property valor - El valor asociado a la acción, usado como entrada para ejecutar la acción.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * @descripción
 * Este componente se encarga de gestionar la funcionalidad del asistente (wizard) "Permiso Maquila".
 * Proporciona la lista de pasos del asistente y administra el índice del paso actual.
 */
 
@Component({
  selector: 'app-mod-permiso-sanitario-importacion-260904',
  templateUrl: './mod-permiso-sanitario-importacion-260904.component.html',
})

export class ModPermisoSanitarioImportacion260904Component implements OnInit {
  storeData!: Tramite260904State;
  /**
   * Referencia al componente del asistente (wizard) para controlar sus acciones.
   */
  @ViewChild('wizard') wizardComponent!: WizardComponent;
  /**
     * Esta variable se utiliza para almacenar la lista de pasos.
     */
  pantallasPasos: ListaPasosWizard[] = PERMISO_MAQUILA;

  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice :number = 1;

  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  @ViewChild('pasoUnoComponent') pasoUnoComponent!: PasoUnoComponent;

  public formErrorAlert!: string;

  esFormaValido: boolean = false;

  isSaltar: boolean = false;

  public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

  public mostrarAlerta: boolean = false;

  public seleccionarFilaNotificacion!: Notificacion;

  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  datosDelSolicitud!: DatosDelSolicituteSeccionState;

  destroyNotifier$: Subject<void> = new Subject();

  manifestoState!: DatosDomicilioLegalState;
  
  domicilioState!: DomicilioState;

  /**
   * @propiedades
   * - `nroPasos`: Número total de pasos basado en la longitud de `pantallasPasos`.
   * - `indice`: Índice actual del paso.
   * - `txtBtnAnt`: Texto que se muestra en el botón para retroceder al paso anterior.
   * - `txtBtnSig`: Texto que se muestra en el botón para avanzar al siguiente paso.
   *
   * @descripción
   * Objeto que contiene la configuración y estado de los pasos en el flujo de la aplicación.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  constructor(
    private Tramite260904Query: Tramite260904Query,
    private Tramite260904Store: Tramite260904Store,
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService,
    private datosDelSolicituteSeccionStore: DatosDelSolicituteSeccionStateStore,
    private datosDelSolicituteSeccionQuery: DatosDelSolicituteSeccionQuery,
    private manifestoQuery: DatosDomicilioLegalQuery,
    private manifestoStore: DatosDomicilioLegalStore,
    private domicilioQuery: DomicilioQuery,
    private domicilioStore: DomicilioStore,
  ) {}

  ngOnInit(): void {
    this.Tramite260904Query.selectTramite260904$.pipe().subscribe((data) => {
      this.storeData = data;
    });

    this.datosDelSolicituteSeccionQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((data) => {
      this.datosDelSolicitud = data;
    });
    
    this.manifestoQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((state) => {
      this.manifestoState = state;
    });
    this.domicilioQuery.selectSolicitud$.pipe(
      takeUntil(this.destroyNotifier$))
    .subscribe((state) => {
        this.domicilioState = state;
    });

  }

  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
  * Método para manejar el evento de carga de documentos.
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  /**
   * Método para manejar el evento de carga de documentos.
   * Actualiza el estado de la sección de carga de documentos.
   *  cargaRealizada - Indica si la carga de documentos se realizó correctamente.
   * {void} No retorna ningún valor.
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  /**
   * @descripción
   * Método para actualizar el índice del paso actual basado en la acción y el valor proporcionados.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor asociado.
   * 
   * @detalles
   * - Si el valor está entre 1 y 4 (exclusivo), actualiza el índice.
   * - Si la acción es 'cont', avanza al siguiente paso.
   * - Si la acción no es 'cont', retrocede al paso anterior.
   */
  getValorIndice(e: AccionBoton): void {
    
    if (e.accion === 'cont') {
      let isValid = true;
  
      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }
  
      if(!this.pasoUnoComponent.validarContenedor() && this.requiresPaymentData) {
        this.confirmarSinPagoDeDerechos = 2;
      }else {
        this.confirmarSinPagoDeDerechos = 3;
      }
  
      if(!this.requiresPaymentData) {
        if(!this.pasoUnoComponent.pagoDeDerechosComponent.validarContenedor()){
          this.mostrarAlerta=true;
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: MENSAJE_DE_VALIDACION_PAGO_DERECHOS,
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'SI',
            txtBtnCancelar: 'NO',
            alineacionBtonoCerrar:'flex-row-reverse'
          }
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        } else if(this.pasoUnoComponent.pagoDeDerechosComponent.validarContenedor() && !this.pasoUnoComponent?.validarContenedor()) {
          this.confirmarSinPagoDeDerechos = 2;
        } else if(this.pasoUnoComponent.pagoDeDerechosComponent.validarContenedor() && this.pasoUnoComponent?.validarContenedor() && !this.pasoUnoComponent.tercerosRelacionadosVistaComponent.validarContenedor()) {
          this.confirmarSinPagoDeDerechos = 3;
        }
      }
  
      if (!isValid) {
        this.formErrorAlert = this.MENSAJE_DE_ERROR;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
  
      const PAYLOAD = GuardarAdapter_260904.toFormPayload(this.storeData, this.datosDelSolicitud, this.manifestoState, this.domicilioState );
      let shouldNavigate = false;
      this.registroSolicitudService.postGuardarDatos('260904', PAYLOAD).subscribe(response => {
        shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
          this.formErrorAlert = ModPermisoSanitarioImportacion260904Component.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        if(shouldNavigate) {
          if(esValidObject(response) && esValidObject(response.datos)) {
            this.esFormaValido = false;
            const DATOS = response.datos as { id_solicitud?: number };
            const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
            this.Tramite260904Store.setIdSolicitud(ID_SOLICITUD);
          }
          // Calcular el nuevo índice basado en la acción
          let indiceActualizado = e.valor;
          if (e.accion === 'cont') {
            indiceActualizado = e.valor;
          }
          this.toastrService.success(response.mensaje);
          if (indiceActualizado > 0 && indiceActualizado < 5) {
            this.indice = indiceActualizado;
            this.datosPasos.indice = indiceActualizado;
            if (e.accion === 'cont') {
              this.wizardComponent.siguiente();
            } else {
              this.wizardComponent.atras();
            }
          }
        } else {
          this.toastrService.error(response.mensaje);
        }
      });
    }else{
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }

  public static generarAlertaDeError(mensajes:string): string {
    const ALERTA = `
      <div class="d-flex justify-content-center text-center">
        <div class="col-md-12 p-3  border-danger  text-danger rounded">
          <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

          <div class="d-flex justify-content-start mb-1">
            <span class="me-2">1.</span>
            <span class="flex-grow-1 text-center">${mensajes}</span>
          </div>  
        </div>
      </div>
      `;
      return ALERTA;
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  siguiente(): void {
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  cerrarModal(value:boolean): void {
    if(value){
    this.mostrarAlerta = false;
    this.requiresPaymentData = true;
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }
}
