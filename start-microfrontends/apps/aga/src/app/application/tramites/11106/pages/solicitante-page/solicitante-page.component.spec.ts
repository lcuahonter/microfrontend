import { TestBed } from '@angular/core/testing';
import { SolicitantePageComponent } from './solicitante-page.component';
import { WizardComponent } from '@ng-mf/data-access-user';
import { PASOS } from '@libs/shared/data-access-user/src/tramites/constantes/11106/pasos.enum';

describe('SolicitantePageComponent', () => {
  let component: SolicitantePageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SolicitantePageComponent],
      declarations: [],
      providers: [],
    }).compileComponents();

    const fixture = TestBed.createComponent(SolicitantePageComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializarse con los valores predeterminados', () => {
    expect(component.indice).toBe(1);
    expect(component.pasos).toBe(PASOS);
    expect(component.datosPasos.nroPasos).toBe(PASOS.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debería actualizar el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('debe actualizar el índice y llamar a WizardComponent.siguiente cuando se llama a getValorIndice con "cont"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const wizardSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    component.getValorIndice({ accion: 'cont', valor: 2 });

    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('debería actualizar el índice y llamar a WizardComponent.atras cuando se llame a getValorIndice con "ant"', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const wizardSpy = jest.spyOn(component.wizardComponent, 'atras');
    component.getValorIndice({ accion: 'ant', valor: 2 });

    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
    expect(wizardSpy).toHaveBeenCalled();
  });

  it('no debe actualizar el índice ni llamar a los métodos WizardComponent si el valor está fuera de rango', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;

    const siguienteSpy = jest.spyOn(component.wizardComponent, 'siguiente');
    const atrasSpy = jest.spyOn(component.wizardComponent, 'atras');

    component.getValorIndice({ accion: 'cont', valor: 0 });
    expect(component.indice).toBe(1);
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();

    component.getValorIndice({ accion: 'ant', valor: 6 });
    expect(component.indice).toBe(1);
    expect(siguienteSpy).not.toHaveBeenCalled();
    expect(atrasSpy).not.toHaveBeenCalled();
  });

  it('debería llamar a getValorIndice con los parámetros correctos cuando se llama a continuar', () => {
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as unknown as WizardComponent;
    
    const getValorIndiceSpy = jest.spyOn(component, 'getValorIndice');
    component.indice = 2;

    component.continuar();

    expect(getValorIndiceSpy).toHaveBeenCalledWith({
      accion: 'cont',
      valor: 3,
    });
  });
});
