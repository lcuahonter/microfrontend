import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Capitulo } from '../../service/model/request/tree-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tree-node-item',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./tree-node-item.component.scss'],
  templateUrl: './tree-node-item.component.html'
})
export class TreeNodeItemComponent {
  @Input() node!: Capitulo;
  @Input() level: number = 0;
  @Input() selectedNodes: Set<string> = new Set();

  @Output() nodeToggled = new EventEmitter<Capitulo>();
  @Output() nodeSelected = new EventEmitter<{
    node: Capitulo;
    selected: boolean;
  }>();

  /**
   * Alternar la expansión del nodo.
   */
  toggleNode(event: Event): void {
    event.stopPropagation();
    this.nodeToggled.emit(this.node);
  }

  /**
   * Manejar el cambio de selección del checkbox.
   * @param event - Evento del checkbox.
   */
  onCheckboxChange(event: Event): void {
    const CHECKBOX = event.target as HTMLInputElement;
    this.nodeSelected.emit({ node: this.node, selected: CHECKBOX.checked });
  }

  /**
   * Manejar el clic en el texto del nodo.
   */
  onLabelClick(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Verificar si el nodo está seleccionado.
   * @returns Indica si el nodo está seleccionado.
   */
  isSelected(): boolean {
    return this.selectedNodes.has(this.node.clave);
  }
}
