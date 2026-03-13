import { AlertComponent, BtnContinuarComponent, DatosPasos, JSONResponse, ListaPasosWizard, WizardComponent, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite110223Store, TramiteState } from '../../estados/Tramite110223.store';
import { CertificadosOrigenService } from '../../services/certificado-origen.service';
import { CommonModule } from '@angular/common';
import { ERROR_FORMA_ALERT } from '../../../110204/constantes/modificacion.enum';
import { HttpClient } from '@angular/common/http';
import { PASOS } from '../../enums/constantes-alertas.enum';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src/';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite110223Query } from '../../query/tramite110223.query';

/**
 * TEXTO DE ALERTA PARA TERCEROS.
 */
const TERCEROS_TEXTO_DE_ALERTA =
  'La solicitud ha quedado registrada con el número temporal 202757598. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.';

/**
 * Interfaz que define la estructura de una acción de botón.
 */
interface AccionBoton {
  /**
   * La acción que se realizará.
   */
  accion: string;

  /**
   * El valor asociado a la acción.
   */
  valor: number;
}

/**
 * Componente que representa la página de solicitud.
 */
@Component({
  templateUrl: './solicitud-page.component.html',
  styles: ``,
  standalone:true,
  imports: [
    WizardComponent,
    CommonModule,
    BtnContinuarComponent,
    FormsModule,
    PasoDosComponent,
    PasoUnoComponent, 
    ReactiveFormsModule,
    AlertComponent,
    PasoFirmaComponent
  ]
})
export class SolicitudPageComponent implements OnDestroy {
      /**
   * Referencia al componente hijo `PasoUnoComponent` para acceder a sus métodos de validación de formularios.
   * const isValid = this.pasoUnoComponent.validateForms();
   * const formsValidity = this.pasoUnoComponent.getAllFormsValidity();
   */
    @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;
    esFormaValido: boolean = false;
  /**
   * Texto de alerta para terceros.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;
      /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
    public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente del asistente.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Estado del trámite.
   * @type {TramiteState}
   */
  solicitudState!: TramiteState;

    /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

    /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;
  
  /**
   * Constructor del componente.
   * @param store - El store del trámite.
   * @param query - La consulta del trámite.
   */    
  constructor( private store: Tramite110223Store,
        private query: Tramite110223Query,
        private certificadoDeService: CertificadosOrigenService,
        private toastr: ToastrService,
        private http: HttpClient){
    this.query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
    
  }

  /**
   * Construye un arreglo de mercancías seleccionadas a partir de los datos proporcionados.
   * @param arr Arreglo de objetos con los datos de las mercancías seleccionadas.
   * @returns Arreglo de objetos con la estructura requerida para las mercancías seleccionadas.
   * */
  buildMercanciaSeleccionadas(arr: unknown[]): Record<string, unknown>[] {
    return arr.map((item: unknown) => {
      const MERCANCIA_ITEM = item as Record<string, unknown>;
      return {
      id: MERCANCIA_ITEM['id'],
      fraccion_arancelaria: MERCANCIA_ITEM['fraccionArancelaria'],
      tipo_factura: MERCANCIA_ITEM['tipoFactura'],
      num_factura: MERCANCIA_ITEM['numeroFactura'],
      complemento_descripcion: MERCANCIA_ITEM['complementoDescripcion'],
      fecha_factura: MERCANCIA_ITEM['fechaFactura'],
      cantidad: MERCANCIA_ITEM['cantidad'],
      umc: MERCANCIA_ITEM['umc'],
      valor_mercancia: MERCANCIA_ITEM['valorMercancia'],
    };
    });
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
  guardar(item: TramiteState): Promise<JSONResponse> {    
    const PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS = this.certificadoDeService.buildProductoresPorExportador(item.agregarProductoresExportador);
    const PRODUCTORES_POR_EXPORTADOR = this.certificadoDeService.buildProductoresPorExportador(item.productoresExportador);
    const MERCANCIAS_PRODUCDOR = this.certificadoDeService.buildMercanciasProductor(item.mercanciaProductores);
    const CERTIFICADO = this.certificadoDeService.buildCertificado(item);
    const DESTINATARIO = this.certificadoDeService.buildDestinatario(item);
    const DATOS_DEL_CERTIFICADO = this.certificadoDeService.buildDatosDelCertificado(item);
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
      this.certificadoDeService.guardarDatosPost(PAYLOAD).subscribe(response => {
          const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE) && esValidObject(API_RESPONSE.datos)) {
          if(getValidDatos(API_RESPONSE.datos.idSolicitud)) {
            this.store.setIdSolicitud((API_RESPONSE.datos.idSolicitud));
            this.pasoNavegarPor({ accion: 'cont', valor: 2 });
          } else {
            this.store.setIdSolicitud(0);
          }
        }
        resolve(response as unknown as JSONResponse);
      }, error => {
        reject(error);
      });
    });

  }

  /**
   * Navega a través de los pasos del asistente según la acción del botón.
   * @param e Objeto que contiene la acción y el valor del índice al que se desea navegar.
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
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * @param e Acción del botón.
   */
getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;

      const ISVALID = this.validarTodosFormulariosPasoUno();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore();
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }

/**
 * @descripcion
 * Valida todos los formularios contenidos en el componente `pasoUnoComponent`.
 * 
 * - Si el componente no está inicializado (`pasoUnoComponent` es `null` o `undefined`), 
 *   se asume que no hay formularios por validar y retorna `true`.
 * - Si existe, ejecuta la función `validarFormularios()` del componente 
 *   y retorna `false` en caso de que alguno no sea válido.
 *
 */   
public validarTodosFormulariosPasoUno(): boolean {
     
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
   * Obtiene los datos actuales del store del trámite y los guarda.
   */
  obtenerDatosDelStore(): void {
    this.certificadoDeService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }  

  /**
   * @metodo ngOnDestroy
   * @descripcion
   * Se ejecuta cuando el componente va a ser destruido.
   * 
   * @tareas
   * - Cancela todas las suscripciones activas
   * - Libera recursos para evitar fugas de memoria
   * 
   * @implementa OnDestroy
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
  
}
