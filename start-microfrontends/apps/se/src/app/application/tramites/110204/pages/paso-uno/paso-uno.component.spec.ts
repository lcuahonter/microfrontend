import { PasoUnoComponent } from './paso-uno.component';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';


const mockChangeDetectorRef = {
  detectChanges: jest.fn()
};

const mockCertificadosOrigenGridService = {
  getAcuiculturaData: jest.fn().mockReturnValue(of(null)),
  actualizarEstadoFormulario: jest.fn()
};

const mockConsultaioQuery = {
  selectConsultaioState$: of({ update: false, readonly: false })
};

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;

  beforeEach(() => {
    component = new PasoUnoComponent(
      mockChangeDetectorRef as any,
      mockCertificadosOrigenGridService as any,
      mockConsultaioQuery as any
    );
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.formularioDeshabilitado).toBe(false);
    expect(component.persona).toEqual([]);
    expect(component.domicilioFiscal).toEqual([]);
  });

  it('should change tab index', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should return false when validating forms without child components', () => {
    const result = component.validarFormularios();
    expect(result).toBe(false);
  });
});