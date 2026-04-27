import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { EstatusUsuario, Usuario } from '../../../core/models/usuario.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule } from '@angular/common';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-user-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    AlertComponent,
  ],
  template: `
    <div class="user-search">
      <form [formGroup]="form" (ngSubmit)="buscar()" class="user-search__form">
        <div class="input-group user-search__input">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input class="form-control text-uppercase" formControlName="rfc" placeholder="Ej: GOMA800101AB1" maxlength="13">
          <button class="btn btn-primary" type="submit" [disabled]="cargando()">
            @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
            @else { <i class="bi bi-search"></i> Buscar }
          </button>
        </div>
      </form>

      @if (noEncontrado()) {
        <vuc-alert type="warning">No se encontró ningún usuario con el RFC indicado.</vuc-alert>
      }

      @if (usuario()) {
        <div class="card user-card mt-3">
          <div class="card-body">
            <div class="user-card__header">
              <div class="user-card__avatar">
                <i class="bi" [class.bi-building]="usuario()!.tipoPersona === 'MORAL'" [class.bi-person]="usuario()!.tipoPersona !== 'MORAL'"></i>
              </div>
              <div class="user-card__info">
                <h3>{{ usuario()!.nombre }} {{ usuario()!.primerApellido }} {{ usuario()!.segundoApellido }}</h3>
                <p><strong>RFC:</strong> {{ usuario()!.rfc }}</p>
                <p><strong>Correo:</strong> {{ usuario()!.correo }}</p>
                <p><strong>Tipo:</strong> {{ usuario()!.tipoPersona }} | {{ usuario()!.tipoNacionalidad }}</p>
              </div>
              <span class="badge" [class]="'status-' + usuario()!.estatus">{{ usuario()!.estatus }}</span>
            </div>
            <button class="btn btn-primary" (click)="seleccionar()">
              <i class="bi bi-check-circle"></i> Seleccionar Usuario
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .user-search__form { margin-bottom: 16px; }
    .user-search__input { }
    .user-card { border: 1px solid #dee2e6; }
    .user-card__header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .user-card__avatar { width: 48px; height: 48px; border-radius: 50%; background: #006847; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; flex-shrink: 0; }
    .user-card__info h3 { margin: 0 0 4px; font-size: 16px; }
    .user-card__info p { margin: 0; font-size: 13px; color: #6c757d; }
    .status-ACTIVO { background: #2e7d32 !important; color: white !important; }
    .status-BLOQUEADO { background: #a94442 !important; color: white !important; }
    .status-PENDIENTE_CORREO { background: #8a6d3b !important; color: white !important; }
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
    if (this.form.invalid) { return; }
    const RFC = this.form.value.rfc!.toUpperCase();
    this.cargando.set(true);
    this.noEncontrado.set(false);
    this.usuario.set(null);

    this.api.buscarUsuario(RFC).subscribe(u => {
      this.cargando.set(false);
      if (u) { this.usuario.set(u); }
      else { this.noEncontrado.set(true); }
    });
  }

  seleccionar() {
    if (this.usuario()) { this.seleccionado.emit(this.usuario()!); }
  }
}
