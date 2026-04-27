import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AltaCapturistaComponent } from './alta-capturista.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

const mockApiService = {
  verificarCurp: jest.fn().mockReturnValue(of({ nombreCompleto: 'GOMEZ MARTINEZ' })),
  altaCapturista: jest.fn().mockReturnValue(of({})),
};

describe('AltaCapturistaComponent', () => {
  let component: AltaCapturistaComponent;
  let fixture: ComponentFixture<AltaCapturistaComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockApiService.verificarCurp.mockReturnValue(of({ nombreCompleto: 'GOMEZ MARTINEZ' }));
    mockApiService.altaCapturista.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AltaCapturistaComponent, ReactiveFormsModule],
      providers: [
        { provide: UsuariosApiService, useValue: mockApiService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AltaCapturistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('paso() debe iniciar en 0', () => {
    expect(component.paso()).toBe(0);
  });

  it('curpVerificado() debe iniciar en false', () => {
    expect(component.curpVerificado()).toBe(false);
  });

  it('nombreRenapo() debe iniciar vacío', () => {
    expect(component.nombreRenapo()).toBe('');
  });

  it('verificarCurp() debe llamar a api.verificarCurp() con el CURP del form', () => {
    component.form.patchValue({ curp: 'GOMA800101HDFMRN09' });

    component.verificarCurp();

    expect(mockApiService.verificarCurp).toHaveBeenCalledWith('GOMA800101HDFMRN09');
  });

  it('tras verificarCurp() exitoso, curpVerificado() debe ser true', () => {
    component.form.patchValue({ curp: 'GOMA800101HDFMRN09' });

    component.verificarCurp();

    expect(component.curpVerificado()).toBe(true);
  });

  it('tras verificarCurp() exitoso, nombreRenapo() debe tener el nombre', () => {
    component.form.patchValue({ curp: 'GOMA800101HDFMRN09' });

    component.verificarCurp();

    expect(component.nombreRenapo()).toBe('GOMEZ MARTINEZ');
  });

  it('verificarCurp() NO debe llamar al API si el CURP está vacío', () => {
    component.form.patchValue({ curp: '' });

    component.verificarCurp();

    expect(mockApiService.verificarCurp).not.toHaveBeenCalled();
  });

  it('verificarCurp() NO debe llamar al API si el CURP es null/undefined', () => {
    component.form.patchValue({ curp: null });

    component.verificarCurp();

    expect(mockApiService.verificarCurp).not.toHaveBeenCalled();
  });

  it('readonly pasos debe tener 3 elementos', () => {
    expect(component.pasos.length).toBe(3);
  });

  it('los pasos deben tener las etiquetas correctas', () => {
    expect(component.pasos[0].label).toBe('Usuario');
    expect(component.pasos[1].label).toBe('Capturista');
    expect(component.pasos[2].label).toBe('e.firma');
  });

  it('form debe ser inválido sin datos', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('form es inválido con correo en formato incorrecto', () => {
    component.form.setValue({ rfc: 'GOMA800101AB1', curp: 'GOMA800101HDFMRN09', correo: 'correo-invalido' });
    expect(component.form.get('correo')!.hasError('email')).toBe(true);
  });

  it('form es válido con todos los campos correctos', () => {
    component.form.setValue({ rfc: 'GOMA800101AB1', curp: 'GOMA800101HDFMRN09', correo: 'prueba@correo.com' });
    expect(component.form.valid).toBe(true);
  });
});
