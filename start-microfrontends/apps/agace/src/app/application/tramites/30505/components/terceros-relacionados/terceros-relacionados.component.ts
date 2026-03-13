import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { TablaAcciones, TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TERCEROS_ENCABEZADO_DE_TABLA } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { TercerosRelacionados } from '../../../../core/models/30505/aviso-modificacion.model';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';

/**
 * Componente encargado de gestionar y mostrar los terceros relacionados en el trámite 30505.
 *
 * @remarks
 * Este componente utiliza servicios para obtener los datos de terceros relacionados y los muestra en una tabla dinámica.
 * Implementa las interfaces `OnInit` y `OnDestroy` para manejar el ciclo de vida del componente.
 *
 * @example
 * <app-terceros-relacionados></app-terceros-relacionados>
 */
@Component({
  selector: 'app-terceros-relacionados',
  templateUrl: './terceros-relacionados.component.html',
  styleUrls: ['./terceros-relacionados.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablaDinamicaComponent,
    TituloComponent
  ]
})
export class TercerosRelacionadosComponent implements OnDestroy,OnInit {
 
  /**
   * Arreglo que contiene los datos de los terceros relacionados.
   * 
   * Cada elemento del arreglo es una instancia de la interfaz `TercerosRelacionados`,
   * representando la información de un tercero vinculado al trámite actual.
   */
  public tercerosRelacionadosDatos:TercerosRelacionados[] = [];

  /**
   * Configuración de la tabla para mostrar los terceros relacionados.
   * 
   * Esta propiedad utiliza la constante `TERCEROS_ENCABEZADO_DE_TABLA` para definir
   * los encabezados y la estructura de la tabla en el componente.
   * 
   * @see TERCEROS_ENCABEZADO_DE_TABLA
   */
  public TERCEROS_CONFIGURATION_TABLA = TERCEROS_ENCABEZADO_DE_TABLA;

  /**
   * Arreglo que contiene las acciones disponibles para la tabla.
   * Cada elemento representa una acción que puede realizarse sobre los elementos de la tabla.
   * 
   * @type {TablaAcciones[]}
   */
  public acciones:TablaAcciones[] = [];

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se debe emitir un valor y completar este Subject cuando el componente se destruya.
   */
  public destroyNotifier$: Subject<void> = new Subject();

   /**
    * Indica si el componente debe estar en modo solo lectura.
    * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
    * Valor predeterminado: `false`.
    */
   @Input() soloLectura: boolean = false;
  /**
   * Crea una nueva instancia del componente e inyecta el servicio TercerosRelacionadosService.
   * 
   * @param TercerosService Servicio utilizado para gestionar las operaciones relacionadas con terceros.
   */
  constructor(
    private TercerosService:TercerosRelacionadosService
  ) { 
    
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de la inicialización del componente.
   * Llama al método `cargarDatos` para cargar la información necesaria al iniciar el componente.
   */
  ngOnInit(): void {
    this.cargarDatos();
  }

 
  /**
   * Carga los datos de terceros relacionados utilizando el servicio TercerosService.
   * 
   * Realiza una suscripción al observable devuelto por `obtenerDatos()`, asegurando la cancelación
   * de la suscripción cuando se emite el notifier `destroyNotifier$` para evitar fugas de memoria.
   * 
   * Los datos obtenidos se asignan a la propiedad `tercerosRelacionadosDatos`. Si la respuesta no es un arreglo,
   * se encapsula en uno para mantener la consistencia del tipo de datos.
   */
  cargarDatos(): void {
    this.TercerosService.obtenerDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.tercerosRelacionadosDatos = Array.isArray(data) ? data : [data];
      });
    
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una notificación y completa el observable `destroyNotifier$` para limpiar suscripciones
   * y evitar fugas de memoria.
   */
   ngOnDestroy(): void {
     this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  
}