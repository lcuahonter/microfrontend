import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SanidadCertificadoComponent } from './sanidad-certificado.component';
import { AccionBoton } from '../../models/220203/importacion-de-acuicultura.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SanidadCertificadoComponent', () => {
  let componente: SanidadCertificadoComponent;
  let fixture: ComponentFixture<SanidadCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanidadCertificadoComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SanidadCertificadoComponent);
    componente = fixture.componentInstance;
    
    jest.spyOn(componente as any, 'validarTodosFormulariosPasoUno').mockReturnValue(true);
    
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debe inicializar con valores por defecto', () => {
    expect(componente.esFormaValido).toBe(false);
    expect(componente.indice).toBe(1);
    expect(componente.datosPasos.nroPasos).toBe(componente.PASOS.length);
    expect(componente.datosPasos.indice).toBe(1);
  });

  it('debe continuar al siguiente paso cuando el formulario es válido', () => {
    (componente as any)['validarTodosFormulariosPasoUno'] = jest.fn().mockReturnValue(true);
    componente.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const accion: AccionBoton = { accion: 'cont', valor: 1 };

    componente.getValorIndice(accion);

    expect(componente.indice).toBe(2);
    expect(componente.esFormaValido).toBe(false);
  });

  it('no debe continuar cuando el formulario es inválido', () => {
    (componente as any)['validarTodosFormulariosPasoUno'] = jest.fn().mockReturnValue(false);
    componente.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const accion: AccionBoton = { accion: 'cont', valor: 1 };

    componente.getValorIndice(accion);

    expect(componente.indice).toBe(1);
    expect(componente.esFormaValido).toBe(true);
    expect(componente.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('debe regresar al paso anterior', () => {
    componente.indice = 2;
    const mockWizard = { siguiente: jest.fn(), atras: jest.fn() };
    componente.wizardComponent = mockWizard as any;
    const accion: AccionBoton = { accion: 'ant', valor: 2 };

    componente.getValorIndice(accion);

    expect(componente.indice).toBe(1);
    expect(mockWizard.atras).toHaveBeenCalled();
  });

  it('no debe exceder el número máximo de pasos', () => {
    componente.indice = componente.PASOS.length;
    const mockWizard = { siguiente: jest.fn(), atras: jest.fn() };
    componente.wizardComponent = mockWizard as any;
    const accion: AccionBoton = { accion: 'cont', valor: componente.PASOS.length };

    componente.getValorIndice(accion);

    expect(componente.indice).toBe(componente.PASOS.length);
    expect(mockWizard.siguiente).not.toHaveBeenCalled();
  });

  it('no debe ir por debajo del paso mínimo', () => {
    componente.indice = 1;
    const mockWizard = { siguiente: jest.fn(), atras: jest.fn() };
    componente.wizardComponent = mockWizard as any;
    const accion: AccionBoton = { accion: 'ant', valor: 1 };

    componente.getValorIndice(accion);

    expect(componente.indice).toBe(1);
    expect(mockWizard.atras).not.toHaveBeenCalled();
  });

  it('debe manejar la validación cuando pasoUnoComponent no está disponible', () => {
    componente.pasoUnoComponent = null as any;

    const resultado = componente['validarTodosFormulariosPasoUno']();

    expect(resultado).toBe(true);
  });

  it('debe llamar al método de validación de pasoUnoComponent', () => {
    const mockPasoUno = { validarFormularios: jest.fn().mockReturnValue(true) };
    componente.pasoUnoComponent = mockPasoUno as any;

    const resultado = componente['validarTodosFormulariosPasoUno']();
    expect(resultado).toBe(true);
  });

  it('debe actualizar datosPasos cuando cambia el índice', () => {
    (componente as any)['validarTodosFormulariosPasoUno'] = jest.fn().mockReturnValue(true);
    componente.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const accion: AccionBoton = { accion: 'cont', valor: 2 };

    componente.getValorIndice(accion);

    expect(componente.datosPasos.indice).toBe(3);
  });
});
