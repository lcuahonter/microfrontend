/**
 * @module AcusePageComponent
 * @description Componente que muestra la página de acuse de servicios extraordinarios.
 */
import { ACUSE_SERVICIOS_EXTRAORDINARIOS, TITULO_ACUSE, TXT_ALERTA_ACUSE } from '@libs/shared/data-access-user/src';
import { Component, OnInit } from '@angular/core';
import { AccionesTabla } from '@libs/shared/data-access-user/src';
import { AcuseComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';

@Component({
  templateUrl: './acuse-page.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, AcuseComponent]
})
export class AcusePageComponent implements OnInit {
  /**
   * Mensaje de alerta generado para el acuse.
   * @type {string}
   */
  txtAlerta!: string;

  /**
   * Subtítulo de la página de acuse.
   * @type {string}
   */
  subtitulo = TITULO_ACUSE;

  /**
   * Encabezado de la tabla de acuse.
   * @type {Array}
   */
  encabezadoTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse;

  /**
   * Acciones disponibles en la tabla de acuse.
   * @type {AccionesTabla[]}
   */
  accionesTablaAcuse: AccionesTabla[] =
    ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse;

  /**
   * Datos de la tabla de acuse.
   * @type {Array}
   */
  datosTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse;

  /**
   * Folio del trámite.
   * @type {string}
   */
  folio: string = '';

  constructor() {
    // Constructor vacío
  }

  /**
   * Método de ciclo de vida de Angular que se ejecuta una vez que el componente ha sido inicializado.
   *
   * En este método, se obtiene el folio del trámite y se genera un mensaje de alerta.
   */
  ngOnInit(): void {
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);
  }
}
