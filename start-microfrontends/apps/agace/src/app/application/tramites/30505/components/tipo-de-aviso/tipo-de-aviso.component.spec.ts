import { TipoDeAvisoComponent } from './tipo-de-aviso.component';
import { FormBuilder } from '@angular/forms';
import { Subject, of } from 'rxjs';

describe('TipoDeAvisoComponent', () => {
  let component: TipoDeAvisoComponent;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setAviso: jest.fn(),
      setCheckboxDatos: jest.fn()
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        numeroDeOficio: '123',
        fechaFinVigencia: '2024-01-01',
        avisoDeMod: true,
        avisoDeFusion: false,
        avisoDeCal: false,
        avisoDenom: false,
        selectedCheckbox: ['avisoDeMod']
      })
    };
    component = new TipoDeAvisoComponent(new FormBuilder(), tramiteStoreMock, tramiteQueryMock);
    component.selectedCheckboxes = ['avisoDeMod'];
  });

  it('should initialize form and selectedCheckboxes on inicializarFormulario', () => {
    component.inicializarFormulario();
    expect(component.avisoForm).toBeDefined();
    expect(component.selectedCheckboxes).toEqual(['avisoDeMod']);
  });

  it('should set indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should add and remove checkboxes on onCambiarAviso', () => {
    const emitSpy = jest.spyOn(component.checkboxChange, 'emit');
    // Simulate checking a new checkbox
    const eventCheck = { target: { checked: true } } as any;
    component.selectedCheckboxes = [];
    component.onCambiarAviso('avisoDeFusion', eventCheck);
    expect(component.selectedCheckboxes).toContain('avisoDeFusion');
    expect(tramiteStoreMock.setAviso).toHaveBeenCalledWith('avisoDeFusion', true);
    expect(emitSpy).toHaveBeenCalledWith(['avisoDeFusion']);
    expect(tramiteStoreMock.setCheckboxDatos).toHaveBeenCalledWith(['avisoDeFusion']);

    // Simulate unchecking a checkbox
    const eventUncheck = { target: { checked: false } } as any;
    component.selectedCheckboxes = ['avisoDeFusion'];
    component.onCambiarAviso('avisoDeFusion', eventUncheck);
    expect(component.selectedCheckboxes).not.toContain('avisoDeFusion');
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(completeSpy).toHaveBeenCalled();
  });
});
