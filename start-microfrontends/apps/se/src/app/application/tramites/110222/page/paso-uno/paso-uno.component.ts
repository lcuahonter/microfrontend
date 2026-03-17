import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadoOrigenComponent } from '../../components/certificado-origen/certificado-origen.component';
import { DatosCertificadoComponent } from '../../components/datos-certificado/datos-certificado.component';
import { DestinatarioDeCertificadoComponent } from '../../components/destinatario-de-certificado/destinatario-de-certificado.component';
import { HistoricoDeProductoresComponent } from '../../components/historico-de-productores/historico-de-productores.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {number} indice - El índice de la pestaña seleccionada.
   */
  indice: number = 1;
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;
  /** Referencia al componente DestinatarioDeCertificadoComponent mediante ViewChild. */
  @ViewChild('DestinatarioDeCertificadoComponent')
  destinatarioComponent!: DestinatarioDeCertificadoComponent;
  /** Referencia al componente CertificadoOrigenComponent mediante ViewChild. */
  @ViewChild('CertificadoOrigen')
  certificadoOrigen!: CertificadoOrigenComponent;
  /** Referencia al componente HistoricoDeProductoresComponent mediante ViewChild. */
  @ViewChild('HistoricoDeProductoresComponent')
  HistoricoDeProductoresComponent!: HistoricoDeProductoresComponent;
  /** Referencia al componente DatosCertificadoComponent mediante ViewChild. */
  @ViewChild('DatosCertificado') datosCertificado!: DatosCertificadoComponent;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Referencia al componente SolicitanteComponent mediante ViewChild.
   * Se utiliza para invocar métodos o acceder a propiedades del componente hijo.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Inyección de dependencias a través del constructor. */
  constructor(
    private consultaQuery: ConsultaioQuery,
    public validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService
  ) { }

  /**
   * @inheritdoc
   *
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable del estado de consulta, actualiza el estado local y
   * realiza acciones según si hay una actualización pendiente.
   *
   * @remarks
   * - Si existe un estado de consulta y requiere actualización, guarda los datos del formulario.
   * - Si no, establece la bandera de datos de respuesta como verdadera.
   *
   * @override
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
    if (
      this.consultaState &&
      this.consultaState.procedureId === '110222' &&
      this.consultaState.update
    ) {
      this.guardarDatosFormulario(this.consultaState.id_solicitud);
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Delegates validation to PeruDestinatarioComponent
   */
  /**
   * Delegates validation to PeruDestinatarioComponent
   */
  public validateAllForms(): boolean {
    return this.destinatarioComponent?.validateAllForms() ?? true;
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(id_solicitud: string): void {
    this.validarInicialmenteCertificadoService
      .getMostrarSolicitud(id_solicitud)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        if (resp?.datos) {
          const DATOS = Array.isArray(resp.datos) ? resp.datos[0] : resp.datos;
          if (DATOS) {
            const MAPPED_DATA = this.validarInicialmenteCertificadoService.reverseBuildSolicitud110222(DATOS as Record<string, unknown>);
            // Ensure 'bloque' is present to satisfy Tramite110222State
            const mappedWithBloque = {
              ...MAPPED_DATA,
              bloque: (MAPPED_DATA as any).bloque ?? { id: 0, clave: '', descripcion: '' }
            };
            this.validarInicialmenteCertificadoService.actualizarEstadoFormulario(mappedWithBloque as any);
          }
          this.esDatosRespuesta = true;
        }
      });
  }
  /**
   * @method seleccionaTab
   * @description Selecciona una pestaña y actualiza el índice.
   * @param {number} i - El índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Método público para validar todos los formularios del paso uno */
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
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.destinatarioComponent) {
      if (!this.destinatarioComponent.validarFormulario()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    if (this.datosCertificado) {
      if (!this.datosCertificado.validateAll()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Utiliza el Subject `destroyNotifier$` para notificar la destrucción y completar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
