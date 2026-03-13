import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { permisoComponent } from './permiso-expedido.component';
import { Tramite30401Store } from '../../estados/tramites30401.store';

describe('permisoComponent', () => {
  let component: permisoComponent;
  let mockTramite30401Store: jest.Mocked<Tramite30401Store>;
  let mockFormGroupDirective: FormGroupDirective;

  beforeEach(() => {
    mockTramite30401Store = {
      establecerDatos: jest.fn(),
    } as unknown as jest.Mocked<Tramite30401Store>;
    mockFormGroupDirective = {
      control: new FormGroup({
        testGroup: new FormGroup({
          testField: new FormControl(''),
        }),
      }),
    } as FormGroupDirective;

    component = new permisoComponent(mockFormGroupDirective, mockTramite30401Store);
    component.grupoDeFormulario = 'testGroup';
  });

  it('debe inicializar el grupo de formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.inicializarFormulario).toBe(mockFormGroupDirective.control.get('testGroup'));
  });

  it('Debería llamar a establecerDatos en setValoresStore con datos correctos', () => {
    const testForm = new FormGroup({
      testField: new FormControl('testValue'),
    });

    component.setValoresStore(testForm, 'testField');
    expect(mockTramite30401Store.establecerDatos).toHaveBeenCalledWith({ testField: 'testValue' });
  });

  it('Debe devolver verdadero si el control no es válido y está tocado o sucio en esInvalido', () => {
    const testControl = new FormControl('', { validators: () => ({ required: true }) });
    testControl.markAsTouched();
    component.inicializarFormulario = new FormGroup({
      testField: testControl,
    });

    expect(component.esInvalido('testField')).toBe(true);
  });

  it('debe devolver falso si el control es válido en esInvalido', () => {
    const testControl = new FormControl('validValue');
    component.inicializarFormulario = new FormGroup({
      testField: testControl,
    });

    expect(component.esInvalido('testField')).toBe(false);
  });

  it('Debe devolver falso si el control no existe en esInvalido', () => {
    component.inicializarFormulario = new FormGroup({});
    expect(component.esInvalido('nonExistentField')).toBe(false);
  });
});