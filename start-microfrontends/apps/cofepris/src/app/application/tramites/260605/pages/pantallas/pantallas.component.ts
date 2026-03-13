import { AccionBoton, JSONResponse, WizardService,doDeepCopy, esValidObject, } from '@ng-mf/data-access-user';
import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable,Subject,catchError, from, map, of, switchMap, take, takeUntil } from 'rxjs';
import { Solicitud260605State, Tramite260605Store } from '../../../../estados/tramites/tramite260605.store';
import { DatosComponent } from '../datos/datos.component';
import { DatosPasos } from '@libs/shared/data-access-user/src/core/models/shared/components.model';
import { ListaPasosWizard } from '@ng-mf/data-access-user';
import { ModificatNoticeService } from '../../services/modificat-notice.service';
import { PASOS } from '@ng-mf/data-access-user';
import { TEXTO_DE_PELIGRO } from '../../../260503/constantes/constante260503.enum';
import { ToastrService } from 'ngx-toastr';
import { Tramite260605Query } from '../../../../estados/queries/tramite260605.query';
import { WizardComponent } from '@libs/shared/data-access-user/src/tramites/components/wizard/wizard.component';
import { MSG_REGISTRO_EXITOSO, TEXTOS } from '../../constantes/260605enum';

/**
 * Este componente se utiliza para mostrar los pasos del asistente - 220401
 * Lista de pasos
 * Índice del paso
 */
@Component({
  selector: 'app-pantallas',
  standalone: false,
  templateUrl: './pantallas.component.html',
})

export class PantallasComponent implements OnInit,OnDestroy {

  /**
   * Referencia al componente `PasoUnoComponent`.
   */
  @ViewChild('datosComponentRef') datosComponent!: DatosComponent;
  /**
   * Sujeto para notificar la destrucción del componente.
   * 
   * @private
   * @type {Subject<void>}
   * @memberof RepresentanteComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Identificador numérico para guardar la solicitud.
   * Se inicializa en 0 y se actualiza cuando se captura una nueva solicitud.
   */
  public guardarIdSolicitud: number = 0;
   /**
   * Indica si el formulario es válido.
   */
  esValido = true;

   /**
   * @description mensaje de registro de solicitud exitoso.
   * @type {string}
   * @protected
   */
  protected readonly MSG_REGISTRO_EXITOSO = MSG_REGISTRO_EXITOSO;
  /**
   * ID de la solicitud guardada.
   * Se obtiene del store después de guardar exitosamente.
   */
  idSolicitud: string = '';
  /**
   * Evento que se emite para cargar archivos.
   * Este evento se utiliza para notificar a otros componentes que se debe realizar una acción de
   */
  cargarArchivosEvento = new EventEmitter<void>();
  /**
     * @description Constante que contiene los textos utilizados en el componente.
     */
    TEXTOS = TEXTOS;
  /**
 * Indica si el botón para cargar archivos está habilitado.
 */
  activarBotonCargaArchivos: boolean = false;

   /**
 * Indica si la sección de carga de documentos está activa.
 * Se inicializa en true para mostrar la sección de carga de documentos al inicio.
 */
  seccionCargarDocumentos: boolean = true;

  /**
   * Indica si la carga de archivos está en progreso.
   */
  cargaEnProgreso: boolean = true;
  /**
   * @property wizardService
   * @description
   * Inyección del servicio `WizardService` para gestionar la lógica y el estado del componente wizard.
   * @type {WizardService}
   */
  public wizardService: WizardService;
  /**
   * Esta variable se utiliza para almacenar la lista de pasos.
   */
  pantallasPasos: ListaPasosWizard[] = PASOS;
  /**
   * Esta variable se utiliza para almacenar el índice del paso.
   */
  indice: number = 1;

  /**
   * Referencia al componente WizardComponent para acceder a sus métodos y propiedades.
   */
  @ViewChild(WizardComponent) wizardComponent!: WizardComponent;

  /**
   * Esta variable se utiliza para almacenar los datos de los pasos.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pantallasPasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /** Estado de la solicitud.
   * 
   * @type {Solicitud260605State}
   * @memberof PantallasComponent
   */
  public solicitudState!: Solicitud260605State;
  /** Texto de advertencia que se muestra cuando hay condiciones peligrosas. */
  public textoPeligro: string = TEXTO_DE_PELIGRO;
  /**
   * Indica si se debe mostrar un mensaje de peligro.
   */
  public isPeligro: boolean = false;

  /** 
   * Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. 
   */
  public isContinuarTriggered: boolean = false;

  /**
   * Crea una instancia del componente PantallasComponent.
   * @param tramite260605Store - Servicio para gestionar el estado del trámite 260605.
   * @param tramite260605Query - Servicio para consultar el estado del trámite 260605.
   * @param toastrService - Servicio para mostrar notificaciones toastr.
   * @param _modificatNoticeSvc - Servicio para gestionar las solicitudes de modificación de aviso.
   */
  constructor(
      private tramite260605Store: Tramite260605Store,
      private tramite260605Query: Tramite260605Query,
      private toastrService: ToastrService,
      private _modificatNoticeSvc: ModificatNoticeService,
      wizardService: WizardService
  ) {
    this.wizardService = wizardService;
  }

  ngOnInit(): void {
    this.tramite260605Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          this.isContinuarTriggered = this.solicitudState['continuarTriggered'] ?? false;
        })
      )
      .subscribe();
  }

  /**
   * Este método se utiliza para establecer el índice del paso.
   */
  getValorIndice(e: AccionBoton): void {
    const NEXT_INDEX =
    e.accion === 'cont' ? e.valor + 1 :
    e.accion === 'ant' ? e.valor - 1 :
    e.valor;
    if (this.indice === 1 && e.accion === 'cont') {
      this.tramite260605Store.setContinuarTriggered(true);
      const ES_VALIDO = this.validarFormulariosPasoActual();
      if (!ES_VALIDO) {
        this.isPeligro = true; 
        return;
      }
      this.isPeligro = false;
    }
    if (e.valor > 0 && e.valor < this.pantallasPasos.length) {
      if (e.accion === 'cont') {
        if (this.indice === 1) {
            this.shouldNavigate$()
          .subscribe((shouldNavigate) => {
            if (shouldNavigate) {
              this.indice = NEXT_INDEX;
              this.datosPasos.indice = NEXT_INDEX;
              this.wizardService.cambio_indice(NEXT_INDEX);
              this.wizardComponent.siguiente();
            } else {
              this.indice = e.valor;
              this.datosPasos.indice = e.valor;
            }
          });
        } else {
          this.indice = NEXT_INDEX;
          this.datosPasos.indice = NEXT_INDEX;
          this.wizardService.cambio_indice(NEXT_INDEX);
          this.wizardComponent.siguiente();
        }
      } else {
        this.indice = NEXT_INDEX;
        this.datosPasos.indice = NEXT_INDEX;
        this.wizardComponent.atras();
      }
    }
  }

  /**
 * Método para navegar a la sección anterior del wizard.
 * Actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
anterior(): void {
  this.wizardComponent.atras();
  this.indice = this.wizardComponent.indiceActual + 1;
  this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
}

/**
 * Método para navegar a la siguiente sección del wizard.
 * Realiza la validación de los documentos cargados y actualiza el índice y el estado de los pasos.
 * {void} No retorna ningún valor.
 */
siguiente(): void {
  // Aqui se hara la validacion de los documentos cargdados
  this.wizardComponent.siguiente();
  this.indice = this.wizardComponent.indiceActual + 1;
  this.datosPasos.indice = this.wizardComponent.indiceActual + 1;
}

  /**   
   * Determina si se debe navegar al siguiente paso.
   * 
   * @returns {Observable<boolean>} Un observable que emite `true` si se debe navegar, `false` en caso contrario.
   */
  private shouldNavigate$(): Observable<boolean> {
    return of(this.solicitudState).pipe(
      take(1),
      switchMap(() => from(this.guardar())),
      map(response => {
        const DATOS = doDeepCopy(response);
        const OK = DATOS.codigo === '00';
        if (OK) {
          this.toastrService.success(DATOS.mensaje);
        } else {
          this.toastrService.error(DATOS.mensaje);
        }
        return OK;
      }),
      catchError((error) => {
        console.error('Error during save operation:', error);
        this.toastrService.error(error.message || 'Ocurrió un error al guardar la solicitud.');
        return of(false);
      })
    );
  }

  /**
   * Valida los formularios del paso actual antes de permitir continuar.
   * @returns {boolean} - `true` si los formularios son válidos, `false` en caso contrario.
   */
  validarFormulariosPasoActual(): boolean {
    if (this.indice === 1) {
      return this.datosComponent?.validarFormularios() ?? true;
    }
    return true;
  }

  /**
   * Guarda la solicitud actual utilizando el servicio `ModificatNoticeService`.
   * 
   * @returns {Promise<JSONResponse>} Una promesa que se resuelve con la respuesta JSON del servicio.
   */
  public guardar(): Promise<JSONResponse> {
    const SOLICITUDE = this.solicitudState;
    type Aduana = { clave?: string; descripcion?: string };
    const ADUANAS_SELECCIONADAS: { clave_aduana?: string; tipo_aduana?: string }[] = [];
    for(const ADUANA of (SOLICITUDE.aduanasSeleccionadas as Aduana[])) {
      ADUANAS_SELECCIONADAS.push({
        clave_aduana: ADUANA?.clave,
        tipo_aduana: ADUANA?.descripcion
      });
    }
    const PAYLOAD = {
      "solicitante": {
          "rfc": "AAL0409235E6",
          "nombre": "ACEROS ALVARADO S.A. DE C.V.",
          "actividadEconomica": "Fabricación de productos de hierro y acero",
          "correoElectronico": "contacto@acerosalvarado.com",
          "domicilio": {
              "pais": "México",
              "codigoPostal": "06700",
              "estado": "Ciudad de México",
              "municipioAlcaldia": "Cuauhtémoc",
              "localidad": "Centro",
              "colonia": "Roma Norte",
              "calle": "Av. Insurgentes Sur",
              "numeroExterior": "123",
              "numeroInterior": "Piso 5, Oficina A",
              "lada": "",
              "telefono": "123456"
          }
      },
      "solicitud": {
          "discriminatorValue": 260605,
          "declaracionesSeleccionadas": true,
          "regimen": "General",
          // "aduanaAIFA": "ALTAMIRA",
          "informacionConfidencial": false,
          "justificacionTecnica": SOLICITUDE.cstumbresAtuales,
          "aduanasActuales": SOLICITUDE.aduanaActual,
      },
      "establecimiento": {
          "RFCResponsableSanitario": "XAXX010101000",
          "razonSocial": "Laboratorios Farmacéuticos del Centro S.A. de C.V.",
          "correoElectronico": "info@labcentro.com.mx",
          "domicilio": {
              "codigoPostal": "06700",
              "entidadFederativa": {
                  "clave": "09"
              },
              "descripcionMunicipio": "Cuauhtémoc",
              "informacionExtra": "Centro",
              "descripcionColonia": "Roma Norte",
              "calle": "Calle Orizaba 123, Interior 4B",
              "lada": "55",
              "telefono": "55551234"
          },
          "original": "",
          "avisoFuncionamiento": true,
          "numeroLicencia": "123456"
          // "aduanas": "ALTAMIRA"
      },
      "discriminator_value": "260605",
      "cve_regimen": "General",
      "aduana_aicm": null,
      "aduana_aifa": null,
      "aduanas": ADUANAS_SELECCIONADAS,
      "mercancias": [
          {
              "numero_partida": 1,
              "cve_fraccion": "30049099",
              "descripcion_mercancia": "Efedrina (alcaloide natural) para uso farmacéutico",
              "descripcion_denominacion_distintiva": "Efedrina Base",
              "cantidad_umt": 500.00,
              "unidad_medida_tarifaria": "KG",
              "cantidad_umc": 500.00,
              "unidad_medida_comercial": "KG",
              "importe_factura_usd": 25000.00,
              "id_clasificacion_producto": 1,
              "id_subclasificacion_producto": 10,
              "descripcion_identificacion": "Alcaloide natural extraído de Ephedra sinica",
              "descripcion_presentacion": "Polvo cristalino blanco",
              "porcentaje_concentracion": "99.5%",
              "nombre_comercial": "Ephedrine Base USP",
              "nombre_quimico": "(1R,2S)-2-Methylamino-1-phenylpropan-1-ol",
              "numero_cas": "299-42-3",
              "numero_lote": "LOT-EPH-2025-001",
              "cantidad_lotes": 5,
              "fecha_ingreso": "15/01/2025", 
              "fecha_salida": "30/06/2025", 
              "fecha_caducidad": "15/01/2026", 
              "registroSanitarioConComas": "COFEPRIS-REG-001-2024-SSA1",
              "estado_fisico": "SOLID",
              "paises": [
                  {
                      "cve_pais": "IND",
                      "tipo_pais": "TIPMG.OR"
                  },
                  {
                      "cve_pais": "IND",
                      "tipo_pais": "TIPMG.PR"
                  }
              ]
          }
      ],
      "terceros": [
          {
              "tipo_tercero": "TIPERS.FAB",
              "rfc": "LPI950101ABC",
              "razon_social": "LABORATORIOS PISA S.A. DE C.V.",
              "persona_moral": true,
              "cve_pais_origen": "MEX",
              "correo_electronico": "exportaciones@pisa.com.mx",
              "telefono": "5555123456",
              "domicilio": {
                  "calle": "Av. Industria",
                  "numero_exterior": "2000",
                  "numero_interior": "Edif. A",
                  "colonia": "Industrial Vallejo",
                  "codigo_postal": "02300",
                  "municipio": "Azcapotzalco",
                  "entidad_federativa": "Ciudad de México",
                  "descripcion_ubicacion": "Av. Industria 2000, Edif. A, Col. Industrial Vallejo, CP 02300, Azcapotzalco, CDMX"
              }
          }
      ],
      "representanteLegal": {
          "rfc": SOLICITUDE.rfc,
          "resultadoIDC": "",
          "nombre": SOLICITUDE.nombre,
          "apellidoPaterno": SOLICITUDE.apellidoPaterno,
          "apellidoMaterno": SOLICITUDE.apellidoMaterno
      }
  }

    return new Promise((resolve, reject) => {
      this._modificatNoticeSvc.guardarSolicitud(PAYLOAD).pipe(
        takeUntil(this.destroyNotifier$)
      ).subscribe((response) => {
        if(esValidObject(response)) {
          const RESPONSE = doDeepCopy(response);
          this.tramite260605Store.actualizarIdSolicitud(RESPONSE?.datos?.id_solicitud ?? 0);
          this.guardarIdSolicitud = RESPONSE?.datos?.id_solicitud ?? 0;
          resolve(response);
        } else {
          resolve({ id: 0, descripcion: '', codigo: '', data: {} } as JSONResponse);
        }
      },error=>{
        reject(error);
      });
    });
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
  * Actualiza el estado del botón de carga de archivos.
  *  carga - Indica si la carga de documentos está activa o no.
  * {void} No retorna ningún valor.
  */
  manejaEventoCargaDocumentos(carga: boolean): void {
    this.activarBotonCargaArchivos = carga;
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

  /** Actualiza el estado de carga en progreso. */
  onCargaEnProgreso(carga: boolean): void {
    this.cargaEnProgreso = carga;
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * @memberof RepresentanteComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
