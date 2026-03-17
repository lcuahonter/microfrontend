import {
  ACUSE_SERVICIOS_EXTRAORDINARIOS,
  TITULO_ACUSE,
  TXT_ALERTA_ACUSE,
} from '../../../core/enums/constantes-alertas.enum';
import { Component, OnInit } from '@angular/core';
import { AccionesTabla } from '../../../core/models/shared/components.model';
import { AcuseResolucionComponent } from '../../components/acuses-y-resoluciones/acuse.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TramiteFolioQueries } from '../../../core/queries/tramiteFolio.query';
@Component({
  templateUrl: './acuse-page.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, AcuseResolucionComponent],
})
export class AcuseResolucionPageComponent implements OnInit {
  /**
   * @description Mensaje de alerta que se muestra al usuario en la página de acuse.
   */
  txtAlerta!: string;

  /**
   * @description Subtítulo que se muestra en la página de acuse.
   */
  subtitulo = TITULO_ACUSE;

  /**
   * @description Encabezado de la tabla de acuse que se muestra en la página.
   */
  encabezadoTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse;

  /**
   * @description Acciones disponibles en la tabla de acuse.
   */
  accionesTablaAcuse: AccionesTabla[] =
    ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse;

  /**
   * @description Datos que se muestran en la tabla de acuse.
   */
  datosTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse;

  /**
   * @description Folio del trámite que se muestra en la página de acuse.
   */
  folio!: string;

  /**
   * @description URL de la aplicación, se utiliza para redirigir al usuario al acuse del trámite.
   */
  url!: string;


  idSolicitud!: number;
  /**
   * Código del procedimiento o trámite que se está procesando.
   * Valor 0 indica que no hay procedimiento definido.
   * 
   * @type {number}
   * @default 0
   */
  procedure:number=0;

  constructor(
    private tramiteQueries: TramiteFolioQueries,
    private router: Router
  ) {}

  /**
   * Método de ciclo de vida de Angular que se llama una vez que el componente ha sido inicializado.
   *
   * En este método, se obtiene el folio del trámite utilizando el servicio `tramiteQueries` y se asigna a la propiedad `folio`.
   * Luego, se genera un mensaje de alerta utilizando la función `TXT_ALERTA_ACUSE` con el folio obtenido y se asigna a la propiedad `txtAlerta`.
   */
  ngOnInit(): void {
    const URL_ACTUAL = this.router.url;
    this.url = URL_ACTUAL.split('/')[2];

    this.folio = this.tramiteQueries.getTramite();
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio);

     this.idSolicitud = this.tramiteQueries.getIdSolicitud();
     this.procedure = this.tramiteQueries.getProcedure();
  }
}
