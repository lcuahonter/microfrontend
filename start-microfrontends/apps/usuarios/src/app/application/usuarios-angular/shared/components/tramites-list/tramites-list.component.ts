import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tramite } from '../../../core/models/tramite.model';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-tramites-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
  ],
  template: `
    <div class="tramites-list">
      <div class="mb-3">
        <label class="form-label">Filtrar trámites</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-funnel"></i></span>
          <input class="form-control" [value]="filtro()" (input)="setFiltro($event)" placeholder="Buscar por nombre o clave...">
        </div>
      </div>

      @if (cargando()) {
        <div style="text-align:center; padding: 24px">
          <div class="spinner-border" role="status"></div>
        </div>
      } @else {
        <div class="tramites-list__container">
          @for (tramite of tramitesFiltrados(); track tramite.id) {
            <div class="tramite-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" [id]="'tramite-' + tramite.id"
                       [checked]="seleccionados().has(tramite.id)"
                       (change)="toggleTramite(tramite.id, $event)">
                <label class="form-check-label" [for]="'tramite-' + tramite.id">
                  <div class="tramite-item__info">
                    <span class="tramite-item__clave">{{ tramite.clave }}</span>
                    <span class="tramite-item__nombre">{{ tramite.nombre }}</span>
                  </div>
                </label>
              </div>
            </div>
          }
        </div>
        <div class="tramites-list__footer">
          <span>{{ seleccionados().size }} trámite(s) seleccionado(s)</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .tramites-list__container { max-height: 320px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px; }
    .tramite-item { padding: 10px 16px; border-bottom: 1px solid #f5f5f5; }
    .tramite-item:last-child { border-bottom: none; }
    .tramite-item:hover { background: #f9f9f9; }
    .tramite-item__info { display: flex; flex-direction: column; }
    .tramite-item__clave { font-size: 11px; color: #006847; font-weight: 600; }
    .tramite-item__nombre { font-size: 13px; }
    .tramites-list__footer { padding: 8px 12px; background: #f5f5f5; border-radius: 0 0 8px 8px; font-size: 13px; color: #666; }
  `],
})
export class TramitesListComponent implements OnInit {
  private api = inject(UsuariosApiService);

  @Output() seleccionCambiada = new EventEmitter<number[]>();

  tramites = signal<Tramite[]>([]);
  cargando = signal(true);
  filtro = signal('');
  seleccionados = signal<Set<number>>(new Set());

  tramitesFiltrados = () => {
    const F = this.filtro().toLowerCase();
    return this.tramites().filter(t =>
      t.nombre.toLowerCase().includes(F) || t.clave.toLowerCase().includes(F)
    );
  };

  ngOnInit() {
    this.api.getCatalogoTramites().subscribe(lista => {
      this.tramites.set(lista);
      this.cargando.set(false);
    });
  }

  setFiltro(event: Event) {
    this.filtro.set((event.target as HTMLInputElement).value);
  }

  toggleTramite(id: number, event: Event) {
    const CHECKED = (event.target as HTMLInputElement).checked;
    const SET = new Set(this.seleccionados());
    if (CHECKED) { SET.add(id); } else { SET.delete(id); }
    this.seleccionados.set(SET);
    this.seleccionCambiada.emit([...SET]);
  }
}
