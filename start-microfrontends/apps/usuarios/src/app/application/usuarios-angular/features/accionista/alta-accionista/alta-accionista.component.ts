import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { TipoPersona, TipoNacionalidad, Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-alta-accionista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatRadioModule, MatProgressSpinnerModule,
    StepperComponent, AlertComponent, UserSearchComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>group_add</mat-icon> Alta de Accionista</h2>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      <!-- PASO 0: Empresa -->
      @if (paso() === 0) {
        <h3>Buscar Empresa (Persona Moral)</h3>
        <vuc-user-search (seleccionado)="empresa.set($event)"></vuc-user-search>
        @if (empresa()) {
          <button mat-raised-button color="primary" (click)="paso.set(1)" style="margin-top:12px">
            Continuar <mat-icon>arrow_forward</mat-icon>
          </button>
        }
      }

      <!-- PASO 1: Tipo de accionista -->
      @if (paso() === 1) {
        <h3>Tipo de Accionista</h3>
        <mat-radio-group [(ngModel)]="tipoPersona" class="radio-group">
          <mat-radio-button value="FISICA">Persona Física</mat-radio-button>
          <mat-radio-button value="MORAL">Persona Moral</mat-radio-button>
        </mat-radio-group>
        <mat-radio-group [(ngModel)]="tipoNacionalidad" class="radio-group" style="margin-top:12px">
          <mat-radio-button value="MEXICANO">Mexicano</mat-radio-button>
          <mat-radio-button value="EXTRANJERO">Extranjero</mat-radio-button>
        </mat-radio-group>
        <div class="step-nav">
          <button mat-stroked-button (click)="paso.set(0)"><mat-icon>arrow_back</mat-icon> Anterior</button>
          <button mat-raised-button color="primary" (click)="paso.set(2)">Continuar <mat-icon>arrow_forward</mat-icon></button>
        </div>
      }

      <!-- PASO 2: Datos del accionista -->
      @if (paso() === 2) {
        <h3>Datos del Accionista</h3>
        <form [formGroup]="formDatos" class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>RFC</mat-label>
            <input matInput formControlName="rfc" maxlength="13" style="text-transform:uppercase">
          </mat-form-field>
          @if (tipoPersona === 'FISICA') {
            <mat-form-field appearance="outline">
              <mat-label>Nombre(s)</mat-label>
              <input matInput formControlName="nombre">
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Primer Apellido</mat-label>
              <input matInput formControlName="primerApellido">
            </mat-form-field>
          } @else {
            <mat-form-field appearance="outline">
              <mat-label>Razón Social</mat-label>
              <input matInput formControlName="nombre">
            </mat-form-field>
          }
          <mat-form-field appearance="outline">
            <mat-label>% de Participación</mat-label>
            <input matInput formControlName="porcentaje" type="number" min="1" max="100">
            <span matSuffix>%</span>
          </mat-form-field>
        </form>
        <div class="step-nav">
          <button mat-stroked-button (click)="paso.set(1)"><mat-icon>arrow_back</mat-icon> Anterior</button>
          <button mat-raised-button color="primary" (click)="paso.set(3)" [disabled]="formDatos.invalid">Confirmar con e.firma <mat-icon>arrow_forward</mat-icon></button>
        </div>
      }

      <!-- PASO 3: e.firma -->
      @if (paso() === 3) {
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (exito()) { <vuc-alert type="success">Accionista registrado correctamente.</vuc-alert> }
        @if (fielData) {
          <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()" style="margin-top:12px">
            @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { <mat-icon>save</mat-icon> Guardar Accionista }
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 640px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .radio-group { display: flex; gap: 20px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class AltaAccionistaComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  empresa = signal<Usuario | null>(null);
  tipoPersona = 'FISICA';
  tipoNacionalidad = 'MEXICANO';
  fielData: any = null;
  cargando = signal(false);
  exito = signal(false);

  pasos: WizardStep[] = [
    { label: 'Empresa', icon: 'business' },
    { label: 'Tipo', icon: 'person' },
    { label: 'Datos', icon: 'badge' },
    { label: 'e.firma', icon: 'security' },
  ];

  formDatos = this.fb.group({
    rfc: ['', Validators.required],
    nombre: ['', Validators.required],
    primerApellido: [''],
    porcentaje: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  onFirmado(data: any) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const dto = {
      rfc: this.formDatos.value.rfc!,
      nombre: this.formDatos.value.nombre!,
      primerApellido: this.formDatos.value.primerApellido || '',
      tipoPersona: this.tipoPersona as TipoPersona,
      tipoNacionalidad: this.tipoNacionalidad as TipoNacionalidad,
      porcentajeParticipacion: +this.formDatos.value.porcentaje!,
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaAccionista(this.empresa()!.rfc, dto).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
