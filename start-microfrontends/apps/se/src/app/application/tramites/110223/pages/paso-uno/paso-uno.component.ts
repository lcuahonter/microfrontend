import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ConsultaioQuery, ConsultaioState } from "@ng-mf/data-access-user";
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, FormularioDinamico, PERSONA_MORAL_NACIONAL, SolicitanteComponent, TIPO_PERSONA } from "@libs/shared/data-access-user/src";
import { Subject, takeUntil } from "rxjs";
import { CertificadoOrigenComponent } from "../../components/certificado-origen/certificado-origen.component";
import { CertificadosOrigenService } from "../../services/certificado-origen.service";
import { CommonModule } from "@angular/common";
import { DatosCertificadoComponent } from "../../components/datos-certificado/datos_certificado.component";
import { DestinatarioDeCertificadoComponent } from "../../components/destinatario-de-certificado/destinatario-de-certificado.component";
import { HistoricoProductoressComponent } from "../../components/historico-productores/historico-productores.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Tramite110223Store, TramiteState } from "../../estados/Tramite110223.store";

/**
 * Componente correspondiente al primer paso del flujo del trámite.
 * Contiene la lógica y vista para capturar datos del solicitante, su domicilio fiscal
 * y el certificado de origen, además de manejar estados de solo lectura y edición.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: true,
  imports: [
    SolicitanteComponent,
    CertificadoOrigenComponent,
    HistoricoProductoressComponent,
    DatosCertificadoComponent,
    ReactiveFormsModule,
    CommonModule,
    DestinatarioDeCertificadoComponent
  ]
})
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {
  
    /**
   * @property {SolicitanteComponent} solicitante
   * @description
   * Referencia al componente hijo `SolicitanteComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de solicitante desde el componente padre.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Representa el tipo de persona (física o moral).
   */
  tipoPersona!: number;

  /**
   * Arreglo de campos de formulario para datos del solicitante.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Arreglo de campos de formulario para datos del domicilio fiscal del solicitante.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de pestaña activa en la interfaz de usuario.
   */
  indice: number = 1;

  /**
   * Subject utilizado para cancelar suscripciones activas al destruir el componente.
   * Esto previene fugas de memoria.
   * @private
   */
  public destroyNotifier$ = new Subject<void>();

  /**
   * Controla si el formulario se encuentra deshabilitado (solo lectura).
   */
  formularioDeshabilitado: boolean = false;

    /**
   * @property {CertificadoOrigenComponent} certificadoOrigen
   * @description
   * Referencia al componente hijo `CertificadoOrigenComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de certificado de origen desde el componente padre.
   */
  @ViewChild('CertificadoOrigen') certificadoOrigen!: CertificadoOrigenComponent;

  /**
   * @property {DatosCertificadoComponent} datosCertificado
   * @description
   * Referencia al componente hijo `DatosCertificadoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos del certificado desde el componente padre.
   */
  @ViewChild('DatosCertificado') datosCertificado!: DatosCertificadoComponent;
  /**
   * @property {DatosCertificadoComponent} datosCertificado
   * @description
   * Referencia al componente hijo `DatosCertificadoComponent` mediante ViewChild.
   * Permite acceder a los métodos y propiedades del formulario de datos del certificado desde el componente padre.
   */
  @ViewChild('Destinatario') destinatario!: DestinatarioDeCertificadoComponent;

  /**
   * Indica si ya se cargaron los datos de respuesta para mostrar en el formulario.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Estado actual de la consulta obtenido desde el store.
   */
  public consultaState!: ConsultaioState;

  /**
   * Constructor con inyección de dependencias para servicios de detección de cambios,
   * gestión de certificados de origen y consulta de estado de edición.
   * 
   * @param cdr Servicio de Angular para ejecutar detección de cambios manual.
   * @param certificadosOrigenGridService Servicio para gestión de datos de certificados de origen.
   * @param consultaQuery Servicio que expone el estado del proceso y permite reaccionar a cambios.
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private certificadosOrigenGridService: CertificadosOrigenService,
    private consultaQuery: ConsultaioQuery,
    public tramite110223Store: Tramite110223Store
  ) {}

  /**
   * Hook del ciclo de vida Angular que se ejecuta al iniciar el componente.
   * Se suscribe a los cambios del estado de consulta y actualiza la vista en función del modo (lectura o edición).
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.consultaState = seccionState;
        if (seccionState.update) {
          this.formularioDeshabilitado = false;
          this.guardarDatosFormulario(this.consultaState?.id_solicitud);
          this.tramite110223Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
        } else {
          this.esDatosRespuesta = true;
        }
        if (seccionState.readonly) {
          this.formularioDeshabilitado = true;
        }
      });
  }

  /**
   * Método que consulta los datos almacenados en el servicio `CertificadosOrigenGridService`
   * y actualiza el estado del formulario si la respuesta es válida.
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.certificadosOrigenGridService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            const MAPPED_DATA = this.certificadosOrigenGridService.reverseBuildSolicitud110223(DATOS as Record<string, unknown>);
            this.certificadosOrigenGridService.actualizarEstadoFormulario(MAPPED_DATA as unknown as TramiteState);
          }
          this.esDatosRespuesta = true;
        }
      });
  
  }

  /**
   * Hook del ciclo de vida Angular que se ejecuta después de que la vista se haya inicializado.
   * Asigna los formularios dinámicos correspondientes y establece el tipo de persona por defecto.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
    this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    this.cdr.detectChanges();
  }

  /**
   * Cambia el índice de la pestaña activa en la interfaz de usuario.
   *
   * @param indice Nuevo índice que se desea seleccionar.
   */
  seleccionaTab(indice: number): void {
    this.indice = indice;
  }

  /**
   * @method validarFormularios
   * @description
   * Valida todos los formularios del paso uno: solicitante, certificado de origen y datos del certificado.
   * Marca los controles como tocados si algún formulario es inválido para mostrar los errores de validación.
   * Retorna `true` si todos los formularios son válidos, de lo contrario retorna `false`.
   *
   * @returns {boolean} Indica si todos los formularios del paso uno son válidos.
   */
  public validarFormularios(): boolean {
    let isValid = true;

    if (this.solicitante?.form) {
      if (this.solicitante.form.invalid) {
        this.solicitante.form.markAllAsTouched();
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.certificadoOrigen) {
      if (!this.certificadoOrigen.validarFormulario()) {
        isValid = true;
      }
    } else {
      isValid = false;
    }

    if (this.datosCertificado) {
      if (!this.datosCertificado.validarFormulario()) {
        isValid = true;
      }
    } else {
      isValid = false;
    }

    if(this.destinatario){
       if (!this.destinatario.validateAllForms()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    
    return isValid;
  }

  /**
   * Delegates validation to PeruDestinatarioComponent
   */
  public validateAllForms(): boolean {
    return this.destinatario?.validateAllForms() ?? true;
  }

  /**
   * Hook del ciclo de vida Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas mediante la emisión del Subject.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
