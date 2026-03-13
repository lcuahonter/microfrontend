import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import {
  BtnContinuarComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoDosComponent } from '../paso-dos/paso-dos.component';
import { PasoTresComponent } from '../paso-tres/paso-tres.component';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;
  let wizardComponentSpy: jest.Mocked<WizardComponent>;

  beforeEach(async () => {
    wizardComponentSpy = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as unknown as jest.Mocked<WizardComponent>;

    await TestBed.configureTestingModule({
      imports: [
        SolicitudPageComponent,
        WizardComponent,
        CommonModule,
        BtnContinuarComponent,
        FormsModule,
        PasoDosComponent,
        PasoTresComponent,
        PasoUnoComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    component.wizardComponent = wizardComponentSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTO_DE_ALERTA set to TERCEROS_TEXTO_DE_ALERTA', () => {
    expect(component.TEXTO_DE_ALERTA).toContain(
      'La solicitud ha quedado registrada'
    );
  });

  it('should initialize indice to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should set indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should update indice and call siguiente on getValorIndice with accion "cont"', () => {
    wizardComponentSpy.siguiente = jest.fn();
    wizardComponentSpy.atras = jest.fn();
    component.wizardComponent = wizardComponentSpy;
    const event = { accion: 'cont', valor: 2 };
    component.getValorIndice(event);
    component.wizardComponent.siguiente();
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should update indice and call atras on getValorIndice with accion not "cont"', () => {
    wizardComponentSpy.siguiente = jest.fn();
    wizardComponentSpy.atras = jest.fn();
    component.wizardComponent = wizardComponentSpy;
    const event = { accion: 'back', valor: 3 };
    component.getValorIndice(event);
    component.wizardComponent.atras();
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not update indice or call wizard methods if valor is out of range', () => {
    wizardComponentSpy.siguiente = jest.fn();
    wizardComponentSpy.atras = jest.fn();
    component.wizardComponent = wizardComponentSpy;
    const event = { accion: 'cont', valor: 0 };
    component.indice = 1;
    component.getValorIndice(event);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();

    const event2 = { accion: 'cont', valor: 5 };
    component.getValorIndice(event2);
    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should have datosPasos initialized correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });
});
