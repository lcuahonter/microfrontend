import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { Suplencia, Usuario } from '../../../core/models/usuario.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-gestionar-suplencias',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, UserSearchComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-arrow-left-right"></i> Gestión de Suplencias</h4>

      <!-- Tabs Bootstrap -->
      <ul class="nav nav-tabs mb-3" role="tablist">
        <li class="nav-item">
          <button class="nav-link" [class.active]="tabActivo() === 'nueva'"
                  (click)="tabActivo.set('nueva')" type="button">Nueva Suplencia</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" [class.active]="tabActivo() === 'activas'"
                  (click)="tabActivo.set('activas')" type="button">Suplencias Activas</button>
        </li>
      </ul>

      <!-- Nueva suplencia -->
      @if (tabActivo() === 'nueva') {
        <div class="tab-content-inner">
          <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

          @if (paso() === 0) {
            <h3>Seleccionar Titular</h3>
            <vuc-user-search (seleccionado)="titular.set($event)"></vuc-user-search>
            @if (titular()) {
              <button class="btn btn-primary" (click)="paso.set(1)">
                Siguiente <i class="bi bi-arrow-right"></i>
              </button>
            }
          }
          @if (paso() === 1) {
            <h3>Seleccionar Suplente</h3>
            <vuc-user-search (seleccionado)="suplente.set($event)"></vuc-user-search>
            @if (suplente()) {
              <div class="step-nav">
                <button class="btn btn-outline-primary" (click)="paso.set(0)"><i class="bi bi-arrow-left"></i> Anterior</button>
                <button class="btn btn-primary" (click)="paso.set(2)">
                  Siguiente <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            }
          }
          @if (paso() === 2) {
            <h3>Período de Suplencia</h3>
            <form [formGroup]="formFechas" class="form-fields">
              <div class="mb-3">
                <label class="form-label">Fecha de Inicio</label>
                <input class="form-control" type="date" formControlName="inicio">
                @if (formFechas.get('inicio')?.hasError('required') && formFechas.get('inicio')?.touched) {
                  <div class="invalid-feedback d-block">La fecha de inicio es requerida</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Fecha de Fin</label>
                <input class="form-control" type="date" formControlName="fin">
                @if (formFechas.get('fin')?.hasError('required') && formFechas.get('fin')?.touched) {
                  <div class="invalid-feedback d-block">La fecha de fin es requerida</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Motivo (opcional)</label>
                <textarea class="form-control" formControlName="motivo" rows="2"></textarea>
              </div>
            </form>
            @if (exito()) {
              <vuc-alert type="success">Suplencia creada correctamente.</vuc-alert>
            }
            <div class="step-nav">
              <button class="btn btn-outline-primary" (click)="paso.set(1)"><i class="bi bi-arrow-left"></i> Anterior</button>
              <button class="btn btn-primary" (click)="crearSuplencia()" [disabled]="formFechas.invalid || cargando()">
                @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
                @else { <i class="bi bi-save"></i> Crear Suplencia }
              </button>
            </div>
          }
        </div>
      }

      <!-- Suplencias activas -->
      @if (tabActivo() === 'activas') {
        <div class="tab-content-inner">
          @if (!suplencias().length) {
            <vuc-alert type="info">No hay suplencias activas en este momento.</vuc-alert>
          } @else {
            @for (s of suplencias(); track s.id) {
              <div class="card suplencia-card mb-3">
                <div class="card-body">
                  <div class="suplencia-row">
                    <div>
                      <p><strong>Titular:</strong> {{ s.nombreTitular }} ({{ s.rfcTitular }})</p>
                      <p><strong>Suplente:</strong> {{ s.nombreSuplente }} ({{ s.rfcSuplente }})</p>
                      <p><strong>Período:</strong> {{ s.fechaInicio }} — {{ s.fechaFin }}</p>
                    </div>
                    <span class="badge" [class]="s.activa ? 'chip-activa' : 'chip-inactiva'">
                      {{ s.activa ? 'Activa' : 'Finalizada' }}
                    </span>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .tab-content-inner { padding: 24px 0; }
    .tab-content-inner h3 { color: #404041; margin-bottom: 16px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
    .suplencia-row { display: flex; justify-content: space-between; align-items: center; }
    .suplencia-row p { margin: 2px 0; font-size: 14px; }
    .chip-activa { background: #2e7d32 !important; color: white !important; }
    .chip-inactiva { background: #6c757d !important; color: white !important; }
  `],
})
export class GestionarSuplenciasComponent implements OnInit {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  tabActivo = signal<'nueva' | 'activas'>('nueva');
  paso = signal(0);
  titular = signal<Usuario | null>(null);
  suplente = signal<Usuario | null>(null);
  suplencias = signal<Suplencia[]>([]);
  cargando = signal(false);
  exito = signal(false);

  readonly pasos: WizardStep[] = [
    { label: 'Titular', icon: 'person' },
    { label: 'Suplente', icon: 'person_outline' },
    { label: 'Fechas', icon: 'date_range' },
  ];

  formFechas = this.fb.group({
    inicio: ['', Validators.required],
    fin: ['', Validators.required],
    motivo: [''],
  });

  ngOnInit() {
    const RFC = this.auth.usuario()?.rfc;
    if (RFC) { this.api.getSuplencias(RFC).subscribe(s => this.suplencias.set(s)); }
  }

  crearSuplencia() {
    this.cargando.set(true);
    const DTO: Partial<Suplencia> = {
      rfcTitular: this.titular()!.rfc,
      nombreTitular: `${this.titular()!.nombre} ${this.titular()!.primerApellido}`,
      rfcSuplente: this.suplente()!.rfc,
      nombreSuplente: `${this.suplente()!.nombre} ${this.suplente()!.primerApellido}`,
      fechaInicio: this.formFechas.value.inicio!,
      fechaFin: this.formFechas.value.fin!,
      motivo: this.formFechas.value.motivo || undefined,
      activa: true,
    };
    this.api.crearSuplencia(DTO).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
