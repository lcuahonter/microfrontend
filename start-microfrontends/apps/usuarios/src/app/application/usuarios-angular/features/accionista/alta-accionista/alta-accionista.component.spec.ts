import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AltaAccionistaComponent } from './alta-accionista.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockApiService = {
  altaAccionista: jest.fn().mockReturnValue(of({})),
};

describe('AltaAccionistaComponent', () => {
  let component: AltaAccionistaComponent;
  let fixture: ComponentFixture<AltaAccionistaComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.altaAccionista.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AltaAccionistaComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AltaAccionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('tipoPersonaCtrl debe iniciar en "FISICA"', () => {
    expect(component.tipoPersonaCtrl.value).toBe('FISICA');
  });

  it('tipoNacionalidadCtrl debe iniciar en "MEXICANO"', () => {
    expect(component.tipoNacionalidadCtrl.value).toBe('MEXICANO');
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('formDatos debe tener el control rfc como requerido', () => {
    const control = component.formDatos.get('rfc');
    expect(control).toBeTruthy();
    control!.setValue('');
    control!.markAsTouched();
    expect(control!.hasError('required')).toBe(true);
  });

  it('formDatos debe tener el control nombre como requerido', () => {
    const control = component.formDatos.get('nombre');
    expect(control).toBeTruthy();
    control!.setValue('');
    control!.markAsTouched();
    expect(control!.hasError('required')).toBe(true);
  });

  it('formDatos debe tener el control porcentaje como requerido', () => {
    const control = component.formDatos.get('porcentaje');
    expect(control).toBeTruthy();
    control!.setValue('');
    control!.markAsTouched();
    expect(control!.hasError('required')).toBe(true);
  });

  it('formDatos es inválido sin rfc', () => {
    component.formDatos.patchValue({ rfc: '', nombre: 'NOMBRE', porcentaje: '50' });
    expect(component.formDatos.invalid).toBe(true);
  });

  it('formDatos es inválido sin nombre', () => {
    component.formDatos.patchValue({ rfc: 'GOMA800101AB1', nombre: '', porcentaje: '50' });
    expect(component.formDatos.invalid).toBe(true);
  });

  it('formDatos es inválido sin porcentaje', () => {
    component.formDatos.patchValue({ rfc: 'GOMA800101AB1', nombre: 'GOMEZ', porcentaje: '' });
    expect(component.formDatos.invalid).toBe(true);
  });

  it('formDatos es válido con todos los campos requeridos', () => {
    component.formDatos.patchValue({ rfc: 'GOMA800101AB1', nombre: 'GOMEZ', primerApellido: '', porcentaje: '50' });
    expect(component.formDatos.valid).toBe(true);
  });

  it('readonly pasos debe tener 4 elementos', () => {
    expect(component.pasos.length).toBe(4);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Empresa');
    expect(component.pasos[1].label).toBe('Tipo');
    expect(component.pasos[2].label).toBe('Datos');
    expect(component.pasos[3].label).toBe('e.firma');
  });

  it('onFirmado() debe asignar fielData con el valor recibido', () => {
    const mockFiel = { rfc: 'GOMA800101AB1', nombre: 'ARTURO GONZALEZ' };
    component.onFirmado(mockFiel);
    expect(component.fielData).toEqual(mockFiel);
  });

  it('guardar() debe llamar a api.altaAccionista y poner exito=true', () => {
    const empresaMock = { rfc: 'GOM800101AB1', nombre: 'EMPRESA TEST' } as any;
    component.empresa.set(empresaMock);
    component.formDatos.patchValue({ rfc: 'GOMA800101AB1', nombre: 'SOCIO', porcentaje: '50' });
    component.guardar();
    expect(mockApiService.altaAccionista).toHaveBeenCalledWith(
      'GOM800101AB1',
      expect.objectContaining({ rfc: 'GOMA800101AB1', porcentajeParticipacion: 50 })
    );
    expect(component.exito()).toBe(true);
    expect(component.cargando()).toBe(false);
  });
});
