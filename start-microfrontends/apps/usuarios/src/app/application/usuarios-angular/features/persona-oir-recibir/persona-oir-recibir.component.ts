import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StepperComponent, WizardStep } from '../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { UserSearchComponent } from '../../shared/components/user-search/user-search.component';
import { FielSignatureComponent } from '../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'vuc-persona-oir-recibir',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, StepperComponent, AlertComponent,
    UserSearchComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>contact_phone</mat-icon> Persona Autorizada para Oír y Recibir</h2>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <h3>Buscar Usuario</h3>
        <vuc-user-search (seleccionado)="usuario.set($event)"></vuc-user-search>
        @if (usuario()) {
          <button mat-raised-button color="primary" (click)="paso.set(1)" style="margin-top:12px">
            Continuar <mat-icon>arrow_forward</mat-icon>
          </button>
        }
      }

      @if (paso() === 1) {
        <h3>Datos de la Persona Autorizada</h3>
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
          <mat-form-field appearance="outline">
            <mat-label>Correo Electrónico</mat-label>
            <input matInput formControlName="correo" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Teléfono (opcional)</mat-label>
            <input matInput formControlName="telefono" maxlength="10">
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
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (exito()) { <vuc-alert type="success">Persona autorizada registrada correctamente.</vuc-alert> }
        @if (fielData) {
          <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()" style="margin-top:12px">
            @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { <mat-icon>save</mat-icon> Registrar Persona }
          </button>
        }
      }

      @if (paso() === 3 && exito()) {
        <vuc-alert type="success">Registro completado exitosamente.</vuc-alert>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 600px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class PersonaOirRecibirComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  usuario = signal<Usuario | null>(null);
  fielData: any = null;
  cargando = signal(false);
  exito = signal(false);

  pasos: WizardStep[] = [
    { label: 'Usuario', icon: 'person' },
    { label: 'Datos', icon: 'badge' },
    { label: 'e.firma', icon: 'security' },
    { label: 'Listo', icon: 'check' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    primerApellido: ['', Validators.required],
    segundoApellido: [''],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
  });

  onFirmado(data: any) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const dto = {
      nombre: this.form.value.nombre!,
      primerApellido: this.form.value.primerApellido!,
      segundoApellido: this.form.value.segundoApellido || undefined,
      correo: this.form.value.correo!,
      telefono: this.form.value.telefono || undefined,
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaPersonaOirRecibir(this.usuario()!.rfc, dto).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
      this.paso.set(3);
    });
  }
}
