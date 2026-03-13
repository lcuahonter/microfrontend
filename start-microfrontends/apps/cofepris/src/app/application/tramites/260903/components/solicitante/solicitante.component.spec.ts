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

  

  it('debería establecer los valores por defecto correctamente en los controles del formulario', () => {
    component.establecerValoresDeFormulario();

    expect(component.solicitudForm.get('rfc')?.value).toBe('AALM87326');
    expect(component.solicitudForm.get('denominacion')?.value).toBe('SVHGSA ASCV 332');
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe('SIMa gsys');
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe('SV US');
    expect(component.solicitudForm.get('pais')?.value).toBe('ESTADOS UNIDOS MEXICANOS');
  });
});