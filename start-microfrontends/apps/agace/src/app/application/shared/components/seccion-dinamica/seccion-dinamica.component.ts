import { Component, Input, QueryList, Type, ViewChildren, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeccionDinamica } from '@libs/shared/data-access-user/src/core/models/shared/seccion-dinamica.model';

/**
 * Componente que representa una sección dinámica reutilizable.
 * Permite mostrar diferentes secciones de manera dinámica utilizando un acordeón,
 * cargando componentes según la configuración recibida en el arreglo `secciones`.
 *
 * @selector seccion-dinamica
 * @standalone true
 * @imports [CommonModule]
 * @templateUrl ./seccion-dinamica.component.html
 * @styleUrl ./seccion-dinamica.component.scss
 */
@Component({
  selector: 'seccion-dinamica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seccion-dinamica.component.html',
  styleUrl: './seccion-dinamica.component.scss',
})

export class SeccionDinamicaComponent {

  /**
   * Referencia a los contenedores dinámicos donde se cargarán los componentes de cada sección.
   * Utiliza @ViewChildren para obtener una lista de ViewContainerRef asociados a la plantilla con el template variable 'contenedorDinamico'.
   */
  @ViewChildren('contenedorDinamico', { read: ViewContainerRef }) contenedores!: QueryList<ViewContainerRef>;

  /** Arreglo de secciones dinámicas que se mostrarán en el componente. */
  @Input() secciones: SeccionDinamica[] = [];

  /** Índice de la sección actualmente abierta en el acordeón, o null si ninguna está abierta. */
  public indiceAbierto: number | null = null;

  /**
   * Abre o cierra la sección del acordeón según el índice recibido.
   * Si la sección ya está abierta, la cierra; si no, la abre y carga dinámicamente el componente correspondiente.
   *
   * @param index - Índice de la sección a abrir o cerrar.
   */
  acordeonAbierto(index: number): void {
    if (this.indiceAbierto === index) {
      this.indiceAbierto = null;
    } else {
      this.indiceAbierto = index;
      setTimeout(() =>
        this.cargarComponente(index)
      , 0);
    }
  }

  /**
   * Carga dinámicamente el componente correspondiente a la sección indicada por el índice.
   * Limpia el contenedor antes de crear el nuevo componente.
   *
   * @param index - Índice de la sección cuyo componente se va a cargar.
   */
  cargarComponente(index: number): void {
    const SECCION = this.secciones[index];
    const CONTENEDOR_DE_VISTA = this.contenedores.get(index);
    if (!CONTENEDOR_DE_VISTA) {
      return;
    }
    CONTENEDOR_DE_VISTA.clear();
    CONTENEDOR_DE_VISTA.createComponent(SECCION.componentClase as Type<unknown>);
  }
}
