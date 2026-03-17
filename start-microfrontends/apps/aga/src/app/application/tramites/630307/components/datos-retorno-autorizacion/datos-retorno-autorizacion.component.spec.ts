import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { DatosRetornoAutorizacionComponent } from './datos-retorno-autorizacion.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';
import { Tramite630307Store } from '../../estados/tramite630307.store';
import { Tramite630307Query } from '../../estados/tramite630307.query';
import { of } from 'rxjs';

describe('DatosRetornoAutorizacionComponent', () => {
  let componente: DatosRetornoAutorizacionComponent;
  let fixture: ComponentFixture<DatosRetornoAutorizacionComponent>;
  let servicioMock: jest.Mocked<RetornoImportacionTemporalService>;
  let storeMock: jest.Mocked<Tramite630307Store>;
  let queryMock: jest.Mocked<Tramite630307Query>;

  beforeEach(async () => {
    servicioMock = {
      getAduanaDeIngreso: jest.fn(),
      getSeccionAduanera: jest.fn(),
    } as unknown as jest.Mocked<RetornoImportacionTemporalService>;

    storeMock = {
      setTramite630307State: jest.fn(),
    } as unknown as jest.Mocked<Tramite630307Store>;

    queryMock = {
      selectTramite630307State$: of({
        campo: 'valor',
      }),
    } as unknown as jest.Mocked<Tramite630307Query>;

    await TestBed.configureTestingModule({
      imports: [DatosRetornoAutorizacionComponent],
      providers: [
        FormBuilder,
        { provide: RetornoImportacionTemporalService, useValue: servicioMock },
        { provide: Tramite630307Store, useValue: storeMock },
        { provide: Tramite630307Query, useValue: queryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosRetornoAutorizacionComponent);
    componente = fixture.componentInstance;

    servicioMock.getAduanaDeIngreso.mockReturnValue(of([]));
    servicioMock.getSeccionAduanera.mockReturnValue(of([]));

    componente.formularioDatosAutorizacion = [
      {
        id: 'aduanaDeIngreso', campo: 'aduanaDeIngreso', opciones: [],
        labelNombre: '',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
      {
        id: 'seccionAduanera', campo: 'seccionAduanera', opciones: [],
        labelNombre: '',
        clase: '',
        tipoInput: '',
        desactivado: false
      },
    ];

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario y obtener valores en ngOnInit', () => {
    const inicializarFormularioSpy = jest.spyOn(componente, 'inicializarFormulario');
    const obtenerValorStoreSpy = jest.spyOn(componente, 'getValorStore');
    const obtenerAduanaDeIngresoSpy = jest.spyOn(componente, 'getAduanaDeIngreso');
    const obtenerSeccionAduaneraSpy = jest.spyOn(componente, 'getSeccionAduanera');

    componente.ngOnInit();

    expect(inicializarFormularioSpy).toHaveBeenCalled();
    expect(obtenerValorStoreSpy).toHaveBeenCalled();
    expect(obtenerAduanaDeIngresoSpy).toHaveBeenCalled();
    expect(obtenerSeccionAduaneraSpy).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con valores predeterminados', () => {
    componente.inicializarFormulario();
    expect(componente.datosImportacionRetornoAutorizacionGeneralFormulario).toBeTruthy();
  });

  it('debería obtener las opciones de aduana de ingreso', () => {
    const datosMock = [{ id: 1, descripcion: 'Aduana 1' }];
    servicioMock.getAduanaDeIngreso.mockReturnValue(of(datosMock));

    componente.getAduanaDeIngreso();

    expect(servicioMock.getAduanaDeIngreso).toHaveBeenCalled();
    const aduanaIngreso = componente.formularioDatosAutorizacion.find((item) => item.id === 'aduanaDeIngreso');
    expect(aduanaIngreso?.opciones).toEqual(datosMock);
  });

  it('debería obtener las opciones de sección aduanera', () => {
    const datosMock = [{ id: 2, descripcion: 'Sección 1' }];
    servicioMock.getSeccionAduanera.mockReturnValue(of(datosMock));

    componente.getSeccionAduanera();

    expect(servicioMock.getSeccionAduanera).toHaveBeenCalled();
    const seccionAduanera = componente.formularioDatosAutorizacion.find((item) => item.id === 'seccionAduanera');
    expect(seccionAduanera?.opciones).toEqual(datosMock);
  });

  it('debería obtener el estado actual del store', () => {
    componente.getValorStore();
    expect(componente.estadoSeleccionado).toEqual({ campo: 'valor' });
  });

  it('debería actualizar el store cuando establecerCambioDeValor es llamado', () => {
    const eventoMock = { campo: 'campoTest', valor: 'valorTest' };

    componente.establecerCambioDeValor(eventoMock);

    expect(storeMock.setTramite630307State).toHaveBeenCalledWith('campoTest', 'valorTest');
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const destroyedSpy = jest.spyOn((componente as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((componente as any).destroyed$, 'complete');

    componente.ngOnDestroy();

    expect(destroyedSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});