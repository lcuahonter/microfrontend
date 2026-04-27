import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { TipoNacionalidad, TipoPersona, Usuario } from '../../../core/models/usuario.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-alta-accionista',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, AlertComponent, UserSearchComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-people"></i> Alta de Accionista</h4>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      <!-- PASO 0: Empresa -->
      @if (paso() === 0) {
        <h3>Buscar Empresa (Persona Moral)</h3>
        <vuc-user-search (seleccionado)="empresa.set($event)"></vuc-user-search>
        @if (empresa()) {
          <button class="btn btn-primary mt-3" (click)="paso.set(1)">
            Continuar <i class="bi bi-arrow-right"></i>
          </button>
        }
      }

      <!-- PASO 1: Tipo de accionista -->
      @if (paso() === 1) {
        <h3>Tipo de Accionista</h3>
        <div class="mb-3">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="tipoPersona" id="tipoFisica" value="FISICA" [formControl]="tipoPersonaCtrl">
            <label class="form-check-label" for="tipoFisica">Persona Física</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="tipoPersona" id="tipoMoral" value="MORAL" [formControl]="tipoPersonaCtrl">
            <label class="form-check-label" for="tipoMoral">Persona Moral</label>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="tipoNacionalidad" id="tipoMex" value="MEXICANO" [formControl]="tipoNacionalidadCtrl">
            <label class="form-check-label" for="tipoMex">Mexicano</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="tipoNacionalidad" id="tipoExt" value="EXTRANJERO" [formControl]="tipoNacionalidadCtrl">
            <label class="form-check-label" for="tipoExt">Extranjero</label>
          </div>
        </div>
        <div class="step-nav">
          <button class="btn btn-outline-primary" (click)="paso.set(0)"><i class="bi bi-arrow-left"></i> Anterior</button>
          <button class="btn btn-primary" (click)="paso.set(2)">Continuar <i class="bi bi-arrow-right"></i></button>
        </div>
      }

      <!-- PASO 2: Datos del accionista -->
      @if (paso() === 2) {
        <h3>Datos del Accionista</h3>
        <form [formGroup]="formDatos" class="form-fields">
          <div class="mb-3">
            <label class="form-label">RFC</label>
            <input class="form-control text-uppercase" formControlName="rfc" maxlength="13">
            @if (formDatos.get('rfc')?.hasError('required') && formDatos.get('rfc')?.touched) {
              <div class="invalid-feedback d-block">El RFC es requerido</div>
            }
          </div>
          @if (tipoPersonaCtrl.value === 'FISICA') {
            <div class="mb-3">
              <label class="form-label">Nombre(s)</label>
              <input class="form-control" formControlName="nombre">
              @if (formDatos.get('nombre')?.hasError('required') && formDatos.get('nombre')?.touched) {
                <div class="invalid-feedback d-block">Este campo es requerido</div>
              }
            </div>
            <div class="mb-3">
              <label class="form-label">Primer Apellido</label>
              <input class="form-control" formControlName="primerApellido">
            </div>
          } @else {
            <div class="mb-3">
              <label class="form-label">Razón Social</label>
              <input class="form-control" formControlName="nombre">
              @if (formDatos.get('nombre')?.hasError('required') && formDatos.get('nombre')?.touched) {
                <div class="invalid-feedback d-block">Este campo es requerido</div>
              }
            </div>
          }
          <div class="mb-3">
            <label class="form-label">% de Participación</label>
            <div class="input-group">
              <input class="form-control" formControlName="porcentaje" type="number" min="1" max="100">
              <span class="input-group-text">%</span>
            </div>
            @if (formDatos.get('porcentaje')?.hasError('required') && formDatos.get('porcentaje')?.touched) {
              <div class="invalid-feedback d-block">El porcentaje es requerido</div>
            }
            @if ((formDatos.get('porcentaje')?.hasError('min') || formDatos.get('porcentaje')?.hasError('max')) && formDatos.get('porcentaje')?.touched) {
              <div class="invalid-feedback d-block">Debe ser entre 1 y 100</div>
            }
          </div>
        </form>
        <div class="step-nav">
          <button class="btn btn-outline-primary" (click)="paso.set(1)"><i class="bi bi-arrow-left"></i> Anterior</button>
          <button class="btn btn-primary" (click)="paso.set(3)" [disabled]="formDatos.invalid">Confirmar con e.firma <i class="bi bi-arrow-right"></i></button>
        </div>
      }

      <!-- PASO 3: e.firma -->
      @if (paso() === 3) {
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (exito()) { <vuc-alert type="success">Accionista registrado correctamente.</vuc-alert> }
        @if (fielData) {
          <button class="btn btn-primary mt-3" (click)="guardar()" [disabled]="cargando()">
            @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
            @else { <i class="bi bi-save"></i> Guardar Accionista }
          </button>
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
export class AltaAccionistaComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  empresa = signal<Usuario | null>(null);
  tipoPersonaCtrl = new FormControl('FISICA');
  tipoNacionalidadCtrl = new FormControl('MEXICANO');
  fielData: unknown = null;
  cargando = signal(false);
  exito = signal(false);

  readonly pasos: WizardStep[] = [
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

  onFirmado(data: unknown) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const DTO = {
      rfc: this.formDatos.value.rfc!,
      nombre: this.formDatos.value.nombre!,
      primerApellido: this.formDatos.value.primerApellido || '',
      tipoPersona: this.tipoPersonaCtrl.value as TipoPersona,
      tipoNacionalidad: this.tipoNacionalidadCtrl.value as TipoNacionalidad,
      porcentajeParticipacion: Number(this.formDatos.value.porcentaje!),
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaAccionista(this.empresa()!.rfc, DTO).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
