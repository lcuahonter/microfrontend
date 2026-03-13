import { AlertComponent,BtnContinuarComponent,DatosPasos,ERROR_FORMA_ALERT,JSONResponse,ListaPasosWizard,LoginQuery,PASOS,WizardComponent,esValidObject,getValidDatos, } from '@ng-mf/data-access-user';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud110219State, Tramite110219Store } from '../../estados/Tramite110219.store';
import { Subject, map, take, takeUntil } from 'rxjs';
import { CertificadoService } from '../../services/certificado.service';
import { CommonModule } from '@angular/common';
import { PasoFirmaComponent } from '@libs/shared/data-access-user/src';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { TERCEROS_TEXTO_DE_ALERTA_TEMPLATE } from '../../constants/messages.constants';
import { ToastrService } from 'ngx-toastr';
import { Tramite110219Query } from '../../estados/Tramite110219.query';

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
  standalone: true,
  imports: [
    WizardComponent,
    BtnContinuarComponent,
    PasoUnoComponent,
    PasoTresComponent,
    CommonModule,
    PasoFirmaComponent,
    AlertComponent,
  ],
})
export class SolicitudPageComponent implements OnInit {
  /**
   * Referencia al componente Wizard para controlar la navegación entre pasos.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Lista de pasos del asistente (wizard).
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual en el asistente.
   */
  indice: number = 1;

  /**
   * Número del paso actual, utilizado para identificar el paso activo.
   */
  nombre: number = 1;

  /**
   * Indica si el número de certificado es válido.
   */
  isNumeroDe!: boolean;

  /**
   * Indica si los datos del número son válidos.
   */
  isNumeroDatos: boolean = false;

  /**
   * Indica si el patrón del número es válido.
   */
  isNumeroPattern!: boolean;

  /**
   * Indica si el patrón de cancelación es válido (no excede 1500 caracteres).
   */
  isCancelacionPattern: boolean = false;

  /**
   * Datos de configuración de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Notificador para destruir los observables y evitar posibles fugas de memoria.
   * @private
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la solicitud 110219.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud110219State}
   * @public
   */
  public solicitudState!: Solicitud110219State;

  /**
   * Identificador numérico de la solicitud actual.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  idSolicitud: number = 0;

  /**
   * Contiene el mensaje HTML de error para el campo de cambio de modalidad.
   * Se utiliza para mostrar alertas de validación al usuario.
   * @type {string}
   */
  public formErrorAlert = ERROR_FORMA_ALERT;

  /**
   * Indica si el formulario es válido.
   * Se utiliza para habilitar o deshabilitar acciones según el estado de validación del formulario.
   */
  esFormaValido: boolean = false;

  /**
   * Referencia al componente PasoUnoComponent dentro de la vista.
   * Permite acceder a las propiedades y métodos públicos del componente hijo
   * desde el componente padre para manipulación o interacción directa.
   */
  @ViewChild(PasoUnoComponent) pasoUnoComponent?: PasoUnoComponent;

  /**
   * Texto de alerta para terceros.
   * @type {string}
   */
  TERCEROS_TEXTO_DE_ALERTA: string = '';

  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  constructor(
    public store: Tramite110219Store,
    private query: Tramite110219Query,
    private certificadoService: CertificadoService,
    private toastr: ToastrService,
    private loginQuery: LoginQuery
  ) {
    this.query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
        this.TERCEROS_TEXTO_DE_ALERTA = TERCEROS_TEXTO_DE_ALERTA_TEMPLATE(
          this.solicitudState.idSolicitud?.toString() || ''
        );
      });

    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /**
   * Convierte una cadena de fecha en formato 'DD/MM/YYYY' a formato ISO string con zona horaria.
   *
   * @param dateString - Cadena de fecha en formato 'DD/MM/YYYY'.
   * @returns La fecha convertida en formato ISO string. Si la cadena es inválida o vacía, retorna la fecha actual en formato ISO.
   */
  private convertDateToISOString(dateString: string): string {
    if (!dateString) {
      return new Date().toISOString();
    }
    
    // Divide la cadena de fecha por '/'
    const DATEPARTS = dateString.split('/');
    if (DATEPARTS.length !== 3) {
      return new Date().toISOString();
    }
    
    const [DAY, MONTH, YEAR] = DATEPARTS;
    const DATE = new Date(parseInt(YEAR, 10), parseInt(MONTH, 10) - 1, parseInt(DAY, 10));
    return DATE.toISOString();
  }

  /**
   * Inicializa el componente y ajusta la lista de pasos del asistente,
   * excluyendo el paso con índice 2 y reasignando el índice del paso 3 a 2.
   */
  ngOnInit(): void {
    this.pasos = this.pasos
      .filter((step) => step.indice !== 2)
      .map((step) => (step.indice === 3 ? { ...step, indice: 2 } : step));
  }

  /**
   * Selecciona una pestaña del asistente según el índice proporcionado.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Obtiene el valor del índice de la acción del botón y navega entre los pasos del asistente.
   * @param e Acción del botón.
   */
  getValorIndice(e: AccionBoton): void {
    this.alEventoHijo(this.nombre);
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

  guardar(item: Solicitud110219State): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: 'guardar',
      idTipoTramite: 110219,
      discriminatorValue: '110219',
      id_solicitud: this.solicitudState.idSolicitud,
      cve_regimen: '01',
      cve_clasificacion_regimen: '01',
      mercancia: {
        cve_fraccion_arancelaria: '72021999',
        cve_subdivision: '7202199901',
        descripcion: 'Descripción',
        cve_unidad_medida_tarifaria: '1',
        cve_pais_origen: 'USA',
        cve_pais_destino: 'MEX',
        cantidad_tarifaria: 12,
        valor_factura_usd: 1.1,
        precio_unitario: 500.75,
        lote: '1',
        fecha_salida: '2025-06-09',
        observaciones: '1',
      },
      productor: {
        tipo_persona: true,
        nombre: 'Juan',
        apellido_materno: 'López',
        apellido_paterno: 'Norte',
        razon_social: 'Aceros Norte',
        descripcion_ubicacion: 'Calle Acero, No. 123, Col. Centro',
        rfc: 'AAL0409235E6',
        pais: 'USA',
      },
      solicitante: {
        rfc: this.loginRfc,
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: '',
      },
      representacion_federal: {
        cve_entidad_federativa: 'DGO',
        cve_unidad_administrativa: '1016',
      },
      certificado: {
        mercanciasCertificado: [
          {
            numeroRegistroProductos: '',
            masaBruta: 0,
            norma: '',
            criterio: '',
            nombreIngles: '',
            numeroOrden: 0,
            marca: '',
            fechaFactura: '2025-10-21',
            numeroFactura: '',
            valorMercancia: 0,
            complementoDescripcion: '',
            nombreComercial: '',
          },
        ],
        requiereJustificacion: true,
        fechaExpedicionStr: '',
        fechaVencimientoStr: '',
        anexoTabaco: true,
        anexoFreshMinneola: true,
        anexoNaranjas: true,
        anexoJugoNaranja: true,
        anexoTejidos: true,
        anexoTejidosAlgodon: true,
        claveEntidadFederativa: '',
        observacionesCupo: '',
        folioTramite: '',
        rfc: '',
        idSolicitud: 0,
        numeroCertificado: item.numeroCertificado || '',
        medioTransporte: '',
        observaciones: '',
        lugar: '',
        fechaExpedicion: this.convertDateToISOString(item.fechaInicial || ''),
        fechaVencimiento: this.convertDateToISOString(item.fechaFinal || ''),
        fechaCancelacion: '2025-10-21T06:16:22.491Z',
        precisa: '',
        presenta: '',
        justificacionRequerimiento: '',
        estadoCertificadoOrigen: '',
        rutaCompleta: '',
        puertoEmbarque: '',
        puertoDesembarque: '',
        puertoTransito: '',
        nombreEmbarcacion: '',
        numeroVuelo: '',
        valorMercancias: 0,
        timer: true,
        fecEmbarque: '2025-10-21T06:16:22.491Z',
        cvePaisFabricacion: '',
        descLugarEmbarque: '',
        tratadoAsociado: {
          ideTipoTratadoAcuerdo: '',
          cveTratadoAcuerdo: '',
          nombre: "item.tratado || ''",
          pexim: true,
          fechaCaptura: '2025-10-21T06:16:22.491Z',
          fechaFinVigencia: '2025-10-21T06:16:22.491Z',
          ideTipoCupoSaai: '',
          fechaInicioVigencia: '2025-10-21T06:16:22.491Z',
          activo: true,
          evaluarIndividual: true,
        },
        paisAsociado: {
          vigencia: {
            fechaInicioVigencia: '2025-10-21T06:16:22.491Z',
            fechaFinVigencia: '2025-10-21T06:16:22.491Z',
            blnActivo: true,
          },
          cvePais: '',
          nombre: "item.pais || ''",
          fechaCaptura: '2025-10-21T06:16:22.491Z',
          moneda: {
            vigencia: {
              fechaInicioVigencia: '2025-10-21T06:16:22.491Z',
              fechaFinVigencia: '2025-10-21T06:16:22.491Z',
              blnActivo: true,
            },
            clave: '',
            nombre: '',
            fechaCaptura: '2025-10-21T06:16:22.491Z',
            equivalenciaAelc: [
              {
                equivalenciaAelcPK: {
                  claveMoneda: '',
                  fechaInicioVigencia: '2025-10-21T06:16:22.491Z',
                },
                valor: 0,
                fechaCaptura: '2025-10-21T06:16:22.491Z',
                moneda: '',
                vigencia: {
                  fechaInicioVigencia: '2025-10-21T06:16:22.491Z',
                  fechaFinVigencia: '2025-10-21T06:16:22.491Z',
                  blnActivo: true,
                },
              },
            ],
          },
          cvePaisWco: '',
          nombreAlterno: '',
        },
        fecImpresion: '2025-10-21T06:16:22.507Z',
        lugarRegistro: '',
        motivoCancelacion: item.motivoCancelacion || '',
        anexoJapon: true,
        datosConfidencialesProductor: true,
        productorMismoExportador: true,
        idSolicitudR: 0,
      },
      destinatario: {
        idPersonaSolicitud: 0,
        idPersonaPersonaSolicitud: 0,
        idSolicitud: 0,
        nombre: '',
        apellidoMaterno: '',
        apellidoPaterno: '',
        razonSocial: '',
        rfc: '',
        curp: '',
        ideTipoPersonaSol: '',
        correoElectronico: '',
        cedulaProfesional: '',
        nss: '',
        telefono: '',
        descripcionGiro: '',
        cvePaisOrigen: '',
        domicilio: {
          calle: '',
          numExterior: '',
          numInterior: '',
          codigoPostal: '',
          informacionExtra: '',
          cveColonia: '',
          cveLocalidad: '',
          cveDelegMun: '',
          cveEntidad: '',
          cvePais: '',
          ciudad: '',
          telefono: '',
          fax: '',
          municipio: '',
          colonia: '',
          descUbicacion: '',
          cveCatalogo: '',
          telefonos: '',
          tipoDomicilio: 0,
        },
        tipoPatenteAgente: '',
        recif: '',
        puesto: '',
        tipoAgente: '',
        numeroPatente: '',
        numeroIdentificacionFiscal: '',
        personaMoral: true,
        booleanExtranjero: true,
        organismoPublico: true,
        cveUsuario: '',
        paginaWeb: '',
        ideGenerica1: '',
        rfcExtranjero: '',
        codAutorizacion: '',
        actividadProductiva: '',
        estadoEvaluacionEntidad: '',
        estadoEntidad: '',
        original: true,
        modificado: true,
        numeroRegistro: '',
        concentimientoInstalacionRecuperacion: true,
        booleanAlquilado: true,
        volumenAlmacenaje: 0,
        capacidadAlmacenaje: 0,
        descripcionDetalladaActividadEconomica: '',
        activo: true,
        blnGenerico1: true,
        area: '',
        idDireccionSol: 0,
        estadoEvaluacionEntidadEnum: 'POR_EVALUAR',
        estadoEntidadEnum: 'CANCELADA',
        estadoEvaluacionEntidadStr: '',
        estadoEntidadStr: '',
      },
      representanteLegal: {
        nombre: '',
        razonSocial: '',
        correoElectronico: '',
        domicilio: {
          fax: '',
          telefono: '',
        },
      },
    };

    return new Promise((resolve, reject) => {
      this.certificadoService.guardarDatosPost(PAYLOAD).subscribe(
        (response) => {
          if (esValidObject(response) && esValidObject(response['datos'])) {
            const DATOS = response['datos'] as { id_solicitud?: number };
            if (getValidDatos(DATOS.id_solicitud)) {
              this.store.setIdSolicitud(DATOS.id_solicitud ?? 0);
              this.pasoNavegarPor({ accion: 'cont', valor: 2 });
            } else {
              this.store.setIdSolicitud(0);
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
            this.toastr.error('Error al guardar el certificado.');
        }
      );
    });
  }

  /**
   * Maneja el evento emitido por un componente hijo y actualiza el número de paso.
   * @param event Número del evento emitido.
   */
  alEventoHijo(event: number): void {
    this.nombre = event;
  }

  /**
   * Actualiza el estado de validez del número de certificado.
   * @param event Valor booleano que indica si el número es válido.
   */
  isNumeroDeCertificado(event: boolean): void {
    this.isNumeroDe = event;
  }

  /**
   * Actualiza el estado de validez del patrón del número.
   * @param event Valor booleano que indica si el patrón es válido.
   */
  isNumeroDePattern(event: boolean): void {
    this.isNumeroPattern = event;
  }

  /**
   * Obtiene y actualiza el número de certificado.
   * @param event Número del certificado.
   */
  getDatosCertificado(event: number): void {
    this.nombre = event;
  }

  /**
   * Actualiza el estado de los datos del número y avanza al siguiente paso si no son válidos.
   * @param event Valor booleano que indica si los datos del número son válidos.
   */
  isDatosNumero(event: boolean): void {
    this.isNumeroDatos = event;
    this.isNumeroPattern = false;
    if (!this.isNumeroDatos) {
      this.getValorIndice({
        accion: 'cont',
        valor: 2,
      });
    }
  }

  /**
   * Maneja el error de patrón de cancelación cuando el motivo excede 1500 caracteres.
   * @param event Valor booleano que indica si hay un error de patrón en la cancelación.
   */
  onCancelacionPatternError(event: boolean): void {
    this.isCancelacionPattern = event;
  }
}