import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ID_PROCEDIMIENTO } from '../../constantes/permiso-sanitario-importacion-medicamentos.enum';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite260204Query } from '../../estados/queries/tramite260204Query.query';
import { Tramite260204Store } from '../../estados/stores/tramite260204Store.store';

/**
 * Decorador `@Component` que define el componente `PagoDeDerechosContenedoraComponent`.
 * 
 * Este componente es responsable de encapsular la lógica y la presentación del formulario
 * de pago de derechos, proporcionando una interfaz para interactuar con el estado del trámite
 * y determinar si el formulario está en modo solo lectura.
 * 
 * Propiedades del decorador:
 * 
 * - `selector`: Define el nombre del selector que se utiliza para instanciar este componente
 *   en una plantilla HTML. En este caso, el selector es `app-pago-de-derechos-contenedora`.
 * 
 * - `standalone`: Indica que este componente es independiente y no requiere ser declarado
 *   dentro de un módulo Angular. Esto permite que sea utilizado directamente en cualquier
 *   parte de la aplicación.
 * 
 * - `imports`: Lista de módulos y componentes que este componente necesita para funcionar.
 *   Incluye `CommonModule` para funcionalidades comunes de Angular y `PagoDeDerechosComponent`
 *   como un componente hijo que se utiliza dentro de este componente.
 * 
 * - `templateUrl`: Ruta al archivo HTML que define la estructura y el diseño del componente.
 *   En este caso, el archivo es `./pago-de-derechos-contenedora.component.html`.
 * 
 * - `styleUrl`: Ruta al archivo SCSS que contiene los estilos específicos para este componente.
 *   En este caso, el archivo es `./pago-de-derechos-contenedora.component.scss`.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.component.html',
  styleUrl: './pago-de-derechos-contenedora.component.scss',
})
export class PagoDeDerechosContenedoraComponent implements OnInit {
    /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Indica si el formulario está deshabilitado. Por defecto es `false`.
   */
  @Input()
  formularioDeshabilitado: boolean = false;
  /**
   * Referencia al componente hijo `PagoDeDerechosComponent`.
   * Permite acceder a las propiedades y métodos del componente hijo desde este componente contenedor.
   *
   */
   @ViewChild(PagoDeDerechosComponent) pagoDeDerechosComponent!: PagoDeDerechosComponent;
  /**
   * Representa el estado actual del formulario de pago de derechos.
   * Contiene los valores y configuraciones asociados al formulario.
   *
   * @type {PagoDerechosFormState}
   */
  public pagoDerechos!: PagoDerechosFormState;
    /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los elementos del componente no serán editables.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

    private destroyNotifier$: Subject<void> = new Subject();
  /**
   * @property {number} idProcedimiento
   * @description Identificador del procedimiento.
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * Constructor de la clase que inicializa el estado del trámite y determina si el formulario es de solo lectura.
   * 
   * @param {Tramite260204Store} tramiteStore - Store que contiene el estado del trámite 260204.
   * @param {ConsultaioQuery} consultaQuery - Query para obtener el estado de la sección de consulta.
   */
  constructor(public tramiteStore: Tramite260204Store,
         private consultaQuery: ConsultaioQuery,
          private tramiteQuery: Tramite260204Query
  ){
    this.consultaQuery.selectConsultaioState$
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        });
  }


   ngOnInit(): void {
    this.tramiteQuery.selectTramiteState$
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data) => {
            this.pagoDerechos = data.pagoDerechos;
          });
  }
  /**
   * Actualiza la información de pago de derechos en el store del trámite.
   *
   * Este método toma un objeto `PagoDerechosFormState` que contiene los datos actualizados
   * del formulario de pago de derechos y llama al método `updatePagoDerechos` del `tramiteStore`
   * para persistir los cambios.
   *
   * @param event Un objeto `PagoDerechosFormState` con los datos actualizados del formulario de pago.
   * @returns void.
   *
   * @example
   * ```typescript
   * const pagoActualizado: PagoDerechosFormState = {
   * // ... datos del formulario
   * };
   * this.updatePagoDerechos(pagoActualizado);
   * ```
   */
  updatePagoDerechos(event: PagoDerechosFormState): void{
    this.tramiteStore.updatePagoDerechos(event);
  }
/**
 *  Valida el formulario de pago de derechos en el componente hijo.
 *  Retorna `true` si el formulario es válido, de lo contrario `false`.
 */
  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
   isAnyFieldFilledButNotAll(): boolean {
      return this.pagoDeDerechosComponent.isAnyFieldFilledButNotAll();
    }

    get continuarButtonClicked(): boolean {
    return this.pagoDeDerechosComponent?.continuarButtonClicked ?? false;
  }
}
