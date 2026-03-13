import { AgregarFabricanteComponent } from '../../../../shared/components/agregar-fabricante/agregar-fabricante.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Fabricante } from '../../../../shared/models/terceros-relacionados.model';
import { ID_PROCEDIMIENTO } from '../../constants/destinados-donacio.enum';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';
/**
 * @component AgregarFabricanteContenedoraComponent
 * @description Componente contenedor que utiliza el componente `AgregarFabricanteComponent` 
 * para gestionar la funcionalidad relacionada con los fabricantes. 
 * Este componente interactúa con el estado del trámite a través del store `Tramite260209Store`.
 */
@Component({
  selector: 'app-agregar-fabricante-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarFabricanteComponent],
  templateUrl: './agregar-fabricante-contenedora.component.html',
  styleUrl: './agregar-fabricante-contenedora.component.scss',
})
export class AgregarFabricanteContenedoraComponent {

  /**
   * @property {string} idProcedimiento
   * @description Identificador único del procedimiento 260209.
   * Esta propiedad es de solo lectura y se inicializa con el valor constante `ID_PROCEDIMIENTO`.
   * Se utiliza como referencia para identificar el tipo de trámite que se está procesando.
   * @readonly
   * @since 1.0.0
   */
  public readonly idProcedimiento = ID_PROCEDIMIENTO;

  /**
   * @property {boolean} estaOculto
   * @description Variable booleana que controla la visibilidad del formulario de agregar fabricante.
   * - `true`: El formulario está oculto y no es visible para el usuario
   * - `false`: El formulario está visible y puede ser utilizado por el usuario
   * Esta propiedad se utiliza para mostrar/ocultar dinámicamente elementos de la interfaz de usuario.
   * @default true
   * @example
   * ```typescript
   * // Para mostrar el formulario
   * this.estaOculto = false;
   * 
   * // Para ocultar el formulario
   * this.estaOculto = true;
   * ```
   * @since 1.0.0
   */
  estaOculto: boolean = true;
    
  /**
   * @constructor
   * @description Constructor del componente que inicializa las dependencias necesarias.
   * Inyecta el store `Tramite260209Store` para gestionar el estado del trámite 260209.
   * 
   * @param {Tramite260209Store} tramite260209Store - Store que administra el estado completo del trámite 260209.
   *        Este store contiene métodos para:
   *        - Actualizar datos de fabricantes
   *        - Gestionar el estado del formulario
   *        - Manejar validaciones y errores
   *        - Sincronizar datos con el backend
   * 
   * @example
   * ```typescript
   * // El constructor se ejecuta automáticamente al crear una instancia del componente
   * const component = new AgregarFabricanteContenedoraComponent(tramite260209Store);
   * ```
   * 
   * @since 1.0.0
   * @memberof AgregarFabricanteContenedoraComponent
   */
  constructor(
    public tramite260209Store: Tramite260209Store) {
      // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method updateFabricanteTablaDatos
   * @description Método que actualiza los datos de la tabla de fabricantes en el estado del trámite.
   * Esta función sirve como intermediario entre el componente hijo `AgregarFabricanteComponent` 
   * y el store `Tramite260209Store`, facilitando la comunicación entre componentes.
   * 
   * @param {Fabricante[]} event - Array de objetos Fabricante que contiene los datos actualizados
   *        de todos los fabricantes que deben ser almacenados en el state management.
   *        Cada objeto Fabricante debe cumplir con la interfaz definida en 
   *        `../../../../shared/models/terceros-relacionados.model`.
   * 
   * @returns {void} Este método no retorna ningún valor, pero actualiza el estado global
   *          del trámite a través del store.
   * 
   * @example
   * ```typescript
   * const nuevosFabricantes: Fabricante[] = [
   *   {
   *     id: 1,
   *     nombre: 'Fabricante ABC',
   *     direccion: 'Calle Principal 123',
   *     telefono: '555-0123'
   *   }
   * ];
   * 
   * this.updateFabricanteTablaDatos(nuevosFabricantes);
   * ```
   * 
   * @throws {Error} Puede lanzar errores si el store no está disponible o si los datos
   *         no cumplen con el formato esperado.
   * 
   * @see {@link Tramite260209Store.updateFabricanteTablaDatos} - Método del store que ejecuta la actualización
   * @see {@link Fabricante} - Interfaz que define la estructura de un fabricante
   * 
   * @since 1.0.0
   * @memberof AgregarFabricanteContenedoraComponent
   */
  updateFabricanteTablaDatos(event: Fabricante[]): void {
    this.tramite260209Store.updateFabricanteTablaDatos(event);
  }
}
