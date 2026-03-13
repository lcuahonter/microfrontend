import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  LoginQuery
} from '@ng-mf/data-access-user';
import {
  SolicitanteComponent,
  TIPO_PERSONA,
} from '@libs/shared/data-access-user/src';
import { Solicitud130301State, Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadoKimberleyComponent } from '../../components/certificado-kimberley/certificado-kimberley.component';
import { DatosDelTramiteComponent } from '../../components/datos-del-tramite/datos-del-tramite.component';
import { PartidasDeLaMercanciaComponent } from '../../components/partidas-de-la-mercancia/partidas-de-la-mercancia.component';
import { ProrrogasComponent } from '../../components/prorrogas/prorrogas.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { SolicitudProrrogaService } from '../../services/solicitudProrroga/solicitud-prorroga.service';
import { Solocitud130301Service } from '../../services/service130301.service';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar el paso uno del trámite.
 * Este componente permite al usuario seleccionar una pestaña y gestionar información del solicitante.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * RFC del usuario actual.
   * @type {string}
   */
  public loginRfc: string = '';

  /**
   * Índice para manejar la pestaña seleccionada.
   * Este valor determina cuál pestaña está activa en la interfaz de usuario.
   *
   * @type {number}
   */
  public indice: number = 1;

  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Observable para gestionar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Solicitud del estado actual del trámite 130301.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Constructor del componente.
   * @param consultaQuery Consulta para obtener el estado de la consulta.
   * @param solocitud130301Service Servicio para gestionar la solicitud del trámite 130301.
   * @param solicitudProrrogaService Servicio para gestionar las solicitudes de prórroga.
   * @param tramite130301Query Consulta para obtener el estado del trámite 130301.
   * @param tramite130301Store Almacén de estado para el trámite 130301.
   * @param loginQuery Consulta para obtener el estado de inicio de sesión.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solocitud130301Service: Solocitud130301Service,
    private solicitudProrrogaService: SolicitudProrrogaService,
    private tramite130301Query: Tramite130301Query,
    private tramite130301Store: Tramite130301Store,
    private loginQuery: LoginQuery
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((loginState) => {
          this.loginRfc = loginState.rfc;
          this.tramite130301Store.setLoginRfc(this.loginRfc);
        })
      )
      .subscribe();
  }

  /**
   * Hook de inicialización del componente. Verifica el estado de actualización del store
   * y carga datos en caso necesario.
   */
  ngOnInit(): void {
    this.tramite130301Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((solicitudState) => {
          this.solicitudState = solicitudState;
        })
      )
      .subscribe();

    // Implement consulta logic as in 130104
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.tramite130301Store.setIdSolicitud(Number(this.consultaState.id_solicitud));
            this.getMostrarInitial(this.consultaState.id_solicitud);
          } else {
            this.esDatosRespuesta = true;
          }
          
        })
      )
      .subscribe();

    this.cargarDatosPerfil();
  }

  /**
   * Decorador `ViewChild` para acceder a la instancia del componente `SolicitanteComponent`.
   * Instancias de componentes hijos accedidas mediante `ViewChild` para gestionar los formularios y datos del trámite:
   * - `SolicitanteComponent`: Información y validación del solicitante.
   * - `DatosDelTramiteComponent`: Datos específicos del trámite.
   * - `CertificadoKimberleyComponent`: Formulario y validación del certificado Kimberley.
   * - `ProrrogasComponent`: Gestión y validación de prorrogas.
   */
  @ViewChild('Solicitante') solicitante!: SolicitanteComponent;
  /** Instancia del componente para datos del trámite */
  @ViewChild('datosDelTramite')
  datosDelTramiteComponent!: DatosDelTramiteComponent;
  /** Instancia del componente para certificado Kimberley */
  @ViewChild('certificadoKimberley')
  certificadoKimberleyComponent!: CertificadoKimberleyComponent;
  /** Instancia del componente para prorrogas */
  @ViewChild('prorrogas') prorrogasComponent!: ProrrogasComponent;

  /**
   * Instancia del componente para partidas de la mercancía
   */
  @ViewChild('partidasDeLaMercancia')
  partidasDeLaMercanciaComponent!: PartidasDeLaMercanciaComponent;

  /** Instancia del componente para la solicitud */
  @ViewChild('solicitud')
  solicitudComponent!: SolicitudComponent;

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * En este método se llama al componente `SolicitanteComponent` para establecer el tipo de persona.
   */
  ngAfterViewInit(): void {
    // Llama al método para obtener el tipo de persona (en este caso, una persona moral nacional)
    if (this.solicitante) {
      this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    }
  }

  /**
   * Permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   *
   * @param {number} indice El índice de la pestaña seleccionada.
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
  }

  /**
   * Carga los datos del formulario desde un archivo JSON externo y los actualiza en el store.
   * También establece la bandera de datos cargados en verdadero.
   */
  // guardarDatosFormulario(): void {
  //   this.solocitud130301Service
  //     .getRegistroTomaMuestrasMercanciasData()
  //     .pipe(takeUntil(this.destroyNotifier$))
  //     .subscribe((resp) => {
  //       if (resp) {
  //         this.esDatosRespuesta = true;
  //         this.solocitud130301Service.actualizarEstadoFormulario(resp);
  //       }
  //     });
  // }

    getMostrarInitial(solicitud_id: string): void {
    this.solicitudProrrogaService.getDatosDeLaSolicitud(solicitud_id).pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp && resp.codigo === '00' && resp.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          this.esDatosRespuesta = true;
          if (DATOS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const MAPPED_DATA = this.solocitud130301Service.reverseBuildSolicitud130301(DATOS as Record<string, any>);
            this.solocitud130301Service.actualizarEstadoFormulario(MAPPED_DATA);
            // this.solicitudComponent.loadCatalogos(MAPPED_DATA); // Uncomment if needed
          } else {
            this.esDatosRespuesta = false;
          }
        }
      });
    }
  
  /**
   * Valida todos los formularios del paso uno del trámite 130301.
   * Verifica la validez de todos los componentes hijos: Solicitante, Datos de la solicitud,
   * Certificado Kimberley y Prorrogas.
   * Si algún formulario es inválido, marca todos los campos como tocados para mostrar los mensajes de error.
   * Incluye validación especial para campos deshabilitados en Prorrogas usando getRawValue().
   *
   * @returns {boolean} verdadero si todos los formularios son válidos, falso si alguno es inválido o no existe la referencia al componente.
   */
  public validarTodosFormulariosPasoUno(): boolean {
    let esValido = true;

    // Validar Solicitante (siempre debe estar presente)
    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        esValido = false;
      }
    } else {
      esValido = false;
    }

    // Solo validar otros componentes si los datos están cargados
    if (this.esDatosRespuesta) {
      // Validar Datos de la solicitud
      if (this.datosDelTramiteComponent?.datosDelTramite) {
        if (this.datosDelTramiteComponent.datosDelTramite.invalid) {
          this.datosDelTramiteComponent.markAllAsTouched();
          esValido = false;
        }
      } else {
        esValido = false;
      }

      // Validar Certificado Kimberley
      if (this.certificadoKimberleyComponent?.certificadoKimberley) {
        if (this.certificadoKimberleyComponent.certificadoKimberley.invalid) {
          this.certificadoKimberleyComponent.markAllAsTouched();
          esValido = false;
        }
      } else {
        esValido = false;
      }

      // Validar Prorrogas (incluir campos deshabilitados en validación)
      if (this.prorrogasComponent?.prorrogasForm) {
        // Validar campos requeridos específicos, incluso si están deshabilitados
        const VALORES_COMPLETOS =
          this.prorrogasComponent.prorrogasForm.getRawValue();
        const MOTIVO_JUSTIFICACION_VALIDO =
          VALORES_COMPLETOS.motivoJustificacion &&
          VALORES_COMPLETOS.motivoJustificacion.trim() !== '';
        const OTRAS_DECLARACIONES_VALIDO =
          VALORES_COMPLETOS.otrasDeclaraciones &&
          VALORES_COMPLETOS.otrasDeclaraciones.trim() !== '';

        if (
          this.prorrogasComponent.prorrogasForm.invalid ||
          !MOTIVO_JUSTIFICACION_VALIDO ||
          !OTRAS_DECLARACIONES_VALIDO
        ) {
          this.prorrogasComponent.markAllAsTouched();

          // Forzar marcado de campos deshabilitados como tocados para mostrar errores
          if (!MOTIVO_JUSTIFICACION_VALIDO) {
            this.prorrogasComponent.prorrogasForm
              .get('motivoJustificacion')
              ?.markAsTouched();
          }
          if (!OTRAS_DECLARACIONES_VALIDO) {
            this.prorrogasComponent.prorrogasForm
              .get('otrasDeclaraciones')
              ?.markAsTouched();
          }

          esValido = false;
        }
      } else {
        esValido = false;
      }
    }

    return esValido;
  }

  /**
   * Carga los datos del perfil del usuario utilizando el servicio de solicitud de prórroga.
   * Utiliza el folio del permiso almacenado en el estado de la solicitud y el RFC del entorno.
   * Los datos se cargan hasta que el componente es destruido para evitar fugas de memoria.
   * @returns {void}
   */
  cargarDatosPerfil(): void {
    // Prefer solicitudState.folioPermiso (registrar), fallback to consultaState.consultaioSolicitante.folioDelTramite (consulta)
    const FOLIO_PERMISO =
      this.solicitudState?.folioPermiso ||
      this.consultaState?.consultaioSolicitante?.folioDelTramite ||
      '';

    const PAYLOAD = {
      folioPermiso: FOLIO_PERMISO,
      rfc: this.loginRfc,
    };

    this.solicitudProrrogaService
      .cargarDatosPerfil(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((datos) => {
        this.solicitudProrrogaService.actualizarDatosPerfil(datos.datos);
        this.solicitudComponent.obtenerFormDatos();
        this.datosDelTramiteComponent.obtenerFormDatos();
        this.partidasDeLaMercanciaComponent.obtenerFormDatos();
        this.certificadoKimberleyComponent.obtenerFormDatos();
        this.prorrogasComponent.obtenerFormDatos();
      });
  }

  /**
   * Hook de destrucción del componente. Limpia las suscripciones activas para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
