import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite5601Store } from '../../estados/stores/tramite5601.store';
import { Tramite5601Query } from '../../estados/queries/tramite5601.query';
import { of } from 'rxjs';
import { Tramite5601State } from '../../estados/stores/tramite5601.store';
import { FORMULARIO_DETALLES } from '../../constantes/tramite5601.enum';
import seleccionarOpciones from '@libs/shared/theme/assets/json/5601/selector-5601.json';

jest.mock('@libs/shared/theme/assets/json/5601/selector-5601.json', () => ({
  __esModule: true,
  default: {
    aduanas: [{ id: '1', descripcion: 'Aduana 1' }],
    seccionAduanera: [{ id: '1', descripcion: 'Sección 1' }],
    tipoOperacion: [{ id: '1', descripcion: 'Importación' }],
    tipoMoneda: [{ id: '1', descripcion: 'MXN' }],
  },
}));


describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;

  let mockStore: jest.Mocked<Tramite5601Store>;
  let mockQuery: jest.Mocked<Tramite5601Query>;

  const ESTADO_INICIAL: Tramite5601State = {
    tieneCertificacion: false,
    certificacionEmpresa: '',
    otraCertificacion: '',
    aduana: '',
    seccionAduanera: '',
    tipoOperacion: '',
    fechaOperacion: '',
    motivoDespachoDomicilio: '',
    observaciones: '',
    especificacionesMercancia: '',
    descripcionMercancia: '',
    tipoMoneda: '',
    valorMercancia: '',
    esquemasControlSeguridad: '',
    distanciaRutaTiempos: '',
    direccion: '',
    telefono: '',
    distanciaAduana: '',
    referencias: '',
  };

  beforeEach(async () => {
    mockStore = {
      setDynamicFieldValue: jest.fn(),
    } as unknown as jest.Mocked<Tramite5601Store>;

    mockQuery = {
      selectCertificacion$: of(ESTADO_INICIAL),
    } as unknown as jest.Mocked<Tramite5601Query>;

    await TestBed.configureTestingModule({
      imports: [DatosSolicitudComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite5601Store, useValue: mockStore },
        { provide: Tramite5601Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar los catálogos correctamente en ngOnInit', () => {
    expect(component.aduanas).toEqual(seleccionarOpciones.aduanas);
    expect(component.seccionAduanera).toEqual(seleccionarOpciones.seccionAduanera);
    expect(component.tipoOperacion).toEqual(seleccionarOpciones.tipoOperacion);
    expect(component.tipoMoneda).toEqual(seleccionarOpciones.tipoMoneda);
  });

  it('debe actualizar el store al llamar establecerCambioDeValor', () => {
    const CAMBIO = { campo: 'aduana', valor: '123' };
    component.establecerCambioDeValor(CAMBIO);

    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith('aduana', '123');
  });

  it('debe llamar alCambiarTipoOperacion cuando el campo es tipoOperacion', () => {
    const CAMBIO = { campo: 'tipoOperacion', valor: 'importación' };
    const SPY_CAMBIO = jest.spyOn(component, 'alCambiarTipoOperacion');

    component.establecerCambioDeValor(CAMBIO);

    expect(SPY_CAMBIO).toHaveBeenCalled();
    expect(mockStore.setDynamicFieldValue).toHaveBeenCalledWith('tipoOperacion', 'importación');
  });

  it('debe mostrar el campo fechaOperacion cuando se llama alCambiarTipoOperacion', () => {
    const CAMPO = FORMULARIO_DETALLES.find(c => c.campo === 'fechaOperacion');
    if (CAMPO) {
      CAMPO.mostrar = false;
      component.formularioDatosSolicitud = FORMULARIO_DETALLES;

      component.alCambiarTipoOperacion();

      expect(CAMPO.mostrar).toBe(true);
    }
  });

  it('debe completar destroyed$ en ngOnDestroy', () => {
    const SPY = jest.spyOn((component as any).destroyed$, 'complete');

    component.ngOnDestroy();

    expect(SPY).toHaveBeenCalled();
  });
});
