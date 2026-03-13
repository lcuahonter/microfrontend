import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudExpedicionPageComponent } from './solicitud-expedicion-page.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { AccionBoton } from '@libs/shared/data-access-user/src/core/models/140103/cancelacion.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudExpedicionPageComponent', () => {
  let component: SolicitudExpedicionPageComponent;
  let fixture: ComponentFixture<SolicitudExpedicionPageComponent>;

  class MockWizardComponent {
    siguiente = jest.fn();
    atras = jest.fn();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudExpedicionPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudExpedicionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.wizardComponent = new MockWizardComponent() as any;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar pantallasPasos y datosPasos correctamente', () => {
    expect(Array.isArray(component.pantallasPasos)).toBe(true);
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debe actualizar el índice y llamar a wizardComponent.siguiente cuando getValorIndice es llamado con acción "cont"', () => {
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debe actualizar el índice y llamar a wizardComponent.atras cuando getValorIndice es llamado con acción "atras"', () => {
    component.getValorIndice({ valor: 3, accion: 'atras' });
    expect(component.indice).toBe(3);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar métodos de wizardComponent cuando getValorIndice es llamado con valor inválido', () => {
    const initialIndice = component.indice;

    component.getValorIndice({ valor: 0, accion: 'cont' });
    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    component.getValorIndice({ valor: 5, accion: 'atras' });
    expect(component.indice).toBe(initialIndice);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });
});