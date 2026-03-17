import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@ng-mf/data-access-user';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DESTINO_FINAL_ENCABEZADO_DE_TABLA, DestinoFinal, PROVEEDOR_ENCABEZADO_DE_TABLA, Proveedor, TERCEROR_TEXTO_DE_ALERTA } from '../../models/terceros-relacionados.model';
import { OCULTAR_BOTON_MODIFICAR_TERCEROS, TERCEROS_NACIONALIDAD } from '../../constants/datos-solicitud.enum';
import { CommonModule } from '@angular/common';
import { OCULTAR_BOTONES } from '../../constants/datos-del-tramilte.enum'

/**
 * @title Terceros Relacionados
 * @description Componente que muestra tablas dinámicas con información de destinatarios finales y proveedores relacionados al procedimiento.
 * @summary Visualización de terceros relacionados a través de tablas dinámicas y navegación entre rutas.
 */

@Component({
  selector: 'app-terceros-relacionados',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, AlertComponent, TituloComponent],
  templateUrl: './terceros-relacionados.component.html',
  styleUrl: './terceros-relacionados.component.scss',
})
export class TercerosRelacionadosComponent implements OnInit{
  /**
   * Texto que se muestra en la alerta del componente.
   * @property {string} tercerorTextoDeAlerta
   */
  public tercerorTextoDeAlerta = TERCEROR_TEXTO_DE_ALERTA;

    /**
   * Indica si el elemento está ocultarBotones o visible.
   *
   * @type {boolean}
   * - `true`: El elemento está ocultarBotones.
   * - `false`: El elemento está visible.
   */
    public ocultarBotones = false;

  /**
   * Identificador del procedimiento relacionado.
   * @property {number} idProcedimiento
   */
  @Input() public idProcedimiento!: number;

  /**
   * Datos que alimentan la tabla de destinatarios finales.
   * @property {DestinoFinal[]} destinatarioFinalTablaDatos
   */
  @Input() destinatarioFinalTablaDatos: DestinoFinal[] = [];

  /**
   * Datos que alimentan la tabla de proveedores.
   * @property {Proveedor[]} proveedorTablaDatos
   */
  @Input() proveedorTablaDatos: Proveedor[] = [];

  /**
   * Emite un evento cuando se modifican los datos del destinatario.
   * El evento contiene un objeto de tipo `DestinoFinal`.
   *
   * @type {EventEmitter<DestinoFinal>}
   */
  @Output() modificarDestinarioDatos: EventEmitter<DestinoFinal> = new EventEmitter<DestinoFinal>(true);
  /**
   * @output eliminarDestinatarioFinalEvent - Evento que emite cuando se elimina un destinatario final.
   * Este EventEmitter emite una instancia de `DestinoFinal`.
   */
  @Output() eliminarDestinatarioFinalEvent: EventEmitter<DestinoFinal> = new EventEmitter<DestinoFinal>(true);
  /**
   * Evento que emite cuando se desea eliminar un proveedor final.
   * Este EventEmitter emite una instancia de tipo `Proveedor`.
   * 
   * @event eliminarProveedorFinalEvent
   */
  @Output() eliminarProveedorFinalEvent: EventEmitter<Proveedor> = new EventEmitter<Proveedor>(true);
  /**
   * Emite un evento cuando se modifican los datos del proveedor.
   * El evento contiene un objeto de tipo `Proveedor`.
   *
   * @type {EventEmitter<Proveedor>}
   */
  @Output() modificarProveedorDatos: EventEmitter<Proveedor> = new EventEmitter<Proveedor>(true);
  
  /**
   * Indica si el botón de modificar está oculto o visible.
   * @property {boolean} ocultarBotonModificar
   */

  ocultarBotonModificar:boolean=false;

  @Output() openModal = new EventEmitter<string>();

  @Output () eliminarProveedorContenedoraFinalEvent = new EventEmitter<Proveedor>();

  /**
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los campos del formulario no pueden ser editados.
   * @property {boolean} esFormularioSoloLectura
   * @default false
   */
  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Configuración de la tabla de destinatarios finales.
   * @property {any} destinoFinalTablaConfiguracion
   */
  public destinoFinalTablaConfiguracion = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: DESTINO_FINAL_ENCABEZADO_DE_TABLA,
  };

  /**
   * Configuración de la tabla de proveedores.
   * @property {any} dproveedorTablaConfiguracion
   */
  public dproveedorTablaConfiguracion = {
    tipoSeleccionTabla: TablaSeleccion.CHECKBOX,
    configuracionTabla: PROVEEDOR_ENCABEZADO_DE_TABLA,
  };

  /**
   * Lista de destinatarios seleccionados en la tabla.
   * Contiene objetos del tipo `DestinoFinal`.
   *
   * @type {DestinoFinal[]}
   */
  destinarioTablaSeleccionada: DestinoFinal[] = [];
  
  /**
   * Lista de proveedores seleccionados en la tabla.
   * Contiene objetos del tipo `Proveedor`.
   *
   * @type {Proveedor[]}
   */
  proveedorTablaSeleccionada: Proveedor[] = [];

  /**
   * Navega a una ruta relativa dentro del flujo actual.
   * @method irAAcciones
   * @param {string} accionesPath - Ruta relativa a la que se desea navegar.
   * @returns {void}
   */
  irAAcciones(accionesPath: string): void {
    this.destinarioTablaSeleccionada = [];
    this.proveedorTablaSeleccionada = [];
    this.openModal.emit(accionesPath)
  }

  /**
   * Maneja el evento de selección de filas en la tabla de destinatarios.
   * @method destinarioTablaSeleccionadaEvent
   * @param {DestinoFinal[]} event - Lista de destinatarios seleccionados.
   * @returns {void}
   */
  destinarioTablaSeleccionadaEvent(event: DestinoFinal[]): void {
    this.destinarioTablaSeleccionada = event;
  }

  /**
   * Maneja el evento de selección de filas en la tabla de proveedores.
   * @method proveedorTablaSeleccionadaEvent
   * @param {Proveedor[]} event - Lista de proveedores seleccionados.
   * @returns {void}
   */
  proveedorTablaSeleccionadaEvent(event: Proveedor[]): void {
    this.proveedorTablaSeleccionada = event;
  }

  /**
   * Constructor del componente.
   * @method constructor
   * @param {Router} router - Servicio de navegación.
   * @param {ActivatedRoute} activatedRoute - Ruta activa para navegación relativa.
   * @returns {void}
   */
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

   /**
 * @property
 * @name tercerosNacionalidad
 * @type {boolean}
 * @description Indica si la nacionalidad de terceros está habilitada o no. 
 * Este valor se utiliza para determinar la visibilidad o funcionalidad relacionada con la nacionalidad de terceros en el formulario.
 * @default false
 */
   public tercerosNacionalidad: boolean = false;

  /**
   * Emite el primer destinatario seleccionado para su modificación.
   * Utiliza el `EventEmitter` modificarDestinarioDatos para enviar el dato al componente padre.
   *
   * @returns {void}
   */
  modificarDestinatario(): void {
    this.modificarDestinarioDatos.emit(this.destinarioTablaSeleccionada[0]);
  }

  /**
   * Elimina el destinatario final seleccionado y emite un evento con el destinatario eliminado.
   * 
   * @command Eliminar destinatario final seleccionado.
   */
  eliminarDestinatarioFinal():void{
    this.eliminarDestinatarioFinalEvent.emit(this.destinarioTablaSeleccionada[0]);
  }

  /**
   * Elimina el proveedor final seleccionado y emite un evento con el proveedor eliminado.
   * 
   * @command Eliminar el proveedor final seleccionado.
   */
  eliminarProveedorFinal():void{
    this.eliminarProveedorFinalEvent.emit(this.proveedorTablaSeleccionada[0]);
  }

  /**
   * Emite el primer proveedor seleccionado para su modificación.
   * Utiliza el `EventEmitter` modificarProveedorDatos para enviar el dato al componente padre.
   *
   * @returns {void}
   */
  modificarProveedor(): void {
    this.modificarProveedorDatos.emit(this.proveedorTablaSeleccionada[0])
  }
  ngOnInit(): void {
    this.ocultarBotones = OCULTAR_BOTONES.includes(this.idProcedimiento); 
    this.tercerosNacionalidad = TERCEROS_NACIONALIDAD.includes(this.idProcedimiento);
    this.ocultarBotonModificar = OCULTAR_BOTON_MODIFICAR_TERCEROS.includes(this.idProcedimiento);
  }
}
