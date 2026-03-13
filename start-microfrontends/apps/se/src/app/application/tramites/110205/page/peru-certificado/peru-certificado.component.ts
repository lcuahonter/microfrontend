/**
 * @component PeruCertificadoComponent
 * @description
 * El componente `PeruCertificadoComponent` es responsable de manejar el flujo de pasos para el trámite zoosanitario de importación del Perú.
 * Utiliza un componente `WizardComponent` para gestionar la navegación entre pasos del trámite.
 * También maneja la actualización del estado de la sección y la validez del formulario observando el estado del trámite.
 * 
 * @example
 * <app-peru-certificado></app-peru-certificado>
 */

import { AccionBoton, ListaPasoWizard } from '../../models/peru-certificado.module';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, ERROR_FORMA_ALERT, JSONResponse, SeccionLibStore, esValidObject, getValidDatos} from '@ng-mf/data-access-user';
import { Subject, take, takeUntil } from 'rxjs';
import { Tramite110205State, Tramite110205Store } from '../../estados/tramite110205.store';
import { AVISO } from '@ng-mf/data-access-user'
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { PASOS } from '../../constantes/peru-certificado.module';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite110205Query } from '../../estados/tramite110205.query';
import { WizardComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-peru-certificado',
  templateUrl: './peru-certificado.component.html',
  styleUrl: './peru-certificado.component.scss',
})
export class PeruCertificadoComponent implements OnInit, OnDestroy {

  /**
   * Texto de alerta para terceros.
   * @type {string}
   */
  TERCEROS_TEXTO_DE_ALERTA: string = '';

  /**
   * Referencia al componente PasoUnoComponent dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo
   * desde el componente padre para manipulación o interacción directa.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent?: PasoUnoComponent;

  /**
   * @property {ListaPasosWizard[]} pasos
   * @description
   * Lista de pasos que componen el flujo del trámite en el wizard.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * @property {string | null} tituloMensaje
   * @description
   * Título principal mostrado en el encabezado del trámite.
   */
  tituloMensaje: string | null = 'Zoosanitario para importación';

  /**
   * @property {WizardComponent} wizardComponent
   * @description
   * Referencia al componente hijo `WizardComponent`, utilizado para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * @property {number} indice
   * @description
   * Índice actual del paso activo dentro del wizard. Comienza en 1.
   */
  indice: number = 1;

  /**
   * @property {DatosPasos} datosPasos
   * @description
   * Objeto con metainformación sobre el flujo de pasos del wizard.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * @property {any} TEXTOS
   * @description
   * Contiene los textos informativos para el pago de derechos.
   */
  public TEXTOS = AVISO.Aviso;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador para gestionar la destrucción de suscripciones reactivas y evitar fugas de memoria.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Tramite110205State} solicitudState
   * @description
   * Estado actual de la solicitud del trámite.
   */
  solicitudState!: Tramite110205State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Indica si existe un error en el campo de cambio de modalidad.
   * Se actualiza desde el estado del store para mostrar mensajes de error específicos.
   * @type {boolean}
   */
  cambioError: boolean = false;

  /**
   * Contiene el mensaje HTML de error para el campo de cambio de modalidad.
   * Se utiliza para mostrar alertas de validación al usuario.
   * @type {string}
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Indica si existe un error en el campo de servicios IMMX.
   * Se actualiza desde el estado del store para mostrar mensajes de error específicos.
   * @type {boolean}
   */
  serviciosImmxError: boolean = false;

  /**
   * Indica si el formulario es válido.
   * Se utiliza para habilitar o deshabilitar acciones según el estado de validación del formulario.
   */
  esFormaValido: boolean = false;

  /**
   * @constructor
   * @description
   * Constructor del componente. Se encarga de suscribirse a `FormaValida$` del `Tramite110205Query`
   * para actualizar el estado de la sección y la validez del formulario en el store de sección.
   *
   * @param {SeccionLibStore} seccionStore - Store para actualizar el estado de la sección.
   * @param {Tramite110205Query} tramiteQuery - Query para observar el estado de validez del formulario.
   */
  constructor(
    private seccionStore: SeccionLibStore,
    private tramiteQuery: Tramite110205Query,
    private tramite110205Store: Tramite110205Store,
    private peruCertificadoService: PeruCertificadoService,
    private toastr: ToastrService
  ) {
    this.tramiteQuery.FormaValida$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(() => {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([true]);
    });
  }

  /**
   * Mantiene la suscripción al estado de CambioModalidadQuery para tener siempre el estado actualizado.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectCambioModalidad$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((state: Tramite110205State) => {
        this.solicitudState = state;
        this.cambioError = state.cambioError ?? false;
        this.serviciosImmxError = state.serviciosImmxError ?? false;
        this.TERCEROS_TEXTO_DE_ALERTA = `La solicitud ha quedado registrada con el número temporal ${this.solicitudState.idSolicitud} Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada.`;
      });
  }

  /**
   * Maneja la lógica de navegación y validación de formularios según la acción recibida.
   * 
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción y el valor para determinar el flujo.
   * 
   * - Si el índice actual es 1 y la acción es 'cont', valida todos los formularios del primer paso.
   *   Si la validación falla, marca el formulario como inválido y detiene el flujo.
   *   Si la validación es exitosa, obtiene los datos del store.
   * - Si el valor de la acción está dentro del rango de pasos, navega al paso correspondiente.
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
    } else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
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
   * Obtiene los datos del store y los guarda utilizando el servicio.
   */
  obtenerDatosDelStore(): void {
    this.peruCertificadoService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data);
      });
  }

  /**
   * @method validarTodosFormulariosPasoUno
   * @description
   * Valida todos los formularios del componente `PasoUnoComponent`.
   * Si la referencia al componente no existe, retorna `true` (no hay formularios que validar).
   * Llama al método `validarFormularios()` del componente hijo y retorna `false` si algún formulario es inválido.
   * Retorna `true` si todos los formularios son válidos.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
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
  // guardar(item: any): void {
  guardar(item: Tramite110205State): Promise<JSONResponse> {
    const PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS = this.peruCertificadoService.buildProductoresPorExportador(item.agregarProductoresExportador);
    const PRODUCTORES_POR_EXPORTADOR = this.peruCertificadoService.buildProductoresPorExportador(item.productoresExportador);
    const MERCANCIAS_PRODUCDOR = this.peruCertificadoService.buildMercanciasProductor(item.mercanciaProductores);
    const PAYLOAD = {
      rfc_solicitante: 'AAL0409235E6',
      idSolicitud: this.solicitudState.idSolicitud,
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
      certificado: {
        tratado_acuerdo: item.formCertificado['entidadFederativa'],
        pais_bloque: item.formCertificado['bloque'],
        fraccion_arancelaria: item.formCertificado['fraccionArancelariaForm'],
        nombre_comercial: item.formCertificado['nombreComercialForm'],
        registro_producto: item.formCertificado['numeroDeRegistroProductoForm'],
        fecha_inicio: item.formCertificado['fechaInicioInput'],
        fecha_fin: item.formCertificado['fechaFinalInput'],
        realizo_tercer_operador: {
          tercer_operador: item.formCertificado['si'],
          nombre: item.formCertificado['nombres'],
          primer_apellido: item.formCertificado['primerApellido'],
          segundo_apellido: item.formCertificado['segundoApellido'],
          numero_registro_fiscal:
            item.formCertificado['numeroDeRegistroFiscal'],
          razon_social: item.formCertificado['razonSocial'],
        },
        domicilio_tercer_operador: {
          pais: item.formCertificado['pais'],
          ciudad: item.formCertificado['ciudad'],
          calle: item.formCertificado['calle'],
          numero_letra: item.formCertificado['numeroLetra'],
          telefono: item.formCertificado['telefono'],
          correo_electronico: item.formCertificado['correo'],
        },
        mercancias_seleccionadas: item.mercanciaTabla.map((m: Mercancia) => ({
          id: m.id,
          fraccion_arancelaria: m.fraccionArancelaria,
          tipo_factura: m.tipoFactura,
          num_factura: m.numeroFactura,
          complemento_descripcion: m.complementoDescripcion,
          fecha_factura: m.fechaFactura,
          cantidad: m.cantidad,
          umc: m.umc,
          valor_mercancia: m.valorMercancia,
        })),
      },
      destinatario: {
        nombre: item.formDatosDelDestinatario['nombres'],
        primer_apellido: item.formDatosDelDestinatario['primerApellido'],
        segundo_apellido: item.formDatosDelDestinatario['segundoApellido'],
        numero_registro_fiscal:
          item.formDatosDelDestinatario['numeroDeRegistroFiscal'],
        razon_social: item.formDatosDelDestinatario['razonSocial'],
        domicilio: {
          ciudad_poblacion_estado_provincia: item.formDestinatario['ciudad'],
          calle: item.formDestinatario['calle'],
          numero_letra: item.formDestinatario['numeroLetra'],
          lada: item.formDestinatario['lada'],
          telefono: item.formDestinatario['telefono'],
          fax: item.formDestinatario['fax'],
          correo_electronico: item.formDestinatario['correoElectronico'],
          pais_destino: item.formDestinatario['paisDestino'],
        },
        generalesRepresentanteLegal: {
          lugarRegistro: item.formExportor['lugar'],
          nombre: item.formExportor['exportador'],
          razonSocial: item.formExportor['nombres'],
          puesto: item.formExportor['puesto'],
          telefono: item.formExportor['telefono'],
          correoElectronico: item.formExportor['correoElectronico'],
        },
        medio_transporte: item.formDatosDelDestinatario['medioTransporte'],
      },
      datos_del_certificado: {
        observaciones: item.formDatosCertificado['observacionesDates'],
        idioma: item.formDatosCertificado['idiomaDates'],
        representacion_federal: {
          entidad_federativa:
            item.formDatosCertificado['EntidadFederativaDates'],
          representacion_federal:
            item.formDatosCertificado['representacionFederalDates'],
        },
      },
      historico: {
        datosConfidencialesProductor: item.formulario['datosConfidencialesProductor'],
        productorMismoExportador: item.formulario['productorMismoExportador'],
        productoresPorExportador: [...PRODUCTORES_POR_EXPORTADOR],
        ProductoresPorExportadorSeleccionados: [...PRODUCTORES_POR_EXPORTADOR_SELECCIONADAS],
        mercanciasProductor: [...MERCANCIAS_PRODUCDOR],
      },
    };

    return new Promise((resolve, reject) => {
      this.peruCertificadoService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { idSolicitud?: number };
            if (getValidDatos(DATOS.idSolicitud)) {
              this.tramite110205Store.setIdSolicitud(DATOS.idSolicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.tramite110205Store.setIdSolicitud(0);
            }
          }
          resolve({
            id: response['id'] ?? 0,
            descripcion: response['descripcion'] ?? '',
            codigo: response['codigo'] ?? '',
            mensaje: 'Operación exitosa.',
            data: response['data'] ?? response['datos'] ?? null,
            ...response,
          } as JSONResponse);
        },
        (error) => {
          reject(error);
          this.toastr.error('Error al buscar Mercancia');
        }
      );
    });
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Se utiliza para cerrar y completar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
