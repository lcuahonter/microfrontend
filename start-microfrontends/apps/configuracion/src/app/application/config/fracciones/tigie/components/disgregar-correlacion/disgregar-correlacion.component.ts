import { CargarArchivoMenusComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Capitulo } from '../../../../programas/prosec/service/model/request/tree-request';
import { CommonModule } from '@angular/common';
import { FraccionesService } from '../../../../programas/prosec/service/fracciones.service';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { TreeNodeItemComponent } from '../../../../programas/prosec/components/tree-data-select/tree-node-item.component';

@Component({
  selector: 'app-disgregar-correlacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    TreeNodeItemComponent,
    CargarArchivoMenusComponent
  ],
  templateUrl: './disgregar-correlacion.component.html'
})
export class DisgregarCorrelacionComponent implements OnInit {
  @ViewChild('modalCarga') modalElement!: ElementRef;
  
  form!: FormGroup;
  nodes: Capitulo[] = [];
  selectedNodes: Set<string> = new Set();
  isLoading = false;
  modalInstance: Modal | null = null;

  constructor(
    private fb: FormBuilder,
    private fraccionesService: FraccionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoOperacion: ['importacion', Validators.required],
      busqueda: ['', Validators.required]
    });
  }

  /**
   * Busca los capitulos
   */
  onBuscar(): void {
    const BUSQUEDA = this.form.get('busqueda');
    if (BUSQUEDA?.invalid) {
      BUSQUEDA.markAsTouched();
      return;
    }

    this.isLoading = true;
    this.fraccionesService.getCapitulos().subscribe({
      next: (res: BaseResponse<Capitulo[]>) => {
        this.nodes = (res.datos || []).map((item: Capitulo) => ({
          ...item,
          level: 0,
          expanded: false,
          children: []
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggle expandir/collapsar nodo
   * @param node 
   */
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

  /**
   * Carga los hijos del nodo
   * @param node 
   */
  private loadChildren(node: Capitulo): void {
    const LEVEL = node.level ?? 0;
    node.loading = true;

    const HANDLE_RESPONSE = (res: BaseResponse<Capitulo[]>): void => {
      node.children = (res.datos || []).map((item) => ({
        ...item,
        level: LEVEL + 1,
        expanded: false,
        children: []
      }));
      node.expanded = true;
      node.loading = false;
    };

    const ERROR_HANDLER = (): void => {
      node.loading = false;
    };

    if (LEVEL === 0) {
      this.fraccionesService.getPartidas(node.clave).subscribe({ next: HANDLE_RESPONSE, error: ERROR_HANDLER });
    } else if (LEVEL === 1) {
      this.fraccionesService.getSubpartidas(node.clave).subscribe({ next: HANDLE_RESPONSE, error: ERROR_HANDLER });
    } else if (LEVEL === 2) {
      this.fraccionesService.getFraccionesTigie(node.clave).subscribe({ next: HANDLE_RESPONSE, error: ERROR_HANDLER });
    }
  }

  /**
   * Selecciona/deselecciona un nodo
   * @param selection 
   */
  onSelectNode(selection: { node: Capitulo; selected: boolean }): void {
    const { node: NODE, selected: SELECTED } = selection;
    if (SELECTED) {
      this.selectedNodes.add(NODE.clave);
    } else {
      this.selectedNodes.delete(NODE.clave);
    }
  }

  /**
   * Disgregar fraccion
   */
  onDisgregarFraccion(): void {
    if (this.selectedNodes.size > 0) {
      // Lógica para procesar la disgregación
    }
  }

  /**
   * Abre el modal de carga masiva
   */
  onDisgregarCargaMasiva(): void {
    if (this.modalElement) {
      this.modalInstance = new Modal(this.modalElement.nativeElement);
      this.modalInstance.show();
    }
  }

  closeModal(): void {
    this.modalInstance?.hide();
  }

  onCancelar(): void {
    this.router.navigate(['/configuracion', 'fracciones']);
  }
}
