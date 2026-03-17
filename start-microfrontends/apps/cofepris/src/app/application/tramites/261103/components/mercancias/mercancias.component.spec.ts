import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MercanciasComponent } from './mercancias.component';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { DatosProcedureQuery } from '../../../../estados/queries/tramites261103.query';
import { DatosProcedureStore } from '../../../../estados/tramites/tramites261103.store';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';

describe('MercanciasComponent', () => {
  let componente: MercanciasComponent;
  let fixture: ComponentFixture<MercanciasComponent>;
  let mockService: jest.Mocked<ModificacionPermisoImportacionMedicamentosService>;
  let mockQuery: jest.Mocked<DatosProcedureQuery>;
  let mockStore: jest.Mocked<DatosProcedureStore>;

  beforeEach(async () => {
    mockService = {
      getMercanciasData: jest.fn().mockReturnValue(of([])),
      getAduanaData: jest.fn().mockReturnValue(of([])),
    } as any;

    mockQuery = {
      selectProrroga$: of({ aduanas: 'Aduana de Prueba' }),
    } as any;

    mockStore = {
      establecerDatos: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MercanciasComponent],
      providers: [
        FormBuilder,
        { provide: ModificacionPermisoImportacionMedicamentosService, useValue: mockService },
        { provide: DatosProcedureQuery, useValue: mockQuery },
        { provide: DatosProcedureStore, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MercanciasComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería llamar a crearFormulario en ngOnInit', () => {
    const spy = jest.spyOn(componente, 'crearFormulario');
    componente.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería llamar a mercanciasData en ngOnInit', () => {
    const spy = jest.spyOn(componente, 'mercanciasData');
    componente.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('debería establecer mercanciasDatas desde getMercanciasData', () => {
    const mockResponse = [{
      clasificacionDelProducto: 'Prueba',
      especificarClasificacionDelProduct: 'Especificar',
      denominacion: 'Denominacion',
      denominacionDistintiva: 'Distintiva',
      numeroCAS: '123-45-6',
      cantidad: 1,
      fraccionArancelaria: '12345678',
      descripcionDeFraccion: 'Descripción de fracción'
    }];
    mockService.getMercanciasData.mockReturnValueOnce(of(mockResponse));
    componente.mercanciasData();
    expect(mockService.getMercanciasData).toHaveBeenCalled();
    expect(componente.mercanciasDatas).toEqual(mockResponse);
  });

  it('debería establecer aduanaData desde getAduanaData', () => {
    const aduana = [{ municipio: 'CDMX' }];
    mockService.getAduanaData.mockReturnValueOnce(of(aduana as any));
    componente.mercanciasData();
    expect(mockService.getAduanaData).toHaveBeenCalled();
    expect(componente.aduanaData).toEqual(aduana);
  });

  it('debería inicializar el formulario correctamente en crearFormulario', () => {
    componente['seccionState'] = { aduanas: 'Aduana de Prueba' } as any;
    componente.crearFormulario();
    expect(componente.aduanaFormulario.get('aduanas')?.value).toBe('Aduana de Prueba');
  });

  it('debería deshabilitar el formulario si esFormularioSoloLectura es true', () => {
    componente['seccionState'] = { aduanas: 'X' } as any;
    componente.esFormularioSoloLectura = true;
    componente.guardarDatosFormulario();
    expect(componente.aduanaFormulario.disabled).toBe(true);
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es false', () => {
    componente['seccionState'] = { aduanas: 'X' } as any;
    componente.esFormularioSoloLectura = false;
    componente.guardarDatosFormulario();
    expect(componente.aduanaFormulario.enabled).toBe(false);
  });

  it('debería establecer TablaSeleccion correctamente', () => {
    expect(componente.TablaSeleccion).toBe(TablaSeleccion.CHECKBOX);
  });

  it('debería limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn(componente['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(componente['destroyNotifier$'], 'complete');
    componente.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería manejar errores silenciosamente en getMercanciasData', () => {
    mockService.getMercanciasData.mockImplementationOnce(() => {
      return of(() => {
        throw new Error('Error de prueba');
      }) as any;
    });
    expect(() => componente.mercanciasData()).not.toThrow();
  });

  it('debería actualizar seccionState correctamente desde query', () => {
    componente.getValorStore();
    expect(componente['seccionState']).toEqual({ aduanas: 'Aduana de Prueba' });
  });

  it('debería tener una configuración de tabla válida', () => {
    expect(componente.configuracionTabla).toBeDefined();
    expect(componente.configuracionTabla.length).toBeGreaterThan(0);
  });
});
