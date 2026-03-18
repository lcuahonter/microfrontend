import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserSearchComponent } from '../../shared/components/user-search/user-search.component';
import { TramitesListComponent } from '../../shared/components/tramites-list/tramites-list.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';
import { Usuario } from '../../core/models/usuario.model';
import { Tramite } from '../../core/models/tramite.model';

@Component({
  selector: 'vuc-tramites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, MatTabsModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, UserSearchComponent,
    TramitesListComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>description</mat-icon> Gestión de Trámites</h2>
      <mat-tab-group>
        <!-- Pestaña 1: Asignar -->
        <mat-tab label="Asignar Trámites">
          <div class="tab-content">
            <vuc-user-search (seleccionado)="onUsuario($event)"></vuc-user-search>
            @if (usuario()) {
              <h3>Seleccione trámites para {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
              <vuc-tramites-list (seleccionCambiada)="tramitesSeleccionados = $event"></vuc-tramites-list>
              @if (exito()) {
                <vuc-alert type="success">{{ tramitesSeleccionados.length }} trámite(s) asignados correctamente.</vuc-alert>
              }
              <button mat-raised-button color="primary" (click)="asignar()" [disabled]="!tramitesSeleccionados.length">
                <mat-icon>save</mat-icon> Guardar Asignación
              </button>
            }
          </div>
        </mat-tab>

        <!-- Pestaña 2: Catálogo -->
        <mat-tab label="Catálogo de Trámites">
          <div class="tab-content">
            <table mat-table [dataSource]="catalogoTramites()" class="tramites-table">
              <ng-container matColumnDef="clave">
                <th mat-header-cell *matHeaderCellDef>Clave</th>
                <td mat-cell *matCellDef="let t">{{ t.clave }}</td>
              </ng-container>
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let t">{{ t.nombre }}</td>
              </ng-container>
              <ng-container matColumnDef="descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let t">{{ t.descripcion }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columnas"></tr>
              <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
            </table>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container { max-width: 900px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .tab-content { padding: 24px 0; }
    .tab-content h3 { color: #006847; margin-bottom: 16px; }
    .tramites-table { width: 100%; }
  `],
})
export class TramitesComponent implements import('@angular/core').OnInit {
  private api = inject(UsuariosApiService);

  usuario = signal<Usuario | null>(null);
  catalogoTramites = signal<Tramite[]>([]);
  tramitesSeleccionados: number[] = [];
  exito = signal(false);
  columnas = ['clave', 'nombre', 'descripcion'];

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
