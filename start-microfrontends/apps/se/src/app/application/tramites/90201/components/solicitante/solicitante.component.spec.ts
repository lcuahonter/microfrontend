import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { SolicitanteComponent } from './solicitante.component';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, TituloComponent, SolicitanteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los controles deshabilitados', () => {
    const form = component.solicitudForm;
    expect(form).toBeDefined();
    expect(form.get('rfc')?.disabled).toBe(true);
    expect(form.get('denominacion')?.disabled).toBe(true);
    expect(form.get('actividadEconomica')?.disabled).toBe(true);
    expect(form.get('correoElectronico')?.disabled).toBe(true);
  });

  it('debe establecer los valores del formulario en ngOnInit', () => {
    // ngOnInit is already called in fixture.detectChanges()
    expect(component.solicitudForm.get('rfc')?.value).toBe('AALM87326');
    expect(component.solicitudForm.get('denominacion')?.value).toBe('SVHGSA ASCV 332');
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe('SIMa gsys');
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe('SV US');
  });
});
