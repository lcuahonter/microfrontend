import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { Tramite30401Query } from '../../estados/tramites30401.query';
import { createInitialState, Tramite30401Store } from '../../estados/tramites30401.store';
import { ConsolidacionDeCargasComponent } from './consolidacion-de-cargas.component';

describe('ConsolidacionDeCargasComponent', () => {
  let component: ConsolidacionDeCargasComponent;
  let tramite30401QueryMock: Partial<Tramite30401Query>;
  let tramite30401StoreMock: Partial<Tramite30401Store>;

  beforeEach(() => {
    tramite30401QueryMock = {
      selectTramite30401$: of({
        ...createInitialState(),
      }),
    };

    tramite30401StoreMock = {
      establecerDatos: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ConsolidacionDeCargasComponent],
      providers: [
        FormBuilder,
        { provide: Tramite30401Query, useValue: tramite30401QueryMock },
        { provide: Tramite30401Store, useValue: tramite30401StoreMock },
      ],
    });

    const fixture = TestBed.createComponent(ConsolidacionDeCargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores predeterminados de la tienda', () => {
    expect(component.forma.value).toEqual({
      consolidacionCargas: '',
      noConsolidadoET: '',
    });
  });

  it('debe llamar a enPatchStoredFormData y suscribirse para almacenar datos', () => {
    const spy = jest.spyOn(tramite30401QueryMock.selectTramite30401$ as any, 'subscribe');
    component.enPatchStoredFormData();
    expect(spy).toHaveBeenCalled();
    expect(component.seccionState).toEqual({
      ...createInitialState(),
    });
  });

  it('Debería llamar a setValoresStore y actualizar la tienda con los valores del formulario', () => {
    const form = component.forma;
    form.get('consolidacionCargas')?.setValue('');
    component.setValoresStore(form, 'consolidacionCargas');
    expect(tramite30401StoreMock.establecerDatos).toHaveBeenCalledWith({
      consolidacionCargas: '',
    });
  });

  it('No se debe llamar a setValoresStore si el formulario es nulo', () => {
    component.setValoresStore(null, 'consolidacionCargas');
    expect(tramite30401StoreMock.establecerDatos).not.toHaveBeenCalled();
  });

  it('Debería actualizar esConsolidatedET a verdadero cuando el valor sea "1"', () => {
    component.enCambioDeValor('1');
    expect(component.esConsolidatedET).toBe(true);
  });

  it('Debería actualizar esConsolidatedET a falso cuando el valor no sea "1"', () => {
    component.enCambioDeValor('0');
    expect(component.esConsolidatedET).toBe(false);
  });

  it('Debería completar la destrucción en ngOnDestroy', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    const completeSpy = jest.spyOn(component.destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('Debe crear el formulario con los validadores requeridos', () => {
    const form = component.forma;
    expect(form.get('consolidacionCargas')?.valid).toBe(false);
    expect(form.get('noConsolidadoET')?.valid).toBe(false);
  });
});