import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AlertComponent } from '../alert/alert.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario, EstatusUsuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-user-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCardModule, MatProgressSpinnerModule,
    MatChipsModule, AlertComponent,
  ],
  template: `
    <div class="user-search">
      <form [formGroup]="form" (ngSubmit)="buscar()" class="user-search__form">
        <mat-form-field appearance="outline" class="user-search__input">
          <mat-label>RFC del Usuario</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput formControlName="rfc" placeholder="Ej: GOMA800101AB1" maxlength="13" style="text-transform:uppercase">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="cargando()">
          @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
          @else { <mat-icon>search</mat-icon> Buscar }
        </button>
      </form>

      @if (noEncontrado()) {
        <vuc-alert type="warning">No se encontró ningún usuario con el RFC indicado.</vuc-alert>
      }

      @if (usuario()) {
        <mat-card class="user-card">
          <mat-card-content>
            <div class="user-card__header">
              <div class="user-card__avatar">
                <mat-icon>{{ usuario()!.tipoPersona === 'MORAL' ? 'business' : 'person' }}</mat-icon>
              </div>
              <div class="user-card__info">
                <h3>{{ usuario()!.nombre }} {{ usuario()!.primerApellido }} {{ usuario()!.segundoApellido }}</h3>
                <p><strong>RFC:</strong> {{ usuario()!.rfc }}</p>
                <p><strong>Correo:</strong> {{ usuario()!.correo }}</p>
                <p><strong>Tipo:</strong> {{ usuario()!.tipoPersona }} | {{ usuario()!.tipoNacionalidad }}</p>
              </div>
              <mat-chip [class]="'status-' + usuario()!.estatus">{{ usuario()!.estatus }}</mat-chip>
            </div>
            <button mat-flat-button color="primary" (click)="seleccionar()">
              <mat-icon>check</mat-icon> Seleccionar Usuario
            </button>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .user-search__form { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
    .user-search__input { flex: 1; }
    .user-card { border: 1px solid #e0e0e0; }
    .user-card__header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .user-card__avatar { width: 48px; height: 48px; border-radius: 50%; background: #006847; display: flex; align-items: center; justify-content: center; color: white; }
    .user-card__info h3 { margin: 0 0 4px; font-size: 16px; }
    .user-card__info p { margin: 0; font-size: 13px; color: #555; }
    .status-ACTIVO { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .status-BLOQUEADO { background: #ffebee !important; color: #c62828 !important; }
    .status-PENDIENTE_CORREO { background: #fff8e1 !important; color: #e65100 !important; }
  `],
})
export class UserSearchComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);

  @Output() seleccionado = new EventEmitter<Usuario>();

  form = this.fb.group({ rfc: ['', Validators.required] });
  usuario = signal<Usuario | null>(null);
  cargando = signal(false);
  noEncontrado = signal(false);

  buscar() {
    if (this.form.invalid) return;
    const rfc = this.form.value.rfc!.toUpperCase();
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.usuario.set(null);

    this.api.buscarUsuario(rfc).subscribe(u => {
      this.cargando.set(false);
      if (u) this.usuario.set(u);
      else this.noEncontrado.set(true);
    });
  }

  seleccionar() {
    if (this.usuario()) this.seleccionado.emit(this.usuario()!);
  }
}
