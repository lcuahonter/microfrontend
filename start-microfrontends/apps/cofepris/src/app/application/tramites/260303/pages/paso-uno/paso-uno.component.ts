import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CertificadosLicenciasPermisosService } from '../../services/certificados-licencias-permisos.service';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudContenedoraComponent } from '../../components/datos-de-la-solicitud-contenedora/datos-de-la-solicitud.contenedora';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src/tramites/components/solicitante/solicitante.component';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados.contenedora';
/**
 * PasoUnoComponent es responsable de manejar el primer paso del proceso.
 * para actualizar el componente actual que se está mostrando.
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDeLaSolicitudContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
    PagoDeDerechosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit {
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  indice: number = 1;
  /**
   * Este método se utiliza para establecer el índice del subtítulo.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta obtenido del store. */
  public consultaState!: ConsultaioState;

  /** Componente hijo para manejar los datos del solicitante. */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /** Componente hijo para manejar los datos de la solicitud. */
  @ViewChild(DatosDeLaSolicitudContenedoraComponent)
  datosDeLaSolicitudContenedoraComponent!: DatosDeLaSolicitudContenedoraComponent;

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Componente hijo para manejar los datos de terceros relacionados. */
  @ViewChild(PagoDeDerechosContenedoraComponent)
  pagoDeDerechosContenedoraComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * Constructor del componente.
   * @param consultaQuery Servicio para consultar el estado de la consulta.
   * @param certificadosLicenciasPermisosService Servicio para manejar los datos del formulario de certificados, licencias y permisos.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private certificadosLicenciasPermisosService: CertificadosLicenciasPermisosService
  ) {}

  /**
   * Método de ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado de consulta y actualiza la variable local.
   * Si el estado indica que hay una actualización, guarda los datos del formulario.
   * De lo contrario, marca que ya existen datos de respuesta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          // Actualiza el estado local con el valor obtenido del store
          this.consultaState = seccionState;

          // Verifica si se debe actualizar el formulario o solo mostrar los datos existentes
          if (this.consultaState && this.consultaState.update) {
            this.guardarDatosFormulario();
          } else {
            this.esDatosRespuesta = true;
          }
        })
      )
      .subscribe();
  }

  /**
   * Método para guardar los datos del formulario.
   * Obtiene los datos del formulario desde el servicio y actualiza el estado si la respuesta es válida.
   */
  guardarDatosFormulario(): void {
    this.certificadosLicenciasPermisosService
      .getFormularioData()
      .pipe(
        takeUntil(this.destroyNotifier$) // Cancela la suscripción al destruir el componente
      )
      .subscribe((resp) => {
        if (resp) {
          // Si la respuesta existe, marca que hay datos de respuesta y actualiza el estado del formulario
          this.esDatosRespuesta = true;
          this.certificadosLicenciasPermisosService.actualizarEstadoFormulario(
            resp
          );
        }
      });
  }

  /**
   * Método para validar los formularios dentro del componente.
   * @returns true si todos los formularios son válidos, false en caso contrario.
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

    if (this.pagoDeDerechosContenedoraComponent) {
      if (!this.pagoDeDerechosContenedoraComponent.validarContenedor()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }
}
