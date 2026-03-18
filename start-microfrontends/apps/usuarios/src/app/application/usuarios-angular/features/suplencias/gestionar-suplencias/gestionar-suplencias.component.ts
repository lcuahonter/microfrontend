import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario, Suplencia } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-gestionar-suplencias',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule, MatCardModule,
    MatChipsModule, MatProgressSpinnerModule,
    StepperComponent, UserSearchComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>swap_horiz</mat-icon> Gestión de Suplencias</h2>
      <mat-tab-group>
        <!-- Nueva suplencia -->
        <mat-tab label="Nueva Suplencia">
          <div class="tab-content">
            <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

            @if (paso() === 0) {
              <h3>Seleccionar Titular</h3>
              <vuc-user-search (seleccionado)="titular.set($event)"></vuc-user-search>
              @if (titular()) {
                <button mat-raised-button color="primary" (click)="paso.set(1)">
                  Siguiente <mat-icon>arrow_forward</mat-icon>
                </button>
              }
            }
            @if (paso() === 1) {
              <h3>Seleccionar Suplente</h3>
              <vuc-user-search (seleccionado)="suplente.set($event)"></vuc-user-search>
              @if (suplente()) {
                <div class="step-nav">
                  <button mat-stroked-button (click)="paso.set(0)"><mat-icon>arrow_back</mat-icon> Anterior</button>
                  <button mat-raised-button color="primary" (click)="paso.set(2)">
                    Siguiente <mat-icon>arrow_forward</mat-icon>
                  </button>
                </div>
              }
            }
            @if (paso() === 2) {
              <h3>Período de Suplencia</h3>
              <form [formGroup]="formFechas" class="form-fields">
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Inicio</mat-label>
                  <input matInput [matDatepicker]="pickerInicio" formControlName="inicio">
                  <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
                  <mat-datepicker #pickerInicio></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Fin</mat-label>
                  <input matInput [matDatepicker]="pickerFin" formControlName="fin">
                  <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
                  <mat-datepicker #pickerFin></mat-datepicker>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Motivo (opcional)</mat-label>
                  <textarea matInput formControlName="motivo" rows="2"></textarea>
                </mat-form-field>
              </form>
              @if (exito()) {
                <vuc-alert type="success">Suplencia creada correctamente.</vuc-alert>
              }
              <div class="step-nav">
                <button mat-stroked-button (click)="paso.set(1)"><mat-icon>arrow_back</mat-icon> Anterior</button>
                <button mat-raised-button color="primary" (click)="crearSuplencia()" [disabled]="formFechas.invalid || cargando()">
                  @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> Crear Suplencia }
                </button>
              </div>
            }
          </div>
        </mat-tab>

        <!-- Suplencias activas -->
        <mat-tab label="Suplencias Activas">
          <div class="tab-content">
            @if (!suplencias().length) {
              <vuc-alert type="info">No hay suplencias activas en este momento.</vuc-alert>
            } @else {
              @for (s of suplencias(); track s.id) {
                <mat-card class="suplencia-card">
                  <mat-card-content>
                    <div class="suplencia-row">
                      <div>
                        <p><strong>Titular:</strong> {{ s.nombreTitular }} ({{ s.rfcTitular }})</p>
                        <p><strong>Suplente:</strong> {{ s.nombreSuplente }} ({{ s.rfcSuplente }})</p>
                        <p><strong>Período:</strong> {{ s.fechaInicio }} — {{ s.fechaFin }}</p>
                      </div>
                      <mat-chip [class]="s.activa ? 'chip-activa' : 'chip-inactiva'">
                        {{ s.activa ? 'Activa' : 'Finalizada' }}
                      </mat-chip>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .tab-content { padding: 24px 0; }
    .tab-content h3 { color: #006847; margin-bottom: 16px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
    .suplencia-card { margin-bottom: 12px; }
    .suplencia-row { display: flex; justify-content: space-between; align-items: center; }
    .suplencia-row p { margin: 2px 0; font-size: 14px; }
    .chip-activa { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .chip-inactiva { background: #f5f5f5 !important; color: #666 !important; }
  `],
})
export class GestionarSuplenciasComponent implements OnInit {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  paso = signal(0);
  titular = signal<Usuario | null>(null);
  suplente = signal<Usuario | null>(null);
  suplencias = signal<Suplencia[]>([]);
  cargando = signal(false);
  exito = signal(false);

  pasos: WizardStep[] = [
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
    const rfc = this.auth.usuario()?.rfc;
    if (rfc) this.api.getSuplencias(rfc).subscribe(s => this.suplencias.set(s));
  }

  crearSuplencia() {
    this.cargando.set(true);
    const dto: Partial<Suplencia> = {
      rfcTitular: this.titular()!.rfc,
      nombreTitular: `${this.titular()!.nombre} ${this.titular()!.primerApellido}`,
      rfcSuplente: this.suplente()!.rfc,
      nombreSuplente: `${this.suplente()!.nombre} ${this.suplente()!.primerApellido}`,
      fechaInicio: this.formFechas.value.inicio!,
      fechaFin: this.formFechas.value.fin!,
      motivo: this.formFechas.value.motivo || undefined,
      activa: true,
    };
    this.api.crearSuplencia(dto).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
