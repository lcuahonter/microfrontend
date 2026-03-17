import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico } from '@ng-mf/data-access-user';
import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL, } from '@libs/shared/data-access-user/src/tramites/constantes/solicitante-constantes.enum';
import { Subject, map, takeUntil } from 'rxjs';
import { AdaceService } from '../../services/aviso-retorno.service';
import { SolicitanteComponent, } from '@libs/shared/data-access-user/src';
import { Tramite32514Store } from '../../state/Tramite32514.store';
/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit, OnDestroy {

  /**
 * Referencia al componente de solicitante.
 */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;

  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = PERSONA_MORAL_NACIONAL;

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

    /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
    public consultaState!: ConsultaioState;

    /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
    public esDatosRespuesta: boolean = false;
  
    /** Subject para notificar la destrucción del componente. */
    private destroyNotifier$: Subject<void> = new Subject();

    /**
     * Constructor del componente que inyecta los servicios necesarios para consultar
     * el estado general de la solicitud y realizar operaciones relacionadas con ADACE.
     *
     * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado general de la solicitud.
     * @param {AdaceService} adace - Servicio para operaciones relacionadas con ADACE.
     */
    constructor(
      private consultaQuery: ConsultaioQuery,
      private adace: AdaceService,
      private store: Tramite32514Store
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
      this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
        this.consultaState = seccionState;
      })).subscribe();
      if (this.consultaState && this.consultaState.procedureId === '32514' &&
        this.consultaState.update) {
        this.guardarDatosFormulario();
      } else {
        this.esDatosRespuesta = true;
      }
  
    }

    /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
    guardarDatosFormulario(): void {
      this.adace
        .getRegistroTomaMuestrasMercanciasData().pipe(
          takeUntil(this.destroyNotifier$)
        )
        .subscribe((resp) => {
          if (resp) {
            this.esDatosRespuesta = true;
            this.store.actualizarEstadoFormulario(resp);
          }
        });
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


  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
}
