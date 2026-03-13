import { ACUSE_SERVICIOS_EXTRAORDINARIOS, AccionesTabla, AcuseComponent, TITULO_ACUSE, TXT_ALERTA_ACUSE } from "@libs/shared/data-access-user/src";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
/**
 * Componente de la página de Acuse
 * Este componente está diseñado para manejar y mostrar datos relacionados con 
 * los servicios extraordinarios utilizando estructuras como tablas y alertas.
 */
@Component({
  templateUrl: './acuse-page.component.html',
  styles: ``,
  standalone: true,
  imports: [CommonModule, AcuseComponent],
})
export class AcusePageComponent implements OnInit {
  /** Texto de alerta que se muestra en la página */
  txtAlerta!: string;

  /** Subtítulo que utiliza el título del acuse */
  subtitulo = TITULO_ACUSE;

  /** Encabezado de la tabla de acuse, tomado de los servicios extraordinarios */
  encabezadoTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse;

  /** Acciones permitidas en la tabla de acuse */
  accionesTablaAcuse: AccionesTabla[] =
    ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse;

  /** Datos mostrados en la tabla de acuse */
  datosTablaAcuse = ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse;

  /** Código de folio asociado al acuse */
  folio!: string;
  

  /**
   * Constructor del componente AcusePageComponent
   * Aquí se pueden inicializar valores o servicios si es necesario.
   */
  constructor() {
    // Constructor vacío, se puede personalizar según las necesidades
  }

  /**
   * Método ngOnInit
   * Inicializa los datos necesarios al cargar el componente. En este caso,
   * se configura el texto de alerta y se asigna un folio estático.
   */
  ngOnInit(): void {
    this.folio = '01010101010101010101010101010101'; // Folio inicial
    this.txtAlerta = TXT_ALERTA_ACUSE(this.folio); // Genera texto de alerta dinámico
  }
}
