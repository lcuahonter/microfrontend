import { ACUSE_DATOS, ACUSE_ENCABEZADOS } from "../../constants/validar-inicialmente-certificado.enum";
import { ConfiguracionColumna, TablaAcciones, TablaDinamicaComponent } from "@libs/shared/data-access-user/src";
import { AcuseLista } from "../../models/validar-inicialmente-certificado.model";
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
/**
 * Componente para mostrar la tabla de acuses CEROR.
 * 
 * Este componente utiliza una tabla dinámica para mostrar los datos de los acuses,
 * incluyendo encabezados y acciones configuradas. Los datos y encabezados se obtienen
 * de constantes predefinidas.
 */
@Component({
  selector: 'app-acuse-ceror',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent
  ],
  templateUrl: './acuse-ceror.component.html',
  styleUrl: './acuse-ceror.component.scss',
})
export class AcuseCerorComponent {
  /**
   * Configuración de los encabezados de la tabla de acuses.
   * 
   * Define las columnas y su configuración para la tabla de acuses.
   */
  public acuseEncabezados: ConfiguracionColumna<AcuseLista>[] = ACUSE_ENCABEZADOS;

  /**
   * Datos de la tabla de acuses.
   * 
   * Contiene la lista de acuses que se mostrarán en la tabla.
   */
  acuseTablaDatos: AcuseLista[] = ACUSE_DATOS;

  /**
   * Acciones configuradas para la tabla dinámica.
   * 
   * Define las acciones que se pueden realizar en la tabla, como editar o eliminar.
   */
  acciones = TablaAcciones;

  /**
   * Constructor del componente.
   * 
   * El constructor se utiliza para la inyección de dependencias necesarias para el componente.
   */
  constructor() {
    // El constructor se utiliza para la inyección de dependencias.
  }
}