import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { ExportacionMineralesDeHierroService } from '../../services/exportacion-minerales-de-hierro.service';
import { Tramite130108Store } from '../../estados/tramites/tramites130108.store';
import { Tramite130108Query } from '../../estados/queries/tramite130108.query';
import { PaisDeOrigenComponent } from '../../../../shared/components/pais-de-origen/pais-de-origen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let exportacionServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    exportacionServiceMock = {
      getSolicitudeOptions: jest.fn().mockReturnValue(of({ options: [] })),
      getProductoOptions: jest.fn().mockReturnValue(of({ options: [] })),
      getTablaDatos: jest.fn().mockReturnValue(of([{ cantidad: 10, totalUSD: 100 }])),
      getEstado: jest.fn().mockReturnValue(of([])),
      getRepresentacionFederal: jest.fn().mockReturnValue(of([])),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of([])),
      obtenerListaDeCiudades: jest.fn().mockReturnValue(of([])),
      getPaisesPorBloque: jest.fn().mockReturnValue(of([])),
    };

    tramiteStoreMock = {
      establecerDatos: jest.fn(),
      storeTableValues: jest.fn(),
      setMostrarTabla: jest.fn(),
      setTablaDatos: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        tablaDatos: [{ cantidad: '10', totalUSD: '100' }],
        rangoDias: [],
        seleccionada: []
      }),
      mostrarTabla$: of(false),
      selectConsultaioState$: of({ readonly: false })
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      imports: [ReactiveFormsModule,
         PaisDeOrigenComponent,
         HttpClientTestingModule,
         DatosDelTramiteComponent],
      providers: [
        FormBuilder,
        { provide: ExportacionMineralesDeHierroService, useValue: exportacionServiceMock },
        { provide: Tramite130108Store, useValue: tramiteStoreMock },
        { provide: Tramite130108Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    const spyInitForms = jest.spyOn(component, 'inicializarFormularios');
    component.ngOnInit();
    expect(spyInitForms).toHaveBeenCalled();
  });

  it('should call opcionesDeBusqueda on ngOnInit', () => {
    const spyOpcionesDeBusqueda = jest.spyOn(component, 'opcionesDeBusqueda');
    component.ngOnInit();
    expect(spyOpcionesDeBusqueda).toHaveBeenCalled();
  });

  it('should fetch table data and update formForTotalCount', () => {
    const mockTableData = [{ cantidad: '10', totalUSD: '100' }];
    exportacionServiceMock.getTablaDatos.mockReturnValue(of(mockTableData));
    
    component.obtenerTablaDatos();
    
    expect(exportacionServiceMock.getTablaDatos).toHaveBeenCalled();
    expect(tramiteStoreMock.setTablaDatos).toHaveBeenCalledWith(mockTableData);
  });

  it('should handle store updates for setFraccion', () => {
    const form = new FormBuilder().group({ fraccion: [1], umt: [''] });
    component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Sample Description', relacionadaUmtId: 2 }]];
    const spySetValoresStore = jest.spyOn(component, 'setValoresStore');

    component.handleStoreUpdate({ form, campo: 'fraccion', metodoNombre: 'setFraccion' });

    expect(spySetValoresStore).toHaveBeenCalledWith(form, 'fraccion');
    expect(form.value.umt).toBe(2);
  });

  it('should handle store updates for setNico', () => {
    const form = new FormBuilder().group({ fraccion: [1], descripcionNico: [''] });
    component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Test Descripción' }]];
    const spySetValoresStore = jest.spyOn(component, 'setValoresStore');

    component.handleStoreUpdate({ form, campo: 'nico', metodoNombre: 'setNico' });

    expect(spySetValoresStore).toHaveBeenCalledWith(form, 'nico');
    expect(form.value.descripcionNico).toBe('Test Descripción');
  });

  it('should validate and show/hide table based on form validity', () => {
    component['fb'] = new FormBuilder();
    component.partidasDelaMercanciaForm = component['fb'].group({
      cantidadModificar: ['', Validators.required],
    });

    component.validarYEnviarFormulario();
    expect(component.mostrarTabla).toBe(false);

    component.partidasDelaMercanciaForm.patchValue({ cantidadModificar: '10' });
    component.validarYEnviarFormulario();
    expect(component.mostrarTabla).toBe(true);
  });

  it('should fetch countries by block and update selectRangoDias', () => {
    const mockData = [{ descripcion: 'Country 1' }, { descripcion: 'Country 2' }];
    exportacionServiceMock.getPaisesPorBloque.mockReturnValue(of(mockData));

    component.fetchPaisesPorBloque(1);
    expect(exportacionServiceMock.getPaisesPorBloque).toHaveBeenCalledWith(1);
    expect(component.paisesPorBloque).toEqual(mockData);
    expect(component.selectRangoDias).toEqual(['Country 1', 'Country 2']);
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ 
      rangoDias: ['Country 1', 'Country 2'], 
      seleccionada: [] 
    });
  });

  it('should set values in the store', () => {
    const form = new FormBuilder().group({ campo: ['value'] });
    component.setValoresStore(form, 'campo');
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ campo: 'value' });
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should handle crosslist fechas seleccionadas change', () => {
    const fechasSeleccionadas = ['Country 1', 'Country 2'];
    
    component.onFechasSeleccionadasChange(fechasSeleccionadas);
    
    expect(component.fechaSeleccionada).toEqual(fechasSeleccionadas);
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ seleccionada: fechasSeleccionadas });
  });
  
});