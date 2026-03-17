import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { RepresentanteLegalComponent } from './representanteLegal.component';
import { Tramite260906Store } from '../../../../estados/tramites/tramite260906.store';
import { Tramite260906Query } from '../../../../estados/queries/tramite260906.query';
import { provideHttpClient } from '@angular/common/http';

describe('RepresentanteLegalComponent', () => {
  let component: RepresentanteLegalComponent;
  let tramite260906StoreMock: Partial<Tramite260906Store>;
  let tramite260906QueryMock: Partial<Tramite260906Query>;

  beforeEach(() => {
    tramite260906StoreMock = {
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    };

    tramite260906QueryMock = {
      selectSolicitud$: new Subject(),
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RepresentanteLegalComponent],
      declarations: [],
      providers: [ provideHttpClient(),
        FormBuilder,
        { provide: Tramite260906Store, useValue: tramite260906StoreMock },
        { provide: Tramite260906Query, useValue: tramite260906QueryMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RepresentanteLegalComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.solicitudState = {
      rfc: 'ABC123456789',
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
    } as any;

    component.ngOnInit();

    expect(component.representante.value).toEqual({
      rfc: 'ABC123456789',
      nombre: 'John',
      apellidoPaterno: 'Doe',
      apellidoMaterno: 'Smith',
    });
  });

  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.ngOnInit();

    expect(component.representante.disabled).toBe(true);
  });

  it('should enable the form when soloLectura is false', () => {
    component.soloLectura = false;
    component.ngOnInit();

    expect(component.representante.enabled).toBe(true);
  });

  it('should patch values to the form when obtenerValor is called', () => {
    component.ngOnInit();
    component.obtenerValor();

    expect(component.representante.value).toEqual({
      rfc: null,
      nombre: 47875, // As per the current implementation
      apellidoPaterno: 'Paterno',
      apellidoMaterno: 'Materno',
    });
  });

  it('should call setValoresStore and update the store', () => {
    const form = component.fb.group({
      rfc: ['ABC123456789'],
    });

    component.setValoresStore(form, 'rfc', 'setRfc');

    expect(tramite260906StoreMock.setRfc).toHaveBeenCalledWith('ABC123456789');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});