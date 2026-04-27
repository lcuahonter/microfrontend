import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-alta-capturista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, AlertComponent,
    UserSearchComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-pencil-square"></i> Alta de Capturista Privado</h4>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <h3>Buscar Usuario Principal</h3>
        <vuc-user-search (seleccionado)="usuarioPrincipal.set($event)"></vuc-user-search>
        @if (usuarioPrincipal()) {
          <button class="btn btn-primary mt-3" (click)="paso.set(1)">
            Continuar <i class="bi bi-arrow-right"></i>
          </button>
        }
      }

      @if (paso() === 1) {
        <h3>Datos del Capturista</h3>
        <vuc-alert type="info">El capturista debe estar registrado en RENAPO. Se verificará su CURP.</vuc-alert>
        <form [formGroup]="form" class="form-fields">
          <div class="mb-3">
            <label class="form-label">RFC del Capturista</label>
            <input class="form-control text-uppercase" formControlName="rfc" maxlength="13">
            @if (form.get('rfc')?.hasError('required') && form.get('rfc')?.touched) {
              <div class="invalid-feedback d-block">El RFC es requerido</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">CURP</label>
            <div class="input-group">
              <input class="form-control text-uppercase" formControlName="curp" maxlength="18">
              <button class="btn btn-sm btn-link p-0 input-group-text" type="button" (click)="verificarCurp()" [disabled]="verificandoCurp()">
                <i class="bi bi-search"></i>
              </button>
            </div>
            @if (form.get('curp')?.hasError('required') && form.get('curp')?.touched) {
              <div class="invalid-feedback d-block">El CURP es requerido</div>
            }
          </div>
          @if (curpVerificado()) {
            <vuc-alert type="success">CURP verificado: {{ nombreRenapo() }}</vuc-alert>
          }
          <div class="mb-3">
            <label class="form-label">Correo Electrónico</label>
            <input class="form-control" formControlName="correo" type="email">
            @if (form.get('correo')?.hasError('required') && form.get('correo')?.touched) {
              <div class="invalid-feedback d-block">El correo es requerido</div>
            }
            @if (form.get('correo')?.hasError('email') && form.get('correo')?.touched) {
              <div class="invalid-feedback d-block">Formato de correo incorrecto</div>
            }
          </div>
        </form>
        <div class="step-nav">
          <button class="btn btn-outline-primary" (click)="paso.set(0)"><i class="bi bi-arrow-left"></i> Anterior</button>
          <button class="btn btn-primary" (click)="paso.set(2)" [disabled]="form.invalid">
            Confirmar con e.firma <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      }

      @if (paso() === 2) {
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (exito()) { <vuc-alert type="success">Capturista registrado correctamente.</vuc-alert> }
        @if (fielData) {
          <button class="btn btn-primary mt-3" (click)="guardar()" [disabled]="cargando()">
            @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
            @else { <i class="bi bi-save"></i> Registrar Capturista }
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
  fielData: unknown = null;
  cargando = signal(false);
  exito = signal(false);
  verificandoCurp = signal(false);
  curpVerificado = signal(false);
  nombreRenapo = signal('');

  readonly pasos: WizardStep[] = [
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
    const CURP = this.form.value.curp;
    if (!CURP) { return; }
    this.verificandoCurp.set(true);
    this.api.verificarCurp(CURP).subscribe(res => {
      this.verificandoCurp.set(false);
      this.curpVerificado.set(true);
      this.nombreRenapo.set(res.nombreCompleto);
    });
  }

  onFirmado(data: unknown) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const DTO = {
      rfc: this.form.value.rfc!,
      curp: this.form.value.curp!,
      nombre: this.nombreRenapo() || 'NOMBRE',
      primerApellido: '',
      correo: this.form.value.correo!,
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaCapturista(this.usuarioPrincipal()!.rfc, DTO).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
