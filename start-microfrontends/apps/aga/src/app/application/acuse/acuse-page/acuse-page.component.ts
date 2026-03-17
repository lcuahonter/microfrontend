import { ACUSE_SERVICIOS_EXTRAORDINARIOS, AccionesTabla, AcuseComponent, TITULO_ACUSE, TXT_ALERTA_ACUSE } from '@libs/shared/data-access-user/src';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tramite5701Query } from '../../core/queries/tramite5701.query';

@Component({
  templateUrl: './acuse-page.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, AcuseComponent],
})
export class AcusePageComponent implements OnInit {
  txtAlerta!: string;
  subtitulo = TITULO_ACUSE;
  encabezadoTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse;
  accionesTablaAcuse: AccionesTabla[] =
  ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse;
  datosTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse;

  folio!: string;

  constructor(
    private tramite5701Query: Tramite5701Query) { }

  /**
   * Método de ciclo de vida de Angular que se llama una vez que el componente ha sido inicializado.
   *
   * En este método, se obtiene el folio del trámite utilizando el servicio `tramiteQueries` y se asigna a la propiedad `folio`.
   * Luego, se genera un mensaje de alerta utilizando la función `TXT_ALERTA_ACUSE` con el folio obtenido y se asigna a la propiedad `txtAlerta`.
   */
  ngOnInit(): void {
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);
  }
}