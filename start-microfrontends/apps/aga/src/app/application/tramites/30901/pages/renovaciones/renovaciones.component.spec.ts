import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RenovacionesComponent } from './renovaciones.component';
import {
  AlertComponent,
  BtnContinuarComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { RENOVACIONES_PASOS } from '../../enums/renovaciones-muestras-mercancias.enum';
import {
  ERROR_DE_CAMPO,
  ERROR_VERIFICAR,
  SIGUIENTES_ERRORES,
} from '../../constantes/constantes';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { CommonModule } from '@angular/common';

@Component({ selector: 'mock-wizard', template: '' })
class MockWizardComponent {
  siguiente = jest.fn(() => of());
  atras = jest.fn(() => of());
}

@Component({ selector: 'mock-paso-uno', template: '' })
class MockPasoUnoComponent {
  indice = 1;
  registroRenovacionesMuestrasMercanciasComponent: any = null;
  pagoLineaDeCapturaComponent: any = null;
}

describe('RenovacionesComponent', () => {
  let component: RenovacionesComponent;
  let fixture: ComponentFixture<RenovacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockWizardComponent, MockPasoUnoComponent],
      imports: [
        RenovacionesComponent,
        HttpClientTestingModule,
        WizardComponent,
        PasoUnoComponent,
        PasoDosComponent,
        PasoTresComponent,
        BtnContinuarComponent,
        AlertComponent,
        CommonModule,
      ],
      providers: [],
    }).compileComponents();
    fixture = TestBed.createComponent(RenovacionesComponent);
    component = fixture.componentInstance;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoUnoComponent = { indice: 0 } as any;
    component.wizardComponent = new MockWizardComponent() as any;
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call wizardComponent.siguiente() when accion is "cont" and esValido is true', () => {
    const evento = { accion: 'cont', valor: 2 };
    component.esValido = true;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(evento);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras() when accion is not "cont" and esValido is true', () => {
    const evento = { accion: 'back', valor: 2 };
    component.esValido = true;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(evento);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should validate registroRenovacionesMuestrasMercanciasComponent when indice is 1 and pasoUnoComponent.indice is 2', () => {
    component.indice = 1;
    component.pasoUnoComponent.indice = 2;
    component.pasoUnoComponent.registroRenovacionesMuestrasMercanciasComponent =
      {
        validarFormulario: () => false,
        formRegistroMuestras: null,
        TEXTOS: null,
        opcionDeImportador: null,
        fraccionArancelariaAga: null,
      } as any;
    const evento = { accion: 'cont', valor: 2 };
    component.getValorIndice(evento);
    expect(component.esValido).toBe(false);
    expect(component.mensajeError).toBe(ERROR_DE_CAMPO);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should validate pagoLineaDeCapturaComponent and set error messages when indice is 1 and pasoUnoComponent.indice is 4', fakeAsync(() => {
    component.indice = 1;
    component.pasoUnoComponent.indice = 4;
    component.pasoUnoComponent.pagoLineaDeCapturaComponent = {
      validarFormulario: () => false,
      formPagoLC: null,
      tableData: [],
      darseDeBaja: jest.fn(),
      destroyed$: {
        subscribe: jest.fn(() => of()),
        unsubscribe: jest.fn(() => of()),
      },
    } as any;
    const evento = { accion: 'cont', valor: 2 };
    component.getValorIndice(evento);
    expect(component.esValido).toBe(false);
    expect(component.mensajeError).toBe(SIGUIENTES_ERRORES);
    tick(1500);
    expect(component.mensajeError).toBe(ERROR_VERIFICAR);
    expect(component.datosPasos.indice).toBe(1);
  }));

  it('should not change indice if evento.valor is out of range', () => {
    const evento = { accion: 'cont', valor: 0 };
    component.indice = 1;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.getValorIndice(evento);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should not proceed if esValido is false after validation', () => {
    component.indice = 1;
    component.pasoUnoComponent.indice = 2;
    component.pasoUnoComponent.registroRenovacionesMuestrasMercanciasComponent =
      {
        validarFormulario: () => false,
        formRegistroMuestras: null,
        TEXTOS: null,
        opcionDeImportador: null,
        fraccionArancelariaAga: null,
      } as any;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    const evento = { accion: 'cont', valor: 2 };
    component.getValorIndice(evento);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should update datosPasos.indice to 1 if esValido is false', () => {
    component.esValido = false;
    const evento = { accion: 'cont', valor: 2 };
    component.getValorIndice(evento);
    expect(component.datosPasos.indice).toBe(1);
  });
});
