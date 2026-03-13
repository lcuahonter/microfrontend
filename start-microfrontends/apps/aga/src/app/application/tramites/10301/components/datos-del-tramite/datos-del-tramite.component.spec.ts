import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';

import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { 
  ConsultaioQuery, 
  ConsultaioState,
  ValidacionesFormularioService,
  TablaDinamicaComponent,
  AlertComponent,
  CatalogoSelectComponent,
  TituloComponent,
  CrosslistComponent,
  InputRadioComponent
} from '@ng-mf/data-access-user';
import { ImportadorExportadorService } from '../../services/importador-exportador.service';
import { Tramite10301Store } from '../../estados/tramite10301.store';
import { Tramite10301Query } from '../../estados/tramite10301.query';
import { Solicitud10301Service } from '../../services/solicitud10301.service';
import { DatosMercancia } from '../../models/importador-exportador.model';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockImportadorExportadorService: jest.Mocked<ImportadorExportadorService>;
  let mockStore: jest.Mocked<Tramite10301Store>;
  let mockQuery: jest.Mocked<Tramite10301Query>;
  let mockValidacionesService: jest.Mocked<ValidacionesFormularioService>;
  let mockSolicitud10301Service: jest.Mocked<Solicitud10301Service>;

  const mockCatalogData = [
    { id: 1, descripcion: 'Test Item 1' },
    { id: 2, descripcion: 'Test Item 2' }
  ];

  const mockMercanciaDatos: DatosMercancia[] = [
    {
      id: 1,
      fines: 'Test fines',
      tipoMercancia: 'Test tipo',
      ano: '2024',
      modelo: 'Test modelo',
      marca: 'Test marca',
      serie: '123456',
      usoEspecifico: 'Test uso',
      condicion: 'Nueva'
    }
  ];

  beforeEach(async () => {
    mockConsultaioQuery = {
      selectConsultaioState$: of({
        procedureId: 'test',
        parameter: 'test',
        department: 'test',
        folioTramite: 'test',
        tipoDeTramite: 'test',
        estadoDeTramite: 'test',
        readonly: false,
        create: true,
        update: false,
        consultaioSolicitante: null
      })
    } as any;

    mockImportadorExportadorService = {
      getAno: jest.fn().mockReturnValue(of({ code: 200, data: mockCatalogData, message: 'Success' })),
      getCondicion: jest.fn().mockReturnValue(of({ code: 200, data: mockCatalogData, message: 'Success' })),
      getPais: jest.fn().mockReturnValue(of({ code: 200, data: mockCatalogData, message: 'Success' })),
      getAduanaIngresara: jest.fn().mockReturnValue(of({ code: 200, data: mockCatalogData, message: 'Success' })),
      getFinesDeMercancia: jest.fn().mockReturnValue(of({ data: mockCatalogData }))
    } as any;

    mockStore = {
      setAno: jest.fn(),
      setCondicion: jest.fn(),
      setPais: jest.fn(),
      setAduana: jest.fn(),
      setFechasSeleccionadas: jest.fn(),
      setValorSeleccionado: jest.fn(),
      setTipoMercancia: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setMarca: jest.fn(),
      setModelo: jest.fn(),
      setSerie: jest.fn(),
      setCalle: jest.fn(),
      setNumeroExterior: jest.fn(),
      setNumeroInterior: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setColonia: jest.fn(),
      setOpcion: jest.fn(),
      setDatosMercancia: jest.fn(),
      setNombre: jest.fn()
    } as any;

    mockQuery = {
      selectSolicitud$: of({
        manifesto: 'test-manifesto',
        idSolicitud: 'test-id',
        tipoSolicitud: 'test-tipo',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: ['fecha1', 'fecha2'],
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: 'Test Name',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      }),
      selectAduana$: of(mockCatalogData),
      selectAno$: of(mockCatalogData),
      selectCondicion$: of(mockCatalogData),
      selectPais$: of(mockCatalogData)
    } as any;

    mockValidacionesService = {
      isValid: jest.fn().mockReturnValue(true)
    } as any;

    mockSolicitud10301Service = {
      obtenerDatosTableData: jest.fn().mockReturnValue(of(mockMercanciaDatos))
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        DatosDelTramiteComponent
      ],
      providers: [
        FormBuilder,
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: ImportadorExportadorService, useValue: mockImportadorExportadorService },
        { provide: Tramite10301Store, useValue: mockStore },
        { provide: Tramite10301Query, useValue: mockQuery },
        { provide: ValidacionesFormularioService, useValue: mockValidacionesService },
        { provide: Solicitud10301Service, useValue: mockSolicitud10301Service }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;

    component.modalElement = { nativeElement: document.createElement('div') } as ElementRef;
    component.modalConfirmacion = { nativeElement: document.createElement('div') } as ElementRef;
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;
    component.closeModalConfirmacion = { nativeElement: { click: jest.fn() } } as any;

    Object.defineProperty(window, 'bootstrap', {
      value: {
        Modal: jest.fn().mockImplementation(() => ({
          show: jest.fn(),
          hide: jest.fn()
        }))
      },
      writable: true,
      configurable: true
    });
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize component properties', () => {
      expect(component.mercanciaDatos).toEqual([]);
      expect(component.filaSeleccionadas).toEqual([]);
      expect(component.mostrarErroresValidacion).toBe(false);
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.formularioDeshabilitado).toBe(true);
    });

    it('should initialize encabezadoDeTabla with correct configuration', () => {
      expect(component.encabezadoDeTabla).toBeDefined();
      expect(component.encabezadoDeTabla.length).toBe(9);
      expect(component.encabezadoDeTabla[0].encabezado).toBe('');
      expect(component.encabezadoDeTabla[1].encabezado).toBe('Fines a los que se destinará la mercancía');
    });

    it('should initialize radioOpcions correctly', () => {
      expect(component.radioOpcions).toEqual([
        { label: 'Sí', value: 'sí' },
        { label: 'No', value: 'no' }
      ]);
    });
  });

  describe('ngOnInit', () => {
    it('should call initialization methods', () => {
      jest.spyOn(component, 'donanteDomicilio').mockImplementation();
      jest.spyOn(component, 'getAduanaIngresara').mockImplementation();
      jest.spyOn(component, 'getAno').mockImplementation();
      jest.spyOn(component, 'getCondicion').mockImplementation();
      jest.spyOn(component, 'getPais').mockImplementation();
      jest.spyOn(component, 'inicializaCatalogos').mockImplementation();
      jest.spyOn(component, 'inicializarEstadoFormulario').mockImplementation();

      component.ngOnInit();

      expect(component.donanteDomicilio).toHaveBeenCalled();
      expect(component.getAduanaIngresara).toHaveBeenCalled();
      expect(component.getAno).toHaveBeenCalled();
      expect(component.getCondicion).toHaveBeenCalled();
      expect(component.getPais).toHaveBeenCalled();
      expect(component.inicializaCatalogos).toHaveBeenCalled();
      expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    });

    it('should subscribe to query observables', () => {
      component.ngOnInit();

      expect(component.aduana).toBeDefined();
      expect(component.ano).toBeDefined();
      expect(component.condicion).toBeDefined();
      expect(component.pais).toBeDefined();
    });

    it('should set consultaDatos and esFormularioSoloLectura from consultaioQuery', () => {
      const mockState: ConsultaioState = {
        procedureId: 'test',
        parameter: 'test',
        department: 'test',
        folioTramite: 'test',
        tipoDeTramite: 'test',
        estadoDeTramite: 'test',
        readonly: true,
        create: true,
        update: false,
        consultaioSolicitante: null,
        action_id: '',
        current_user: '',
        id_solicitud: '',
        nombre_pagina: ''
      };
      
      const tempMockConsultaioQuery = {
        selectConsultaioState$: of(mockState)
      } as any;
      
      const tempComponent = new DatosDelTramiteComponent(
        tempMockConsultaioQuery,
        mockImportadorExportadorService,
        mockStore,
        mockQuery,
        new FormBuilder(),
        mockValidacionesService,
        mockSolicitud10301Service
      );

      tempComponent.ngOnInit();

      expect(tempComponent.consultaDatos).toEqual(mockState);
      expect(tempComponent.esFormularioSoloLectura).toBe(true);
    });

    it('should set solicitudState from query', () => {
      const mockSolicitudState = {
        manifesto: 'test',
        idSolicitud: 'test',
        tipoSolicitud: 'test',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: [],
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: 'Test User',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      };
      mockQuery.selectSolicitud$ = of(mockSolicitudState);

      component.ngOnInit();

      expect(component.solicitudState).toEqual(mockSolicitudState);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.tramiteForm = new FormBuilder().group({
        test: ['', []]
      });
    });

    it('should mark all controls as touched if form is invalid', () => {
      jest.spyOn(component.tramiteForm, 'invalid', 'get').mockReturnValue(true);
      const markAllAsTouchedSpy = jest.spyOn(component.tramiteForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should not mark controls as touched if form is valid', () => {
      jest.spyOn(component.tramiteForm, 'invalid', 'get').mockReturnValue(false);
      const markAllAsTouchedSpy = jest.spyOn(component.tramiteForm, 'markAllAsTouched');

      component.validarDestinatarioFormulario();

      expect(markAllAsTouchedSpy).not.toHaveBeenCalled();
    });

    it('should return validation result from validacionesService', () => {
      const form = new FormGroup({});
      const fieldName = 'testField';
      mockValidacionesService.isValid.mockReturnValue(true);

      const result = component.isValid(form, fieldName);

      expect(mockValidacionesService.isValid).toHaveBeenCalledWith(form, fieldName);
      expect(result).toBe(true);
    });

    it('should return false when validacionesService returns falsy', () => {
      const form = new FormGroup({});
      const fieldName = 'testField';
      mockValidacionesService.isValid.mockReturnValue(null);

      const result = component.isValid(form, fieldName);

      expect(result).toBe(false);
    });
  });

  describe('Service Calls', () => {
    it('should call setAno when getAno succeeds with code 200', () => {
      component.getAno();

      expect(mockImportadorExportadorService.getAno).toHaveBeenCalled();
      expect(mockStore.setAno).toHaveBeenCalledWith(mockCatalogData);
    });

    it('should not call setAno when getAno fails', () => {
      mockImportadorExportadorService.getAno.mockReturnValue(of({ code: 400, data: [], message: 'Error' }));

      component.getAno();

      expect(mockStore.setAno).not.toHaveBeenCalled();
    });

    it('should call setCondicion when getCondicion succeeds', () => {
      component.getCondicion();

      expect(mockImportadorExportadorService.getCondicion).toHaveBeenCalled();
      expect(mockStore.setCondicion).toHaveBeenCalledWith(mockCatalogData);
    });

    it('should call setPais when getPais succeeds', () => {
      component.getPais();

      expect(mockImportadorExportadorService.getPais).toHaveBeenCalled();
      expect(mockStore.setPais).toHaveBeenCalledWith(mockCatalogData);
    });

    it('should call setAduana when getAduanaIngresara succeeds', () => {
      component.getAduanaIngresara();

      expect(mockImportadorExportadorService.getAduanaIngresara).toHaveBeenCalled();
      expect(mockStore.setAduana).toHaveBeenCalledWith(mockCatalogData);
    });
  });

  describe('inicializaCatalogos', () => {
    it('should call getFinesDeMercancia and set fines', () => {
      component.pais = { catalogos: mockCatalogData } as any;

      component.inicializaCatalogos();

      expect(mockImportadorExportadorService.getFinesDeMercancia).toHaveBeenCalled();
      expect(component.fines).toEqual(mockCatalogData);
    });

    it('should handle undefined pais catalogos', () => {
      component.pais = { catalogos: undefined } as any;

      expect(() => component.inicializaCatalogos()).not.toThrow();
    });
  });

  describe('Form State Management', () => {
    beforeEach(() => {
      component.tramiteForm = new FormBuilder().group({
        test: ['']
      });
    });

    it('should disable form when esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      const disableSpy = jest.spyOn(component.tramiteForm, 'disable');

      component.guardarDatosDelFormulario();

      expect(disableSpy).toHaveBeenCalled();
    });

    it('should enable form when esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      const enableSpy = jest.spyOn(component.tramiteForm, 'enable');

      component.guardarDatosDelFormulario();

      expect(enableSpy).toHaveBeenCalled();
    });

    it('should initialize form state when readonly is false', () => {
      component.esFormularioSoloLectura = false;
      jest.spyOn(component, 'donanteDomicilio').mockImplementation();
      jest.spyOn(component, 'guardarDatosDelFormulario').mockImplementation();

      component.inicializarEstadoFormulario();

      expect(component.donanteDomicilio).toHaveBeenCalled();
      expect(component.guardarDatosDelFormulario).not.toHaveBeenCalled();
    });

    it('should save form data when readonly is true', () => {
      component.esFormularioSoloLectura = true;
      jest.spyOn(component, 'donanteDomicilio').mockImplementation();
      jest.spyOn(component, 'guardarDatosDelFormulario').mockImplementation();

      component.inicializarEstadoFormulario();

      expect(component.guardarDatosDelFormulario).toHaveBeenCalled();
      expect(component.donanteDomicilio).not.toHaveBeenCalled();
    });
  });

  describe('Radio Button Handling', () => {
    it('should update valorSeleccionado and call store method', () => {
      const testValue = 'sí';

      component.cambiarRadio(testValue);

      expect(component.valorSeleccionado).toBe(testValue);
      expect(mockStore.setValorSeleccionado).toHaveBeenCalledWith(testValue);
    });

    it('should handle number value', () => {
      const testValue = 1;

      component.cambiarRadio(testValue);

      expect(component.valorSeleccionado).toBe(1);
      expect(mockStore.setValorSeleccionado).toHaveBeenCalledWith(1);
    });
  });

  describe('Table Row Selection', () => {
    it('should update filaSeleccionadas with selected row ids', () => {
      const selectedRows = [
        { id: 1, fines: 'test1' },
        { id: 2, fines: 'test2' }
      ] as DatosMercancia[];

      component.onSelectedRowsChange(selectedRows);

      expect(component.filaSeleccionadas).toEqual([1, 2]);
    });

    it('should handle empty selection', () => {
      component.onSelectedRowsChange([]);

      expect(component.filaSeleccionadas).toEqual([]);
    });
  });

  describe('Modal Management', () => {
    it('should close modal when cerrarModal is called', () => {
      const clickSpy = jest.fn();
      component.closeModal = { nativeElement: { click: clickSpy } } as any;

      component.cerrarModal();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle missing closeModal reference', () => {
      component.closeModal = null as any;

      expect(() => component.cerrarModal()).not.toThrow();
    });

    it('should open confirmation modal', () => {
      const mockModalInstance = { show: jest.fn() };
      
      (window as any).bootstrap.Modal = jest.fn().mockReturnValue(mockModalInstance);

      component.abrirModalConfirmacion();

      expect((window as any).bootstrap.Modal).toHaveBeenCalledWith(component.modalConfirmacion.nativeElement);
      expect(mockModalInstance.show).toHaveBeenCalled();
    });
  });

  describe('Form Initialization', () => {
    it('should create forms in donanteDomicilio', () => {
      component.solicitudState = {
        manifesto: 'test-manifesto',
        idSolicitud: 'test-id',
        tipoSolicitud: 'test-tipo',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: [],
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: 'Test Name',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      } as any;

      component.donanteDomicilio();

      expect(component.tramiteForm).toBeDefined();
      expect(component.agregarMercanciasForm).toBeDefined();
    });

    it('should initialize forms with empty values for mercancia form', () => {
      component.donanteDomicilio();

      const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia');
      expect(datosMercanciaForm?.get('tipoMercancia')?.value).toBe('');
      expect(datosMercanciaForm?.get('usoEspecifico')?.value).toBe('');
      expect(datosMercanciaForm?.get('condicion')?.value).toBe('');
    });
  });

  describe('Form Getters', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should return importadorExportador form group', () => {
      const importadorExportador = component.importadorExportador;

      expect(importadorExportador).toBeDefined();
      expect(importadorExportador.get('aduana')).toBeDefined();
    });

    it('should return datosMercancia form group', () => {
      const datosMercancia = component.datosMercancia;

      expect(datosMercancia).toBeDefined();
      expect(datosMercancia.get('tipoMercancia')).toBeDefined();
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.donanteDomicilio();
    });

    it('should update store value and call updateValueAndValidity', () => {
      const testValue = 'test-value';
      const form = component.importadorExportador;
      form.get('nombre')?.setValue(testValue);

      const updateValiditySpy = jest.spyOn(component.importadorExportador.get('nombre')!, 'updateValueAndValidity');

      component.setValoresStore(form, 'nombre', 'setNombre');

      expect(mockStore.setNombre).toHaveBeenCalledWith(testValue);
      expect(updateValiditySpy).toHaveBeenCalled();
    });

    it('should handle missing form field', () => {
      const form = component.importadorExportador;

      expect(() => component.setValoresStore(form, 'nonexistent', 'setNombre')).not.toThrow();
    });
  });

  describe('Merchandise Management', () => {
    beforeEach(() => {
      component.donanteDomicilio();
      component.mercanciaDatos = [];
      component.solicitudState = {
        manifesto: 'test-manifesto',
        idSolicitud: 'test-id',
        tipoSolicitud: 'test-tipo',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: ['fecha1', 'fecha2'],
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: '',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      } as any;
    });

    describe('agregarMercancia', () => {
      it('should show validation errors when form is invalid', () => {
        const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
        datosMercanciaForm.get('tipoMercancia')?.setValue('');

        component.agregarMercancia();

        expect(component.mostrarErroresValidacion).toBe(true);
      });

      it('should add mercancia when form is valid', () => {
        const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
        
        datosMercanciaForm.patchValue({
          tipoMercancia: 'Test Tipo',
          usoEspecifico: 'Test Uso',
          condicion: '1',
          marca: 'Test Marca',
          ano: '2024',
          modelo: 'Test Modelo',
          serie: '123456'
        });

        const cerrarModalSpy = jest.spyOn(component, 'cerrarModal').mockImplementation();
        const abrirModalConfirmacionSpy = jest.spyOn(component, 'abrirModalConfirmacion').mockImplementation();

        component.agregarMercancia();

        expect(component.mercanciaDatos.length).toBe(1);
        expect(mockStore.setDatosMercancia).toHaveBeenCalledWith(component.mercanciaDatos);
        expect(component.mostrarErroresValidacion).toBe(false);
        expect(cerrarModalSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(abrirModalConfirmacionSpy).toHaveBeenCalled();
        }, 300);
      });

      it('should reset form after successful submission', () => {
        const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
        
        datosMercanciaForm.patchValue({
          tipoMercancia: 'Test Tipo',
          usoEspecifico: 'Test Uso',
          condicion: '1',
          marca: 'Test Marca',
          ano: '2024',
          modelo: 'Test Modelo',
          serie: '123456'
        });

        jest.spyOn(component, 'cerrarModal').mockImplementation();
        jest.spyOn(component, 'abrirModalConfirmacion').mockImplementation();

        const resetSpy = jest.spyOn(component.agregarMercanciasForm, 'reset');
        const markAsUntouchedSpy = jest.spyOn(component.agregarMercanciasForm, 'markAsUntouched');
        const markAsPristineSpy = jest.spyOn(component.agregarMercanciasForm, 'markAsPristine');

        component.agregarMercancia();

        expect(resetSpy).toHaveBeenCalled();
        expect(markAsUntouchedSpy).toHaveBeenCalled();
        expect(markAsPristineSpy).toHaveBeenCalled();
      });

      it('should handle form validation for complete form', () => {
        const markAllAsTouchedSpy = jest.spyOn(component.agregarMercanciasForm, 'markAllAsTouched');
        
        component.agregarMercancia();

        expect(markAllAsTouchedSpy).toHaveBeenCalled();
      });

      it('should validate complete form when datosMercancia is valid but overall form is not', () => {
        const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
        
        datosMercanciaForm.patchValue({
          tipoMercancia: 'Test Tipo',
          usoEspecifico: 'Test Uso',
          condicion: '1',
          marca: 'Test Marca',
          ano: '2024',
          modelo: 'Test Modelo',
          serie: '123456'
        });

        jest.spyOn(component.agregarMercanciasForm, 'valid', 'get').mockReturnValue(false);

        component.agregarMercancia();

        expect(component.mostrarErroresValidacion).toBe(true);
      });
    });

    describe('limpiarMercancias', () => {
      it('should reset form and validation errors', () => {
        component.mostrarErroresValidacion = true;
        const resetSpy = jest.spyOn(component.agregarMercanciasForm, 'reset');

        component.limpiarMercancias();

        expect(resetSpy).toHaveBeenCalled();
        expect(component.mostrarErroresValidacion).toBe(false);
      });
    });

    describe('eliminar', () => {
      it('should remove selected rows from mercanciaDatos', () => {
        component.mercanciaDatos = [
          { id: 1, fines: 'test1' } as DatosMercancia,
          { id: 2, fines: 'test2' } as DatosMercancia,
          { id: 3, fines: 'test3' } as DatosMercancia
        ];
        component.filaSeleccionadas = [1, 3];

        component.eliminar();

        expect(component.mercanciaDatos.length).toBe(1);
        expect(component.mercanciaDatos[0].id).toBe(2);
        expect(mockStore.setDatosMercancia).toHaveBeenCalledWith(component.mercanciaDatos);
        expect(component.filaSeleccionadas).toEqual([]);
      });

      it('should not remove anything when no rows selected', () => {
        component.mercanciaDatos = [{ id: 1, fines: 'test1' } as DatosMercancia];
        component.filaSeleccionadas = [];

        component.eliminar();

        expect(component.mercanciaDatos.length).toBe(1);
        expect(mockStore.setDatosMercancia).not.toHaveBeenCalled();
      });

      it('should handle null filaSeleccionadas', () => {
        component.mercanciaDatos = [{ id: 1, fines: 'test1' } as DatosMercancia];
        component.filaSeleccionadas = null as any;

        expect(() => component.eliminar()).not.toThrow();
      });
    });
  });

  describe('Cross-list Management', () => {
    beforeEach(() => {
      component.tramiteForm = new FormBuilder().group({
        fechasSeleccionadas: new FormBuilder().array([])
      });
    });

    it('should get fechasSeleccionadas FormArray', () => {
      const fechasArray = component.fechasSeleccionadas;

      expect(fechasArray).toBeDefined();
      expect(fechasArray.length).toBe(0);
    });

    it('should add fechas to FormArray and store', () => {
      const testFechas = ['fecha1', 'fecha2', 'fecha3'];

      component.changeCrosslist(testFechas);

      expect(component.fechasSeleccionadas.length).toBe(3);
      expect(mockStore.setFechasSeleccionadas).toHaveBeenCalledWith(testFechas);
    });

    it('should handle empty fechas array', () => {
      component.changeCrosslist([]);

      expect(component.fechasSeleccionadas.length).toBe(0);
      expect(mockStore.setFechasSeleccionadas).toHaveBeenCalledWith([]);
    });
  });

  describe('Cross-list Button Configuration', () => {
    it('should return correct button configuration', () => {
      const buttons = component.obtenerCrossListBtn();

      expect(buttons).toHaveLength(4);
      expect(buttons[0].btnNombre).toBe('Agregar todos');
      expect(buttons[1].btnNombre).toBe('Agregar selección');
      expect(buttons[2].btnNombre).toBe('Restar selección');
      expect(buttons[3].btnNombre).toBe('Restar todos');
    });

    it('should execute button functions without errors', () => {
      component.crossList = {
        forEach: jest.fn((callback) => {
          const mockCrosslistComponent = {
            agregar: jest.fn(),
            quitar: jest.fn()
          };
          callback(mockCrosslistComponent);
        })
      } as any;

      const buttons = component.obtenerCrossListBtn();

      expect(() => buttons[0].funcion()).not.toThrow();
      expect(() => buttons[1].funcion()).not.toThrow();
      expect(() => buttons[2].funcion()).not.toThrow();
      expect(() => buttons[3].funcion()).not.toThrow();
    });
  });

  describe('Data Loading', () => {
    it('should load table data successfully', () => {
      component.cargarDatosTablaData();

      expect(mockSolicitud10301Service.obtenerDatosTableData).toHaveBeenCalled();
      expect(component.mercanciaDatos).toEqual(mockMercanciaDatos);
    });

    it('should handle error in table data loading', () => {
      mockSolicitud10301Service.obtenerDatosTableData.mockReturnValue(throwError('Error'));

      expect(() => component.cargarDatosTablaData()).not.toThrow();
    });
  });

  describe('Component Cleanup', () => {
    it('should unsubscribe from all subscriptions on destroy', () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      
      component.getAduanaIngresaraSubscription = mockSubscription as any;
      component.getAnoSubscription = mockSubscription as any;
      component.getPaisSubscription = mockSubscription as any;
      component.getCondicionSubscription = mockSubscription as any;
      component['subscriptions'] = [mockSubscription as any];

      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const destroyNotifierCompleteSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalledTimes(5);
      expect(destroyNotifierSpy).toHaveBeenCalled();
      expect(destroyNotifierCompleteSpy).toHaveBeenCalled();
    });

    it('should handle missing subscriptions gracefully', () => {
      component.getAduanaIngresaraSubscription = null as any;
      component.getAnoSubscription = null as any;
      component.getPaisSubscription = null as any;
      component.getCondicionSubscription = null as any;
      component['subscriptions'] = [];

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle service call errors gracefully', () => {
      mockImportadorExportadorService.getAno.mockReturnValue(throwError('Service Error'));

      expect(() => component.getAno()).not.toThrow();
    });

    it('should handle form creation with null solicitudState', () => {
      component.solicitudState = null as any;

      expect(() => component.donanteDomicilio()).not.toThrow();
    });

    it('should handle missing form groups in setValoresStore', () => {
      component.donanteDomicilio();
      const mockForm = new FormGroup({});

      expect(() => component.setValoresStore(mockForm, 'nonexistent', 'setNombre')).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle trimmed values in agregarMercancia', () => {
      component.donanteDomicilio();
      const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
      
      datosMercanciaForm.patchValue({
        tipoMercancia: '  Test Tipo  ',
        usoEspecifico: '  Test Uso  ',
        condicion: '1',
        marca: '  Test Marca  ',
        ano: '2024',
        modelo: '  Test Modelo  ',
        serie: '  123456  '
      });

      jest.spyOn(component, 'cerrarModal').mockImplementation();
      jest.spyOn(component, 'abrirModalConfirmacion').mockImplementation();

      component.agregarMercancia();

      const addedItem = component.mercanciaDatos[0];
      expect(addedItem.tipoMercancia).toBe('Test Tipo');
      expect(addedItem.marca).toBe('Test Marca');
      expect(addedItem.modelo).toBe('Test Modelo');
      expect(addedItem.serie).toBe('123456');
    });

    it('should handle null values in form submission', () => {
      component.donanteDomicilio();
      component.solicitudState = {
        manifesto: 'test',
        idSolicitud: 'test',
        tipoSolicitud: 'test',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: null,
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: '',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      } as any;
      
      const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
      datosMercanciaForm.patchValue({
        tipoMercancia: null,
        usoEspecifico: null,
        condicion: '1',
        marca: null,
        ano: '2024',
        modelo: null,
        serie: null
      });

      jest.spyOn(component, 'cerrarModal').mockImplementation();
      jest.spyOn(component, 'abrirModalConfirmacion').mockImplementation();

      component.agregarMercancia();

      if (component.mercanciaDatos.length > 0) {
        const addedItem = component.mercanciaDatos[0];
        expect(addedItem.fines).toBe('');
        expect(addedItem.tipoMercancia).toBe('');
        expect(addedItem.marca).toBe('');
      } else {
        expect(component.mercanciaDatos.length).toBe(0);
        expect(component.mostrarErroresValidacion).toBe(true);
      }
    });

    it('should handle undefined fechasSeleccionadas in solicitudState', () => {
      component.donanteDomicilio();
      component.solicitudState = {
        manifesto: 'test',
        idSolicitud: 'test',
        tipoSolicitud: 'test',
        aduana: null,
        ano: null,
        condicion: null,
        pais: null,
        tipoDocumento: null,
        fechasSeleccionadas: undefined,
        finesElegidos: [],
        selectRangoDias: [],
        fechasDatos: [],
        fecha: null,
        fechaSeleccionada: null,
        valorSeleccionado: null,
        documentos: null,
        nombre: '',
        tipoMercancia: '',
        usoEspecifico: '',
        marca: '',
        modelo: '',
        serie: '',
        calle: '',
        numeroExterior: 0,
        numeroInterior: 0,
        telefono: 0,
        correoElectronico: '',
        codigoPostal: 0,
        estado: 0,
        colonia: 0,
        opcion: '',
        tableCheck: '',
        donacion: '',
        persona: '',
        otro: '',
        condicionMercancia: ''
      } as any;
      
      const datosMercanciaForm = component.agregarMercanciasForm.get('datosMercancia') as FormGroup;
      datosMercanciaForm.patchValue({
        tipoMercancia: 'Test',
        usoEspecifico: 'Test',
        condicion: '1',
        marca: 'Test',
        ano: '2024',
        modelo: 'Test',
        serie: '123'
      });

      jest.spyOn(component, 'cerrarModal').mockImplementation();
      jest.spyOn(component, 'abrirModalConfirmacion').mockImplementation();

      component.agregarMercancia();

      expect(component.mercanciaDatos[0].fines).toBe('');
    });
  });
});
