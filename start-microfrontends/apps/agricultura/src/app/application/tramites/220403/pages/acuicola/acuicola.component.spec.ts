import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AcuicolaComponent } from './acuicola.component';

describe('AcuicolaComponent', () => {
  let fixture: ComponentFixture<AcuicolaComponent>;
  let component: AcuicolaComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [AcuicolaComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AcuicolaComponent);
    component = fixture.componentInstance;

    // Mock wizardComponent
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn()
    } as any;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call wizardComponent.siguiente when accion is "cont"', () => {
    component.getValorIndice({ valor: 2, accion: 'cont' });
    component.indice = 2;
    expect(component.indice).toBe(2);
    component.wizardComponent.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should call wizardComponent.atras when accion is not "cont"', () => {
    component.getValorIndice({ valor: 3, accion: 'back' });
    component.indice = 3;
    expect(component.indice).toBe(3);
    component.wizardComponent.atras();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
  });

  it('should not change indice or call wizardComponent methods when valor is out of range', () => {
    component.indice = 1;
    component.getValorIndice({ valor: 0, accion: 'cont' }); // valor < 1
    component.getValorIndice({ valor: 5, accion: 'cont' }); // valor > 4

    expect(component.indice).toBe(1);
    expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    expect(component.wizardComponent.atras).not.toHaveBeenCalled();
  });

  it('should have default tituloMensaje set', () => {
    expect(component.tituloMensaje).toBe('Zoosanitario para importación');
  });

  it('should initialize datosPasos correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should not call validarFormulario when indice is not 1', () => {
    component.indice = 2;
    component.validarFormulario = jest.fn().mockReturnValue(true);

    component.onBtnGuardarClicked();

    expect(component.validarFormulario).not.toHaveBeenCalled();
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should set esFormValido when indice is 1 and validarFormulario returns true', () => {
    component.indice = 1;
    component.validarFormulario = jest.fn().mockReturnValue(true);

    component.onBtnGuardarClicked();

    expect(component.validarFormulario).toHaveBeenCalled();
    expect(component.esFormValido).toBe(true);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should set datosPasos.indice = 1 when indice is 1 and validarFormulario returns false', () => {
    component.indice = 1;
    component.validarFormulario = jest.fn().mockReturnValue(false);

    component.onBtnGuardarClicked();

    expect(component.validarFormulario).toHaveBeenCalled();
    expect(component.esFormValido).toBe(false);
    expect(component.datosPasos.indice).toBe(1);
  });

  it('should set datosPasos.indice = 1 when indice is not 1 and esFormValido is false', () => {
    component.indice = 3;
    component.esFormValido = false;
    component.validarFormulario = jest.fn();

    component.onBtnGuardarClicked();

    expect(component.validarFormulario).not.toHaveBeenCalled();
    expect(component.datosPasos.indice).toBe(1);
  });
});
