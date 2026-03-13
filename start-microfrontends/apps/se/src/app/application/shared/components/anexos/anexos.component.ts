import {
  CONFIGURACION_ANEXOS_IMPORTACION,
  CONFIGURACION_ANEXOS_SENSIBLES,
  CONFIGURACION_TABLA_EXPORTACION,
} from '../../constantes/anexos.enum';
import { Component, Input } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Anexo } from '../../models/anexos.model';
import { CommonModule } from '@angular/common';

/**
 * Componente que muestra los anexos relacionados con un trámite,
 * incluyendo exportación, importación y anexos sensibles.
 */
@Component({
  selector: 'app-anexos',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './anexos.component.html',
  styleUrl: './anexos.component.scss',
})
export class AnexosComponent {
  /**
   * Número de procedimiento del trámite.
   * @property {number} procedimiento
   */
  @Input() procedimiento!: number;

  /**
   * Configuración de las columnas de la tabla para los anexos de exportación.
   * @property {ConfiguracionColumna<Anexo>[]} configuracionTablaExportacion
   */
  configuracionTablaExportacion: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_TABLA_EXPORTACION;

  /**
   * Configuración de las columnas de la tabla para los anexos de importación.
   * @property {ConfiguracionColumna<Anexo>[]} configuracionTablaImportacion
   */
  configuracionTablaImportacion: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_IMPORTACION;

  /**
   * Configuración de las columnas de la tabla para los anexos sensibles.
   * @property {ConfiguracionColumna<Anexo>[]} configuracionTablaSensibles
   */
  configuracionTablaSensibles: ConfiguracionColumna<Anexo>[] =
    CONFIGURACION_ANEXOS_SENSIBLES;

  /**
   * Datos de los anexos de exportación.
   * @property {Anexo[]} datosExportacion
   */
  @Input() datosExportacion: Anexo[] = [];

  /**
   * Datos de los anexos de importación.
   * @property {Anexo[]} datosImportacion
   */
  @Input() datosImportacion: Anexo[] = [];

  /**
   * Datos de los anexos sensibles.
   * @property {Anexo[]} datosSensibles
   */
  @Input() datosSensibles: Anexo[] = [];
}
