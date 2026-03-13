/**
 * @component CertificadoComponent
 * @descripcion
 * Componente responsable de manejar el flujo de pasos para el trámite de certificado zoosanitario para importación.
 * Permite la navegación entre los pasos del wizard, controla el índice actual, y gestiona la validación de las secciones.
 * Además, expone los textos y títulos relevantes para la interfaz y utiliza el componente Wizard para la navegación.
 *
 * @import { Component, ViewChild } from '@angular/core';
 * @import { WizardComponent } from '@ng-mf/data-access-user';
 * @import { DatosPasos } from '@ng-mf/data-access-user';
 * @import { PASOS } from '../../constantes/peru-certificado.module';
 */
import { Component, ViewChild } from '@angular/core';
import { DatosPasos,JSONResponse, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Subject, take, takeUntil } from 'rxjs';
import { AccionBoton } from '../../models/peru-certificado.model';
import { ERROR_FORMA_ALERT } from '@ng-mf/data-access-user';

import { PASOS } from '../../constantes/peru-certificado.model';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { Tramite110221Query } from '../../estados/tramite110221.query';

import { Tramite110221State, Tramite110221Store } from '../../estados/tramite110221.store';
import { WizardComponent } from '@ng-mf/data-access-user';

import { ToastrService } from 'ngx-toastr';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';

/**
 * @component CertificadoComponent
 * @description
 * Componente responsable de manejar el flujo de pasos para el trámite de certificado zoosanitario para importación.
 * Permite la navegación entre los pasos del wizard, controla el índice actual, y gestiona la validación de las secciones.
 * Además, expone los textos y títulos relevantes para la interfaz y utiliza el componente Wizard para la navegación.
 *
 * @import { Component, ViewChild } from '@angular/core';
 * @import { WizardComponent } from '@ng-mf/data-access-user';
 * @import { DatosPasos } from '@ng-mf/data-access-user';
 * @import { PASOS } from '../../constantes/peru-certificado.module';
 */
@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrl: './certificado.component.scss',
})
export class CertificadoComponent {
  esFormaValido: boolean = false;
  /**
   * Array de pasos del wizard.
   * @type {Array<ListaPasoWizard>}
   */
  pasos = PASOS;

  /**
   * El título del mensaje mostrado en la vista.
   * @type {string | null}
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   * @type {WizardComponent}
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

    /**
 * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
 * const isValid = this.pasoUnoComponent.validateForms();
 * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
 */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;


  /**
   * El índice del paso actual.
   * @type {number}
   */
  indice: number = 1;

  /**
   * Datos de los pasos del wizard, incluyendo textos de botones y número de pasos.
   * @type {DatosPasos}
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  destroyNotifier$: Subject<void> = new Subject();
    /**
 * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
 */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Estado actual de la solicitud, obtenido del store.
   * @type {Tramite110221State}
   */
  solicitudState!: Tramite110221State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;
  /**
 * Indica si el formulario de estado es válido.
 * Se utiliza para mostrar mensajes de error relacionados con la selección de estado.
 * Si es true, se muestra el mensaje de error correspondiente en la interfaz.
 */
  esFormaEstadoValido: boolean = false;
  /**
 * Mensaje de error relacionado con la selección de estado.
 * Se muestra cuando el usuario no ha seleccionado un estado válido para la planta o domicilio fiscal.
 */
  formErrorEstadoAlert: string = '';

  /**
   * Inyecta los servicios necesarios y suscribe a la validación de la forma para actualizar el estado de la sección.
   * @param seccionStore Servicio para manejar el estado de la sección.
   * @param tramiteQuery Query para consultar el estado del trámite.
   */
  constructor(private tramiteStore: Tramite110221Store, 
      private certificadoService: ValidarInicialmenteCertificadoService,
      private tramiteQuery: Tramite110221Query,
        private tramite110221Store: Tramite110221Store,
            private toastr: ToastrService
        
    ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });

  }

  /**
   * Maneja la acción del botón y determina la navegación (siguiente o anterior) en el wizard.
   * @param {AccionBoton} e - Objeto de acción que contiene la acción y el valor a manejar.
   */

getValorIndice(e: AccionBoton): void {
  this.esFormaValido = false;
  // Normalice ambos valores para poder compararlos.
  const ESTADO = (localStorage.getItem('estado') || '').trim().toLowerCase();
  const CATALOGO = (this.solicitudState?.entidadFederativaSeleccion?.descripcion || '').trim().toLowerCase();

  if (this.indice === 1 && e.accion === 'cont') {
    this.datosPasos.indice = 1;
    const ISVALID = this.validarTodosFormulariosPasoUno();
    if (!ISVALID) {
      this.esFormaValido = true;
      return;
    }
    this.esFormaEstadoValido = false;
    if (ESTADO !== CATALOGO) {
      this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
      this.esFormaEstadoValido = true;
      return;
    } 
    this.obtenerDatosDelStore();
  } else if (e.valor > 0 && e.valor <= this.pasos.length) {
    this.esFormaEstadoValido = false;
    if (ESTADO !== CATALOGO) {
      this.formErrorEstadoAlert = 'Favor de seleccionar un estado en el que se tenga registrada una planta o su domicilio fiscal';
      this.esFormaEstadoValido = true;
      return;
    } 
    this.pasoNavegarPor(e);
  }
}

  /**
   * Navega a un paso específico en el wizard basado en la acción del botón.
   * @param {AccionBoton} e - Objeto que contiene la acción ('cont' o 'ant') y el valor del índice del paso.
   */
   pasoNavegarPor(e: AccionBoton): void {
    this.indice = e.valor;
    this.datosPasos.indice = e.valor;
    if (e.valor > 0 && e.valor < 5) {
      if (e.accion === 'cont') {
        this.wizardComponent.siguiente();
      } else {
        this.wizardComponent.atras();
      }
    }
  }
/**
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.certificadoService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }
   private validarTodosFormulariosPasoUno(): boolean {
    if (!this.pasoUnoComponent) {
      return true;
    }
    const ISFORM_VALID_TOUCHED = this.pasoUnoComponent.validarFormularios();
    if (!ISFORM_VALID_TOUCHED) {
      return false;
    }
    return true;
  }
  
    /**
     * Guarda los datos proporcionados en el parámetro `item` construyendo un objeto payload y enviándolo al servicio backend.
     * El payload incluye información del solicitante, certificado, destinatario y detalles del certificado.
     *
     * @param item - Objeto que contiene todos los datos necesarios para el payload, incluyendo información del certificado, destinatario y detalles adicionales.
     *
     * @remarks
     * Este método muestra el payload construido en la consola y está diseñado para enviarlo al backend mediante `registroService.guardarDatosPost`.
     * La llamada al servicio actualmente está comentada.
     */    
    guardar(item: Tramite110221State): Promise<JSONResponse> {    
      const PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS = this.certificadoService.buildProductoresPorExportador(item.agregarProductoresExportador);
      const PRODUCTORES_POR_EXPORTADOR = this.certificadoService.buildProductoresPorExportador(item.productoresExportador);
      const MERCANCIAS_PRODUCDOR = this.certificadoService.buildMercanciasProductor(item.mercanciaProductores);
      const CERTIFICADO = this.certificadoService.buildCertificado(item);
      const DESTINATARIO = this.certificadoService.buildDestinatario(item);
      const DATOS_DEL_CERTIFICADO = this.certificadoService.buildDatosDelCertificado(item);
      const PAYLOAD = {
        idSolicitud: this.solicitudState.idSolicitud,
        rfc_solicitante: 'AAL0409235E6',
        solicitante: {
          rfc: 'AAL0409235E6',
          nombre: 'ACEROS ALVARADO S.A. DE C.V.',
          actividad_economica: 'Fabricación de productos de hierro y acero',
          correo_electronico: 'contacto@acerosalvarado.com',
          domicilio: {
            pais: 'México',
            codigo_postal: '06700',
            estado: 'Ciudad de México',
            municipio_alcaldia: 'Cuauhtémoc',
            localidad: 'Centro',
            colonia: 'Roma Norte',
            calle: 'Av. Insurgentes Sur',
            numero_exterior: '123',
            numero_interior: 'Piso 5, Oficina A',
            lada: '',
            telefono: '123456',
          },
        },
        certificado: CERTIFICADO,
        destinatario: DESTINATARIO,      
        solicitud: {
            datosConfidencialesProductor: item.formulario['datosConfidencialesProductor'],
            productorMismoExportador: item.formulario['productorMismoExportador'],
            productoresPorExportador: [...PRODUCTORES_POR_EXPORTADOR],
            mercanciasProductor: [...MERCANCIAS_PRODUCDOR],
            ProductoresPorExportadorSeleccionados: [...PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS],
          },
        datos_del_certificado: DATOS_DEL_CERTIFICADO
      };    
        return new Promise((resolve, reject) => {
        this.certificadoService.guardarDatosPost(PAYLOAD).subscribe(response => {
            const API_RESPONSE = doDeepCopy(response);
          if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
            if(getValidDatos(API_RESPONSE.datos.idSolicitud)) {
              this.tramiteStore.setIdSolicitud((API_RESPONSE.datos.idSolicitud));
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.tramiteStore.setIdSolicitud(0);
            }
          }
          resolve(response as unknown as JSONResponse);
        }, error => {
          reject(error);
        });
      });
  
    }
}