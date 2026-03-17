import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { AVISO, AccionBoton, DatosPasos, ListaPasosWizard, PASOS_REGISTRO, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { MENSAJE_DE_VALIDACION, MENSAJE_DE_VALIDACION_PAGO_DERECHOS, TITULO_MENSAJE } from '../../enum/mercancias.enum';
import { GuardarAdapter_261103 } from '../../adapters/guardar-payload.adapter';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';

import { DatosProcedureState, DatosProcedureStore } from '../../estados/tramites261103.store';
import { ToastrService } from 'ngx-toastr';

import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { WizardComponent } from '@ng-mf/data-access-user';

import { DatosProcedureQuery } from '../../estados/tramites261103.query';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
})
export class DatosComponent implements OnInit {
  /**
   * @property {ListaPasosWizard[]} pasos
   */
  pasos: ListaPasosWizard[] = PASOS_REGISTRO;
  /**
   * @property {ListaPasosWizard[]} pantallasPasos
   */
  pantallasPasos: ListaPasosWizard[] = PASOS_REGISTRO;
  //  @property {string} AVISO_
  TEXTOS: string = AVISO.Aviso;
//  @property {string} infoAlert
  infoAlert = 'alert-info text-center';
//  @property {string} errorAlert
  infoError = 'alert-danger text-center';
//  @property {string} tituloMensaje
  tituloMensaje: string = TITULO_MENSAJE;
//  @property {number} indice
  indice: number = 1;
//  @property {DatosPasos} datosPasos
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  //  @property {EventEmitter<void>} cargarArchivosEvento
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;
  //  @property {PasoUnoComponent} pasoUnoComponent
  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;
  //  @property {string} idTipoTRamite
  idTipoTRamite: string = '261103';
  //  @property {number | null} idSolicitudState
  idSolicitudState: number | null = 0;
  //  @property {DatosProcedureState} solicitudState
   solicitudState!: DatosProcedureState;
  //  @property {boolean} esFormaValido
  esFormaValido: boolean = false;
  //  @property {string} formErrorAlert
  formErrorAlert!: string;
  //  @property {boolean} mostrarAlerta
  mostrarAlerta: boolean = false;
  //  @property {any} seleccionarFilaNotificacion
  seleccionarFilaNotificacion: any;
  //  @property {boolean} requiresPaymentData
  requiresPaymentData: boolean = false;
  //  @property {number} confirmarSinPagoDeDerechos
  confirmarSinPagoDeDerechos: number = 0;
  //  @property {EventEmitter<void>} cargarArchivosEvento
  cargarArchivosEvento = new EventEmitter<void>();
  //  @property {boolean} seccionCargarDocumentos
  seccionCargarDocumentos: boolean = true;
  //  @property {boolean} activarBotonCargaArchivos
  activarBotonCargaArchivos: boolean = false;
  //  @property {boolean} cargaEnProgreso
  cargaEnProgreso: boolean = true;
  //  @property {AccionBoton} accionDelBoton
  accionDelBoton!: AccionBoton;
  //  @property {boolean} isSaltar
  isSaltar: boolean = false;
  //  @property {number} confirmarSinPagoDeDerechos
  constructor(
    private toastrService: ToastrService,
    public registroSolicitudService: RegistroSolicitudService,
    private datosProcedureQuery: DatosProcedureQuery,
private tramiteStore: DatosProcedureStore,    
  ) {}

  ngOnInit(): void {
 this.datosProcedureQuery.selectTramite261103$.subscribe(state => {
    this.solicitudState = state;
  });
  }
  /**
   * @method onClickCargaArchivos
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
  }
  /**
   * @method cargaRealizada
   * @param cargaRealizada 
   */
  cargaRealizada(cargaRealizada: boolean): void {
    this.seccionCargarDocumentos = !cargaRealizada;
  }
  /**
   * @method manejaEventoCargaDocumentos
   * @param carga 
   */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
  }
  /**
   * @method onCargaEnProgreso
   * @param carga 
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }
  /**
   * @method seleccionaTab
   * @param i 
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.datosPasos.indice = i;
  }
  /**
   * @method getValorIndice
   * @param e 
   */
  getValorIndice(e: AccionBoton): void {
    this.accionDelBoton = e;
    if (e.accion === 'cont') {
      let isValid = true;

      // Validate only the current step
      switch (this.indice) {
        case 1:
          isValid = this.pasoUnoComponent?.validarPasoUno?.() ?? true;
          break;
        case 2:
          isValid = this.pasoUnoComponent?.contenedorDeDatosSolicitudComponent?.validarContenedor?.() ?? true;
          break;
        case 3:
          isValid = this.pasoUnoComponent?.tercerosRelacionadosVistaComponent?.validarContenedor?.() ?? true;
          break;
        case 4:
          isValid = this.pasoUnoComponent?.pagoDeDerechosContenedoraComponent?.validarContenedor?.() ?? true;
          break;
        case 5:
          // Add validation for the 5th tab if needed
          isValid = true;
          break;
        default:
          isValid = true;
      }

      if (!isValid) {

        this.formErrorAlert = MENSAJE_DE_VALIDACION;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }

      // Prepare payload and save
            const state = this.datosProcedureQuery.getValue();

      const PAYLOAD = GuardarAdapter_261103.toFormPayload(state);
      this.registroSolicitudService.postGuardarDatos('261103', PAYLOAD).subscribe(response => {
        const shouldNavigate = response.codigo === '00';
        if (!shouldNavigate) {
          const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
          this.formErrorAlert = DatosComponent.generarAlertaDeError(ERROR_MESSAGE);
          this.esFormaValido = true;
          this.indice = 1;
          this.datosPasos.indice = 1;
          this.wizardComponent.indiceActual = 1;
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
        if (esValidObject(response) && esValidObject(response.datos)) {
          this.esFormaValido = false;
          const DATOS = response.datos as { id_solicitud?: number };
          const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
          this.idSolicitudState = ID_SOLICITUD;
          // Update your store if needed
          this.tramiteStore.update({ idSolicitud: ID_SOLICITUD });
        }
        let indiceActualizado = e.valor;
        if (e.accion === 'cont') {
          indiceActualizado = e.valor;
        }
        this.toastrService.success(response.mensaje);
        if (e.accion === 'cont') {
  this.wizardComponent.siguiente();
} else {
  this.wizardComponent.atras();
}
this.indice = this.wizardComponent.indiceActual + 1;
this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
      });
    } else {
      // Go back
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }
  /**   * @method cerrarModal
   * @param value 
   */ 
  cerrarModal(value: boolean): void {
    if (value) {
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
      if (this.pasoUnoComponent?.validarPasoUno?.()) {
        this.guardarDatosApi(this.accionDelBoton);
      } else {
        this.formErrorAlert = MENSAJE_DE_VALIDACION;
        this.esFormaValido = true;
      }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
    }
  }
  /**
   * @method guardarDatosApi
   * @param e 
   */
  guardarDatosApi(e: AccionBoton): void {
        const state = this.datosProcedureQuery.getValue(); // <-- always fresh

         const PAYLOAD = GuardarAdapter_261103.toFormPayload(state);

    this.registroSolicitudService.postGuardarDatos('261103', PAYLOAD).subscribe(response => {

      const shouldNavigate = response.codigo === '00';
      if (!shouldNavigate) {
        const ERROR_MESSAGE = response.mensaje || 'Error desconocido en la solicitud';
        this.formErrorAlert = DatosComponent.generarAlertaDeError(ERROR_MESSAGE);
        this.esFormaValido = true;
        this.indice = 1;
        this.datosPasos.indice = 1;
        this.wizardComponent.indiceActual = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
        return;
      }
      if (esValidObject(response) && esValidObject(response.datos)) {
        this.esFormaValido = false;
        const DATOS = response.datos as { id_solicitud?: number };
        const ID_SOLICITUD = getValidDatos(DATOS.id_solicitud) ? (DATOS.id_solicitud ?? 0) : 0;
        this.idSolicitudState = ID_SOLICITUD;
         this.tramiteStore.setIdSolicitud(ID_SOLICITUD);
        // Update your store if needed
      }
      let indiceActualizado = e.valor;
      if (e.accion === 'cont') {
        indiceActualizado = e.valor;
      }
      this.toastrService.success(response.mensaje);
     
      if (e.accion === 'cont') {
  this.wizardComponent.siguiente();

} else {
  this.wizardComponent.atras();
}
this.indice = this.wizardComponent.indiceActual + 1;
this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
    });
  }
  /**   * @method generarAlertaDeError
   * @param mensajes 
   * @returns {string}
   */
  public static generarAlertaDeError(mensajes: string): string {
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
  
  /**
   * @method siguiente
   */
  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
  /**   * @method anterior
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
  /**   * @method obtenerNombreDelTítulo
   * @param valor 
   * @returns 
   */
  obtenerNombreDelTítulo(valor: number): string {
    switch (valor) {
      case 1:
        return TITULO_MENSAJE;
      case 2:
        return this.pasos[1].titulo;
      case 3:
        return this.pasos[2].titulo;
      default:
        return TITULO_MENSAJE;
    }
  }
  /**   * @method onBlancoObligatoria
   * @param enBlanco 
   */
  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }
  /**   * @method saltar
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
  }
}