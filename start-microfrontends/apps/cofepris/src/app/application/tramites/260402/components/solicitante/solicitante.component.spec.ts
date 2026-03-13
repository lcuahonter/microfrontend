import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitanteComponent } from './solicitante.component';
import { CommonModule } from '@angular/common';
import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, CommonModule, TituloComponent, SolicitanteComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;

    component.establecerSolicitudForm();

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar solicitudForm con los controles correctos y en estado deshabilitado', () => {
    const form = component.solicitudForm;

    expect(form.get('rfc')).toBeTruthy();
    expect(form.get('denominacion')).toBeTruthy();
    expect(form.get('actividadEconomica')).toBeTruthy();
    expect(form.get('correoElectronico')).toBeTruthy();

    expect(form.get('rfc')?.disabled).toBe(true);
    expect(form.get('denominacion')?.disabled).toBe(true);
    expect(form.get('actividadEconomica')?.disabled).toBe(true);
    expect(form.get('correoElectronico')?.disabled).toBe(true);
  });

  it('debería establecer los valores por defecto de los controles del formulario correctamente', () => {
    component.establecerValoresDeFormulario();

    expect(component.solicitudForm.get('rfc')?.value).toBe('AALM87326');
    expect(component.solicitudForm.get('denominacion')?.value).toBe('SVHGSA ASCV 332');
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe('SIMa gsys');
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe('SV US');
    expect(component.solicitudForm.get('pais')?.value).toBe('ESTADOS UNIDOS MEXICANOS');
  });

  it('debería llamar a establecerValoresDeFormulario en la inicialización', () => {
    const spy = jest.spyOn(component, 'establecerValoresDeFormulario').mockImplementation();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería inicializar solicitudForm con los controles correctos y en estado deshabilitado (llamada explícita)', () => {
    component.establecerSolicitudForm(); // Asegura que el formulario esté inicializado
    const form = component.solicitudForm;

    expect(form.get('rfc')).toBeTruthy();
    expect(form.get('denominacion')).toBeTruthy();
    expect(form.get('actividadEconomica')).toBeTruthy();
    expect(form.get('correoElectronico')).toBeTruthy();

    expect(form.get('rfc')?.disabled).toBe(true);
    expect(form.get('denominacion')?.disabled).toBe(true);
    expect(form.get('actividadEconomica')?.disabled).toBe(true);
    expect(form.get('correoElectronico')?.disabled).toBe(true);
  });
});
