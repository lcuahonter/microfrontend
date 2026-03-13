import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject, of } from 'rxjs';
import { DestinatariosComponent } from './destinatarios.component';
import { AutorizacionDeRayosXService } from '../../services/autorizacion-de-rayos-x.service';
import { Tramite300105Store } from '../../estados/tramite300105.store';
import { Tramite300105Query } from '../../estados/tramite300105.query';
import {
  ConsultaioQuery,
  CrosslistComponent,
  CategoriaMensaje,
  TipoNotificacionEnum,
  TablaSeleccion,
  Catalogo
} from '@ng-mf/data-access-user';
import { DestinatarioConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { OBTENER_BOTONES_CROSSLIST } from '../../enum/botons.enum';

// Mock external dependencies
jest.mock('../../enum/botons.enum');

describe('DestinatariosComponent', () => {
  let component: DestinatariosComponent;
  let fixture: ComponentFixture<DestinatariosComponent>;
  let mockAutorizacionService: jest.Mocked<AutorizacionDeRayosXService>;
  let mockTramite300105Store: jest.Mocked<Tramite300105Store>;
  let mockTramite300105Query: jest.Mocked<Tramite300105Query>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockTramiteState = {
    destinatarioTablaDatos: [
      {
        id: 1,
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 'Mexico',
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 'Type A'
      }
    ]
  };

  const mockCatalogos: Catalogo[] = [
    { id: 1, descripcion: 'Mexico' },
    { id: 2, descripcion: 'USA' }
  ];

  beforeEach(async () => {
    const autorizacionServiceMock = {
      pais: mockCatalogos,
      tipoMercancia: mockCatalogos,
      fraccionArancelariaDescripcion: [
        { id: 1, descripcion: 'Test Description' }
      ],
      inicializaMercanciaDatosCatalogos: jest.fn()
    };

    const tramite300105StoreMock = {
      setDestinatarioTablaDatos: jest.fn()
    };

    const tramite300105QueryMock = {
      selectTramite300105$: of(mockTramiteState)
    };

    const consultaioQueryMock = {
      selectConsultaioState$: of({
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        tipoDeTramite: '',
        estadoDeTramite: '',
        readonly: false,
        create: false,
        update: false,
        consultaioSolicitante: null
      })
    };

    await TestBed.configureTestingModule({
      declarations: [DestinatariosComponent],
      imports: [ReactiveFormsModule, CommonModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AutorizacionDeRayosXService, useValue: autorizacionServiceMock },
        { provide: Tramite300105Store, useValue: tramite300105StoreMock },
        { provide: Tramite300105Query, useValue: tramite300105QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinatariosComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    
    mockAutorizacionService = TestBed.inject(AutorizacionDeRayosXService) as jest.Mocked<AutorizacionDeRayosXService>;
    mockTramite300105Store = TestBed.inject(Tramite300105Store) as jest.Mocked<Tramite300105Store>;
    mockTramite300105Query = TestBed.inject(Tramite300105Query) as jest.Mocked<Tramite300105Query>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;

    // Mock the OBTENER_BOTONES_CROSSLIST function
    (OBTENER_BOTONES_CROSSLIST as jest.Mock).mockReturnValue([
      { label: 'Test Button', action: jest.fn() }
    ]);

    // Mock crosslistComponent
    component.crosslistComponent = {} as CrosslistComponent;
    
    // Initialize component properties that are set in ngOnInit
    component.datosTablaDestinatario = [];
    component.listaFilaSeleccionadaMercancia = [];
    
    // Initialize the form to prevent template errors
    component.crearNuevoFormularioMercancia();
  });
describe('ngOnInit', () => {
    it('should initialize component state', () => {
      // Ensure form is created before ngOnInit
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();

      expect(component.estadoSolicitud300105).toEqual(mockTramiteState);
      expect(component.datosTablaDestinatario).toEqual(mockTramiteState.destinatarioTablaDatos);
      expect(component.botonesMovimientos).toBeDefined();
      expect(OBTENER_BOTONES_CROSSLIST).toHaveBeenCalledWith(component.crosslistComponent);
    });
  });

  describe('Constructor', () => {
    it('should subscribe to consultaioQuery and set readonly state', () => {
      expect(component.esFormularioSoloLectura).toBe(true);
    });
    
  });

  describe('crearNuevoFormularioMercancia', () => {
    it('should create form with default values when no data provided', () => {
      component.crearNuevoFormularioMercancia();

      expect(component.formularioMercancia).toBeDefined();
      expect(component.formularioMercancia.get('denominacionRazon')?.value).toBe('');
      expect(component.formularioMercancia.get('domicilio')?.value).toBe('');
      expect(component.formularioMercancia.get('pais')?.value).toBe('');
      expect(component.formularioMercancia.get('correo')?.value).toBe('');
      expect(component.formularioMercancia.get('paginaWeb')?.value).toBe('');
      expect(component.formularioMercancia.get('tipoMercancia')?.value).toBe('');
    });

    it('should create form with provided data', () => {
      const testData: DestinatarioConfiguracionItem = {
        id: 1,
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 'Mexico',
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 'Type A'
      };

      component.crearNuevoFormularioMercancia(testData);

      expect(component.formularioMercancia.get('denominacionRazon')?.value).toBe('Test Company');
      expect(component.formularioMercancia.get('domicilio')?.value).toBe('Test Address');
      expect(component.formularioMercancia.get('pais')?.value).toBe('Mexico');
    });

    it('should create form with required validators', () => {
      component.crearNuevoFormularioMercancia();

      const denominacionControl = component.formularioMercancia.get('denominacionRazon');
      const domicilioControl = component.formularioMercancia.get('domicilio');
      const paisControl = component.formularioMercancia.get('pais');
      const correoControl = component.formularioMercancia.get('correo');
      const paginaWebControl = component.formularioMercancia.get('paginaWeb');
      const tipoMercanciaControl = component.formularioMercancia.get('tipoMercancia');

      expect(denominacionControl?.hasError('required')).toBeTruthy();
      expect(domicilioControl?.hasError('required')).toBeTruthy();
      expect(paisControl?.hasError('required')).toBeTruthy();
      expect(correoControl?.hasError('required')).toBeTruthy();
      expect(paginaWebControl?.hasError('required')).toBeTruthy();
      expect(tipoMercanciaControl?.hasError('required')).toBeTruthy();
    });
  });

  describe('manejarCambioFraccionArancelaria', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      // Add the fraccionDescripcion control that the method expects
      component.formularioMercancia.addControl('fraccionDescripcion', formBuilder.control(''));
    });

    it('should update fraccionDescripcion when fraccion arancelaria changes', () => {
      const mockEvent: Catalogo = { id: 1, descripcion: '1' };
      
      component.manejarCambioFraccionArancelaria(mockEvent);

      expect(component.formularioMercancia.get('fraccionDescripcion')?.value).toBe('Test Description');
    });

    it('should handle when fraccion arancelaria is not found', () => {
      const mockEvent: Catalogo = { id: 999, descripcion: '999' };
      
      component.manejarCambioFraccionArancelaria(mockEvent);

      expect(component.formularioMercancia.get('fraccionDescripcion')?.value).toBeUndefined();
    });
  });

  describe('manejarFilaSeleccionada', () => {
    const testRow: DestinatarioConfiguracionItem = {
      id: 1,
      denominacionRazon: 'Test',
      domicilio: 'Test Address',
      pais: 'Mexico',
      correo: 'test@test.com',
      paginaWeb: 'www.test.com',
      tipoMercancia: 'Type A'
    };

    it('should disable buttons when no rows selected', () => {
      component.manejarFilaSeleccionada([]);

      expect(component.enableModficarBoton).toBeFalsy();
      expect(component.enableEliminarBoton).toBeFalsy();
    });

    it('should enable buttons and set selected row when rows are selected', () => {
      component.manejarFilaSeleccionada([testRow]);

      expect(component.enableModficarBoton).toBeTruthy();
      expect(component.enableEliminarBoton).toBeTruthy();
      expect(component.listaFilaSeleccionadaMercancia).toEqual([testRow]);
      expect(component.filaSeleccionadaMercancia).toEqual(testRow);
    });

    it('should set last row as selected when multiple rows are selected', () => {
      const testRow2: DestinatarioConfiguracionItem = {
        id: 2,
        denominacionRazon: 'Test2',
        domicilio: 'Test Address2',
        pais: 'USA',
        correo: 'test2@test.com',
        paginaWeb: 'www.test2.com',
        tipoMercancia: 'Type B'
      };

      component.manejarFilaSeleccionada([testRow, testRow2]);

      expect(component.filaSeleccionadaMercancia).toEqual(testRow2);
    });
  });

  describe('actualizarFilaSeleccionada', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();
      component.filaSeleccionadaMercancia = { id: 1 } as DestinatarioConfiguracionItem;
    });

    it('should update selected row with latest data from table', () => {
      component.actualizarFilaSeleccionada();

      expect(component.filaSeleccionadaMercancia).toEqual(mockTramiteState.destinatarioTablaDatos[0]);
    });

    it('should not update when row is not found', () => {
      component.filaSeleccionadaMercancia = { id: 999 } as DestinatarioConfiguracionItem;
      const originalRow = { ...component.filaSeleccionadaMercancia };
      
      component.actualizarFilaSeleccionada();

      expect(component.filaSeleccionadaMercancia).toEqual(originalRow);
    });
  });

  describe('modificarItemMercancia', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();
      component.listaFilaSeleccionadaMercancia = [mockTramiteState.destinatarioTablaDatos[0]];
      component.filaSeleccionadaMercancia = mockTramiteState.destinatarioTablaDatos[0];
      jest.spyOn(component, 'actualizarFilaSeleccionada');
      jest.spyOn(component, 'crearNuevoFormularioMercancia');
      jest.spyOn(component, 'alternarModalMercancia');
      jest.spyOn(component, 'abrirMultipleSeleccionPopup');
    });

    it('should modify single item when only one row selected', () => {
      component.modificarItemMercancia();

      expect(component.actualizarFilaSeleccionada).toHaveBeenCalled();
      expect(component.esOperacionDeActualizacion).toBeTruthy();
      expect(component.crearNuevoFormularioMercancia).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });

    it('should open multiple selection popup when multiple rows selected', () => {
      component.listaFilaSeleccionadaMercancia = [
        mockTramiteState.destinatarioTablaDatos[0],
        { ...mockTramiteState.destinatarioTablaDatos[0], id: 2 }
      ];

      component.modificarItemMercancia();

      expect(component.abrirMultipleSeleccionPopup).toHaveBeenCalled();
    });
  });

  describe('confirmEliminarMercanciaItem', () => {
    beforeEach(() => {
      jest.spyOn(component, 'abrirElimninarConfirmationopup');
    });

    it('should not open confirmation popup when no items selected', () => {
      component.listaFilaSeleccionadaMercancia = [];
      
      component.confirmEliminarMercanciaItem();

      expect(component.abrirElimninarConfirmationopup).not.toHaveBeenCalled();
    });

    it('should open confirmation popup when items are selected', () => {
      component.listaFilaSeleccionadaMercancia = [mockTramiteState.destinatarioTablaDatos[0]];
      
      component.confirmEliminarMercanciaItem();

      expect(component.abrirElimninarConfirmationopup).toHaveBeenCalled();
    });
  });

  describe('eliminarMercanciaItem', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();
      component.listaFilaSeleccionadaMercancia = [mockTramiteState.destinatarioTablaDatos[0]];
      jest.spyOn(component, 'cerrarEliminarConfirmationPopup');
    });

    it('should remove selected items from table and update store', () => {
      const initialData = [...component.datosTablaDestinatario];
      
      component.eliminarMercanciaItem();

      expect(component.datosTablaDestinatario).toEqual([]);
      expect(component.listaFilaSeleccionadaMercancia).toEqual([]);
      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalledWith([]);
      expect(component.cerrarEliminarConfirmationPopup).toHaveBeenCalled();
    });
  });

  describe('Popup methods', () => {
    describe('abrirMultipleSeleccionPopup', () => {
      it('should open popup when modify button is enabled', () => {
        component.enableModficarBoton = true;
        
        component.abrirMultipleSeleccionPopup();

        expect(component.multipleSeleccionPopupAbierto).toBeTruthy();
        expect(component.nuevaNotificacion).toEqual({
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ERROR,
          modo: 'modal',
          titulo: 'Aviso',
          mensaje: 'Selecciona sólo un registro para modificar.',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        });
      });

      it('should not open popup when modify button is disabled', () => {
        component.enableModficarBoton = false;
        
        component.abrirMultipleSeleccionPopup();

        expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
      });
    });

    describe('cerrarMultipleSeleccionPopup', () => {
      it('should close multiple selection popup', () => {
        component.cerrarMultipleSeleccionPopup();

        expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
        expect(component.multipleSeleccionPopupCerrado).toBeFalsy();
      });
    });

    describe('abrirElimninarConfirmationopup', () => {
      it('should open delete confirmation popup', () => {
        component.abrirElimninarConfirmationopup();

        expect(component.confirmEliminarPopupAbierto).toBeTruthy();
        expect(component.nuevaNotificacion).toEqual({
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.ERROR,
          modo: 'modal',
          titulo: 'Aviso',
          mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
          cerrar: false,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
      });
    });

    describe('cerrarEliminarConfirmationPopup', () => {
      it('should close delete confirmation popup', () => {
        component.cerrarEliminarConfirmationPopup();

        expect(component.confirmEliminarPopupAbierto).toBeFalsy();
        expect(component.confirmEliminarPopupCerrado).toBeFalsy();
      });
    });

    describe('cerrarRelacionMercanciaPopup', () => {
      it('should close relacion mercancia popup', () => {
        component.cerrarRelacionMercanciaPopup();

        expect(component.relacionMercanciaPopupAbierto).toBeFalsy();
      });
    });
  });

  describe('alternarModalMercancia', () => {
    it('should toggle modal visibility', () => {
      const initialState = component.mostrarModalDatosMercancia;
      
      component.alternarModalMercancia();

      expect(component.mostrarModalDatosMercancia).toBe(!initialState);
    });
  });

  describe('mostrarFormularioMercanciaModal', () => {
    beforeEach(() => {
      jest.spyOn(component, 'crearNuevoFormularioMercancia');
      jest.spyOn(component, 'alternarModalMercancia');
    });

    it('should initialize form and show modal', () => {
      component.mostrarFormularioMercanciaModal();

      expect(component.esOperacionDeActualizacion).toBeFalsy();
      expect(mockAutorizacionService.inicializaMercanciaDatosCatalogos).toHaveBeenCalled();
      expect(component.crearNuevoFormularioMercancia).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });
  });

  describe('esControlInvalido', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
    });

    it('should return true when control is invalid and touched', () => {
      const control = component.formularioMercancia.get('denominacionRazon');
      control?.markAsTouched();

      const result = component.esControlInvalido('denominacionRazon');

      expect(result).toBeTruthy();
    });

    it('should return true when control is invalid and dirty', () => {
      const control = component.formularioMercancia.get('denominacionRazon');
      control?.markAsDirty();

      const result = component.esControlInvalido('denominacionRazon');

      expect(result).toBeTruthy();
    });

    it('should return false when control is valid', () => {
      const control = component.formularioMercancia.get('denominacionRazon');
      control?.setValue('Valid value');
      control?.markAsTouched();

      const result = component.esControlInvalido('denominacionRazon');

      expect(result).toBeFalsy();
    });

    it('should return false when control does not exist', () => {
      const result = component.esControlInvalido('nonExistentControl');

      expect(result).toBeFalsy();
    });
  });

  describe('enviarFormularioMercancia', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();
      jest.spyOn(component, 'mostrarNotificacionRelacionMercancia');
      jest.spyOn(component, 'alternarModalMercancia');
    });

    it('should return early when form is invalid', () => {
      component.enviarFormularioMercancia();

      expect(component.formularioMercancia.touched).toBeTruthy();
      expect(mockTramite300105Store.setDestinatarioTablaDatos).not.toHaveBeenCalled();
    });

    it('should add new item when form is valid and not updating', () => {
      // Fill form with valid data
      component.formularioMercancia.patchValue({
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 1,
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 1
      });

      component.esOperacionDeActualizacion = false;
      component.enviarFormularioMercancia();

      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalled();
      expect(component.mostrarNotificacionRelacionMercancia).toHaveBeenCalled();
    });

    it('should update existing item when form is valid and updating', () => {
      // Fill form with valid data
      component.formularioMercancia.patchValue({
        id: 1,
        denominacionRazon: 'Updated Company',
        domicilio: 'Updated Address',
        pais: 1,
        correo: 'updated@test.com',
        paginaWeb: 'www.updated.com',
        tipoMercancia: 1
      });

      component.esOperacionDeActualizacion = true;
      component.enviarFormularioMercancia();

      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalled();
      expect(component.mostrarNotificacionRelacionMercancia).toHaveBeenCalled();
    });

    it('should save and close modal when isGuardar is true', () => {
      // Fill form with valid data
      component.formularioMercancia.patchValue({
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 1,
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 1
      });

      jest.spyOn(component.formularioMercancia, 'reset');

      component.enviarFormularioMercancia(true);

      expect(component.formularioMercancia.reset).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });

    it('should handle case when pais is not found in catalog', () => {
      // Fill form with valid data including invalid pais index
      component.formularioMercancia.patchValue({
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 999, // Invalid index
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 1
      });

      component.esOperacionDeActualizacion = false;
      component.enviarFormularioMercancia();

      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalled();
    });

    it('should save when isGuardar is true and updating', () => {
      // Fill form with valid data
      component.formularioMercancia.patchValue({
        id: 1,
        denominacionRazon: 'Updated Company',
        domicilio: 'Updated Address',
        pais: 1,
        correo: 'updated@test.com',
        paginaWeb: 'www.updated.com',
        tipoMercancia: 1
      });

      jest.spyOn(component.formularioMercancia, 'reset');
      component.esOperacionDeActualizacion = true;

      component.enviarFormularioMercancia(true);

      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalled();
      expect(component.formularioMercancia.reset).toHaveBeenCalled();
      expect(component.alternarModalMercancia).toHaveBeenCalled();
    });
  });

  describe('mostrarNotificacionRelacionMercancia', () => {
    it('should show success notification and open popup', () => {
      component.mostrarNotificacionRelacionMercancia();

      expect(component.nuevaNotificacion).toEqual({
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.EXITO,
        modo: 'modal',
        titulo: '',
        mensaje: 'Relación agregada',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      });
      expect(component.relacionMercanciaPopupAbierto).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destruction subject', () => {
      jest.spyOn(component['notificadorDestruccion$'], 'next');
      jest.spyOn(component['notificadorDestruccion$'], 'complete');

      component.ngOnDestroy();

      expect(component['notificadorDestruccion$'].next).toHaveBeenCalled();
      expect(component['notificadorDestruccion$'].complete).toHaveBeenCalled();
    });
  });

  describe('Component Properties', () => {
    beforeEach(() => {
      component.crearNuevoFormularioMercancia();
      component.ngOnInit();
    });

    it('should initialize all properties correctly', () => {
      expect(component.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
      expect(component.configuracionTabla).toBeDefined();
      expect(component.mercanciaTabla).toBeDefined();
      expect(component.enableModficarBoton).toBeFalsy();
      expect(component.mostrarModalDatosMercancia).toBeFalsy();
      expect(component.mostrarPopupSeleccionMultiple).toBeFalsy();
      expect(component.multipleSeleccionPopupAbierto).toBeFalsy();
      expect(component.multipleSeleccionPopupCerrado).toBeTruthy();
      expect(component.confirmEliminarPopupAbierto).toBeFalsy();
      expect(component.confirmEliminarPopupCerrado).toBeTruthy();
      expect(component.enableEliminarBoton).toBeFalsy();
      expect(component.esOperacionDeActualizacion).toBeFalsy();
      expect(component.relacionMercanciaPopupAbierto).toBeFalsy();
      expect(component.esFormularioSoloLectura).toBeDefined();
    });

    it('should have correct array properties initialized', () => {
      expect(Array.isArray(component.listaOriginalAduanas)).toBeTruthy();
      expect(Array.isArray(component.listaSeleccionadaAduanas)).toBeTruthy();
      expect(Array.isArray(component.listaOriginalMovimientos)).toBeTruthy();
      expect(Array.isArray(component.listSeleccionadaMovimientos)).toBeTruthy();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined form control in esControlInvalido', () => {
      component.crearNuevoFormularioMercancia();
      
      // Mock get method to return null
      jest.spyOn(component.formularioMercancia, 'get').mockReturnValue(null);
      
      const result = component.esControlInvalido('testControl');
      
      expect(result).toBeFalsy();
    });

    it('should handle empty arrays in manejarFilaSeleccionada', () => {
      component.manejarFilaSeleccionada([]);
      
      expect(component.enableModficarBoton).toBeFalsy();
      expect(component.enableEliminarBoton).toBeFalsy();
    });

    it('should handle form submission with empty catalogs', () => {
      mockAutorizacionService.pais = [];
      mockAutorizacionService.tipoMercancia = [];
      
      component.crearNuevoFormularioMercancia();
      component.formularioMercancia.patchValue({
        denominacionRazon: 'Test Company',
        domicilio: 'Test Address',
        pais: 1,
        correo: 'test@test.com',
        paginaWeb: 'www.test.com',
        tipoMercancia: 1
      });

      component.enviarFormularioMercancia();

      expect(mockTramite300105Store.setDestinatarioTablaDatos).toHaveBeenCalled();
    });
  });
});