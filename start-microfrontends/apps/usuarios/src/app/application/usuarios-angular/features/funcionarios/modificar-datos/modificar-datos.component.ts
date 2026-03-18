import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-modificar-datos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
    UserSearchComponent, FielSignatureComponent, AlertComponent, StepperComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>edit</mat-icon> Modificar Datos de Usuario</h2>

      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <vuc-user-search (seleccionado)="onUsuario($event)"></vuc-user-search>
        @if (usuario()) {
          <button mat-raised-button color="primary" (click)="paso.set(1)" style="margin-top:16px">
            Editar Datos <mat-icon>arrow_forward</mat-icon>
          </button>
        }
      }

      @if (paso() === 1 && usuario()) {
        <h3>Editar Datos de {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
        <form [formGroup]="form" class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>Nombre(s)</mat-label>
            <input matInput formControlName="nombre">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Primer Apellido</mat-label>
            <input matInput formControlName="primerApellido">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Segundo Apellido</mat-label>
            <input matInput formControlName="segundoApellido">
          </mat-form-field>
        </form>
        <div class="step-nav">
          <button mat-stroked-button (click)="paso.set(0)"><mat-icon>arrow_back</mat-icon> Anterior</button>
          <button mat-raised-button color="primary" (click)="paso.set(2)" [disabled]="form.invalid">
            Confirmar con e.firma <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      }

      @if (paso() === 2) {
        <h3>Confirme los cambios con su e.firma</h3>
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (fielData) {
          <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()" style="margin-top:16px">
            @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { <mat-icon>save</mat-icon> Guardar Cambios }
          </button>
        }
        @if (exito()) {
          <vuc-alert type="success">Datos actualizados correctamente.</vuc-alert>
        }
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 640px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class ModificarDatosComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  usuario = signal<Usuario | null>(null);
  fielData: any = null;
  cargando = signal(false);
  exito = signal(false);

  pasos: WizardStep[] = [
    { label: 'Buscar', icon: 'search' },
    { label: 'Editar', icon: 'edit' },
    { label: 'Confirmar', icon: 'security' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    primerApellido: ['', Validators.required],
    segundoApellido: [''],
  });

  onUsuario(u: Usuario) {
    this.usuario.set(u);
    this.form.patchValue({ nombre: u.nombre, primerApellido: u.primerApellido, segundoApellido: u.segundoApellido });
  }

  onFirmado(data: any) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    this.api.modificarDatos(this.usuario()!.rfc, {
      nombre: this.form.value.nombre!,
      primerApellido: this.form.value.primerApellido!,
      segundoApellido: this.form.value.segundoApellido || undefined,
    }).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
