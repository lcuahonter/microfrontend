import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, ListaPasosWizard, Notificacion, PASOS, RegistroSolicitudService, esValidObject, getValidDatos } from '@libs/shared/data-access-user/src';
import { Tramite260516State, Tramite260516Store } from '../../estado/tramite260516Store.store';
import { DatosDomicilioLegalService } from '../../../../shared/services/datos-domicilio-legal.service';
import { DatosDomicilioLegalState } from '../../../../shared/estados/stores/datos-domicilio-legal.store';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { GuardarAdapter_260516 } from '../../adapters/guardar-payload.adapter';
import { MENSAJE_DE_VALIDACION } from '../../constantes/datos-solicitud.enum';
import { PagoBancoService } from '../../../../shared/services/pago-banco.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { SolicitudPagoBancoState } from '../../../../shared/estados/stores/pago-banco.store';
import { Subject } from 'rxjs';
import { Tramite260516Query } from '../../estado/tramite260516Query.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { takeUntil } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

/**
 * Representa la acción y el valor asociados con un botón.
 */
interface AccionBoton {
  accion: string;
  valor: number;
}

/**
 * Componente principal para la gestión de plaguicidas.
 * Contiene la lógica y la estructura del asistente de plaguicidas.
 */
@Component({
  selector: 'app-plaguicidas',
  templateUrl: './plaguicidas.component.html',
})
export class PlaguicidasComponent implements OnInit, OnDestroy {
    @ViewChild(PasoUnoComponent) solicitante!: PasoUnoComponent;

esFormaValido: boolean = false;
public formErrorAlert = ERROR_FORMA_ALERT;
  /**
   * Lista de pasos del asistente.
   * Se obtiene de una constante definida en otro archivo.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Indice actual del paso en el asistente.
   * Se inicializa en 1.
   */
  indice: number = 1;

  /**
   * Título del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Título del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  storeData!: Tramite260516State;

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;

  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos está activa.
   * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
   */
  seccionCargarDocumentos: boolean = true;

  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  public requiresPaymentData: boolean = false;

  public confirmarSinPagoDeDerechos: number = 0;

  public mostrarAlerta: boolean = false;

  public seleccionarFilaNotificacion!: Notificacion;

  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  isSaltar: boolean = false;

  /**
   * Notificador para destruir observables al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  constructor(private datosDomicilioLegalService: DatosDomicilioLegalService,private pagoBancoService:PagoBancoService, private Tramite260516Query:Tramite260516Query,
  private GuardarAdapter260516: GuardarAdapter_260516,private registroSolicitudService: RegistroSolicitudService, private tramite260516Store:Tramite260516Store, private toastrService: ToastrService,
  ) {

}

 ngOnInit(): void {
    this.Tramite260516Query.selectTramiteState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * Maneja la acción del botón en el asistente.
   * Cambia el paso actual según la acción del botón.
   *
   * @param e - Objeto que contiene la acción y el valor del botón.
   */

  getValorIndice(e: AccionBoton): void {
      if (e.accion === 'cont') {
      let isValid = true;

      if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }

      if (!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validOnButtonClick() && this.requiresPaymentData) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }

      if (!this.requiresPaymentData) {
        if (!this.pasoUnoComponent.pagoDeDerechosComponent.validOnButtonClick()) {
          this.mostrarAlerta = true;
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
            mensaje: 'Debe capturar los datos de pago de derechos para continuar.',
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'SI',
            txtBtnCancelar: 'NO',
            alineacionBtonoCerrar: 'flex-row-reverse'
          }
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        } else if (this.pasoUnoComponent.pagoDeDerechosComponent.validOnButtonClick() && !this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validOnButtonClick()) {
          this.confirmarSinPagoDeDerechos = 2;
        } else if (this.pasoUnoComponent.pagoDeDerechosComponent.validOnButtonClick() && this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validOnButtonClick()) {
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
      const PAYLOAD = this.GuardarAdapter260516.toFormPayload();
      let shouldNavigate = false;
      this.registroSolicitudService.postGuardarDatos('260516', PAYLOAD).subscribe(response => {
        shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
          this.formErrorAlert = PlaguicidasComponent.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          this.seccionCargarDocumentos = false;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        if (shouldNavigate) {
          if (esValidObject(response) && esValidObject(response.datos)) {
            this.esFormaValido = false;
            const DATOS = response.datos as { id_solicitud?: number };
            const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
                  this.tramite260516Store.setIdSolicitud(ID_SOLICITUD);
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
            this.seccionCargarDocumentos = (this.indice === 2);
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
    } 
  else {
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }

    }
  

  /**
   * Obtiene el estado de los datos del domicilio legal desde el servicio `datosDomicilioLegalService`.
   * 
   * @returns {DatosDomicilioLegalState} El estado actual de los datos del domicilio legal.
   * 
   * @remarks
   * Este método utiliza un observable para suscribirse al estado proporcionado por el servicio.
   * Sin embargo, debido a la naturaleza asíncrona de los observables, el valor retornado puede no reflejar
   * el estado actualizado en el momento de la ejecución. Es importante manejar este comportamiento
   * adecuadamente si se requiere el estado más reciente.
   */
  getDatosDomicilioLegalState(): DatosDomicilioLegalState {
    let PAYLOAD= {} as DatosDomicilioLegalState
    this.datosDomicilioLegalService.getDatosDomicilioLegalState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
         PAYLOAD = state;
      });
      return PAYLOAD;
  }

 
  /**
   * Obtiene el estado de la solicitud de pago en el banco.
   * 
   * Este método utiliza el servicio `pagoBancoService` para suscribirse al estado
   * de la solicitud de pago en el banco y devuelve un objeto del tipo `SolicitudPagoBancoState`.
   * 
   * @returns {SolicitudPagoBancoState} El estado de la solicitud de pago en el banco.
   */
  getSolicitudPagoBancoState():SolicitudPagoBancoState{
  let PAYLOAD= {} as SolicitudPagoBancoState
    this.pagoBancoService.getSolicitudPagoBancoState()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state) => {
         PAYLOAD = state;
      });
      return PAYLOAD;
  }

  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }

  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }

  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = cargaRealizada ? false : true;
  }

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
      if (!this.pasoUnoComponent.contenedorDeDatosSolicitudComponent?.validOnButtonClick() && this.requiresPaymentData) {
        this.confirmarSinPagoDeDerechos = 2;
      } else {
        this.confirmarSinPagoDeDerechos = 3;
      }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }

  static obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
      case 2:
        return 'Anexar requisitos';
      case 3:
        return 'Firmar solicitud';
      default:
        return 'Permiso sanitario de importación de medicamentos con registro sanitario';
    }
  }

  static generarAlertaDeError(mensajes: string): string {
    const ALERTA = `
      <div class="row">
        <div class="col-md-12 justify-content-center text-center">
          <div class="row">
            <div class="col-md-12">
              <p>Corrija los siguientes errores:</p>
              <ol>
                <li>${mensajes}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `;
    return ALERTA;
  }

  /**
   * Lógica de limpieza para desuscribirse de los observables cuando el componente es destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
