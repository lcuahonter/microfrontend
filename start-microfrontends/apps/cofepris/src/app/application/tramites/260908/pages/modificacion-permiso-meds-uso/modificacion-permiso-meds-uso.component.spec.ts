import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModificacionPermisoMedsUsoComponent } from './modificacion-permiso-meds-uso.component';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('ModificacionPermisoMedsUsoComponent', () => {
  let componente: ModificacionPermisoMedsUsoComponent;
  let fixture: ComponentFixture<ModificacionPermisoMedsUsoComponent>;

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
      declarations: [ModificacionPermisoMedsUsoComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificacionPermisoMedsUsoComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    // Mock de wizardComponent
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
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

});
