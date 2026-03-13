import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { AsociadosComponent } from './asociados.component';
import { SanitarioService } from '../../services/sanitario.service';
import { Sanitario260906Store } from '../../../../estados/tramites/sanitario260906.store';
import { Permiso260906Query } from '../../../../estados/queries/permiso260906.query';

describe('AsociadosComponent', () => {
  let component: AsociadosComponent;
  let fixture: ComponentFixture<AsociadosComponent>;
  let sanitarioServiceMock: any;
  let sanitarioStoreMock: any;
  let permisoQueryMock: any;

  beforeEach(async () => {
    sanitarioServiceMock = {
      getDatos: jest.fn().mockReturnValue(of([{ id: 1, name: 'Banco 1' }])),
      obtenerDatosDeSolicitud: jest.fn().mockReturnValue(of({ tablaFilaDatos: [] })),
    };

    sanitarioStoreMock = {
      setreferencia: jest.fn(),
      setcadenaDependencia: jest.fn(),
      setbanco: jest.fn(),
      setLlave: jest.fn(),
      settipoFetch: jest.fn(),
      setimporte: jest.fn(),
    };

    permisoQueryMock = {
      selectSolicitud$: of({
        referencia: '12345',
        cadenaDependencia: 'Dependencia 1',
        llave: 'Llave 1',
        banco: 'Banco 1',
        tipoFetch: '2023-01-01',
        importe: '1000',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AsociadosComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SanitarioService, useValue: sanitarioServiceMock },
        { provide: Sanitario260906Store, useValue: sanitarioStoreMock },
        { provide: Permiso260906Query, useValue: permisoQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.derechosForm.value).toEqual({
      referencia: '12345',
      cadenaDependencia: 'Dependencia 1',
      llave: 'Llave 1',
      banco: 'Banco 1',
      tipoFetch: '2023-01-01',
      importe: '1000',
    });
  });

  it('should call loadComboUnidadMedida and populate derechosList', () => {
    component.loadComboUnidadMedida();
    expect(sanitarioServiceMock.getDatos).toHaveBeenCalled();
    expect(component.derechosList).toEqual([{ id: 1, name: 'Banco 1' }]);
  });

  it('should call obtenerDatosDeAplicacion and populate solicitudDatos', () => {
    component.obtenerDatosDeAplicacion();
    expect(sanitarioServiceMock.obtenerDatosDeSolicitud).toHaveBeenCalled();
    expect(component.solicitudDatos).toEqual([]);
  });

  it('should call setValoresStore and update the store', () => {
    const form = component.derechosForm;
    form.get('referencia')?.setValue('New Reference');
    component.setValoresStore(form, 'referencia', 'setreferencia');
    expect(sanitarioStoreMock.setreferencia).toHaveBeenCalledWith('New Reference');
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});