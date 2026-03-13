import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from './representante-legal.component';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';
import { of } from 'rxjs';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let fixture: ComponentFixture<RepresentanteLegalComponent>;
  let tramite260701StoreMock: Partial<Tramite260701Store>;
  let tramite260701QueryMock: Partial<Tramite260701Query>;

  beforeEach(async () => {
    tramite260701StoreMock = {
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    };

    tramite260701QueryMock = {
      selectSolicitud$: of({
        rfc: 'RFC123456',
        nombre: 'John',
        apellidoPaterno: 'Doe',
        apellidoMaterno: 'Smith',
      } as Solicitud260701State),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RepresentanteLegalComponent],
      providers: [
        { provide: Tramite260701Store, useValue: tramite260701StoreMock },
        { provide: Tramite260701Query, useValue: tramite260701QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores de la consulta', () => {
    expect(component.representante.value).toEqual({
      rfc: 'RFC123456',
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
    });
  });

  it('debería llamar setValoresStore cuando se invoca obtenerValor', () => {
    jest.spyOn(component, 'setValoresStore');
    component.representante.get('rfc')?.setValue('RFC123456');
    component.obtenerValor();

    expect(component.setValoresStore).toHaveBeenCalledWith(
      component.representante,
      'nombre',
      'setNombre'
    );
    expect(component.setValoresStore).toHaveBeenCalledWith(
      component.representante,
      'apellidoPaterno',
      'setApellidoPaterno'
    );
    expect(component.setValoresStore).toHaveBeenCalledWith(
      component.representante,
      'apellidoMaterno',
      'setApellidoMaterno'
    );
  });

  it('debería deshabilitar los campos del formulario después de llamar obtenerValor', () => {
    component.representante.get('rfc')?.setValue('RFC123456');
    component.obtenerValor();

    expect(component.representante.get('nombre')?.disabled).toBe(true);
    expect(component.representante.get('apellidoPaterno')?.disabled).toBe(true);
    expect(component.representante.get('apellidoMaterno')?.disabled).toBe(true);
  });

  it('debería llamar métodos del store con valores correctos en setValoresStore', () => {
    const form = component.representante;
    form.get('nombre')?.setValue('John');
    component.setValoresStore(form, 'nombre', 'setNombre');

    expect(tramite260701StoreMock.setNombre).toHaveBeenCalledWith('John');
  });

  it('debería completar destroyNotifier$ al destruir el componente', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
