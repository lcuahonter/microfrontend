import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { Tramite } from '../../core/models/tramite.model';
import { TramitesListComponent } from '../../shared/components/tramites-list/tramites-list.component';
import { UserSearchComponent } from '../../shared/components/user-search/user-search.component';
import { Usuario } from '../../core/models/usuario.model';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-tramites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, UserSearchComponent,
    TramitesListComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-file-text"></i> Gestión de Trámites</h4>

      <!-- Tabs Bootstrap -->
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <button class="nav-link" [class.active]="tabActivo() === 'asignar'"
                  (click)="tabActivo.set('asignar')" type="button">Asignar Trámites</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tabActivo() === 'catalogo'"
                  (click)="tabActivo.set('catalogo')" type="button">Catálogo de Trámites</button>
        </li>
      </ul>

      <!-- Pestaña 1: Asignar -->
      @if (tabActivo() === 'asignar') {
        <div class="tab-content-inner">
          <vuc-user-search (seleccionado)="onUsuario($event)"></vuc-user-search>
          @if (usuario()) {
            <h3>Seleccione trámites para {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
            <vuc-tramites-list (seleccionCambiada)="tramitesSeleccionados = $event"></vuc-tramites-list>
            @if (exito()) {
              <vuc-alert type="success">{{ tramitesSeleccionados.length }} trámite(s) asignados correctamente.</vuc-alert>
            }
            <button class="btn btn-primary" (click)="asignar()" [disabled]="!tramitesSeleccionados.length">
              <i class="bi bi-save"></i> Guardar Asignación
            </button>
          }
        </div>
      }

      <!-- Pestaña 2: Catálogo -->
      @if (tabActivo() === 'catalogo') {
        <div class="tab-content-inner">
          <table class="table table-striped table-bordered table-hover">
            <thead class="table-light">
              <tr>
                <th>Clave</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              @for (t of catalogoTramites(); track t.id) {
                <tr>
                  <td>{{ t.clave }}</td>
                  <td>{{ t.nombre }}</td>
                  <td>{{ t.descripcion }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .tab-content-inner { padding: 24px 0; }
    .tab-content-inner h3 { color: #404041; margin-bottom: 16px; }
  `],
})
export class TramitesComponent implements OnInit {
  private api = inject(UsuariosApiService);

  tabActivo = signal<'asignar' | 'catalogo'>('asignar');
  usuario = signal<Usuario | null>(null);
  catalogoTramites = signal<Tramite[]>([]);
  tramitesSeleccionados: number[] = [];
  exito = signal(false);

  ngOnInit() {
    this.api.getCatalogoTramites().subscribe(t => this.catalogoTramites.set(t));
  }

  onUsuario(u: Usuario) { this.usuario.set(u); this.exito.set(false); }

  asignar() {
    this.api.asignarTramites(this.usuario()!.rfc, this.tramitesSeleccionados).subscribe(() => {
      this.exito.set(true);
    });
  }
}
