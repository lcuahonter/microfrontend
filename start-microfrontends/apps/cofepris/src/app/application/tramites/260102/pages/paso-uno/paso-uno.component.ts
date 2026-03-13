import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SeccionLibStore, SolicitanteComponent } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsumoPersonalService } from '../../services/consumo-personal.service';
import { ContenedorDeDatosSolicitudComponent } from '../../components/contenedor-de-datos-solicitud/contenedor-de-datos-solicitud.component';
import { PagoDeDerechosContenedoraComponent } from '../../components/pago-de-derechos-contenedora/pago-de-derechos-contenedora.component';
import { SECCIONES_TRAMITE_260102 } from '../../constantes/consumo-personal.enum';
import { TercerosRelacionadosVistaComponent } from '../../components/terceros-relacionados-vista/terceros-relacionados-vista.component';

@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    ContenedorDeDatosSolicitudComponent,
    TercerosRelacionadosVistaComponent,
    PagoDeDerechosContenedoraComponent
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnChanges, OnDestroy {
  /**
   * Índice numérico utilizado como referencia o posición actual.
   * Comienza en 1 por defecto.
   *
   * @type {number}
   */
  indice: number = 1;
  /**
   * Esta variable se utiliza para almacenar el índice del subtítulo.
   */
  public consultaState!: ConsultaioState;

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
* @property idProcedimiento
* @description Identificador numérico del trámite o procedimiento en curso.
* @type {number}
* @readonly
*/
  public readonly idProcedimiento: number = 260102;

  @Input() confirmarSinPagoDeDerechos: number = 0;

  @ViewChild(SolicitanteComponent) solicitanteComponent!: SolicitanteComponent;
  
  @ViewChild(ContenedorDeDatosSolicitudComponent) contenedorDatosSolicitudComponent!: ContenedorDeDatosSolicitudComponent;

  @ViewChild(TercerosRelacionadosVistaComponent) tercerosRelacionadosComponent!: TercerosRelacionadosVistaComponent;

  @ViewChild(PagoDeDerechosContenedoraComponent) pagoDerechosComponent!: PagoDeDerechosContenedoraComponent;

  /**
   * Constructor del componente que inicializa el estado de la consulta
   * y determina si se deben guardar los datos del formulario o mostrar solo los datos de respuesta.
   *
   * @param {SeccionLibStore} seccionStore - Store para manejar las secciones del trámite.
   * @param {ConsultaioQuery} consultaQuery - Servicio para obtener el estado de la consulta.
   * @param {ConsumoPersonalService} ConsumoPersonalService - Servicio para gestionar el consumo personal.
   */
  constructor(private seccionStore: SeccionLibStore, private consultaQuery: ConsultaioQuery, private ConsumoPersonalService: ConsumoPersonalService) {
     this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === this.idProcedimiento.toString() &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confirmarSinPagoDeDerechos'] && !changes['confirmarSinPagoDeDerechos'].firstChange) {
      const CONFIRMAR_VALOR = changes['confirmarSinPagoDeDerechos'].currentValue;
      if (CONFIRMAR_VALOR) {
        this.seleccionaTab(CONFIRMAR_VALOR);
      }
    }
  }
  /**
   * Método para seleccionar una pestaña específica en la interfaz de usuario.
   * @param {number} i - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosFormulario(): void {
    this.ConsumoPersonalService
      .obtenerRegistroTomarMuestrasDatos().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.ConsumoPersonalService.actualizarEstadoFormulario(resp);
        }
      });
  }

  validarPasoUno(): boolean {
    const ES_TAB_VALIDO = this.contenedorDatosSolicitudComponent?.validarContenedor() ?? false;
    const ES_TERCEROS_VALIDO = this.tercerosRelacionadosComponent.validarContenedor() ?? false;
    // const ES_PAGO_VALIDO = this.pagoDerechosComponent.validarContenedor() ?? false;
    return (
      (ES_TAB_VALIDO && ES_TERCEROS_VALIDO) ? true : false

    );
  }

  /**
* Método para asignar las secciones existentes al stored
*/
  private asignarSecciones(): void {
    const SECCIONES: boolean[] = [];
    const FORMA_VALIDA: boolean[] = [];
    const PREDETERMINADO = SECCIONES_TRAMITE_260102
    for (const LLAVE_SECCION in PREDETERMINADO.PASO_1) {
      if (Object.prototype.hasOwnProperty.call(PREDETERMINADO.PASO_1, LLAVE_SECCION)) {
        // @ts-expect-error - fix this
        SECCIONES.push(PREDETERMINADO.PASO_1[LLAVE_SECCION]);
        FORMA_VALIDA.push(false);
      }
    }
    this.seccionStore.establecerSeccion(SECCIONES);
    this.seccionStore.establecerFormaValida(FORMA_VALIDA);
  }
  /**
* Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
*
* Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
* que el componente está siendo destruido, y luego completa el observable para liberar recursos.
*
* @returns {void} No retorna ningún valor.
*/
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
