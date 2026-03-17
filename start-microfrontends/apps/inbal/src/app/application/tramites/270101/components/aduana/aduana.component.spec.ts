import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AduanaComponent } from './aduana.component';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
import { Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
import * as bootstrap from 'bootstrap';

jest.mock('bootstrap', () => {
  return {
    Modal: jest.fn().mockImplementation(() => ({
      show: jest.fn(),
      hide: jest.fn(),
    })),
  };
});

describe('AduanaComponent', () => {
  let component: AduanaComponent;
  let fixture: ComponentFixture<AduanaComponent>;

  const mockTramite270101Query = {
    selectExportarIlustraciones$: of({
      aduana: '123',
      configuracionTablaDatos: [
        {
          ciudad: 'CDMX',
          tipo: '',
          sede: '',
          tipoDeTraslado: '',
          fechaExhibicion: '',
          observaciones: '',
          fechoInicio: '',
          fechaFin: '',
        },
        { ciudad: 'Guadalajara' },
      ],
    }),
  };

  const mockTramite270101Store = {
    setDynamicFieldValue: jest.fn(),
  };

  const mockExportarIlustracionesService = {
    getAduanaDeSalidaData: jest.fn().mockReturnValue(of([])),
    getTransporteData: jest.fn().mockReturnValue(of([])),
    setAduanaArray: jest.fn(),
    setForm: jest.fn(),
  };

  let exportarIlustracionesService: typeof mockExportarIlustracionesService;
  const mockModalRef = {
    nativeElement: document.createElement('div'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AduanaComponent, ReactiveFormsModule],
      providers: [
        { provide: Tramite270101Query, useValue: mockTramite270101Query },
        { provide: Tramite270101Store, useValue: mockTramite270101Store },
        {
          provide: ExportarIlustracionesService,
          useValue: mockExportarIlustracionesService,
        },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AduanaComponent);
    component = fixture.componentInstance;

    component.forma = new FormGroup({
      aduana: new FormControl(null),
      extentoPago: new FormControl(false),
      itinerarioFormGroup: new FormControl({
        tipoItinerario: '',
        ciudad: '',
        tipoDeTraslado: '',
        observaciones: '',
        fechaInicio: '',
        fechaFin: '',
      }),
      itinerarioMaximoFormGroup: new FormGroup({}),
    });

    component.modal = mockModalRef;
    component.configuracionTablaDatos = [];
    component.itinerarioFormData = [];
    component.datosSeleccionados = [];
    exportarIlustracionesService = TestBed.inject(
      ExportarIlustracionesService
    ) as any;
    component.consultaState = {
          readonly: false,
        } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call obtenerAduanaDeSalida and obtrenerTipoDeTraslado', () => {
    const obtenerAduanaSpy = jest.spyOn(component, 'obtenerAduanaDeSalida');
    const obtenerTrasladoSpy = jest.spyOn(component, 'obtrenerTipoDeTraslado');
    component.ngOnInit();
    expect(obtenerAduanaSpy).toHaveBeenCalled();
    expect(obtenerTrasladoSpy).toHaveBeenCalled();
  });

  it('should fetch and store aduana data', () => {
    const mockData = [{ id: 1, descripcion: 'Test' }];
    jest
      .spyOn(exportarIlustracionesService, 'getAduanaDeSalidaData')
      .mockReturnValue(of(mockData));
    component.obtenerAduanaDeSalida(() => {}); // Pass a dummy callback
    expect(component.aduanaData).toEqual(mockData);
  });

  it('should open modal if modal ref exists', () => {
    const mockElement = document.createElement('div');
    component.modal = {
      nativeElement: mockElement,
    } as ElementRef;

    const showSpy = jest.fn();
    (bootstrap.Modal as unknown as jest.Mock).mockImplementation(() => ({
      show: showSpy,
    }));

    component.abrirDialogo();

    expect(showSpy).toHaveBeenCalled();
  });

  it('should add itinerary if form is valid and config is empty', () => {
    component.configuracionTablaDatos = [];
    component.forma.get('itinerarioFormGroup')!.setValue({
      tipoItinerario: 'A',
      ciudad: 'CDMX',
      tipoDeTraslado: 'Bus',
      observaciones: '',
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-10',
    });
    const setSpy = jest.spyOn(exportarIlustracionesService, 'setAduanaArray');
    const cambioSpy = jest.spyOn(component, 'cambioEnValoresStore');
    const cerrarSpy = jest.spyOn(component, 'cerrarModal');
    component.agregarConfirmarModal();
    expect(component.configuracionTablaDatos.length).toBe(1);
    expect(setSpy).toHaveBeenCalled();
    expect(cambioSpy).toHaveBeenCalled();
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('should format date to en-GB', () => {
    const result = AduanaComponent.formatoFecha(new Date('2024-04-20'));
    expect(result).toBe('20/04/2024');
  });

  it('should return empty string for invalid date', () => {
    expect(AduanaComponent.formatoFecha(null as any)).toBe('');
  });

  it('should click closeModal element', () => {
    const clickSpy = jest.fn();
    component.closeModal = { nativeElement: { click: clickSpy } } as any;
    component.cerrarModal();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should add selected items to datosSeleccionados', () => {
    const mockItems = [
      {
        ciudad: 'CDMX',
        tipo: 'someTipo',
        sede: 'someSede',
        tipoDeTraslado: 'someTipoDeTraslado',
        fechaExhibicion: 'someFechaExhibicion',
        observaciones: '',
        fechoInicio: '',
        fechaFin: '',
      },
    ];

    component.listaDeFilaSeleccionada(mockItems);
    expect(component.datosSeleccionados).toContainEqual({
      ciudad: 'CDMX',
      tipo: 'someTipo',
      sede: 'someSede',
      tipoDeTraslado: 'someTipoDeTraslado',
      fechaExhibicion: 'someFechaExhibicion',
      observaciones: '',
      fechoInicio: '',
      fechaFin: '',
    });
  });

  it('should remove selected items from configuracionTablaDatos', () => {
    component.configuracionTablaDatos = [
      {
        ciudad: 'CDMX',
        tipo: '',
        sede: '',
        tipoDeTraslado: '',
        fechaExhibicion: '',
        observaciones: '',
        fechoInicio: '',
        fechaFin: '',
      },
    ];
    component.datosSeleccionados = [
      {
        ciudad: 'CDMX',
        tipo: '',
        sede: '',
        tipoDeTraslado: '',
        fechaExhibicion: '',
        observaciones: '',
        fechoInicio: '',
        fechaFin: '',
      },
    ];

    const cambioSpy = jest.spyOn(component, 'cambioEnValoresStore');
    component.eliminar();

    expect(component.configuracionTablaDatos.length).toBe(0);
    expect(cambioSpy).toHaveBeenCalledWith('configuracionTablaDatos', []);
  });

  it('should call setDynamicFieldValue', () => {
    const setSpy = jest.spyOn(mockTramite270101Store, 'setDynamicFieldValue');
    component.cambioEnValoresStore('key', 'value');
    expect(setSpy).toHaveBeenCalledWith('key', 'value');
  });

  it('should update field value and emit form event', () => {
    const emitSpy = jest.spyOn(component.formularioEventoEmitir, 'emit');
    const setSpy = jest.spyOn(exportarIlustracionesService, 'setForm');
    const event = { target: { value: 'test value' } } as unknown as Event;
    component.eventoDeCambioDeValor(event, 'campo');
    expect(setSpy).toHaveBeenCalledWith('aduana', component.forma);
    expect(emitSpy).toHaveBeenCalledWith(component.forma);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
