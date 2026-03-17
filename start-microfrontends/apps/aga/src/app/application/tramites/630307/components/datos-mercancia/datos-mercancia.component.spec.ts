import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import { Tramite630307Store } from '../../estados/tramite630307.store';
import { Tramite630307Query } from '../../estados/tramite630307.query';
import { of } from 'rxjs';

describe('DatosMercanciaComponent', () => {
  let componente: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let storeMock: jest.Mocked<Tramite630307Store>;
  let queryMock: jest.Mocked<Tramite630307Query>;

  beforeEach(async () => {
    storeMock = {
      setTramite630307State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630307Store>;

    queryMock = {
      selectTramite630307State$: of({
        campo: 'valorMercancia',
      }),
    } as unknown as jest.Mocked<Tramite630307Query>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosMercanciaComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Tramite630307Store, useValue: storeMock },
        { provide: Tramite630307Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario en ngOnInit', () => {
    const inicializarFormularioSpy = jest.spyOn(
      componente,
      'inicializarFormulario'
    );
    const obtenerValorStoreSpy = jest.spyOn(componente, 'getValorStore');

    componente.ngOnInit();

    expect(inicializarFormularioSpy).toHaveBeenCalled();
    expect(obtenerValorStoreSpy).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con valores predeterminados', () => {
    componente.inicializarFormulario();
    expect(componente.datosMercancia).toBeTruthy();
  });

  it('debería obtener el estado actual del store', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual({ campo: 'valorMercancia' });
  });

  it('debería actualizar el store cuando establecerCambioDeValor es llamado', () => {
    const eventoMock = { campo: 'campoMercancia', valor: 'valorMercancia' };

    componente.establecerCambioDeValor(eventoMock);

    expect(storeMock.setTramite630307State).toHaveBeenCalledWith(
      'campoMercancia',
      'valorMercancia'
    );
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn((componente as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((componente as any).destroyed$, 'complete');

    componente.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should initialize datosMercancia as a FormGroup', () => {
    componente.inicializarFormulario();
    expect(componente.datosMercancia).toBeDefined();
    expect(
      componente.datosMercancia instanceof FormGroup
    ).toBe(true);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true', () => {
    const guardarSpy = jest.spyOn(componente, 'guardarDatosFormulario');
    componente.esFormularioSoloLectura = true;
    componente.inicializarEstadoFormulario();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false', () => {
    const initSpy = jest.spyOn(componente, 'inicializarFormulario');
    componente.esFormularioSoloLectura = false;
    componente.inicializarEstadoFormulario();
    expect(initSpy).toHaveBeenCalled();
  });
});
