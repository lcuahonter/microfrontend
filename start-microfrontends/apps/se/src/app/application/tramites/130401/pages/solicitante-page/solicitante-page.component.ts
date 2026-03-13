import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatosPasos, JSONResponse, Notificacion, doDeepCopy, esValidObject, getValidDatos } from '@ng-mf/data-access-user';
import { ERROR_ALERTA, MSG_REGISTRO_EXITOSO, PASOS } from '../../constants/modificacion-descripcion.enum';
import { Subject, take } from 'rxjs';
import { AccionBoton } from '../../models/modificacion-descripcion.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { ModificacionDescripcionService } from '../../services/modificacion-descripcion.service';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { TEXTOS } from '../../constants/modificacion-descripcion.enum';
import { ToastrService } from 'ngx-toastr';
import { Tramite130401Query } from '../../../../estados/queries/tramite130401.query';
import { Tramite130401State } from '../../../../estados/tramites/tramite130401.store';
import { Tramite130401Store } from '../../../../estados/tramites/tramite130401.store';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';


/**
 * Componente para gestionar la página del solicitante.
 * 
 * Este componente permite al usuario navegar entre los pasos del wizard y gestionar
 * las acciones relacionadas con el trámite, como avanzar o retroceder entre los pasos.
 */
@Component({
  selector: 'app-solicitante-page',
  templateUrl: './solicitante-page.component.html',
  styleUrl: './solicitante-page.component.scss',
})
export class SolicitantePageComponent implements OnInit, OnDestroy {
  /**
    * Lista de pasos del wizard.
    * 
    * Esta propiedad contiene un array de objetos `ListaPasosWizard` que representan
    * los pasos del wizard.
    */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso activo en el wizard.
   * 
   * Esta propiedad indica el paso actual en el wizard, comenzando desde 1.
   */
  indice: number = 1;

  /**
   * Textos utilizados en el componente.
   * 
   * Esta propiedad contiene textos como instrucciones o mensajes que se muestran
   * en la interfaz del usuario.
   */
  TEXTOS = TEXTOS;

  /**
   * Notificador para destruir las suscripciones y evitar fugas de memoria.
   * 
   * Este `Subject` se utiliza para cancelar las suscripciones activas cuando
   * el componente se destruye.
   */
  destroyNotifier$: Subject<void> = new Subject();

  /**
   * Folio temporal de la solicitud.
   * Se utiliza para mostrar el folio en la notificación de éxito.
   */
  public alertaNotificacion!: Notificacion;

  /**
 * @description
 * Indica si el formulario del paso uno es válido.
 * @type {boolean}
 */
  esFormaValido: boolean = false;

  /**
   * Contiene el mensaje de error que se muestra cuando la validación de formularios falla.
   */
  public errorAlerta = ERROR_ALERTA;

  /**
   * Referencia al PasoUnoComponent para validación cruzada.
   */
  @ViewChild(PasoUnoComponent, { static: false })
  pasoUnoComponent!: PasoUnoComponent;

  /**
   * Estado actual del trámite.
   * 
   * Esta propiedad almacena el estado del trámite obtenido desde el store.
   */
  public tramiteState!: Tramite130401State;

  /**
   * Referencia al componente `WizardComponent`.
   * 
   * Esta propiedad utiliza `@ViewChild` para obtener una referencia al componente
   * del wizard dentro de la plantilla.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Datos relacionados con los pasos del wizard.
   * 
   * Esta propiedad contiene información como el número total de pasos, el índice
   * del paso actual y los textos de los botones "Anterior" y "Continuar".
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();

  /**
   * Indica si el botón para cargar archivos está habilitado.
   */
  activarBotonCargaArchivos: boolean = false;

  /**
   * Indica si la sección de carga de documentos debe mostrarse.
   */
  seccionCargarDocumentos: boolean = false;

  /**
   * Indica si existe una carga de documentos en progreso.
   */
  cargaEnProgreso: boolean = false;

  /**
   * Folio temporal de la solicitud.
   * @description
   */
  public folioTemporal: number = 0;

  /**
   * Estado actual de la solicitud 130401.
   *
   * Esta propiedad mantiene la información de la solicitud en curso y
   * se sincroniza de manera reactiva con el store correspondiente.
   * Contiene los datos necesarios para representar y manipular
   * la solicitud dentro del componente.
   *
   * @type {Solicitud130401State}
   * @public
   */
  public solicitudState!: Tramite130401State;

  /**
   * Constructor del componente.
   * 
   * @param {Tramite130401Store} store - Store para gestionar el estado del trámite.
   * @param {Tramite130401Query} tramiteQuery - Query para obtener el estado del trámite.
   */
  constructor(
    public store: Tramite130401Store,
    public tramiteQuery: Tramite130401Query,
    private toastrService: ToastrService,
    private modificacionDescripcionService: ModificacionDescripcionService,
    private tramite130401Store: Tramite130401Store
  ) {
    this.tramiteQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((solicitud) => {
        this.solicitudState = solicitud;
      });
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   * 
   * Este método suscribe al estado del trámite y actualiza la propiedad `tramiteState`
   * con los datos obtenidos.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.tramiteState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
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
   * Emite un evento para cargar archivos.
   * {void} No retorna ningún valor.
   */
  onClickCargaArchivos(): void {
    this.cargarArchivosEvento.emit();
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

  /**
   * Actualiza el estado de la carga en progreso.
   *
   * @param carga - Indica si la carga está en progreso (`true`) o no (`false`).
   */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Regresa al paso anterior del wizard y actualiza el índice actual.
   */
  anterior(): void {
    this.wizardComponent.atras();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Avanza al siguiente paso del wizard y actualiza el índice actual.
   */
  siguiente(): void {
    this.wizardComponent.siguiente();
    this.indice = this.wizardComponent.indiceActual + 1;
    this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
  }

  /**
   * Obtiene y valida el valor del índice según la acción del botón.
   * Controla la navegación y validación del formulario en el paso actual.
   *
   * @param e Acción del botón seleccionada en el wizard.
   */
  getValorIndice(e: AccionBoton): void {
    this.esFormaValido = false;
    if (this.indice === 1 && e.accion === 'cont') {
      this.datosPasos.indice = 1;
      const ISVALID =
        this.pasoUnoComponent?.modificacionMercancia?.validarFormulario();
      if (!ISVALID) {
        this.esFormaValido = true;
        return;
      }
      this.obtenerDatosDelStore(e);
    } else if (e.valor > 0 && e.valor <= this.pasos.length) {
      this.pasoNavegarPor(e);
    }
  }

/**
 * Obtiene el valor del índice de la acción del botón.
 * @param e Acción del botón.
 */
  pasoNavegarPor(e: AccionBoton): void {
    if (e.valor > 0 && e.valor < 5) {
      this.indice = e.valor;
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
  obtenerDatosDelStore(e: AccionBoton): void {
    this.modificacionDescripcionService
      .getAllState()
      .pipe(take(1))
      .subscribe((data) => {
        this.guardar(data, e);
      });
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param item Estado actual del trámite 130301.
   * @param e Acción del botón que indica la navegación entre pasos.
   * @returns Promesa que resuelve la respuesta JSON del servidor.
   */
  guardar(item: Tramite130401State, e: AccionBoton): Promise<JSONResponse> {
    const PAYLOAD = {
      tipoDeSolicitud: 'guardar',
      idSolicitud: item.idSolicitud || 0,
      idTipoTramite: 130401,
      numeroFolioTramiteOriginal: item.datosSolicitud.numeroFolioTramiteOriginal,
      numeroFolioResolucion: item.datosSolicitud.numeroFolioResolucion,
      mercanciaResponseDto: {
        tipoSolicitudPexim: item.datosSolicitud.tipoSolicitudPexim,
        regimen: item.datosSolicitud.mercanciaResponseDto.regimen,
        clasificacionRegimen: item.datosSolicitud.mercanciaResponseDto.clasificacionRegimen,
        condicionMercancia: item.datosSolicitud.mercanciaResponseDto.condicionMercancia,
        descripcion: item.datosSolicitud.mercanciaResponseDto.descripcion,
        fraccionArancelaria: item.datosSolicitud.mercanciaResponseDto.fraccionArancelaria,
        unidadMedidaTarifaria: item.datosSolicitud.mercanciaResponseDto.unidadMedidaTarifaria,
        unidadesAutorizadas: item.datosSolicitud.mercanciaResponseDto.unidadesAutorizadas,
        importeFacturaAutorizadoUSD: item.datosSolicitud.mercanciaResponseDto.importeFacturaAutorizadoUSD
      },
      partidasMercancia: item.datosSolicitud.partidasMercancia || [],
      modificationDescripcion: {
        cantidadLibreMercancia: item.datosSolicitud.modificationDescripcion?.cantidadLibreMercancia,
        descripcion: item.datosSolicitud.modificationDescripcion?.descripcion,
        descripcionNuevaMercanciaPexim: item.datosSolicitud.modificationDescripcion?.descripcionNuevaMercanciaPexim || ""
      },
      partidasModificationDescripcion: item.datosSolicitud.partidasModificationDescripcion || [],
      paises: item.datosSolicitud.paises,
      usoEspecifico: item.datosSolicitud.usoEspecifico,
      justificacionImportacionExportacion: item.datosSolicitud.justificacionImportacionExportacion,
      observaciones: item.datosSolicitud.observaciones,
      representacionFederal: item.datosSolicitud.representacionFederal,
      solicitante: {
        rfcSolicitante: "TSD931210493",
        correoElectronico: "vucem2.5@hotmail.com",
        razonSocialSolicitante: "CORPORACION MEXICANA DE COMPUTO S DE RL DE CV",
        actividadEconomicaPreponderante: "Fabricación de partes de sistemas de dirección y de suspensión para vehículos automotrices",
        domicilio: {
          pais: "ESTADOS UNIDOS MEXICANOS",
          codigoPostal: "06700",
          entidadFederativa: "QUERÉTARO",
          delegacionMunicipio: "EL MARQUES",
          localidad: "EL MARQUES",
          colonia: "PARQUE IND B QUINTANA",
          calle: "Av. Insurgentes Sur",
          numeroExterior: "123",
          numeroInterior: "Piso 5, Oficina A",
          lada: "",
          telefono: "909/917-1445"
        },
      },
    };

    return new Promise((resolve, reject) => {
      let shouldNavigate = false;
      this.modificacionDescripcionService.guardarDatos(PAYLOAD).subscribe(
        (response) => {
          this.esFormaValido = false;

          shouldNavigate = response.codigo === '00';
          if (shouldNavigate) {
            const API_RESPONSE = doDeepCopy(response);
            if (
              esValidObject(API_RESPONSE) &&
              esValidObject(API_RESPONSE.datos)
            ) {
              if (getValidDatos(API_RESPONSE.datos.id_solicitud)) {
                this.folioTemporal =
                  API_RESPONSE.datos.idSolicitud ||
                  API_RESPONSE.datos.id_solicitud;
                this.tramite130401Store.setIdSolicitud(
                  API_RESPONSE.datos.id_solicitud
                );
              } else {
                this.tramite130401Store.setIdSolicitud(0);
              }
              if (e.valor > 0 && e.valor < 5) {
                this.indice = e.valor;

                if (e.valor > 0 && e.valor < 5) {
                  this.indice = e.valor;
                  if (e.accion === 'cont') {
                    this.wizardComponent.siguiente();
                    if (e.valor > 0 && e.valor < 5) {
                      this.alertaNotificacion = {
                        tipoNotificacion: 'banner',
                        categoria: 'success',
                        modo: 'action',
                        titulo: '',
                        mensaje: MSG_REGISTRO_EXITOSO(
                          String(this.folioTemporal)
                        ),
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
            }
            this.toastrService.success(response.mensaje);
            resolve(response);
          } else {
            this.toastrService.error(response.mensaje);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}
