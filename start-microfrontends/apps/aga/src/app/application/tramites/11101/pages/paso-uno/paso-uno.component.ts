import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, FormularioDinamico, PERSONA_MORAL_NACIONAL } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { SolicitanteComponent } from '../../components/solicitante/solicitante.component';
import { TramiteFolioService } from '../../service/servicios-extraordinarios.service';

/**
 * Componente para gestionar el paso uno del trámite.
 * Este componente permite la selección de pestañas y actualiza el índice actual.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
})
export class PasoUnoComponent implements OnInit,AfterViewInit, OnDestroy {

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false; // Indica si hay datos de respuesta del servidor
  private destroyNotifier$: Subject<void> = new Subject(); // Subject para manejar la destrucción de suscripciones
  public consultaState!: ConsultaioState; // Estado de la consulta
  public persona!: ({ labelNombre: string; campo: string; class: string; tipo_input: string; disabled: boolean; tooltip: string; validators: string[]; placeholder: string; } | { labelNombre: string; campo: string; class: string; tipo_input: string; disabled: boolean; validators: string[]; placeholder: string; tooltip?: undefined; })[];

  constructor(
    private service: TramiteFolioService, // Servicio para manejar la solicitud
    private consultaQuery: ConsultaioQuery // Servicio para consultar el estado
  ) {
    // Constructor vacío: La inicialización se realizará en métodos específicos según sea necesario.
  }

  /**
 * Referencia al componente de solicitante.
 */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
 * Datos del formulario dinámico de la persona.
 */
  tipoPersona!: number; // Variable para almacenar el tipo de persona

  /**
 * Datos del formulario dinámico del domicilio fiscal.
 */
  domicilioFiscal: FormularioDinamico[] = []; // Datos del formulario de domicilio fiscal
  /**
   * Índice de la pestaña actualmente seleccionada.
   * @type {number}
   */
  indice: number = 1;

  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormulario()
    } else {
      this.esDatosRespuesta = true
    }
  }


   guardarDatosFormulario(): void {
    // Método para guardar los datos del formulario
    this.service
      .getDatosDeTrtamitelDoc().pipe(
        takeUntil(this.destroyNotifier$) // Se desuscribe al destruir el componente
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true; // Marca que hay datos de respuesta
          this.service.actualizarEstadoFormulario(resp); // Actualiza el estado del formulario con la respuesta
        }
      });
  }

    /**
   * Método que se ejecuta después de que la vista ha sido inicializada.
   */
  ngAfterViewInit(): void {
    this.persona = PERSONA_MORAL_NACIONAL; // Asigna los datos de persona moral nacional
    this.domicilioFiscal = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL; // Asigna los datos de domicilio fiscal
  }
/**
 * Selecciona una pestaña específica y actualiza el índice actual.
 *
 * Este método permite cambiar la pestaña activa en la interfaz de usuario.
 *
 * @param {number} i - El índice de la pestaña a seleccionar.
 * @returns {void}
 */
seleccionaTab(i: number): void {
  this.indice = i;
}

  ngOnDestroy(): void {
    // Se ejecuta al destruir el componente
    this.destroyNotifier$.next(); // Emite el evento de destrucción
    this.destroyNotifier$.complete(); // Completa el subject para limpiar suscripciones
  }
}