import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudDespachoExportacionComponent } from './solicitud-despacho-exportacion.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@libs/shared/data-access-user/src';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-wizard',
  template: ''
})
class MockWizardComponent {
  siguiente = jest.fn();
  atras = jest.fn();
}

describe('SolicitudDespachoExportacionComponent', () => {
  let componente: SolicitudDespachoExportacionComponent;
  let fixture: ComponentFixture<SolicitudDespachoExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudDespachoExportacionComponent, MockWizardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudDespachoExportacionComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as any;

  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería llamar wizardComponent.siguiente si acción es "cont" y valor válido', () => {
    const EVENTO: AccionBoton = { valor: 2, accion: 'cont' };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(2);
    expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debería llamar wizardComponent.atras si acción no es "cont" y valor válido', () => {
    const EVENTO: AccionBoton = { valor: 3, accion: 'back' };
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(3);
    expect(componente.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debería cambiar el índice ni llamar métodos si valor es inválido', () => {
    const EVENTO: AccionBoton = { valor: 0, accion: 'cont' };
    const INDICE_INICIAL = componente.indice;
    componente.getValorIndice(EVENTO);
    expect(componente.indice).toBe(INDICE_INICIAL);
    expect(componente.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(componente.wizardComponent.atras).not.toHaveBeenCalled();
  });
});
