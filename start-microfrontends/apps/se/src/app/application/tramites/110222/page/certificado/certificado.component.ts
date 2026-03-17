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
import {
  AccionBoton,
  ListaPasoWizard,
} from '../../models/peru-certificado.module';
import { Component, ViewChild } from '@angular/core';
import {
  DatosPasos,
  ERROR_FORMA_ALERT,
  JSONResponse,
  WizardComponent,
  esValidObject,
  getValidDatos,
  PAGO_DE_DERECHOS
} from '@libs/shared/data-access-user/src';
import { Subject, take, takeUntil } from 'rxjs';
import {
  Tramite110222State,
  Tramite110222Store,
} from '../../estados/tramite110222.store';
import { PASOS } from '../../constantes/peru-certificado.module';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { ToastrService } from 'ngx-toastr';
import { Tramite110222Query } from '../../estados/tramite110222.query';
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
  /**
   * Array de pasos del wizard.
   * @type {Array<ListaPasoWizard>}
   */
  pasos: ListaPasoWizard[] = PASOS;

  /**
   * Propiedad pública que almacena los textos relacionados con el pago de derechos.
   * @type {any}
   */
  public TEXTOS = PAGO_DE_DERECHOS;

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

  solicitudState!: Tramite110222State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @type {Subject<void>}
   * @private
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {boolean} esFormaValido
   * @description
   * Indica si el formulario del paso actual es válido.
   * Se utiliza para mostrar mensajes de error o controlar la navegación en el asistente.
   */
  esFormaValido: boolean = false;

  /**
   * @property {string} formErrorAlert
   * @description
   * Mensaje HTML que se muestra como alerta cuando faltan campos por capturar en el formulario.
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * @property {PasoUnoComponent} pasoUnoComponent
   * @description
   * Referencia al componente hijo `PasoUnoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del primer paso del asistente desde el componente padre.
   */
  @ViewChild('pasoUnoRef') pasoUnoComponent!: PasoUnoComponent;

  /**
   * Inyecta los servicios necesarios y suscribe a la validación de la forma para actualizar el estado de la sección.
   * @param seccionStore Servicio para manejar el estado de la sección.
   * @param tramiteQuery Query para consultar el estado del trámite.
   */
  constructor(
    private tramiteQuery: Tramite110222Query,
    private validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService,
    private tramite110222Store: Tramite110222Store,
    private toastr: ToastrService
  ) {
    this.tramiteQuery.selectTramite$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  obtenerDatosDelStore(): void {
    this.validarInicialmenteCertificadoService.getAllState()
      .pipe(take(1))
      .subscribe(data => {
        this.guardar(data);
      });
  }

  /**
   * Obtiene el valor del índice de la acción del botón.
   * Este método controla el cambio de paso en el wizard dependiendo de la acción del botón presionado.
   * Si la acción es 'cont', pasa al siguiente paso. Si la acción es 'atras', regresa al paso anterior.
   * @param e Acción del botón (cont o atras) y el valor asociado a la acción.
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
      this.obtenerDatosDelStore()
    }
    else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }

  }

  /**
   * Navega entre los pasos de un asistente (wizard) según la acción recibida.
   *
   * @param e - Objeto de tipo `AccionBoton` que contiene la acción a realizar y el valor del índice del paso.
   *
   * - Actualiza el índice actual y el índice en `datosPasos` con el valor proporcionado.
   * - Si el valor está entre 1 y 4 (inclusive), navega al siguiente paso si la acción es 'cont',
   *   o al paso anterior en caso contrario, utilizando los métodos del componente wizard.
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
   * Guarda el estado del trámite en el store.
   * @param item - Estado del trámite a guardar.
   * @returns Promesa con la respuesta del servidor.
   */
  guardar(item: Tramite110222State): Promise<JSONResponse> {
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
        realizo_tercer_operador: {
          tercer_operador: item.formCertificado?.['si'],
          nombre: item.formCertificado?.['nombres'],
          primer_apellido: item.formCertificado?.['primerApellido'],
          segundo_apellido: item.formCertificado?.['segundoApellido'],
          numero_registro_fiscal: item.formCertificado?.['numeroDeRegistroFiscal'],
          razon_social: item.formCertificado?.['razonSocial'],
        },
        domicilio_tercer_operador: {
          calle: item.formCertificado?.['calle1'],
          numero_letra: item.formCertificado?.['numeroLetra1'],
          ciudad: item.formCertificado?.['ciudad1'],
          pais: item.formCertificado?.['pais1'],
          correo_electronico: item.formCertificado?.['correo1'],
          telefono: item.formCertificado?.['telefono1'],
          fax: item.formCertificado?.['fax1'],
        },
        tratado_acuerdo: item.formCertificado?.['entidadFederativa'] || '',
        pais_bloque: item.formCertificado?.['bloque'],
        fraccion_arancelaria: item.formCertificado?.['fraccionArancelariaForm'],
        registro_producto: item.formCertificado?.['numeroDeRegistroProductoForm'],
        nombre_comercial: item.formCertificado?.['nombreComercialForm'],
        fecha_inicio: item.formCertificado?.['fechaInicioInput'],
        fecha_fin: item.formCertificado?.['fechaFinalInput'],
        mercancias_seleccionadas: this.validarInicialmenteCertificadoService.buildMercanciaSeleccionadas(item.mercanciaTabla ?? []),
        // mercancias_seleccionadas: item.mercanciaTabla.map((m: Mercancia ?? []) => ({
        //   id: m.id,
        //   fraccion_arancelaria: m.fraccionArancelaria,
        //   tipo_factura: m.tipoFactura,
        //   num_factura: m.numeroFactura,
        //   complemento_descripcion: m.complementoDescripcion,
        //   fecha_factura: m.fechaFactura,
        //   cantidad: m.cantidad,
        //   umc: m.umc,
        //   valor_mercancia: m.valorMercancia,
        // })),
      },
      destinatario: {
        nombre: item.formDatosDelDestinatario?.['nombres'],
        numero_registro_fiscal: item.formDatosDelDestinatario?.['numeroDeRegistroFiscal'],
        domicilio: {
          ciudad_poblacion_estado_provincia: item.formDestinatario?.['ciudad'],
          calle: item.formDestinatario?.['calle'],
          numero_letra: item.formDestinatario?.['numeroLetra'],
          telefono: item.formDestinatario?.['telefono'],
          fax: item.formDestinatario?.['fax'],
          correo_electronico: item.formDestinatario?.['correoElectronico'],
          pais_destino: item.formDestinatario?.['paisDestino'],
        },
        generalesRepresentanteLegal: {
          lugarRegistro: item.formExportor?.['lugar'],
          nombre: item.formExportor?.['nombre'],
          cargo: item.formExportor?.['cargo'],
          numero_registro_fiscal: item.formExportor?.['registroFiscal'],
          telefono: item.formExportor?.['telefono'],
          correoElectronico: item.formExportor?.['correo'],
          fax: item.formExportor?.['fax'],
        },
      },
      datos_del_certificado: {
        idioma: item.formDatosCertificado?.['idiomaDates'] || 'en',
        observaciones: item.formDatosCertificado?.['observacionesDates'],
        representacion_federal: {
          entidad_federativa:
            item.formDatosCertificado?.['EntidadFederativaDates'],
          representacion_federal:
            item.formDatosCertificado?.['representacionFederalDates'],
        },
      },
      historico: {
        datosConfidencialesProductor: true,
        productorMismoExportador: true,
        productoresPorExportador: [
          {
            nombreCompleto: '',
            rfc: '',
            direccionCompleta: '',
            correoElectronico: '',
            telefono: '',
            fax: '',
          },
        ],
        ProductoresPorExportadorSeleccionados: [
          {
            nombreCompleto: '',
            rfc: '',
            direccionCompleta: '',
            correoElectronico: '',
            telefono: '',
            fax: '',
          },
        ],
        mercanciasProductor: [
          {
            fraccionArancelaria: '',
            cantidadComercial: '',
            descUnidadMedidaComercial: '',
            valorTransaccional: '',
            descFactura: '',
            numeroFactura: '',
            complementoDescripcion: '',
            fechaFactura: '',
            rfcProductor: '',
          },
        ],
      },
    };
    return new Promise((resolve, reject) => {
      this.validarInicialmenteCertificadoService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {

          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { idSolicitud?: number };
            if (getValidDatos(DATOS.idSolicitud)) {
              this.tramite110222Store.setIdSolicitud(DATOS.idSolicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.tramite110222Store.setIdSolicitud(0);
            }
          }
          resolve({
            id: response['id'] ?? 0,
            descripcion: response['descripcion'] ?? '',
            codigo: response['codigo'] ?? '',
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

}
