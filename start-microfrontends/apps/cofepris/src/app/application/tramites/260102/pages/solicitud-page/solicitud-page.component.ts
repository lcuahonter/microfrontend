import {
  AccionBoton,
  AlertComponent,
  DatosPasos,
  ListaPasosWizard,
  Notificacion,
  NotificacionesComponent,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  RegistroSolicitudService,
  WizardComponent,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ERROR_FORMA_ALERT, MENSAJE_DE_VALIDACION, PASOS } from '../../constantes/consumo-personal.enum';
import { Tramite260102State, Tramite260102Store } from '../../estados/stores/tramite260102Store.store';
import { BtnContinuarComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { GuardarAdapter_260102 } from '../../adapters/guardar-payload.adapter';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite260102Query } from '../../estados/queries/tramite260102Query.query';

/**
 * @component SolicitudPageComponent
 * @description Componente principal de la página de solicitud. Controla la navegación
 * entre pasos de un wizard, muestra el título correspondiente y permite avanzar o retroceder
 * según la interacción del usuario. Utiliza un componente wizard para encapsular la lógica de pasos.
 */
@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [
    CommonModule,
    WizardComponent,
    PasoUnoComponent,
    PasoDosComponent,
    PasoTresComponent,
    BtnContinuarComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent,
    NotificacionesComponent,
    AlertComponent
  ],
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent implements OnInit {
  /**
   * @property {string | null} tituloMensaje
   * Título principal mostrado en la parte superior según el paso actual.
   */
  tituloMensaje: string | null =
    'Permiso sanitario de importación de productos de muestra o consumo personal (para donación, investigación científica, pruebas de laboratorio y exhibición)';

  /**
   * @property {ListaPasosWizard[]} pasos
   * Lista de pasos del wizard obtenidos desde una constante externa.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {number} indice
   * Índice actual del paso seleccionado (empieza en 1).
   */
  indice: number = 1;

  /**
   * @property {WizardComponent} wizardComponent
   * Referencia al componente Wizard para controlar navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {DatosPasos} datosPasos
   * Objeto de configuración utilizado por el componente wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

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

  storeData!: Tramite260102State;

  isSaltar: boolean = false;

  @ViewChild(PasoUnoComponent) pasoUnoComponent!: PasoUnoComponent;

  public mostrarAlerta: boolean = false;

  public seleccionarFilaNotificacion!: Notificacion;

  esFormaValido: boolean = false;

  public requiresPaymentData: boolean = false;
  
  public confirmarSinPagoDeDerechos: number = 0;

  public formErrorAlert = ERROR_FORMA_ALERT;

  constructor(private Tramite260102Query: Tramite260102Query,private registroSolicitudService: RegistroSolicitudService, private tramite260102Store:Tramite260102Store, private toastrService: ToastrService,
  ) {

  }
  ngOnInit(): void {
    this.Tramite260102Query.selectTramiteState$.subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * @method seleccionaTab
   * @description Cambia el índice actual del wizard manualmente.
   * @param {number} i - Índice del paso al que se desea cambiar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * @method getValorIndice
   * @description Controla la navegación del wizard según el botón presionado (anterior o continuar).
   * También actualiza el título correspondiente al paso actual.
   *
   * @param {AccionBoton} e - Objeto que contiene el valor y la acción del botón presionado.
   */
  getValorIndice(e: AccionBoton): void {
    if (e.accion === 'cont') {
      let isValid = true;
        if (this.indice === 1 && this.pasoUnoComponent) {
        isValid = this.pasoUnoComponent.validarPasoUno();
      }
      if(!this.pasoUnoComponent.pagoDerechosComponent.validarContenedor() && !this.requiresPaymentData){
          this.mostrarAlerta=true;
          this.confirmarSinPagoDeDerechos = 2;
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'alert',
            categoria: 'danger',
            modo: 'action',
            titulo: '',
              mensaje: '¿Está seguro que su solicitud no requiere los datos del Pago de derechos?.',
            cerrar: true,
            tiempoDeEspera: 2000,
            txtBtnAceptar: 'SI',
            txtBtnCancelar: 'NO',
            alineacionBtonoCerrar:'flex-row-reverse'
          }
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
          return;
        }
      if (!isValid) {
        this.formErrorAlert = MENSAJE_DE_VALIDACION;
        this.esFormaValido = true;
        this.datosPasos.indice = this.indice;
        return;
      }
      this.esFormaValido = false;
      this.postGuardarDatos(e);
    }else{
      this.indice = e.valor;
      this.datosPasos.indice = this.indice;
      this.wizardComponent.atras();
    }
  }
  postGuardarDatos(e: AccionBoton): void {
        const PAYLOAD = GuardarAdapter_260102.toFormPayload(this.storeData);
          let shouldNavigate = false;
          this.registroSolicitudService.postGuardarDatos('260102', PAYLOAD).subscribe(response => {
            shouldNavigate = response.codigo === '00';
            if (!shouldNavigate) {
              const ERROR_MESSAGE = response.error || 'Error desconocido en la solicitud';
              this.formErrorAlert = SolicitudPageComponent.generarAlertaDeError(ERROR_MESSAGE);
              this.esFormaValido = false;
              this.indice = 1;
              this.datosPasos.indice = 1;
              this.wizardComponent.indiceActual = 1;
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              return;
            }
            if(shouldNavigate) {
              if(esValidObject(response) && esValidObject(response.datos)) {
                const DATOS = response.datos as { id_solicitud?: number };
                if(getValidDatos(DATOS.id_solicitud)) {
                  this.tramite260102Store.setIdSolicitud(DATOS.id_solicitud ?? 0);
                } else {
                  this.tramite260102Store.setIdSolicitud(0);
                }
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

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }
    /**
   * @method saltar
   * @description
   * Método para saltar directamente al paso de firma en el wizard.
   * Actualiza los índices correspondientes y ejecuta la transición
   * forward en el componente wizard.
   */
  saltar(): void {
    this.indice = 3;
    this.datosPasos.indice = 3;
    this.wizardComponent.siguiente();
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

  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  cerrarModal(value:boolean): void {
    if(value){
      this.mostrarAlerta = false;
      this.requiresPaymentData = true;
      const IS_VALID = this.pasoUnoComponent?.validarPasoUno() ?? true;
      if (IS_VALID) {
      const EVENT: AccionBoton = { accion: 'cont', valor: this.indice + 1 };
      this.postGuardarDatos(EVENT);
      this.esFormaValido = false; 
      } else {
        this.formErrorAlert = MENSAJE_DE_VALIDACION;
        this.esFormaValido = true;
        this.indice = 1;
        this.datosPasos.indice = 1;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      }
    } else {
      this.mostrarAlerta = false;
      this.confirmarSinPagoDeDerechos = 4;
      this.indice = 1;
      this.datosPasos.indice = 1;
    }
  }

  /**
   * @method obtenerNombreDelTítulo
   * @description Devuelve el título a mostrar según el número de paso.
   *
   * @param {number} valor - Índice del paso actual.
   * @returns {string} - Título correspondiente.
   */
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
}
