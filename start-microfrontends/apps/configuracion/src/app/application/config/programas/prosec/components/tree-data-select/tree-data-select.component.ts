import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { Capitulo } from '../../service/model/request/tree-request';
import { CommonModule } from '@angular/common';
import { FraccionesService } from '../../service/fracciones.service';
import { TreeNodeItemComponent } from './tree-node-item.component';

@Component({
  selector: 'app-tree-data-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TreeNodeItemComponent],
  templateUrl: './tree-data-select.component.html',
  styleUrls: ['./tree-data-select.component.scss']
})
export class TreeDataSelectComponent implements OnInit {
  @Output() selectedNodesChange = new EventEmitter<Capitulo[]>();
  @Output() cancel = new EventEmitter<void>();

  treeForm!: FormGroup;
  selectedNodes: Set<string> = new Set();
  nodesToSave: Map<string, Capitulo> = new Map();
  
  nodes: Capitulo[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private fraccionesService: FraccionesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCapitulos();
  }

  private initializeForm(): void {
    this.treeForm = this.fb.group({
      selectedNodeIds: [[]]
    });
  }

  private loadCapitulos(): void {
    this.isLoading = true;
    this.fraccionesService.getCapitulos().subscribe({
      next: (res) => {
        this.nodes = (res.datos || []).map(item => ({
          ...item,
          level: 0,
          expanded: false,
          children: []
        }));
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleExpand(node: Capitulo): void {
    if (node.expanded) {
      node.expanded = false;
      return;
    }

    if (node.children && node.children.length > 0) {
      node.expanded = true;
      return;
    }

    this.loadChildren(node);
  }

  private loadChildren(node: Capitulo): void {
    const LEVEL = node.level ?? 0;
    node.loading = true;

    if (LEVEL === 0) {
      // Load Partidas
      this.fraccionesService.getPartidas(node.clave).subscribe({
        next: (res) => {
          node.children = (res.datos || []).map(item => ({
            ...item,
            level: 1,
            expanded: false,
            children: []
          }));
          node.expanded = true;
          node.loading = false;
        },
        error: () => {
          node.loading = false;
        }
      });
    } else if (LEVEL === 1) {
      this.fraccionesService.getSubpartidas(node.clave).subscribe({
          next: (res) => {
            node.children = (res.datos || []).map(item => ({
              ...item,
              level: 2,
              expanded: false,
              children: []
            }));
            node.expanded = true;
            node.loading = false;
          },
          error: () => {
            node.loading = false;
          }
        });
    } else if (LEVEL === 2) {
      this.fraccionesService.getFraccionesTigie(node.clave).subscribe({
        next: (res) => {
          node.children = (res.datos || []).map(item => ({
            ...item,
            level: 3,
            expanded: false,
            children: []
          }));
          node.expanded = true;
          node.loading = false;
        },
        error: () => {
          node.loading = false;
        }
      });
    }
  }

  onSelectNode(selection: { node: Capitulo; selected: boolean }): void {
    const { node: NODE, selected: SELECTED } = selection;
    this.processNodeSelection(NODE, SELECTED);
    this.checkParentSelectionRecursively(this.nodes);
    this.updateFormValue();
  }

  /**
   * Verifica recursivamente si todos los hijos están seleccionados para marcar al padre.
   */
  private checkParentSelectionRecursively(nodes: Capitulo[]): boolean {
    let allSelected = true;
    for (const NODE of nodes) {
      let nodeSelected = false;
      if (NODE.children && NODE.children.length > 0) {
        const CHILDREN_COMPLETELY_SELECTED = this.checkParentSelectionRecursively(NODE.children);
        if (CHILDREN_COMPLETELY_SELECTED) {
          this.selectedNodes.add(NODE.clave);
          nodeSelected = true;
        } else {
          this.selectedNodes.delete(NODE.clave);
          nodeSelected = false;
        }
      } else {
        nodeSelected = this.selectedNodes.has(NODE.clave);
      }
      
      if (!nodeSelected) {
        allSelected = false;
      }
    }
    return allSelected;
  }

  private processNodeSelection(node: Capitulo, selected: boolean): void {
    const NODE_LEVEL = node.level ?? 0;
    
    // Check/uncheck current node
    if (selected) {
      this.selectedNodes.add(node.clave);
      if (NODE_LEVEL === 3) {
        this.nodesToSave.set(node.clave, node);
      }
    } else {
      this.selectedNodes.delete(node.clave);
      if (NODE_LEVEL === 3) {
        this.nodesToSave.delete(node.clave);
      }
    }

    // Propagate to children if already loaded
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.processNodeSelection(child, selected);
      });
    } else if (selected && NODE_LEVEL < 3) {
      // If parent selected and children NOT loaded, load them and select them
      this.loadChildrenAndSelect(node);
    }
  }

  private loadChildrenAndSelect(node: Capitulo): void {
    const LEVEL = node.level ?? 0;
    node.loading = true;

    const HANDLE_RESPONSE = (res: { datos?: Capitulo[] }, nextLevel: number): void => {
      node.children = (res.datos || []).map((item) => ({
        ...item,
        level: nextLevel,
        expanded: true,
        children: []
      }));
      node.expanded = true;
      node.loading = false;
      
      // Select children recursively
      if (node.children) {
        node.children.forEach(child => {
          this.processNodeSelection(child, true);
        });
      }
      // Re-verify parents after loading children
      this.checkParentSelectionRecursively(this.nodes);
    };

    if (LEVEL === 0) {
      this.fraccionesService.getPartidas(node.clave).subscribe({
        next: (res) => {
          HANDLE_RESPONSE(res, 1);
        },
        error: () => {
          node.loading = false;
        }
      });
    } else if (LEVEL === 1) {
      this.fraccionesService.getSubpartidas(node.clave).subscribe({
        next: (res) => {
          HANDLE_RESPONSE(res, 2);
        },
        error: () => {
          node.loading = false;
        }
      });
    } else if (LEVEL === 2) {
      this.fraccionesService.getFraccionesTigie(node.clave).subscribe({
        next: (res) => {
          HANDLE_RESPONSE(res, 3);
        },
        error: () => {
          node.loading = false;
        }
      });
    }
  }

  private updateFormValue(): void {
    this.treeForm.patchValue({
      selectedNodeIds: Array.from(this.selectedNodes)
    });
  }

  agregarFracciones(): void {
    const SELECTED_STRINGS: string[] = [];
    
    // Helper to get selected values according to the rule:
    // If a parent is fully selected, use only the parent.
    // Otherwise, check children.
    const COLLECT_SELECTED = (nodes: Capitulo[]) => {
      for (const NODE of nodes) {
        if (this.selectedNodes.has(NODE.clave)) {
          // Parent is selected, so it must be fully selected (due to checkParentSelectionRecursively)
          SELECTED_STRINGS.push(NODE.clave);
        } else if (NODE.children && NODE.children.length > 0) {
          // Parent not selected, check its children
          COLLECT_SELECTED(NODE.children);
        }
      }
    };

    COLLECT_SELECTED(this.nodes);

    if (SELECTED_STRINGS.length === 0) {
      return;
    }

    const CADENA = SELECTED_STRINGS.join('|');
    this.isLoading = true;
    
    this.fraccionesService.postAgregarFracciones(CADENA).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.codigo === '00') {
          // Also update local store for compatibility with ConsultarFraccionesComponent
          const NODES_TO_SAVE = Array.from(this.nodesToSave.values());
          this.fraccionesService.addFracciones(NODES_TO_SAVE);
          this.selectedNodesChange.emit(NODES_TO_SAVE);
          this.cancel.emit();
        } else {
          alert('Error al agregar fracciones: ' + res.mensaje);
        }
      },
      error: (err: unknown) => {
        this.isLoading = false;
        console.error(err);
        alert('Ocurrió un error al procesar la solicitud');
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
