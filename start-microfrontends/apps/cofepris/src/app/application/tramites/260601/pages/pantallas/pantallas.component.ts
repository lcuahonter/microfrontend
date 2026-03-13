import { AVISO_PRIVACIDAD, ERROR_FORMA_ALERT, MENSAJE_DE_VALIDACION, MSG_REGISTRO_EXITOSO } from '../../constantes/aviso-enum';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';

import {
  AlertComponent,
  BtnContinuarComponent,
  DatosPasos,
  JSONResponse,
  ListaPasosWizard,
  Notificacion,
  PASOS,
  PasoCargaDocumentoComponent,
  PasoFirmaComponent,
  RegistroSolicitudService,
  WizardComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@ng-mf/data-access-user';
import { AvisoSanitarioState, Tramite260601Store } from '../../../../estados/tramites/tramite260601.store';
import { CommonModule } from '@angular/common';
import { DatosComponent } from '../datos/datos.component';
import { GuardarAdapter_260601 } from '../../adapters/guardar-payload.adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Tramite260601Query } from '../../../../estados/queries/tramite260601.query';
import { Service260601Service } from '../../services/service260601.service';
import { take } from 'rxjs';

/**
 * Interfaz que representa el botón de acción.
 */
interface AccionBoton {
  /**
   * La acción a realizar.
   */
  accion: string;

  /**
   * El valor asociado con la acción.
   */
  valor: number;
}

/**
 * Componente para la página de registro de solicitud.
 */
@Component({
  templateUrl: './pantallas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WizardComponent,
    BtnContinuarComponent,
    DatosComponent,
    AlertComponent,
    PasoCargaDocumentoComponent,
    PasoFirmaComponent
  ],
  styles: ``,
})
export class PantallasComponent implements OnInit {
  /**
   * Lista de pasos del wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente WizardComponent.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   *
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = AVISO_PRIVACIDAD;

  /**
   * Datos de los pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

    /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario actual es válido. Se utiliza para mostrar alertas cuando faltan campos por capturar.
   * Cuando es `true`, se muestra un mensaje de error indicando que hay campos obligatorios sin completar.
   */
  esFormaValido: boolean = false;

  /**
   * @property {DatosComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo DatosComponent que contiene los formularios del primer paso del trámite.
   * Se utiliza para acceder a sus métodos de validación y a la información capturada por el usuario.
   */
  @ViewChild(DatosComponent) pasoUnoComponent!: DatosComponent;
  /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   * Utiliza la constante ERROR_FORMA_ALERT definida en los archivos de constantes del módulo.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

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

  storeData!: AvisoSanitarioState;

  MENSAJE_DE_ERROR: string = MENSAJE_DE_VALIDACION;

  isSaltar: boolean = false;

  folioTemporal: string | number = '';

  public seleccionarFilaNotificacion!: Notificacion;

  constructor(private tramite260601Query: Tramite260601Query,
    public registroSolicitudService: RegistroSolicitudService,
    private tramiteStore: Tramite260601Store,
    private toastrService: ToastrService,
    private service260601: Service260601Service
  ){

  }
  ngOnInit(): void {
    this.tramite260601Query.selectSeccionState$.pipe().subscribe((data) => {
      this.storeData = data;
    });
  }

  /**
   * Selecciona la pestaña especificada.
   *
   * @param i - El índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  onBlancoObligatoria(enBlanco: boolean): void {
    this.isSaltar = enBlanco;
  }

  /**
   * Obtiene el valor del índice y realiza la acción correspondiente.
   *
   * @param e - El botón de acción con el valor y la acción.
   */
  getValorIndice(e: AccionBoton): void {
      this.esFormaValido = false;
  
      // Paso 1 y acción continuar
      if (this.indice === 1 && e.accion === 'cont') {
        this.datosPasos.indice = 1;
  
        const ISVALID = this.validarTodosFormulariosPasoUno();
        
        if (!ISVALID) {
          this.esFormaValido = true;
          return;
        }
        this.obtenerDatosDelStore();
      }
      // Navegación normal
      else if (e.valor > 0 && e.valor <= this.pasos.length) {
        this.pasoNavegarPor(e);
      }
    }

    guardar(data: AvisoSanitarioState): Promise<JSONResponse> {
    const PAYLOAD = GuardarAdapter_260601.toFormPayload(data);

    return new Promise((resolve, reject) => {
      this.registroSolicitudService.postGuardarDatos('260601', PAYLOAD).subscribe(response => {
        const API_RESPONSE = doDeepCopy(response);
        if (esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if (getValidDatos(API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud)) {
            this.folioTemporal = API_RESPONSE.datos.idSolicitud || API_RESPONSE.datos.id_solicitud;
            this.tramiteStore.setIdSolicitud((API_RESPONSE.datos.id_solicitud || API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.tramiteStore.setIdSolicitud(0);
          }
        } else {
        this.toastrService.error(response.mensaje);
        }
      }, error => {
        reject(error);
      });
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

  private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarPasoUno();    
    if (!ISFORM_VALID_TOUCHED) {
      
      return false;
    }
    return true;
  }

  pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
        if (e.valor > 0 && e.valor < 5) {
          this.seleccionarFilaNotificacion = {
            tipoNotificacion: 'banner',
            categoria: 'success',
            modo: 'action',
            titulo: '',
            mensaje: MSG_REGISTRO_EXITOSO(String(this.folioTemporal)),
            cerrar: true,
            txtBtnAceptar: '',
            txtBtnCancelar: '',
          };

        }
      } else {
        this.wizardComponent.atras();
      }
    }
  }

  obtenerDatosDelStore(): void {
    this.service260601.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
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
    // Aqui se hara la validacion de los documentos cargdados
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
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
}

export { PASOS };
