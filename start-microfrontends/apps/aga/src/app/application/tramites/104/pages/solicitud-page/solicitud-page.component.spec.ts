import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { PASOS } from '@ng-mf/data-access-user';
import { DatosPasos, AccionBoton } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SolicitudPageComponent', () => {
  let componente: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitudPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', (): void => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar los pasos correctamente', (): void => {
    expect(componente.pasos).toEqual(PASOS);
  });

  it('debería inicializar datosPasos correctamente', (): void => {
    const datosEsperados: DatosPasos = {
      nroPasos: PASOS.length,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar',
    };
    expect(componente.datosPasos).toEqual(datosEsperados);
  });

  it('debería actualizar el índice y avanzar en el wizard', (): void => {
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;
    
    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    componente.getValorIndice(accion);

    expect(componente.indice).toBe(2);
    expect(componente.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('debería actualizar el índice y retroceder en el wizard', (): void => {
    componente.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as unknown as WizardComponent;
    
    const accion: AccionBoton = { valor: 1, accion: 'prev' };
    componente.getValorIndice(accion);

    expect(componente.indice).toBe(1);
    expect(componente.wizardComponent.atras).toHaveBeenCalled();
  });

  it('no debería actualizar el índice si el valor está fuera del rango permitido', (): void => {
    componente.indice = 2;
    
    const accion: AccionBoton = { valor: 5, accion: 'cont' };
    componente.getValorIndice(accion);

    expect(componente.indice).toBe(2); // No cambia
  });
});
