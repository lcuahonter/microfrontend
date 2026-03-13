import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  DestinoFinal,
  Proveedor,
} from '../../../../shared/models/terceros-relacionados.model';
import { AgregarDestinatarioCustomComponent } from '../../../../shared/components/agregar-destinatario-custom/agregar-destinatario-custom.component';
import { CommonModule } from '@angular/common';
import { ID_PROCEDIMIENTO } from '../../constants/solicitud-permiso-extraordinario-exportacion';
import { Observable } from 'rxjs';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';

/**
 * @title Agregar Destinatario Final Contenedora
 * @description Componente contenedor que gestiona la integración del componente de destinatario final con el store.
 * @summary Encapsula el componente de agregar destinatario final y propaga los datos al estado global.
 */

@Component({
  selector: 'app-agregar-destinatario-final-contenedora',
  standalone: true,
  imports: [CommonModule, AgregarDestinatarioCustomComponent],
  templateUrl: './agregar-destinatario-final-contenedora.component.html',
  styleUrl: './agregar-destinatario-final-contenedora.component.scss',
})
export class AgregarDestinatarioFinalContenedoraComponent implements OnInit {
  /**
   * Evento que se emite cuando se cierra el componente.
   * Permite a los componentes padres reaccionar al cierre del modal.
   *
   * @type {EventEmitter<void>}
   */
  @Output() cerrar = new EventEmitter<void>();
  /**
   * @property terechosDatos$
   * @type {Observable<DestinoFinal | Proveedor | null | undefined>}
   * @description Observable que emite datos relacionados con el destino final o proveedor.
   * Puede ser un objeto de tipo `DestinoFinal`, `Proveedor`, `null` o `undefined`.
   * @command Este observable se utiliza para gestionar y observar los datos de los proveedores o destinos finales en el componente.
   */
  terechosDatos$!: Observable<DestinoFinal | Proveedor | null | undefined>;
  /**
   * @property {boolean} estaOculto - Indica si el elemento está oculto o visible.
   * @remarks Este valor determina la visibilidad del componente en la interfaz de usuario.
   * @command Cambiar el valor de esta propiedad para alternar la visibilidad.
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;

  /**
   * Constructor del componente.
   *
   * @method constructor
   * @param {Tramite240118Store} tramiteStore - Store que administra el estado del trámite.
   * @param {Tramite240118Query} tramiteQuery - Consulta que proporciona acceso a los datos del trámite.
   * @returns {void}
   */
  constructor(
    public tramiteStore: Tramite240118Store,
    public tramiteQuery: Tramite240118Query
  ) {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * @method ngOnInit
   * @description Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Asigna un observable para obtener los datos de terceros desde la consulta del trámite.
   * @command Inicializa los datos necesarios para el componente.
   */
  ngOnInit(): void {
    this.terechosDatos$ = this.tramiteQuery.obtenerTercerosDatos$;
  }

  /**
   * Actualiza la lista de destinatarios finales en el store del trámite.
   *
   * @method updateDestinatarioFinalTablaDatos
   * @param {DestinoFinal[]} event - Lista de destinatarios finales actualizada.
   * @returns {void}
   */
  updateDestinatarioFinalTablaDatos(event: DestinoFinal[]): void {
    this.tramiteStore.updateDestinatarioFinalTablaDatos(event);
  }
}
