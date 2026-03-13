import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * Component Define el componente de Angular.
 * selector 'app-aviso-terceros-relacionados' Selector del componente.
 * standalone true Indica que el componente es independiente.
 * imports Lista de módulos y componentes importados.
 * templateUrl Ruta de la plantilla HTML del componente.
 * styleUrl Ruta de los estilos CSS del componente.
 */

@Component({
  selector: 'app-aviso-terceros-relacionados',
  standalone: true,
  imports: [CommonModule, TituloComponent],
  templateUrl: './aviso-terceros-relacionados.component.html',
  styleUrl: './aviso-terceros-relacionados.component.scss',
})
export class AvisoTercerosRelacionadosComponent {}
