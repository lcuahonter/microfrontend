import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { PagoDeDerechosComponent } from '../../../../../shared/components/shared2609/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../../shared/models/terceros-relacionados.model';
import {Tramite261101Query } from '../../../estados/queries/tramite261101query';
import { Tramite261101Store } from '../../../estados/tramites/tramite261101store';
import { ViewChild } from '@angular/core';


/**
 * @component PagoDeDerechosContenedoraComponent
 * @description Componente contenedor que utiliza el componente `PagoDeDerechosComponent`
 * para gestionar la funcionalidad relacionada con el pago de derechos.
 * Este componente interactúa con el estado del trámite a través del store `Tramite260210Store`.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy, OnChanges, OnInit{
  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   * Contiene toda la información relacionada con los datos del formulario de pago de derechos,
   * incluyendo los montos, conceptos y demás información necesaria para el proceso de pago.
   *
   * @public
   * @type {PagoDerechosFormState}
   * @memberof PagoDeDerechosContenedoraComponent
   */
  public pagoDerechos!: PagoDerechosFormState;

   /**
     * Valor del radio seleccionado en el formulario padre. Controla el estado de habilitación de los campos.
     */
   @Input() tipoTramite: string = '';

  /**
   * @property {boolean} esFormularioSoloLectura
   * @description Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar y solo se pueden visualizar.
   * Esta propiedad se actualiza dinámicamente basándose en el estado de consulta del sistema.
   *
   * @public
   * @type {boolean}
   * @default false
   * @memberof PagoDeDerechosContenedoraComponent
   */
  public esFormularioSoloLectura: boolean = true; // Disabled by default
 

 

  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

   /**
     * Identificador único del procedimiento.
     * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
     */
    public readonly idProcedimiento = 261101;
  

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Notificador utilizado para manejar la destrucción o desuscripción de observables.
   * Se usa comúnmente para limpiar suscripciones cuando el componente es destruido,
   * evitando así fugas de memoria y comportamientos inesperados.
   * Este Subject emite un valor cuando el componente va a ser destruido.
   *
   * @private
   * @type {Subject<void>}
   * @memberof PagoDeDerechosContenedoraComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description Constructor que inyecta las dependencias necesarias para el funcionamiento del componente.
   * Inicializa el store `Tramite260210Store` para gestionar el estado del trámite y el query `ConsultaioQuery`
   * para manejar el estado de consulta. También configura la suscripción para detectar cambios en el modo
   * de solo lectura del formulario y establece el valor inicial del pago de derechos.
   *
   * El constructor realiza las siguientes operaciones:
   * 1. Suscribe al estado de consulta para detectar cambios en el modo de solo lectura
   * 2. Inicializa la propiedad `pagoDerechos` con el valor actual del store
   * 3. Gestiona la limpieza automática de suscripciones mediante `takeUntil`
   *
   * @param {Tramite260210Store} tramiteStore - Store que administra el estado del trámite 260214.
   *                                            Proporciona métodos para actualizar y obtener el estado del formulario.
   * @param {ConsultaioQuery} consultaQuery - Query service para manejar el estado de consulta del sistema.
   *                                          Permite detectar si el formulario debe estar en modo de solo lectura.
   *
   * @memberof PagoDeDerechosContenedoraComponent
   */
  constructor(
    public tramiteStore: Tramite261101Store,
    private consultaQuery: ConsultaioQuery,
    private tramiteQuery: Tramite261101Query
  ) {
    console.log('Constructor pago de derechos contenedora');
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    
 //  this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
  }


  ngOnInit(): void {
this.tramiteQuery.selectSolicitud$.pipe(
  takeUntil(this.destroyNotifier$))
  .subscribe((solicitudState) => {
    this.pagoDerechos = solicitudState.pagoDerechos;
  }
 
)
  }

   /**
   * Habilita los campos solo cuando se selecciona una opción de radio (tipoTramite tiene valor)
   */
   ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoTramite']) {
      // Enable all fields as soon as any radio selection is made (tipoTramite is not empty/null/undefined)
      this.esFormularioSoloLectura = !this.tipoTramite;
    }
  }

  /**
   * @method updatePagoDerechos
   * @description Actualiza los datos del formulario de pago de derechos en el store del trámite.
   * Este método actúa como un puente entre el componente hijo `PagoDeDerechosComponent` y el store
   * del trámite, permitiendo que los cambios realizados en el formulario se reflejen en el estado global.
   *
   * Cuando se produce un cambio en el formulario hijo, este método recibe el nuevo estado
   * y lo propaga al store correspondiente, asegurando que la información esté sincronizada
   * en toda la aplicación.
   *
   * @param {PagoDerechosFormState} event - Estado actualizado del formulario de pago de derechos.
   *                                        Contiene todos los datos del formulario incluyendo montos,
   *                                        conceptos, fechas y demás información relevante del pago.
   *
   * @returns {void} Este método no retorna ningún valor.
   *
   * @example
   * // Ejemplo de uso cuando se actualiza el formulario
   * const nuevoEstado: PagoDerechosFormState = {
   *   monto: 1500.00,
   *   concepto: 'Permiso de importación',
   *   // ... otros campos
   * };
   * this.updatePagoDerechos(nuevoEstado);
   *
   * @memberof PagoDeDerechosContenedoraComponent
   */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }

  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }

  

  /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Se utiliza para limpiar las suscripciones activas y evitar fugas de memoria.
   *
   * Este método es crucial para el manejo adecuado de recursos y memoria en la aplicación.
   * Al ejecutarse cuando el componente va a ser destruido, se encarga de:
   * 1. Emitir una señal a través del `destroyNotifier$` para notificar a todas las suscripciones activas
   * 2. Completar el Subject `destroyNotifier$` para liberar todos los recursos asociados
   *
   * Esto es especialmente importante en aplicaciones Angular para prevenir:
   * - Fugas de memoria por suscripciones no cerradas
   * - Comportamientos inesperados por observables que continúan ejecutándose
   * - Problemas de rendimiento por acumulación de suscripciones
   *
   * @implements {OnDestroy}
   * @returns {void} Este método no retorna ningún valor.
   *
   * @memberof PagoDeDerechosContenedoraComponent
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
