import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoModifyIvaEIepsComponent } from './aviso-modify-iva-eieps.component';
import { BtnContinuarComponent, WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from "../../constantes/importador-exportador.enum";
import { AccionBoton } from '@ng-mf/data-access-user';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AvisoModifyIvaEIepsComponent', () => {
  let component: AvisoModifyIvaEIepsComponent;
  let fixture: ComponentFixture<AvisoModifyIvaEIepsComponent>;
  let wizardComponentMock: jest.Mocked<WizardComponent>;

  beforeEach(async () => {
    wizardComponentMock = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [AvisoModifyIvaEIepsComponent,CommonModule, WizardComponent, PasoUnoComponent, PasoDosComponent, PasoTresComponent, BtnContinuarComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoModifyIvaEIepsComponent);
    component = fixture.componentInstance;
    component.wizardComponent = wizardComponentMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pasos from PASOS', () => {
    expect(component.pasos).toBe(PASOS);
  });

  it('should initialize indice as 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice and call siguiente on getValorIndice with accion "cont"', () => {
    const accion: AccionBoton = { valor: 2, accion: 'cont' };
    component.getValorIndice(accion);
  });

  it('should update indice and call atras on getValorIndice with accion not "cont"', () => {
    const accion: AccionBoton = { valor: 3, accion: 'ant' };
    component.getValorIndice(accion);
  });

  it('should not update indice or call wizard methods if valor is out of range', () => {
    const accion: AccionBoton = { valor: 0, accion: 'cont' };
    component.getValorIndice(accion);
    expect(component.indice).toBe(1);
    expect(wizardComponentMock.siguiente).not.toHaveBeenCalled();
    expect(wizardComponentMock.atras).not.toHaveBeenCalled();

    const accion2: AccionBoton = { valor: 5, accion: 'ant' };
    component.getValorIndice(accion2);
  });

  it('should handle multiple valid step changes', () => {
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    component.getValorIndice({ valor: 3, accion: 'cont' });
    expect(component.indice).toBe(3);
    component.getValorIndice({ valor: 2, accion: 'ant' });
    expect(component.indice).toBe(2);
  });
});