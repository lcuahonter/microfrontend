/**
 * @component
 * @name DatosDelTercerosComponent
 * @description
 * Componente que gestiona los datos de terceros relacionados con el trámite.
 * Permite la visualización, modificación y eliminación de destinatarios e instalaciones.
 *
 * @example
 * <app-datos-del-terceros></app-datos-del-terceros>
 *
 * @see Tramite220103Store
 * @see Tramite220103Query
 * @see AgregarDestinatarioComponent
 * @see TablaDinamicaComponent
 * @see TituloComponent
 * @see AlertComponent
 */


import { DatosDelTerceroDestinatario, Instalacion } from "../../modelos/sanidad-acuicola-importacion.model";
import { Tramite220103Query } from "../../estados/queries/tramites220103.query";

import { Subject, takeUntil } from "rxjs";

import {ConsultaioQuery} from "@ng-mf/data-access-user"

import { AlertComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from "@libs/shared/data-access-user/src";
import { CONFIGURACION_CONTACTO, CONFIGURACION_TABLA_INSTALACION, IMPORTANTE } from "../../constantes/sanidad-acuicola-importacion.enum";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AgregarDestinatarioComponent } from "../agregar-destinatario/agregar-destinatario.component";
/**
 * app-datos-del-terceros Componente
 */
@Component({
  selector: 'app-datos-del-terceros',
  standalone: true,
  imports: [
    CommonModule,
    AlertComponent,
    TituloComponent,
    TablaDinamicaComponent,
    AgregarDestinatarioComponent
  ],
  templateUrl: './datos-del-terceros.component.html',
  styleUrl: './datos-del-terceros.component.scss',
})
export class DatosDelTercerosComponent implements OnInit, OnDestroy {


    /**
     * Indica si el componente está en modo solo lectura.
     * Se utiliza para deshabilitar la edición de los datos cuando el trámite está en modo de solo lectura.
     */
    esSoloLectura!: boolean;
  /**
   * Notificador para manejar la destrucción de suscripciones y evitar fugas de memoria.
   * Se utiliza para cancelar todas las suscripciones activas al destruir el componente.
   * @private
   */
  private notificadorDestruccion$ = new Subject<void>();

  /**
   * Mensaje importante que se muestra en el componente.
   * Contiene información relevante para el usuario sobre el trámite.
   */
  mensajeImportante: string = IMPORTANTE.Importante;


  /**
   * Configuración de la tabla de destinatarios.
   * Define las columnas, encabezados y comportamiento de la tabla.
   */
  configuracionTablaContacto = CONFIGURACION_CONTACTO;

  /**
   * Configuración de la tabla de instalaciones.
   * Define las columnas, encabezados y comportamiento de la tabla de instalaciones.
   */
  configuracionTablaInstalacion = CONFIGURACION_TABLA_INSTALACION;

  /**
   * Datos de la tabla de destinatarios.
   * Contiene la información que se muestra en la tabla de destinatarios.
   */
  datosTabla: DatosDelTerceroDestinatario[] = [];

  /**
   * Datos de la tabla de instalaciones.
   * Contiene la información que se muestra en la tabla de instalaciones.
   */
  datosTablaInstalacion: Instalacion[] = [];

  /**
   * Tipo de selección de la tabla (checkbox).
   * Define cómo los usuarios pueden seleccionar elementos en las tablas.
   */
  seleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Almacena los destinatarios seleccionados en la tabla.
   * Se actualiza cuando el usuario selecciona elementos en la tabla de destinatarios.
   */
  destinatariosSeleccionados: DatosDelTerceroDestinatario[] = [];

  /**
   * Almacena las instalaciones seleccionadas en la tabla.
   * Se actualiza cuando el usuario selecciona elementos en la tabla de instalaciones.
   */
  instalacionesSeleccionadas: Instalacion[] = [];

  /**
   * Constructor del componente.
   *
   * @param formBuilder - FormBuilder para inicializar los formularios.
   * @param tramite220103Query - Consulta para obtener el estado del trámite.
   */
  constructor(
    private tramite220103Query: Tramite220103Query,
     private consultaQuery: ConsultaioQuery,
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Suscribe al estado del trámite y actualiza los datos de ambas tablas.
   * Esta suscripción se mantiene activa durante toda la vida del componente.
   */
  ngOnInit(): void {
    this.cargarDatosDesdeStore();
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoConsulta) => {
        this.esSoloLectura = estadoConsulta.readonly;
      });
      
  }

  /**
   * Carga los datos de destinatarios e instalaciones desde el store.
   * Se suscribe al estado del trámite y actualiza las tablas correspondientes.
   * La suscripción se cancela automáticamente al destruir el componente.
   */
  cargarDatosDesdeStore(): void {
    this.tramite220103Query.selectTramite220103State$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estado) => {
        // Actualiza la tabla de destinatarios con los datos del estado o un arreglo vacío si no existen
        this.datosTabla = estado?.['tablaDestinatario'] || [];
        // Actualiza la tabla de instalaciones con los datos del estado o un arreglo vacío si no existen
        this.datosTablaInstalacion = estado?.['tablaInstalacion'] || [];
      });
  }

  /**
   * Maneja la selección de destinatarios en la tabla.
   * Actualiza la propiedad destinatariosSeleccionados con las filas seleccionadas.
   * 
   * @param event - Evento con las filas seleccionadas por el usuario en la tabla.
   */
  obtenerDestinatarioSeleccionadas(event: DatosDelTerceroDestinatario[]): void {
    this.destinatariosSeleccionados = event;
  }

  /**
   * Maneja la selección de instalaciones en la tabla.
   * Actualiza la propiedad instalacionesSeleccionadas con las filas seleccionadas.
   * 
   * @param event - Evento con las filas seleccionadas por el usuario en la tabla.
   */
  obtenerInstalaciSeleccionadas(event: Instalacion[]): void {
    this.instalacionesSeleccionadas = event;
  }

  /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Limpia las suscripciones para evitar fugas de memoria, notificando a todos los
   * observables que deben completarse y liberando recursos del sistema.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}