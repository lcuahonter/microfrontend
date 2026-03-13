import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioDelEstablecimientoComponent } from './domicilio-del-establecimiento.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosService } from '../../../shared/services/datos.service';
import { DomicilioStore } from '../../estados/stores/domicilio.store';
import { DomicilioQuery } from '../../../shared/estados/queries/domicilio.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';

describe('DomicilioDelEstablecimientoComponent', () => {
  let component: DomicilioDelEstablecimientoComponent;
  let fixture: ComponentFixture<DomicilioDelEstablecimientoComponent>;
  let datosServiceMock: any;
  let domicilioStoreMock: any;
  let domicilioQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    datosServiceMock = {
      obtenerEstadoData: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Estado' }])),
      obternerDatosData: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerDatosProducto: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerClaveScian: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerDescripcionScian: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerPreOperativo: jest.fn().mockReturnValue(of([{ id: 1 }])),
      obtenerClasificationProductos: jest.fn().mockReturnValue(of([{ id: 1 }])),
    };
    domicilioStoreMock = {
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMunicipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setScian: jest.fn(),
      setAviso: jest.fn(),
      setNoLicenciaSanitaria: jest.fn(),
      setRegimenDestinado: jest.fn(),
      setAduana: jest.fn(),
      setDatosProducto: jest.fn(),
      setAutorizacionIVAIEPS: jest.fn(),
      setClaveScian: jest.fn(),
      setDescripcionScian: jest.fn(),
      setClasificacionProducto: jest.fn(),
      setEspecificarClasificacion: jest.fn(),
      setMarcaComercial: jest.fn(),
      setDenominacionGenerica: jest.fn(),
      setTipoProducto: jest.fn(),
      setEstadoFisico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccionArancelaria: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUmc: jest.fn(),
      setPorcentajeConcentracion: jest.fn(),
      setValorComercial: jest.fn(),
      setFechaMovimiento: jest.fn(),
      setPresentacionFarmaceutica: jest.fn(),
      setPaisDestino: jest.fn(),
      setPaisProcedencia: jest.fn(),
    };
    domicilioQueryMock = {
      selectSolicitud$: of({
        codigoPostal: '12345',
        estado: 'Estado',
        municipio: 'Municipio',
        localidad: 'Localidad',
        colonia: 'Colonia',
        calle: 'Calle',
        lada: '01',
        telefono: '123456789',
        scian: 'SCIAN',
        aviso: 'Aviso',
        noLicenciaSanitaria: 'Licencia',
        regimenDestinado: 'Regimen',
        aduana: 'Aduana',
        datosProducto: [],
        autorizacionIVAIEPS: 'IVA',
        claveScian: 'Clave',
        descripcionScian: 'Descripcion',
        clasificacionProducto: 'Clasificacion',
        especificarClasificacion: 'Especificar',
        marcaComercial: 'Marca',
        denominacionGenerica: 'Denominacion',
        tipoProducto: 'Tipo',
        estadoFisico: 'Fisico',
        fraccionArancelaria: 'Fraccion',
        descripcionFraccionArancelaria: 'DescFraccion',
        cantidadUMC: 1,
        umc: 'UMC',
        porcentajeConcentracion: 10,
        valorComercial: 100,
        fechaMovimiento: new Date(),
        presentacionFarmaceutica: 'Presentacion',
        paisDestino: 'Destino',
        paisProcedencia: 'Procedencia',
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DomicilioDelEstablecimientoComponent
      ],
      providers: [
        FormBuilder,
        { provide: DatosService, useValue: datosServiceMock },
        { provide: DomicilioStore, useValue: domicilioStoreMock },
        { provide: DomicilioQuery, useValue: domicilioQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioDelEstablecimientoComponent);
    component = fixture.componentInstance;
    
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;
    component.crossList = { toArray: () => [
      { agregar: jest.fn(), quitar: jest.fn() }
    ] } as any;
    fixture.detectChanges();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debería inicializar y llamar a los métodos de datos', () => {
    const spy1 = jest.spyOn(component, 'cargarEstadoData');
    const spy2 = jest.spyOn(component, 'cargarDatosTabla');
    const spy3 = jest.spyOn(component, 'cargarDatosProductoTabla');
    const spy4 = jest.spyOn(component, 'obtenerDatosClave');
    const spy5 = jest.spyOn(component, 'obtenerDatosDescripcion');
    const spy6 = jest.spyOn(component, 'obtenerDatosPreOperativo');
    const spy7 = jest.spyOn(component, 'obtenerclassificacionProductos');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
    expect(spy7).toHaveBeenCalled();
  });

  it('inicializarEstadoFormulario debería llamar a guardarDatosFormulario o inicializarFormulario', () => {
    const spyGuardar = jest.spyOn(component, 'guardarDatosFormulario');
    const spyInit = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spyGuardar).toHaveBeenCalled();
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spyInit).toHaveBeenCalled();
  });

  it('guardarDatosFormulario deshabilita/habilita formularios según esFormularioSoloLectura', () => {
    component.inicializarFormulario();
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.domicilioForm.disabled).toBe(true);
    expect(component.claveScianForm.disabled).toBe(true);
    expect(component.DatosMercanciaForm.disabled).toBe(true);

    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.domicilioForm.enabled).toBe(true);
    expect(component.claveScianForm.enabled).toBe(true);
    expect(component.DatosMercanciaForm.enabled).toBe(true);
  });

  it('setValoresStore debería llamar al método correcto del store', () => {
    component.inicializarFormulario();
    component.setValoresStore(component.domicilioForm, 'codigoPostal', 'setCodigoPostal');
    expect(domicilioStoreMock.setCodigoPostal).toHaveBeenCalled();
  });

  it('mostrar_colapsable debería alternar colapsable', () => {
    const prev = component.colapsable;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(!prev);
  });

  it('toggleNoLicenciaSanitaria deshabilita/habilita el campo', () => {
    component.inicializarFormulario();
    const event = { target: { checked: true } } as any;
    component.toggleNoLicenciaSanitaria(event);
    expect(component.domicilioForm.get('noLicenciaSanitaria')?.disabled).toBe(true);
    event.target.checked = false;
    component.toggleNoLicenciaSanitaria(event);
    expect(component.domicilioForm.get('noLicenciaSanitaria')?.enabled).toBe(true);
  });

  it('cargarEstadoData debería establecer datosEstado', () => {
    component.cargarEstadoData();
    expect(component.datosEstado.length).toBeGreaterThan(0);
  });

  it('cargarDatosTabla debería establecer datosData', () => {
    component.cargarDatosTabla();
    expect(component.datosData.length).toBeGreaterThan(0);
  });

  it('cargarDatosProductoTabla debería establecer datosProducto', () => {
    component.cargarDatosProductoTabla();
    expect(component.datosProducto.length).toBeGreaterThan(0);
  });

  it('obtenerDatosClave debería establecer claveScian', () => {
    component.obtenerDatosClave();
    expect(component.claveScian.length).toBeGreaterThan(0);
  });

  it('obtenerDatosDescripcion debería establecer descripcionScian', () => {
    component.obtenerDatosDescripcion();
    expect(component.descripcionScian.length).toBeGreaterThan(0);
  });

  it('obtenerDatosPreOperativo debería establecer radioOptions', () => {
    component.obtenerDatosPreOperativo();
    expect(component.radioOptions.length).toBeGreaterThan(0);
  });

  it('obtenerclassificacionProductos debería establecer clasificacionProducto', () => {
    component.obtenerclassificacionProductos();
    expect(component.clasificacionProducto.length).toBeGreaterThan(0);
  });

  it('mostrarModeloClave debería establecer modal a mostrar', () => {
    component.mostrarModeloClave();
    expect(component.modal).toBe('show');
  });

  it('datosDelProducto debería establecer modal a mostrar', () => {
    component.datosDelProducto();
    expect(component.modal).toBe('show');
  });

  it('ngOnDestroy debería completar destroy$', () => {
    const spy = jest.spyOn(component['destroy$'], 'next');
    const spy2 = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('las funciones de paisDeProcedenciaBotons deberían llamar a agregar/quitar', () => {
    const agregar = jest.fn();
    const quitar = jest.fn();
    component.crossList = { toArray: () => [{ agregar, quitar }] } as any;
    component.paisDeProcedenciaBotons[0].funcion();
    expect(agregar).toHaveBeenCalledWith('t');
    component.paisDeProcedenciaBotons[1].funcion();
    expect(agregar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotons[2].funcion();
    expect(quitar).toHaveBeenCalledWith('');
    component.paisDeProcedenciaBotons[3].funcion();
    expect(quitar).toHaveBeenCalledWith('t');
  });
});