import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DatosRetornoAutorizacionComponent } from './datos-retorno-autorizacion.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630303Store } from '../../estados/tramite630303.store';
import { Tramite630303Query } from '../../estados/tramite630303.query';
import { of } from 'rxjs';

describe('DatosRetornoAutorizacionComponent', () => {
  let COMPONENTE: DatosRetornoAutorizacionComponent;
  let FIXTURE: ComponentFixture<DatosRetornoAutorizacionComponent>;
  let MOCK_SERVICE: jest.Mocked<RetornoImportacionTemporalService>;
  let MOCK_STORE: jest.Mocked<Tramite630303Store>;
  let MOCK_QUERY: jest.Mocked<Tramite630303Query>;

  beforeEach(async () => {
    MOCK_SERVICE = {
      getAduanaDeIngreso: jest.fn(),
      getSeccionAduanera: jest.fn(),
    } as unknown as jest.Mocked<RetornoImportacionTemporalService>;

    MOCK_STORE = {
      setTramite630303State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630303Store>;

    MOCK_QUERY = {
      selectTramite630303State$: of({
        campo: 'valor',
      }),
    } as unknown as jest.Mocked<Tramite630303Query>;

    await TestBed.configureTestingModule({
      imports: [DatosRetornoAutorizacionComponent],
      providers: [
        FormBuilder,
        { provide: RetornoImportacionTemporalService, useValue: MOCK_SERVICE },
        { provide: Tramite630303Store, useValue: MOCK_STORE },
        { provide: Tramite630303Query, useValue: MOCK_QUERY },
      ],
    }).compileComponents();

    FIXTURE = TestBed.createComponent(DatosRetornoAutorizacionComponent);
    COMPONENTE = FIXTURE.componentInstance;

    MOCK_SERVICE.getAduanaDeIngreso.mockReturnValue(of([]));
    MOCK_SERVICE.getSeccionAduanera.mockReturnValue(of([]));

    COMPONENTE.formularioDatosAutorizacion = [
      {
        id: 'aduanaDeIngreso', opciones: [],
        labelNombre: '',
        campo: 'aduanaDeIngreso',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
      {
        id: 'seccionAduanera', opciones: [],
        labelNombre: '',
        campo: 'seccionAduanera',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
    ];

    FIXTURE.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(COMPONENTE).toBeTruthy();
  });

  it('debería inicializar el formulario y obtener valores en ngOnInit', () => {
    const GET_VALOR_STORE_SPY = jest.spyOn(COMPONENTE, 'getValorStore');
    const GET_ADUANA_DE_INGRESO_SPY = jest.spyOn(COMPONENTE, 'getAduanaDeIngreso');
    const GET_SECCION_ADUANERA_SPY = jest.spyOn(COMPONENTE, 'getSeccionAduanera');

    COMPONENTE.ngOnInit();

    expect(GET_VALOR_STORE_SPY).toHaveBeenCalled();
    expect(GET_ADUANA_DE_INGRESO_SPY).toHaveBeenCalled();
    expect(GET_SECCION_ADUANERA_SPY).toHaveBeenCalled();
  });

  it('debería obtener las opciones de aduana de ingreso', () => {
    const MOCK_DATA = [{ id: 1, descripcion: 'Aduana 1' }];
    MOCK_SERVICE.getAduanaDeIngreso.mockReturnValue(of(MOCK_DATA));

    COMPONENTE.getAduanaDeIngreso();

    expect(MOCK_SERVICE.getAduanaDeIngreso).toHaveBeenCalled();
    const ADUANA_INGRESO = COMPONENTE.formularioDatosAutorizacion.find((item) => item.id === 'aduanaDeIngreso');
    expect(ADUANA_INGRESO?.opciones).toEqual(MOCK_DATA);
  });

  it('debería obtener las opciones de sección aduanera', () => {
    const MOCK_DATA = [{ id: 2, descripcion: 'Sección 1' }];
    MOCK_SERVICE.getSeccionAduanera.mockReturnValue(of(MOCK_DATA));

    COMPONENTE.getSeccionAduanera();

    expect(MOCK_SERVICE.getSeccionAduanera).toHaveBeenCalled();
    const SECCION_ADUANERA = COMPONENTE.formularioDatosAutorizacion.find((item) => item.id === 'seccionAduanera');
    expect(SECCION_ADUANERA?.opciones).toEqual(MOCK_DATA);
  });

  it('debería obtener el estado actual del store', () => {
    COMPONENTE.getValorStore();
    expect(COMPONENTE.estadoSeleccionado).toEqual({ campo: 'valor' });
  });

  it('debería actualizar el store cuando se invoque establecerCambioDeValor', () => {
    const MOCK_EVENT = { campo: 'campoTest', valor: 'valorTest' };

    COMPONENTE.establecerCambioDeValor(MOCK_EVENT);

    expect(MOCK_STORE.setTramite630303State).toHaveBeenCalledWith('campoTest', 'valorTest');
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const DESTROYED_SPY = jest.spyOn((COMPONENTE as any).destroyed$, 'next');
    const COMPLETE_SPY = jest.spyOn((COMPONENTE as any).destroyed$, 'complete');

    COMPONENTE.ngOnDestroy();

    expect(DESTROYED_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});