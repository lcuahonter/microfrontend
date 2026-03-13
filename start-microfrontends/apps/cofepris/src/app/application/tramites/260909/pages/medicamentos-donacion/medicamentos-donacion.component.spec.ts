
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicamentosDonacionComponent } from './medicamentos-donacion.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('MedicamentosDonacionComponent', () => {
  let componente: MedicamentosDonacionComponent;
  let fixture: ComponentFixture<MedicamentosDonacionComponent>;

  // Mock para PasoUnoPagesComponent
  const mockPasoUnoComponent = {
    collectFormValues: jest.fn().mockReturnValue({
      solicitante: { nombre: 'Juan' },
      datosSolicitud: [{ campo: 'valor' }],
      tercerosRelacionados: [],
      pagoDeDerechos: [],
      tramitesAsociados: []
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicamentosDonacionComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentosDonacionComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    // Mock de wizardComponent
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;

    // Mock de pasoUnoComponent
    componente.pasoUnoComponent = mockPasoUnoComponent as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería llamar wizardComponent.siguiente y actualizar payload si acción es "cont" y valor válido', () => {
    const EVENTO = { valor: 2, accion: 'cont' };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(2);
    expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
    expect(componente.wizardComponent.atras).not.toHaveBeenCalled();
    expect(componente.payload.solicitante).toEqual({ nombre: 'Juan' });
  });

  it('debería llamar wizardComponent.atras si acción no es "cont" y valor válido', () => {
    const EVENTO = { valor: 3, accion: 'back' };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(3);
    expect(componente.wizardComponent.atras).toHaveBeenCalled();
    expect(componente.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('no debería cambiar el índice ni llamar métodos si valor es inválido', () => {
    const EVENTO = { valor: 0, accion: 'cont' };
    const INDICE_INICIAL = componente.indice;
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(INDICE_INICIAL);
    expect(componente.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(componente.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('debería recopilar los valores del paso uno en collectAllFormValues', () => {
    const resultado = componente.collectAllFormValues();
    expect(resultado.pasoUno).toEqual({
      solicitante: { nombre: 'Juan' },
      datosSolicitud: [{ campo: 'valor' }],
      tercerosRelacionados: [],
      pagoDeDerechos: [],
      tramitesAsociados: []
    });
    expect(mockPasoUnoComponent.collectFormValues).toHaveBeenCalled();
  });

  it('debería retornar objeto vacío en collectAllFormValues si pasoUnoComponent no existe', () => {
    componente.pasoUnoComponent = undefined as any;
    const resultado = componente.collectAllFormValues();
    expect(resultado).toEqual({});
  });
});