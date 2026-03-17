import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloraFaunaComponent } from './flora-fauna.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { Datos250101Component } from '../datos-250101/datos-250101.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { SolicitanteComponent,AlertComponent } from '@libs/shared/data-access-user/src';
import {
  WizardComponent,
  BtnContinuarComponent,
} from '@libs/shared/data-access-user/src';

const mockWizardComponent = {
  siguiente: jest.fn(),
  atras: jest.fn(),
};

const mockSolicitanteService = {
  validateTab: jest
    .fn()
    .mockImplementation((tabIndex: number) => tabIndex > 0 && tabIndex <= 5),
};

describe('FloraFaunaComponent', () => {
  let component: FloraFaunaComponent;
  let fixture: ComponentFixture<FloraFaunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloraFaunaComponent, Datos250101Component,PasoDosComponent, PasoTresComponent],
      imports: [
        CommonModule,
        AlertComponent,
        WizardComponent,
        SolicitanteComponent,
        BtnContinuarComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: 'SolicitanteService', useValue: mockSolicitanteService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloraFaunaComponent);
    component = fixture.componentInstance;
    component.wizardComponent = mockWizardComponent as any;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar TEXTO_FLORA_FAUNA_ALERT con el valor correcto', () => {
    expect(component.TEXTO_FLORA_FAUNA_ALERT).toBe(
      'La solicitud ha quedado registrada con el número temporal 202768122. Éste no tiene validez legal y sirve solamente para efectos de identificar tu solicitud. Un folio oficial le será asignado a la solicitud al momento en que ésta sea firmada'
    );
  });

  it('debería inicializar datosPasos con los valores correctos', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pantallasPasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debería actualizar indice y llamar a wizardComponent.siguiente cuando getValorIndice es llamado con accion "cont" y valor en rango', () => {
    component.indice = 1;
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const accionBoton = { accion: 'cont', valor: 2 };
    component.getValorIndice(accionBoton);
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

it('debería actualizar indice y llamar a wizardComponent.atras cuando getValorIndice es llamado con accion "atras" y valor en rango', () => {
  component.indice = 3;
  component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
  const accionBoton = { accion: 'atras', valor: 2 };
  component.getValorIndice(accionBoton);
  expect(component.indice).toBe(2);
  expect(component.wizardComponent.atras).toHaveBeenCalled();
});

it('no debería actualizar indice ni llamar métodos de wizardComponent cuando getValorIndice es llamado con valor fuera de rango', () => {
  component.indice = 1;
  component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
  const accionBoton = { accion: 'cont', valor: 5 };
  component.getValorIndice(accionBoton);
  expect(component.indice).toBe(1);
  expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  expect(component.wizardComponent.atras).not.toHaveBeenCalled();
});
});
