import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CertificadoApiData, ColumnasTabla } from '../../models/certificado.model';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico, SolicitanteComponent, TIPO_PERSONA } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud110219State, Tramite110219Store } from '../../estados/Tramite110219.store';
import { CancelacionDeCertificadoComponent } from '../../components/cancelacion-de-certificado/cancelacion-de-certificado.component';
import { CertificadoDeOrigenComponent } from "../../components/certificado-de origen/certificado-de-origen.component";
import { CertificadoService } from '../../services/certificado.service';
import { CommonModule } from '@angular/common';

/**
 * Componente para gestionar el paso uno del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    CancelacionDeCertificadoComponent,
    CertificadoDeOrigenComponent,
  ],
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Indica si el número de certificado es válido.
   */
  isNumeroDe!: boolean;

  /**
   * Indica si el patrón del número de certificado es válido.
   */
  isNumeroDePattern!: boolean;

  /**
   * Evento para emitir el índice de la pestaña seleccionada al componente padre.
   */
  @Output() miEvento: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Referencia al componente `SolicitanteComponent`.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Referencia al componente `SolicitanteComponent`.
   */
  @ViewChild(CancelacionDeCertificadoComponent) cancelacionDeCertificadoComponent!: CancelacionDeCertificadoComponent;

  /**
   * Referencia al componente `SolicitanteComponent`.
   */
  @ViewChild(CertificadoDeOrigenComponent) certificadoDeOrigenComponent!: CertificadoDeOrigenComponent;

  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario para la persona moral.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice de la pestaña seleccionada en la UI.
   */
  indice: number = 1;

  /**
   * Indica si los datos están disponibles.
   */
  isDatos!: boolean;

  /**
   * Indica si el certificado está habilitado.
   */
  isCertificado!: boolean;

  /**
   * Datos del certificado seleccionado.
   */
  certificadoData: ColumnasTabla | null = null;

  /**
   * Datos completos de la API del certificado seleccionado.
   */
  certificadoApiDataCompleto: CertificadoApiData | null = null;

  /**
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Evento para emitir datos al componente padre.
   */
  @Output() eventoDatosHijo: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Evento para emitir si el número de certificado es válido.
   */
  @Output() eventoNumeroDe: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Evento para emitir si el patrón del número de certificado es válido.
   */
  @Output() eventoNumeroDePattern: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Evento para emitir datos del certificado al componente padre.
   */
  @Output() eventoDatosHijoCertificado: EventEmitter<number> =
    new EventEmitter<number>();

  /**
   * Evento para emitir si los datos de número son válidos.
   */
  @Output() isDatosNumero: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  /**
   * Evento para emitir si hay un error de patrón en la cancelación (excede 1500 caracteres).
   */
  @Output() eventoCancelacionPattern: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Estado de la consulta, utilizado para manejar el estado de la aplicación.
   */
  public consultaState!: ConsultaioState;

  /**
   * Indica si los datos de respuesta están disponibles.
   * Se utiliza para determinar si se deben mostrar los datos del formulario o no.
   */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   *
   * @param cdr Servicio para detectar cambios manualmente.
   * @param consultaQuery Servicio para consultar el estado de la sección.
   * @param certificadoService Servicio para gestionar certificados.
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private consultaQuery: ConsultaioQuery,
    private certificadoService: CertificadoService,
    private tramite110219Store: Tramite110219Store,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al estado de consulta y determina si se deben cargar los datos del formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaState = seccionState;
          if (this.consultaState.update) {
            this.guardarDatosFormularios(this.consultaState?.id_solicitud);
            this.tramite110219Store.setIdSolicitud(Number(this.consultaState?.id_solicitud));
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
    
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormularios(id_solicitud: string): void {
    this.certificadoService.getMostrarSolicitud(id_solicitud)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((resp) => {
              if (resp) {
                if (resp?.datos) {
                  const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
                  if (DATOS) {
                    const MAPPED_DATA = this.certificadoService.reverseBuildSolicitud110201(DATOS as Record<string, unknown>) as unknown as Solicitud110219State;
                    this.certificadoService.actualizarEstadoFormulario(MAPPED_DATA);
                  }
                this.esDatosRespuesta = true;
              }
            }
            });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido inicializada.
   * Configura los datos de persona y domicilio fiscal y asigna el tipo de persona en el componente `SolicitanteComponent`.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;

    setTimeout(() => {
      this.solicitante.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * Cambia la pestaña seleccionada en la UI.
   *
   * @param i Índice de la pestaña a activar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.miEvento.emit(this.indice);
  }

  /**
   * Emite un evento al componente padre con los datos proporcionados.
   *
   * @param data Datos a emitir al componente padre.
   */
  emitirCancelacion(data: number): void {
    this.eventoDatosHijo.emit(data);
    this.indice = 3;
    this.seleccionaTab(this.indice);
  }

  /**
   * Actualiza el estado de validez del número de certificado y emite el evento correspondiente.
   * @param event Valor booleano que indica si el número es válido.
   */
  isNumero(event: boolean):void {
    this.isNumeroDe = event;
    this.eventoNumeroDe.emit(this.isNumeroDe);
  }

  /**
   * Actualiza el estado de validez del patrón del número de certificado y emite el evento correspondiente.
   * @param event Valor booleano que indica si el patrón es válido.
   */
  isNumeroPattern(event: boolean): void {
    this.isNumeroDePattern = event;
    this.eventoNumeroDePattern.emit(this.isNumeroDePattern);
  }

  /**
   * Emite datos del certificado al componente padre y cambia la pestaña activa.
   * @param data Datos del certificado.
   */
  numeroData(data: number): void {
    this.eventoDatosHijoCertificado.emit(data);
    this.indice = 3;
    this.seleccionaTab(this.indice);
  }

  /**
   * Emite si los datos del número son válidos.
   * @param data Valor booleano que indica si los datos del número son válidos.
   */
  isNumeroData(data: boolean): void {
    this.isDatosNumero.emit(data);
  }

  /**
   * Actualiza el estado de habilitación del certificado.
   * @param event Valor booleano que indica si el certificado está habilitado.
   */
  certificadoEnable(event: boolean): void {
    this.isCertificado = event;
  }

  /**
   * Maneja la selección de un certificado desde la tabla.
   * @param certificado Datos del certificado seleccionado.
   */
  onCertificadoSeleccionado(certificado: ColumnasTabla): void {
    this.certificadoData = certificado;
  }

  /**
   * Maneja la recepción de los datos completos de la API del certificado seleccionado.
   * @param certificadoApiData Datos completos de la API del certificado seleccionado.
   */
  onCertificadoApiDataSeleccionado(
    certificadoApiData: CertificadoApiData
  ): void {
    this.certificadoApiDataCompleto = certificadoApiData;
  }

  /**
   * Maneja el evento de patrón de cancelación desde el componente certificado-de-origen.
   * @param isCancelacionPatternError - Indica si hay un error de patrón en la cancelación
   */
  onCancelacionPattern(isCancelacionPatternError: boolean): void {
    this.eventoCancelacionPattern.emit(isCancelacionPatternError);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Libera los recursos y completa el observable destroyed$.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
    if (this.certificadoDeOrigenComponent) {
      if (!this.certificadoDeOrigenComponent.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }
}