import { TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BtnContinuarComponent } from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../../../11105/pages/paso-uno/paso-uno.component';
import { PasoTresComponent } from '../../../11105/pages/paso-tres/paso-tres.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        WizardComponent,
        BtnContinuarComponent,
        PasoUnoComponent,
        PasoTresComponent,
        SolicitantePageComponent,
        HttpClientTestingModule
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;

    // Mock the wizardComponent methods
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.indice).toBe(1);
    expect(component.pasos.length).toBeGreaterThan(0);
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update the selected tab index when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should update the wizard index and call siguiente when getValorIndice is called with "cont"', () => {
    const wizardSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('should update the wizard index and call atras when getValorIndice is called with "ant"', () => {
    const wizardSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'ant', valor: 1 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('should not update the wizard index if the value is out of bounds in getValorIndice', () => {
    const wizardSpyNext = jest.spyOn(component.wizardComponent, 'siguiente');
    const wizardSpyBack = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'cont', valor: 6 });
    expect(component.indice).toBe(1); // Index should remain unchanged
    expect(wizardSpyNext).not.toHaveBeenCalled();
    expect(wizardSpyBack).not.toHaveBeenCalled();
  });

  it('should call getValorIndice with the correct parameters when continuar is called', () => {
    const spy = jest.spyOn(component, 'getValorIndice');
    const prevIndice = component.indice;
    component.continuar();
    expect(spy).toHaveBeenCalledWith({ accion: 'cont', valor: prevIndice + 1 });
  });
});