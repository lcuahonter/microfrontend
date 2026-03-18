import { Component, Output, EventEmitter, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Tramite } from '../../../core/models/tramite.model';

@Component({
  selector: 'vuc-tramites-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCheckboxModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="tramites-list">
      <mat-form-field appearance="outline" style="width:100%; margin-bottom:8px">
        <mat-label>Filtrar trámites</mat-label>
        <mat-icon matPrefix>filter_list</mat-icon>
        <input matInput [value]="filtro()" (input)="setFiltro($event)" placeholder="Buscar por nombre o clave...">
      </mat-form-field>

      @if (cargando()) {
        <div style="text-align:center; padding: 24px"><mat-spinner diameter="32"></mat-spinner></div>
      } @else {
        <div class="tramites-list__container">
          @for (tramite of tramitesFiltrados(); track tramite.id) {
            <div class="tramite-item">
              <mat-checkbox
                [checked]="seleccionados().has(tramite.id)"
                (change)="toggleTramite(tramite.id, $event.checked)">
                <div class="tramite-item__info">
                  <span class="tramite-item__clave">{{ tramite.clave }}</span>
                  <span class="tramite-item__nombre">{{ tramite.nombre }}</span>
                </div>
              </mat-checkbox>
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
    const f = this.filtro().toLowerCase();
    return this.tramites().filter(t =>
      t.nombre.toLowerCase().includes(f) || t.clave.toLowerCase().includes(f)
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

  toggleTramite(id: number, checked: boolean) {
    const set = new Set(this.seleccionados());
    checked ? set.add(id) : set.delete(id);
    this.seleccionados.set(set);
    this.seleccionCambiada.emit([...set]);
  }
}
