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
  FormularioDinamico,
} from '@ng-mf/data-access-user';
import {
  DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL,
  PERSONA_MORAL_NACIONAL,
} from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { SharedModule, SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { RegistroSolicitudService } from '../../services/registro-solicitud-service.service';
import { SolicitudComponent } from '../../components/Solicitud.component';

/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    SolicitanteComponent,
    SolicitudComponent,
  ],
})
export class PasoUnoComponent implements AfterViewInit, OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false; // Indica si hay datos de respuesta del servidor
  /**
     * Subject para manejar la destrucción del componente y evitar fugas de memoria.
     * Se utiliza para notificar a las suscripciones que deben finalizarse.
     */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public consultaState!: ConsultaioState; // Estado de la consulta
  public datosRespuesta: unknown; // Datos de respuesta del servidor

  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Referencia al componente de solicitud.
   */
  @ViewChild(SolicitudComponent) solicitudComponent!: SolicitudComponent;

  /**
   * Constructor del componente PasoUnoComponent.
   * @param router Inyecta el servicio Router para la navegación.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private solicitud31803Service: RegistroSolicitudService // Servicio para manejar el estado de la solicitud 31802
  ) { }

  /**
   * Inicializa el componente y suscripciones al estado de consulta.
   *
   * Se suscribe al observable `selectConsultaioState$` para obtener el estado actual de la consulta.
   * Si el estado indica que se debe actualizar (`update` es true), llama a `guardarDatosFormulario()` para cargar los datos
   * y actualizar el estado global. Si no, marca que existen datos de respuesta.
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((consultaState) => {
          this.consultaState = consultaState;
        })
      )
      .subscribe();
    if (this.consultaState?.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Obtiene los datos de la solicitud desde el servicio y actualiza el estado global.
   *
   * Realiza una petición al servicio para obtener los datos de la solicitud.
   * Al recibir la respuesta, marca que existen datos de respuesta y construye un objeto `Solicitud31803State`
   * con los datos recibidos. Luego, actualiza el estado global del formulario utilizando el método
   * `actualizarEstadoFormulario` del servicio.
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  guardarDatosFormulario(): void {
    this.solicitud31803Service
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.solicitud31803Service.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * Método que se ejecuta después de que las vistas del componente han sido inicializadas.
   * Configura los formularios dinámicos y obtiene el tipo de persona.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL;
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;
  }

  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   *
   * Emite un valor y completa el subject `destroyNotifier$` para notificar a todas las suscripciones
   * que deben finalizarse, evitando así fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
