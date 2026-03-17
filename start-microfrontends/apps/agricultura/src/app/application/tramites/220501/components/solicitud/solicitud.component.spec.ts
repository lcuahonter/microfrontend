import { TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder } from '@angular/forms';
import { SolicitudPantallasService } from '../../../220502/services/solicitud-pantallas.service';
import { of } from 'rxjs';
import { CargarDatosIniciales } from '../../../220502/models/solicitud-pantallas.model';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Solicitud220501Store } from '../../estados/tramites220501.store';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let solicitudService: jest.Mocked<SolicitudPantallasService>;
  let consultaioQuery: jest.Mocked<ConsultaioQuery>;
  let solicitud220501Store: jest.Mocked<Solicitud220501Store>;

  beforeEach(() => {
    solicitudService = {
      getData: jest.fn().mockReturnValue(of({
        hHistorialinspeccion: [],
        dHistorialInspecciones: [],
        dCarrosDeFerrocarril: [],
        hCarroFerrocarril: [],
        hSolicitud: [],
        dSolicitud: [],
        hMerchandise: [],
        dMercancia: []
      }))
    } as unknown as jest.Mocked<SolicitudPantallasService>;

    consultaioQuery = {
      getConsultaio: jest.fn().mockReturnValue(of({})),
      selectConsultaioState$: of({ readonly: false }),
    } as unknown as jest.Mocked<ConsultaioQuery>;

    solicitud220501Store = {
      medioDeTransporte: -1,
      identificacionTransporte: '',
      esSolicitudFerros: '',
      totalGuias: '',
      foliodel: '',
      aduanaIngreso: -1,
      setMostrarSeccion: jest.fn(),
    } as unknown as jest.Mocked<Solicitud220501Store>;

    TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: SolicitudPantallasService, useValue: solicitudService },
        { provide: ConsultaioQuery, useValue: consultaioQuery },
        { provide: Solicitud220501Store, useValue: solicitud220501Store }
      ]
    });

    component = new SolicitudComponent(TestBed.inject(FormBuilder), solicitudService, consultaioQuery, solicitud220501Store);
  });

  test('should create component', () => {
    expect(component).toBeDefined();
  });

  test('should initialize the form correctly', () => {
    component.crearFormulario();
    expect(component.form).toBeDefined();
  });

  test('should call cargarDatosIniciales on ngOnInit', () => {
    const mockData: CargarDatosIniciales = {
      hHistorialinspeccion: [
        'Número parcialidad/remesa',
        'Fracción arancelaria',
        'Nico',
        'Cantidad total en UMT',
        'Cantidad parcial en UTM',
        'Saldo pendiente',
        'Fecha de ingreso',
      ],
      dHistorialInspecciones: [
        {
          numeroPartidaMercancia: '12345',
          fraccionArancelaria: '0101.21.00',
          nico: 'Si',
          cantidadUmt: '1000',
          cantidadInspeccion: '500',
          saldoPendiente: '500',
          fechaInspeccionString: '2023-10-01',
        },
      ],
      dCarrosDeFerrocarril: [
        {
          idInspeccionFisica: 1,
          numeroAutorizacion: '12345',
          numeroPartidaMercancia: 'P001',
          numeroTotalCarros: 10,
        },
      ],
      hCarroFerrocarril: [
        'Número de parcialidad/remesa',
        'Cantidad de carros de ferrocarril',
      ],
      hSolicitud: ['Fecha Creación', 'Mercancía', 'Cantidad', 'Proovedor'],
      dSolicitud: [
        {
          fechaCreacion: '2025-02-02 19:50:08:0',
          mercancia: 'descripcion',
          cantidad: '1000000',
          proovedor: 'erick',
        },
      ],
      hMerchandise: ['Description', 'Quantity', 'Value'],
      dMercancia: [
        {
          fraccionArancelaria: '1001.10.10',
          descripcionFraccion: 'Trigo duro',
          nico: 'Sí',
          nicoDescripcion: 'Trigo para molienda',
          cantidadSolicitadaUMT: 50,
          unidadMedidaUMT: 'kg',
          cantidadTotalUMT: 500,
          saldoPendiente: 100,
        },
      ],
      medioDeTransporte:
        {
          labelNombre: 'Medio de transporte',
          required: true,
          primerOpcion: 'Selecciona un valor',
          catalogos: [
            { id: 1, descripcion: 'transporte 1' },
            { id: 2, descripcion: 'transporte 2' },
            { id: 3, descripcion: 'transporte 3' }
          ]
        } as CatalogosSelect
    };

    jest.spyOn(component, 'cargarDatosIniciales');
    solicitudService.getData.mockReturnValue(of(mockData));
    component.cargarDatosIniciales();
    expect(component.cargarDatosIniciales).toHaveBeenCalled();
  });

  test('should toggle mostrarSeccion correctly', () => {
    component.onTransporteSeleccionado(false);
    expect(component.mostrarSeccion).toBe(false);
    expect(solicitud220501Store.setMostrarSeccion).toHaveBeenCalledWith(false);

    component.onTransporteSeleccionado(true);
    expect(component.mostrarSeccion).toBe(true);
    expect(solicitud220501Store.setMostrarSeccion).toHaveBeenCalledWith(true);
  });

  test('should populate data correctly when cargarDatosIniciales is called', () => {
    const mockData: CargarDatosIniciales = {
      hHistorialinspeccion: [
        'Número parcialidad/remesa',
        'Fracción arancelaria',
        'Nico',
        'Cantidad total en UMT',
        'Cantidad parcial en UTM',
        'Saldo pendiente',
        'Fecha de ingreso',
      ],
      dHistorialInspecciones: [
        {
          numeroPartidaMercancia: '12345',
          fraccionArancelaria: '0101.21.00',
          nico: 'Si',
          cantidadUmt: '1000',
          cantidadInspeccion: '500',
          saldoPendiente: '500',
          fechaInspeccionString: '2023-10-01',
        },
      ],
      dCarrosDeFerrocarril: [
        {
          idInspeccionFisica: 1,
          numeroAutorizacion: '12345',
          numeroPartidaMercancia: 'P001',
          numeroTotalCarros: 10,
        },
      ],
      hCarroFerrocarril: [
        'Número de parcialidad/remesa',
        'Cantidad de carros de ferrocarril',
      ],
      hSolicitud: ['Fecha Creación', 'Mercancía', 'Cantidad', 'Proovedor'],
      dSolicitud: [
        {
          fechaCreacion: '2025-02-02 19:50:08:0',
          mercancia: 'descripcion',
          cantidad: '1000000',
          proovedor: 'erick',
        },
      ],
      hMerchandise: ['Description', 'Quantity', 'Value'],
      dMercancia: [
        {
          fraccionArancelaria: '1001.10.10',
          descripcionFraccion: 'Trigo duro',
          nico: 'Sí',
          nicoDescripcion: 'Trigo para molienda',
          cantidadSolicitadaUMT: 50,
          unidadMedidaUMT: 'kg',
          cantidadTotalUMT: 500,
          saldoPendiente: 100,
        },
      ],
      medioDeTransporte:
        {
          labelNombre: 'Medio de transporte',
          required: true,
          primerOpcion: 'Selecciona un valor',
          catalogos: [
            { id: 1, descripcion: 'transporte 1' },
            { id: 2, descripcion: 'transporte 2' },
            { id: 3, descripcion: 'transporte 3' }
          ]
        } as CatalogosSelect
    };

    solicitudService.getData.mockReturnValue(of(mockData));
    component.cargarDatosIniciales();

    expect(component.hHistorialinspeccion).toEqual(mockData.hHistorialinspeccion);
    expect(component.hCarroFerrocarril).toEqual(mockData.hCarroFerrocarril);
    expect(component.hSolicitud).toEqual(mockData.hSolicitud);
  });

  test('should clean up subscriptions on ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});