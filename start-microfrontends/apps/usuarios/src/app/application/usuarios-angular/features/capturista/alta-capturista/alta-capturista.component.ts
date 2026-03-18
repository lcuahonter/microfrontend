import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-alta-capturista',
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
      <h2 class="page-title"><mat-icon>edit_note</mat-icon> Alta de Capturista Privado</h2>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <h3>Buscar Usuario Principal</h3>
        <vuc-user-search (seleccionado)="usuarioPrincipal.set($event)"></vuc-user-search>
        @if (usuarioPrincipal()) {
          <button mat-raised-button color="primary" (click)="paso.set(1)" style="margin-top:12px">
            Continuar <mat-icon>arrow_forward</mat-icon>
          </button>
        }
      }

      @if (paso() === 1) {
        <h3>Datos del Capturista</h3>
        <vuc-alert type="info">El capturista debe estar registrado en RENAPO. Se verificará su CURP.</vuc-alert>
        <form [formGroup]="form" class="form-fields">
          <mat-form-field appearance="outline">
            <mat-label>RFC del Capturista</mat-label>
            <input matInput formControlName="rfc" maxlength="13" style="text-transform:uppercase">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>CURP</mat-label>
            <input matInput formControlName="curp" maxlength="18" style="text-transform:uppercase">
            <button mat-icon-button matSuffix type="button" (click)="verificarCurp()" [disabled]="verificandoCurp()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>
          @if (curpVerificado()) {
            <vuc-alert type="success">CURP verificado: {{ nombreRenapo() }}</vuc-alert>
          }
          <mat-form-field appearance="outline">
            <mat-label>Correo Electrónico</mat-label>
            <input matInput formControlName="correo" type="email">
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
        @if (exito()) { <vuc-alert type="success">Capturista registrado correctamente.</vuc-alert> }
        @if (fielData) {
          <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()" style="margin-top:12px">
            @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
            @else { <mat-icon>save</mat-icon> Registrar Capturista }
          </button>
        }
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
export class AltaCapturistaComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  usuarioPrincipal = signal<Usuario | null>(null);
  fielData: any = null;
  cargando = signal(false);
  exito = signal(false);
  verificandoCurp = signal(false);
  curpVerificado = signal(false);
  nombreRenapo = signal('');

  pasos: WizardStep[] = [
    { label: 'Usuario', icon: 'person' },
    { label: 'Capturista', icon: 'badge' },
    { label: 'e.firma', icon: 'security' },
  ];

  form = this.fb.group({
    rfc: ['', Validators.required],
    curp: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
  });

  verificarCurp() {
    const curp = this.form.value.curp;
    if (!curp) return;
    this.verificandoCurp.set(true);
    this.api.verificarCurp(curp).subscribe(res => {
      this.verificandoCurp.set(false);
      this.curpVerificado.set(true);
      this.nombreRenapo.set(res.nombreCompleto);
    });
  }

  onFirmado(data: any) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const dto = {
      rfc: this.form.value.rfc!,
      curp: this.form.value.curp!,
      nombre: this.nombreRenapo() || 'NOMBRE',
      primerApellido: '',
      correo: this.form.value.correo!,
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaCapturista(this.usuarioPrincipal()!.rfc, dto).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
