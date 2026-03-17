import { AfterViewInit, Component,EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CertificadoDisponibles, ConsultaioQuery, ConsultaioState, doDeepCopy, esValidObject } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, FormularioDinamico, PERSONA_MORAL_NACIONAL, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { BuscarCertificadoDeOrigenService } from '../../services/buscar-certificado-de-origen/buscar-certificado-de-origen.service';
import { CertificadoDeOrigenComponent } from '../certificado-de-origen/certificado-de-origen.component';
import { CertificadoOrigenResponse } from '../../models/certificados-disponsible.model';
import { DomicilioTablaService } from '../../services/domicilio-tabla/domicilioTabla.service';
import { DuplicadoDeCertificadoComponent } from '../duplicado-de-certificado/duplicado-de-certificado.component';
import { esValidArray } from '@libs/shared/data-access-user/src/core/utils/utilerias';
import { Tramite110210Store } from '../../estados/store/tramite110210.store';

/**
 * @descripcion
 * El componente `PasoUnoComponent` es responsable de gestionar la lógica y la interfaz
 * de usuario para el primer paso del trámite 110210.
 *
 * @selector app-paso-uno
 * @templateUrl ./paso-uno.component.html
 * @styleUrl ./paso-uno.component.scss
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss'
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
 * Evento que se emite cuando no se encuentran datos.
 * @type {EventEmitter<void>}
 */
  @Output() noDatosError = new EventEmitter<void>();
  /**
 * Indica si se ha recibido una respuesta con datos.
 * Se utiliza para mostrar u ocultar información en la interfaz según el estado de la respuesta.
 */
  public esDatosRespuesta: boolean = false;
  /**
 * Estado actual de la consulta, obtenido desde el store.
 * Almacena la información relevante para el paso del solicitante.
 */
public consultaState!: ConsultaioState;
  /**
   * Referencia al componente `SolicitanteComponent` dentro de la vista.
   * @type {SolicitanteComponent}
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona seleccionada.
   * @type {number}
   */
  tipoPersona!: number;

  /**
   * Datos del certificado de origen.
   * @type {CertificadoOrigenResponse | null}
   */
  public certificadoDatos: CertificadoOrigenResponse | null = null;

  /**
   * Configuración dinámica para los datos de la persona.
   * @type {FormularioDinamico[]}
   */
  persona: FormularioDinamico[] = [];

  /**   * Indica si se deben mostrar las pestañas en la interfaz.
   * @type {boolean}
   */
  public showTabs: boolean = true;

  /**
   * Configuración dinámica para el domicilio fiscal.
   * @type {FormularioDinamico[]}
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  indice: number = 1;

  /**   * Indica si la pestaña de certificado está habilitada.
   * @type {boolean}
   */
  public certificadoTabEnabled = false;
   /**
 * Subject utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria
 * cuando el componente se destruye.
 */
private destroyed$ = new Subject<void>();
  /**
   * @property {SolicitanteComponent} Solicitante
   * @description
   * Referencia al componente hijo `SolicitanteComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario del solicitante.
   */
  @ViewChild('Solicitante') Solicitante!: SolicitanteComponent;

  /**
   * @property {DuplicadoDeCertificadoComponent} Duplicado
   * @description
   * Referencia al componente hijo `DuplicadoDeCertificadoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de duplicado de certificado.
   */
  @ViewChild('Duplicado') Duplicado!: DuplicadoDeCertificadoComponent;

  /**
   * @property {CertificadoDeOrigenComponent} certificado
   * @description
   * Referencia al componente hijo `CertificadoDeOrigenComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de certificado de origen.
   */
  @ViewChild('certificado') certificado!: CertificadoDeOrigenComponent;

  /**
 * Constructor del componente.
 * Inyecta los servicios necesarios para la gestión de licitaciones y la consulta del estado.
 */
constructor(
  private service: DomicilioTablaService,
  private consultaQuery: ConsultaioQuery,
  private buscarCertificadoService: BuscarCertificadoDeOrigenService,
  private tramite110210Store: Tramite110210Store,
) {
  // constructor
}

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de que la vista del componente ha sido inicializada.
   * Configura los datos iniciales para la persona y el domicilio fiscal.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
     if (this.solicitante?.obtenerTipoPersona) {
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
  }
  }
 /**
 * Método del ciclo de vida que se ejecuta al inicializar el componente.
 *
 * Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta
 * y lo asigna a la propiedad `consultaState`. Dependiendo del valor de `update` en el estado,
 * decide si debe llamar a `guardarDatosFormulario()` para obtener y actualizar los datos,
 * o simplemente mostrar la información existente.
 */
  ngOnInit(): void {
  this.consultaQuery.selectConsultaioState$.pipe(
    takeUntil(this.destroyed$),
    map((seccionState) => {
      this.consultaState = seccionState;

      this.showTabs = !this.consultaState.readonly;
      if(this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
    })
  ).subscribe();
}
  
  /**
 * Método del ciclo de vida que se ejecuta al destruir el componente.
 *
 * Emite y completa el subject `destroyed$` para cancelar todas las suscripciones activas,
 * evitando fugas de memoria.
 */
  ngOnDestroy(): void {
  this.destroyed$.next();
  this.destroyed$.complete();
}
  /**
   * @descripcion
   * Cambia el índice de la pestaña seleccionada.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Habilita la pestaña de certificado estableciendo la variable `certificadoTabEnabled` en `true`.
   *
   */
  enableCertificadoTab(event: CertificadoDisponibles) :void{
  const PAYLOAD = {
  "solicitud": {
    "solicitante": {
      "telefono": "55-98764532",
      "rfc": event.rfc ?? 'AAL0409235E6',
      "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
      "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
      "correoElectronico": "vucem2021@gmail.com",
      "cveUsuario": event.rfc ?? 'AAL0409235E6'
    },
    "cveRolCapturista": "PersonaMoral",
    "cveUsuarioCapturista": event.rfc ?? 'AAL0409235E6',
    "discriminatorValue": "110210",
    "idSolicitud": null,
    "clavePaisSeleccionado": null as string | null,
    "idTratadoAcuerdoSeleccionado": null as string | null,
    "tramite": {
      "numFolioTramite": ""
    }
  },
  "puedeCapturarRepresentanteLegalCG": false,
  "numCertificadoSeleccionado": null,
  "datosMercancia": {
    "numeroCertificado": event.numeroCertificado,
  },
  "parametrosBP": {
    "idSolicitud": null,
    "servicio": null,
    "mensaje": null,
    "idTramite": "110210"
  }
}

if(event.dropdownSeleccionado){
  PAYLOAD.solicitud.clavePaisSeleccionado = event.paises ?? null;
  PAYLOAD.solicitud.idTratadoAcuerdoSeleccionado = event.idTratadoAcuerdo ?? null;
}

  this.service.obtenerEstadoFormulario(PAYLOAD,event.idSolicitud).pipe(
            takeUntil(this.destroyed$)
          ).subscribe((response) => {
            if(esValidObject(response)) {
              const RESPONSE = doDeepCopy(response);
              this.certificadoDatos = RESPONSE?.datos;
              this.tramite110210Store.setMercanciasExportacion(RESPONSE?.datos?.mercancias || []);
              this.tramite110210Store.setSelectedIdSolicitud(event.idSolicitud || null);
              this.certificadoTabEnabled = true;
            }
          });
}
/**   * Deshabilita la pestaña de certificado estableciendo la variable `certificadoTabEnabled` en `false`.
   *
   */
disableCertificado(): void {
  this.certificadoTabEnabled = false;
}
/**
 * Obtiene los datos vigentes de licitaciones mediante el servicio y actualiza el estado del formulario.
 *
 * Se suscribe al observable que retorna el servicio `getLicitationesVigentesData()`. Si la respuesta es válida,
 * actualiza la bandera `esDatosRespuesta` y llama al método del servicio para actualizar el estado del formulario.
 */
   guardarDatosFormulario(): void {
    const PARAMS = { idSolicitud: this.consultaState.id_solicitud || '' };
    this.service.getDatosStore(PARAMS).pipe(
        takeUntil(this.destroyed$)).subscribe((resp) => {
          if(esValidObject(resp)) {
            const RESPONSE_GET = doDeepCopy(resp);
            const PAYLOAD = {
              "solicitud": {
                "solicitante": {
                  "rfc": "AAL0409235E6",
                  "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
                  "descripcionGiro": "Siembra, cultivo y cosecha de otros cultivos",
                  "correoElectronico": "vucem2021@gmail.com",
                  "telefono": "55-98764532",
                  "cveUsuario": "AAL0409235E6",
                  "domicilio": {
                    "pais": {
                      "clave": "MEX",
                      "nombre": "ESTADOS UNIDOS MEXICANOS"
                    },
                    "entidadFederativa": {
                      "clave": "SIN",
                      "nombre": "SINALOA"
                    },
                    "delegacionMunicipio": {
                      "clave": "25001",
                      "nombre": "AHOME"
                    },
                    "localidad": {
                      "clave": "00181210008",
                      "nombre": "LOS MOCHIS"
                    },
                    "colonia": {
                      "clave": "00181210001",
                      "nombre": "MIGUEL HIDALGO"
                    },
                    "calle": "CAMINO VIEJO",
                    "numeroExterior": "1353",
                    "numeroInterior": "",
                    "codigoPostal": "81210"
                  }
                },
                "cveRolCapturista": "PersonaMoral",
                "cveUsuarioCapturista": "AAL0409235E6",
                "clavePaisSeleccionado": RESPONSE_GET?.datos?.solicitud?.clavePaisSeleccionado,
                "idTratadoAcuerdoSeleccionado": RESPONSE_GET?.datos?.solicitud?.idTratadoAcuerdoSeleccionado,
                "discriminatorValue": "110210",
                "tramite": {
                  "numFolioTramite": ""
                },
                "idSolicitud": this.consultaState.id_solicitud || ''
              },
              "puedeCapturarRepresentanteLegalCG": false,
              "datosMercancia": {
                "numeroCertificado": RESPONSE_GET?.datos?.datosMercancia?.numeroCertificado
              },
              "buscarCertificadosPorNumero": "Buscar Certificado",
              "buscarListaCertificados": "Buscar Certificado"
            };

            this.buscarCertificadoService.getCertificadosDisponibles(PAYLOAD).pipe(
              takeUntil(this.destroyed$)
            ).subscribe((response) => {
              if(esValidObject(response)) {
                const RESPONSE = doDeepCopy(response);
                if(esValidArray(RESPONSE.datos)) {
                  if(RESPONSE.datos.length > 0){
                    const DATOS: CertificadoDisponibles[] = []
                    RESPONSE.datos.forEach((certificado: CertificadoDisponibles) => {
                      const DATOSOBJ = {
                        idSolicitud: certificado.idSolicitud,
                        numeroCertificado: certificado.numeroCertificado,
                        fechaExpedicion: certificado.fechaExpedicion,
                        fechaVencimiento: certificado.fechaVencimiento,
                      }
                      DATOS.push(DATOSOBJ);
                    });
                    this.esDatosRespuesta = true;
                    this.tramite110210Store.setCveRegistroProductor(RESPONSE_GET?.datos?.datosMercancia?.numeroCertificado || '');
                    this.tramite110210Store.setPaisBloqueClave(RESPONSE_GET?.datos?.solicitud?.clavePaisSeleccionado || '');
                    this.tramite110210Store.setTratadoAcuerdoClave(RESPONSE_GET?.datos?.solicitud?.idTratadoAcuerdoSeleccionado || '');
                    this.tramite110210Store.setCertificadosDisponibles(DATOS);
                    
                  } 
                }
              }
            });
            
          }
        
      });
  }
  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios de los componentes hijos en el orden siguiente:
   * - Solicitante
   * - Duplicado de certificado
   * 
   * Para cada componente, verifica si está disponible y si su formulario es válido.
   * Si algún formulario es inválido, marca sus controles como "tocados" para mostrar los errores de validación.
   * Si algún componente no está disponible o su formulario es inválido, establece `isValid` a `false`.
   * 
   * @returns {boolean} `true` si todos los formularios son válidos, `false` si alguno no lo es o si falta algún componente.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.Solicitante?.form) {
      if (this.Solicitante.form.invalid) {
        this.Solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.Duplicado) {
      if (!this.Duplicado.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }
}