import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoComponent } from './aviso.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject, of } from 'rxjs';
import { Tramite32503Store } from '../../../../estados/tramites/tramite32503.store';
import { Tramite32503Query } from '../../../../estados/queries/tramite32503.query';
import { Modal } from 'bootstrap';
import { AvisoTabla, MercanciaTabla } from "../../models/aviso-traslado.model";
import { provideHttpClient } from '@angular/common/http';
import { AvisoTrasladoService } from '../../services/aviso-traslado.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn()
  }))
}));

// Mock Modal.getInstance
const MockedModal = Modal as jest.MockedClass<typeof Modal>;
MockedModal.getInstance = jest.fn().mockImplementation((element) => {
  if (!element) {
    throw new Error('Cannot get instance of null element');
  }
  return {
    show: jest.fn(),
    hide: jest.fn()
  };
});



describe('AvisoComponent', () => {
  let component: AvisoComponent;
  let fixture: ComponentFixture<AvisoComponent>;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let tablaDeDatos: AvisoTabla[];
  let tablaDeMercancia: MercanciaTabla[];
  let avisoTrasladoServiceMock: any;


  beforeEach(async () => {

    document.body.innerHTML = '<div id="root"></div>';
    
    tramiteStoreMock = {
      setAvisoFormularioTipoAviso: jest.fn(),
      setAvisoFormularioFechaTranslado: jest.fn(),
    };
    avisoTrasladoServiceMock = {
      obtenerFraccionArancelaria: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Fracción 1' }] })),
      obtenerUnidadMedida: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Unidad 1' }] })),
      obtenerFederativa: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Entidad 1' }] })),
      obtenerMunicipio: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Municipio 1' }] })),
      obtenerColonias: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Colonia 1' }] })),
      obtenerAvisoTabla: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Aviso 1' }] })),
      obtenerMercanciaTabla: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Mercancía 1' }] })),
      getAdaceDatos: jest.fn().mockReturnValue(of({ adace: 'MOCK_ADACE_VALUE' })),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({
        datosAviso: {
          tipoAviso: 'inicial',
          idTransaccion: '',
          motivoProrroga: '',
        },
      }),
    };

    const consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false
      })
    };

    tablaDeDatos = [
      {
        "id": 1,
        "rfc": "XAXX010101000",
        "nombreComercial": "NOMBRE COMERCIAL",
        "entidadFederativa": "ENTIDAD FEDERATIVA",
        "alcaldioOMuncipio": "ALCALDIA O MUNICIPIO",
        "colonia": "COLONIA"
      },
      {
        "id": 1,
        "rfc": "XAXX010101000",
        "nombreComercial": "NOMBRE COMERCIAL",
        "entidadFederativa": "ENTIDAD FEDERATIVA",
        "alcaldioOMuncipio": "ALCALDIA O MUNICIPIO",
        "colonia": "COLONIA"
      }
    ];
    tablaDeMercancia = [
      {
        "id": 1,
        "claveFraccionArancelaria": "certificado",
        "nico": "01",
        "cantidad": "50",
        "claveUnidadMedida": "Botella",
        "valorUSD": "2555",
        "numPedimentoExportacion": "certificado",
        "numPedimentoImportacion": "certificado"
      },
      {
        "id": 1,
        "claveFraccionArancelaria": "certificado",
        "nico": "01",
        "cantidad": "50",
        "claveUnidadMedida": "Botella",
        "valorUSD": "2555",
        "numPedimentoExportacion": "certificado",
        "numPedimentoImportacion": "certificado"
      }
    ]
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AvisoComponent],
      declarations: [],
      providers: [
        provideHttpClient(),
        { provide: Tramite32503Store, useValue: tramiteStoreMock },
        { provide: Tramite32503Query, useValue: tramiteQueryMock },
        { provide: AvisoTrasladoService, useValue: avisoTrasladoServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoComponent);
    component = fixture.componentInstance;
    
    component.tablaDeDatos = { 
      datos: [], 
      encabezadas: [
        { encabezado: 'RFC', clave: (ele: any) => ele.rfc, orden: 1 },
        { encabezado: 'Nombre Comercial', clave: (ele: any) => ele.nombreComercial, orden: 2 }
      ] 
    };
    component.tablaDeMercancia = { 
      datos: [], 
      encabezadas: [
        { encabezado: 'Clave', clave: (ele: any) => ele.claveFraccionArancelaria, orden: 1 },
        { encabezado: 'NICO', clave: (ele: any) => ele.nico, orden: 2 }
      ] 
    };
    component.filaSeleccionadaLista = [];
    component.filaSeleccionadaMercanciaLista = [];
    component.datosCompletosAvisos = {};
    component.datosCompletosMercancias = {};
    component.mostrarAlertaValidacionMercancia = false;
    component.mostrarAlertaValidacionDomicilio = false;
    component.soloLectura = false;
    
    if (!component.avisoFormulario) {
      component.avisoFormulario = new FormBuilder().group({
        datosAviso: new FormBuilder().group({
          tipoAviso: ['inicial'],
          idTransaccion: [''],
          motivoProrroga: ['']
        })
      });
    }
    
    if (!component.mercanciaFormulario) {
      component.mercanciaFormulario = new FormBuilder().group({
        claveFraccionArancelaria: [''],
        nico: [''],
        cantidad: [''],
        claveUnidadMedida: [''],
        valorUSD: [''],
        numPedimentoExportacion: [''],
        numPedimentoImportacion: ['']
      });
    }
    
    if (!component.domicilioFormulario) {
      component.domicilioFormulario = new FormBuilder().group({
        rfc: [''],
        nombreComercial: [''],
        claveEntidadFederativa: [''],
        claveDelegacionMunicipio: [''],
        claveColonia: ['']
      });
    }
    
  });

  it('should initialize tramiteState on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tramiteState).toEqual({
      datosAviso: {
        tipoAviso: 'inicial',
        idTransaccion: '',
        motivoProrroga: '',
      },
    });
  });

  it('should call setAvisoFormularioTipoAviso when verificaTipoAviso is called', () => {
    component.avisoFormulario = new FormGroup({});
    component.verificaTipoAviso();
    expect(tramiteStoreMock.setAvisoFormularioTipoAviso).toHaveBeenCalled();
  });

  it('should disable idTransaccion and motivoProrroga when tipoAviso is "inicial"', () => {
    component.avisoFormulario = new FormGroup({
      datosAviso: new FormGroup({
        tipoAviso: new FormBuilder().control('inicial'),
        idTransaccion: new FormBuilder().control(''),
        motivoProrroga: new FormBuilder().control(''),
      }),
    });
    component.verificaTipoAviso();
    expect(component.avisoFormulario.get('datosAviso.idTransaccion')?.disabled).toBeTruthy();
    expect(component.avisoFormulario.get('datosAviso.motivoProrroga')?.disabled).toBeTruthy();
  });

  it('should filter out selected rows when eliminarDomicilio is called', () => {
    component.tablaDeDatos.datos = tablaDeDatos
    component.filaSeleccionadaLista = [tablaDeDatos[1]];
    component.eliminarDomicilio();
    expect(component.elementoParaEliminar).toBe(2);
    expect(component.nuevaNotificacion1.mensaje).toBe('¿Desea eliminar el registro seleccionado?');
    
    component.eliminarPedimento(true);
    expect(component.tablaDeDatos.datos).toEqual([tablaDeDatos[0]]);
    expect(component.filaSeleccionadaLista).toEqual([]);
  });

  it('should filter out selected rows when eliminarMercancia is called', () => {
    component.tablaDeMercancia.datos = tablaDeMercancia
    component.filaSeleccionadaMercanciaLista = [tablaDeMercancia[1]];
    component.eliminarMercancia();
    expect(component.elementoParaEliminar).toBe(1);
    expect(component.nuevaNotificacion1.mensaje).toBe('¿Desea eliminar el registro seleccionado?');
    
    component.eliminarPedimento(true);
    expect(component.tablaDeMercancia.datos).toEqual([tablaDeMercancia[0]]);
    expect(component.filaSeleccionadaMercanciaLista).toEqual([]);
  });

  it('should call setAvisoFormularioFechaTranslado when cambioFechaIngreso is called', () => {
    const nuevoValor = '2025-04-10';
    component.cambioFechaIngreso(nuevoValor);
    expect(tramiteStoreMock.setAvisoFormularioFechaTranslado).toHaveBeenCalledWith(nuevoValor);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });




  it('should set values in the store using setValoresStore', () => {
    const form = new FormBuilder().group({
      testField: ['Test Value'],
    });
    component.setValoresStore(form, 'testField', 'setAvisoFormularioFechaTranslado');
    expect(tramiteStoreMock.setAvisoFormularioFechaTranslado).toHaveBeenCalledWith('Test Value');
  });

  it('should load fracción arancelaria data using cargarFraccionArancelaria', () => {
    component.cargarFraccionArancelaria();
    expect(avisoTrasladoServiceMock.obtenerFraccionArancelaria).toHaveBeenCalled();
    expect(component.fraccionArancelaria).toEqual([{ id: 1, descripcion: 'Fracción 1' }]);
  });
  it('should load unidad de medida data using cargarUnidadMedida', () => {
    component.cargarUnidadMedida();
    expect(avisoTrasladoServiceMock.obtenerUnidadMedida).toHaveBeenCalled();
    expect(component.unidadMedida).toEqual([{ id: 1, descripcion: 'Unidad 1' }]);
  });
  it('should load entidad federativa data using cargarFederativa', () => {
    component.cargarFederativa();
    expect(avisoTrasladoServiceMock.obtenerFederativa).toHaveBeenCalled();
    expect(component.entidadFederativa).toEqual([{ id: 1, descripcion: 'Entidad 1' }]);
  });
  it('should load municipio data using cargarMunicipio', () => {
    component.cargarMunicipio();
    expect(avisoTrasladoServiceMock.obtenerMunicipio).toHaveBeenCalled();
    expect(component.delegacionMunicipio).toEqual([{ id: 1, descripcion: 'Municipio 1' }]);
  });
  it('should load colonias data using cargarColonias', () => {
    component.cargarColonias();
    expect(avisoTrasladoServiceMock.obtenerColonias).toHaveBeenCalled();
    expect(component.colonia).toEqual([{ id: 1, descripcion: 'Colonia 1' }]);
  });
  it('should load aviso tabla data using cargarAvisoTabla', () => {
    component.cargarAvisoTabla();
    expect(avisoTrasladoServiceMock.obtenerAvisoTabla).toHaveBeenCalled();
    expect(component.tablaDeDatos.datos).toEqual([{ id: 1, descripcion: 'Aviso 1' }]);
  });
  it('should load mercancia tabla data using cargarMercanciaTabla', () => {
    component.cargarMercanciaTabla();
    expect(avisoTrasladoServiceMock.obtenerMercanciaTabla).toHaveBeenCalled();
    expect(component.tablaDeMercancia.datos).toEqual([{ id: 1, descripcion: 'Mercancía 1' }]);
  });
  it('should disable forms when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.avisoFormulario.disabled).toBe(true);
    expect(component.domicilioFormulario.disabled).toBe(true);
    expect(component.mercanciaFormulario.disabled).toBe(true);
  });

  it('should enable forms when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.avisoFormulario.enabled).toBe(true);
    expect(component.domicilioFormulario.enabled).toBe(true);
    expect(component.mercanciaFormulario.enabled).toBe(true);
  });

  it('should update filaSeleccionadaLista when filaSeleccionada is called', () => {
    const mockEvento: AvisoTabla[] = [{
      id: 1,
      rfc: "rfc",
      nombreComercial: "nombreComercial",
      entidadFederativa: "entidadFederativa",
      alcaldioOMuncipio: "alcaldioOMuncipio",
      colonia: "colonia"
    }];
    component.filaSeleccionada(mockEvento);
    expect(component.filaSeleccionadaLista).toEqual(mockEvento);
  });

  it('should update filaSeleccionadaMercanciaLista when filaSeleccionadaMercancia is called', () => {
    const mockEvento: MercanciaTabla[] = [{
      id: 1,
      claveFraccionArancelaria: "claveFraccionArancelaria",
      nico: "nico",
      cantidad: "cantidad",
      claveUnidadMedida: "claveUnidadMedida",
      valorUSD: "valorUSD",
      numPedimentoExportacion: "numPedimentoExportacion",
      numPedimentoImportacion: "numPedimentoImportacion",
    }];
    component.filaSeleccionadaMercancia(mockEvento);
    expect(component.filaSeleccionadaMercanciaLista).toEqual(mockEvento);
  });

  it('should call cargarMercanciaTabla and close the modal when agregarMercancia is called', () => {
    component.mercanciaFormulario = new FormBuilder().group({
      claveFraccionArancelaria: ['test'],
      nico: ['01'],
      cantidad: ['10'],
      claveUnidadMedida: ['KG'],
      valorUSD: ['100'],
      descripcionMercancia: ['test'],
      descripcionProceso: ['test'],
      numPedimentoExportacion: ['123'],
      numPedimentoImportacion: ['456']
    });
    
    component.closeMercancia = {
      nativeElement: {
        click: jest.fn(),
      },
    } as any;

    component.tablaDeMercancia.datos = [];

    component.agregarMercancia();

    expect(component.tablaDeMercancia.datos.length).toBe(1);
    expect(component.closeMercancia.nativeElement.click).toHaveBeenCalled();
  });

  it('should call cargarAvisoTabla, close the modal, and open a notification when agregarDomicilio is called', () => {
    component.domicilioFormulario = new FormBuilder().group({
      nombreComercial: ['test'],
      claveEntidadFederativa: ['01'],
      claveDelegacionMunicipio: ['01'],
      claveColonia: ['01'],
      calle: ['test'],
      numeroExterior: ['123'],
      numeroInterior: ['456'],
      codigoPostal: ['12345'],
      rfc: ['TEST123456789']
    });
    
    component.closeDomicilio = {
      nativeElement: {
        click: jest.fn(),
      },
    } as any;

    component.tablaDeDatos.datos = [];

    component.agregarDomicilio();

    expect(component.tablaDeDatos.datos.length).toBe(1);
    expect(component.closeDomicilio.nativeElement.click).toHaveBeenCalled();
  });

  it('should sanitize input by removing non-alphanumeric characters', () => {
    const mockEvent = {
      target: { value: 'abc123!@#' } as HTMLInputElement,
    } as unknown as Event;
    const form = new FormBuilder().group({
      testField: [''],
    });
    component.desinfectarAlfanumerico(form, 'testField', mockEvent);
    expect(form.get('testField')?.value).toBe('abc123');
  });

  it('should sanitize input by removing non-alphanumeric characters except spaces', () => {
    const mockEvent = {
      target: { value: 'abc 123!@#' } as HTMLInputElement,
    } as unknown as Event;

    const form = new FormBuilder().group({
      testField: [''],
    });
    component.desinfectarAlfanumericoConEspacio(form, 'testField', mockEvent);
    expect(form.get('testField')?.value).toBe('abc 123');
  });

  it('should sanitize input by removing non-numeric characters', () => {
    const mockEvent = {
      target: { value: '123abc!@#' } as HTMLInputElement,
    } as unknown as Event;
    const form = new FormBuilder().group({
      testField: [''],
    });
    component.desinfectarNumerico(form, 'testField', mockEvent);
    expect(form.get('testField')?.value).toBe('123');
  });

  it('should clear the file input and reset the archivoMasivo control', () => {
    const mockFileInput = {
      value: 'mockFile',
    } as HTMLInputElement;

    component.avisoFormulario = new FormBuilder().group({
      archivoMasivo: ['mockFile'],
    });
    component.limpiar(mockFileInput);
    expect(mockFileInput.value).toBe('');
    expect(component.avisoFormulario.get('archivoMasivo')?.value).toBe('');
  });

  it('should set the selected file in the archivoMasivo control', () => {
    const mockFile = new File(['content'], 'testFile.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    component.avisoFormulario = new FormBuilder().group({
      archivoMasivo: [null],
    });
    component.onArchivoMasivoSeleccionado(mockEvent);
    expect(component.avisoFormulario.get('archivoMasivo')?.value).toBe(mockFile);
  });

  it('should not set the archivoMasivo control if no file is selected', () => {
    const mockEvent = {
      target: {
        files: [],
      },
    } as unknown as Event;

    component.avisoFormulario = new FormBuilder().group({
      archivoMasivo: [null],
    });
    component.onArchivoMasivoSeleccionado(mockEvent);
    expect(component.avisoFormulario.get('archivoMasivo')?.value).toBeNull();
  });

  it('should return adaceFormulario group', () => {
    component.avisoFormulario = new FormBuilder().group({
      adaceFormulario: new FormBuilder().group({
        adace: ['test']
      })
    });
    const result = component.adaceFormulario;
    expect(result).toBeTruthy();
    expect(result.get('adace')?.value).toBe('test');
  });

  it('should return datosEmpresa group', () => {
    component.avisoFormulario = new FormBuilder().group({
      datosEmpresa: new FormBuilder().group({
        valorProgramaImmex: ['123']
      })
    });
    const result = component.datosEmpresa;
    expect(result).toBeTruthy();
    expect(result.get('valorProgramaImmex')?.value).toBe('123');
  });

  it('should return datosAviso group', () => {
    component.avisoFormulario = new FormBuilder().group({
      datosAviso: new FormBuilder().group({
        tipoAviso: ['inicial']
      })
    });
    const result = component.datosAviso;
    expect(result).toBeTruthy();
    expect(result.get('tipoAviso')?.value).toBe('inicial');
  });

  it('should return direccionOrigen group', () => {
    component.avisoFormulario = new FormBuilder().group({
      direccionOrigen: new FormBuilder().group({
        nombreComercial: ['test']
      })
    });
    const result = component.direccionOrigen;
    expect(result).toBeTruthy();
    expect(result.get('nombreComercial')?.value).toBe('test');
  });

  it('should hide modal when cerrarModalDomicilio is called', () => {
    const hideModalSpy = jest.spyOn(AvisoComponent as any, 'hideModal');
    component.modalDomicilio = { nativeElement: document.createElement('div') } as any;
    component.cerrarModalDomicilio();
    expect(hideModalSpy).toHaveBeenCalledWith(component.modalDomicilio);
  });

  it('should hide modal when cerrarModalMercancia is called', () => {
    const hideModalSpy = jest.spyOn(AvisoComponent as any, 'hideModal');
    component.modalMercancia = { nativeElement: document.createElement('div') } as any;
    component.cerrarModalMercancia();
    expect(hideModalSpy).toHaveBeenCalledWith(component.modalMercancia);
  });

  it('should activate form validation and return true if form is valid', () => {
    component.avisoFormulario = new FormBuilder().group({
      test: ['test', []]
    });
    component.domicilioFormulario = new FormBuilder().group({
      test: ['test', []]
    });
    component.mercanciaFormulario = new FormBuilder().group({
      test: ['test', []]
    });
    
    const result = component.activarValidacionFormulario();
    expect(result).toBe(true);
  });

  it('should activate form validation and return false if form is invalid', () => {
    component.avisoFormulario = new FormBuilder().group({
      test: ['', [Validators.required]]
    });
    component.domicilioFormulario = new FormBuilder().group({
      test: ['test', []]
    });
    component.mercanciaFormulario = new FormBuilder().group({
      test: ['test', []]
    });
    
    const result = component.activarValidacionFormulario();
    expect(result).toBe(false);
  });

  it('should mark nested FormGroup controls as touched', () => {
    const nestedForm = new FormBuilder().group({
      nested: ['test']
    });
    const mainForm = new FormBuilder().group({
      main: ['test'],
      nestedGroup: nestedForm
    });
    
    component['marcarGrupoFormularioTocado'](mainForm);
    
    expect(mainForm.get('main')?.touched).toBe(true);
    expect(mainForm.get('nestedGroup')?.touched).toBe(true);
    expect(nestedForm.get('nested')?.touched).toBe(true);
  });

  it('should return required error message', () => {
    const form = new FormBuilder().group({
      test: ['', [Validators.required]]
    });
    form.get('test')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBe('Este campo es obligatorio.');
  });

  it('should return minlength error message', () => {
    const form = new FormBuilder().group({
      test: ['ab', [Validators.minLength(5)]]
    });
    form.get('test')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBe('Debe tener al menos 5 caracteres.');
  });

  it('should return maxlength error message', () => {
    const form = new FormBuilder().group({
      test: ['abcdefghijk', [Validators.maxLength(5)]]
    });
    form.get('test')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBe('No debe exceder 5 caracteres.');
  });

  it('should return max error message for cantidad field', () => {
    const form = new FormBuilder().group({
      cantidad: ['999999999999999', [Validators.max(999999999999.99)]]
    });
    form.get('cantidad')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'cantidad');
    expect(result).toBe('Por favor, escribe un valor menor a igual a 999999999999.99');
  });

  it('should return max error message for valorUSD field', () => {
    const form = new FormBuilder().group({
      valorUSD: ['999999999999999', [Validators.max(999999999999.99)]]
    });
    form.get('valorUSD')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'valorUSD');
    expect(result).toBe('Por favor, escribe un valor menor a igual a 999999999999.99');
  });

  it('should return max error message for other fields', () => {
    const form = new FormBuilder().group({
      other: ['100', [Validators.max(50)]]
    });
    form.get('other')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'other');
    expect(result).toBe('El valor debe ser menor o igual a 50.');
  });

  it('should return pattern error message', () => {
    const form = new FormBuilder().group({
      test: ['invalid', [Validators.pattern(/^[0-9]+$/)]]
    });
    form.get('test')?.markAsTouched();
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBe('El formato ingresado no es válido.');
  });

  it('should return generic error message for unknown errors', () => {
    const form = new FormBuilder().group({
      test: ['test']
    });
    form.get('test')?.markAsTouched();
    form.get('test')?.setErrors({ customError: true });
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBe('Este campo contiene errores.');
  });

  it('should return null if control is not touched or invalid', () => {
    const form = new FormBuilder().group({
      test: ['test']
    });
    
    const result = AvisoComponent.obtenerMensajeError(form, 'test');
    expect(result).toBeNull();
  });

  it('should return null if control does not exist', () => {
    const form = new FormBuilder().group({
      test: ['test']
    });
    
    const result = AvisoComponent.obtenerMensajeError(form, 'nonexistent');
    expect(result).toBeNull();
  });

  it('should open domicilio modal for modification with complete data', () => {
    const showModalSpy = jest.spyOn(AvisoComponent as any, 'showModal');
    component.modalDomicilio = { nativeElement: document.createElement('div') } as any;
    component.filaSeleccionadaLista = [{
      id: 1,
      rfc: 'TEST123',
      nombreComercial: 'Test',
      entidadFederativa: 'Estado',
      alcaldioOMuncipio: 'Municipio',
      colonia: 'Colonia'
    }];
    component.datosCompletosAvisos = {
      1: {
        rfc: 'TEST123',
        nombreComercial: 'Test',
        claveEntidadFederativa: 'Estado',
        claveDelegacionMunicipio: 'Municipio',
        claveColonia: 'Colonia',
        calle: 'Calle Test',
        numeroExterior: '123',
        numeroInterior: '456',
        codigoPostal: '12345'
      }
    };
    
    component.abiertoDomicilio(true);
    expect(showModalSpy).toHaveBeenCalledWith(component.modalDomicilio);
  });

  it('should open domicilio modal for modification without complete data', () => {
    const showModalSpy = jest.spyOn(AvisoComponent as any, 'showModal');
    component.modalDomicilio = { nativeElement: document.createElement('div') } as any;
    component.filaSeleccionadaLista = [{
      id: 1,
      rfc: 'TEST123',
      nombreComercial: 'Test',
      entidadFederativa: 'Estado',
      alcaldioOMuncipio: 'Municipio',
      colonia: 'Colonia'
    }];
    component.datosCompletosAvisos = {};
    
    component.abiertoDomicilio(true);
    expect(showModalSpy).toHaveBeenCalledWith(component.modalDomicilio);
  });

  it('should open domicilio modal for adding new record', () => {
    const showModalSpy = jest.spyOn(AvisoComponent as any, 'showModal');
    component.modalDomicilio = { nativeElement: document.createElement('div') } as any;
    
    component.abiertoDomicilio(false);
    expect(showModalSpy).toHaveBeenCalledWith(component.modalDomicilio);
  });

  it('should open mercancia modal for modification with complete data', () => {
    component.modalMercancia = { nativeElement: document.createElement('div') } as any;
    component.filaSeleccionadaMercanciaLista = [{
      id: 1,
      claveFraccionArancelaria: 'TEST123',
      nico: '01',
      cantidad: '10',
      claveUnidadMedida: 'KG',
      valorUSD: '100',
      numPedimentoExportacion: '123',
      numPedimentoImportacion: '456'
    }];
    component.datosCompletosMercancias = {
      1: {
        claveFraccionArancelaria: 'TEST123',
        nico: '01',
        cantidad: '10',
        claveUnidadMedida: 'KG',
        valorUSD: '100',
        descripcionMercancia: 'Descripción',
        descripcionProceso: 'Proceso',
        numPedimentoExportacion: '123',
        numPedimentoImportacion: '456'
      }
    };
    
    component.abiertoMercancia(true);
    expect(component.mostrarAlertaValidacionMercancia).toBe(false);
    expect(Modal).toHaveBeenCalled();
  });

  it('should open mercancia modal for modification without complete data', () => {
    component.modalMercancia = { nativeElement: document.createElement('div') } as any;
    component.filaSeleccionadaMercanciaLista = [{
      id: 1,
      claveFraccionArancelaria: 'TEST123',
      nico: '01',
      cantidad: '10',
      claveUnidadMedida: 'KG',
      valorUSD: '100',
      numPedimentoExportacion: '123',
      numPedimentoImportacion: '456'
    }];
    component.datosCompletosMercancias = {};
    
    component.abiertoMercancia(true);
    expect(component.mostrarAlertaValidacionMercancia).toBe(false);
    expect(Modal).toHaveBeenCalled();
  });

  it('should reset form when opening mercancia modal for adding', () => {
    component.modalMercancia = { nativeElement: document.createElement('div') } as any;
    component.mercanciaFormulario = new FormBuilder().group({
      test: ['test']
    });
    component.domicilioFormulario = new FormBuilder().group({
      rfc: ['test', Validators.required],
      nombreComercial: ['test', Validators.required]
    });
    const resetSpy = jest.spyOn(component.mercanciaFormulario, 'reset');
    
    component.abiertoMercancia(false);
    expect(resetSpy).toHaveBeenCalled();
    expect(Modal).toHaveBeenCalled();
  });

  it('should handle abiertoMercancia when modal element is not available', () => {
    component.modalMercancia = undefined as any;
    
    expect(() => component.abiertoMercancia(false)).not.toThrow();
  });

  it('should use window.bootstrap.Modal when available', () => {
    const mockBootstrapModal = jest.fn().mockImplementation(() => ({
      show: jest.fn()
    }));
    
    (window as any).bootstrap = {
      Modal: mockBootstrapModal
    };
    
    component.modalMercancia = { nativeElement: document.createElement('div') } as any;
    component.domicilioFormulario = new FormBuilder().group({
      rfc: ['test', Validators.required],
      nombreComercial: ['test', Validators.required]
    });
    component.abiertoMercancia(false);
    
    expect(Modal).toHaveBeenCalledWith(component.modalMercancia.nativeElement);
    
    delete (window as any).bootstrap;
  });

  it('should add test mercancia', () => {
    component.tablaDeMercancia.datos = [];
    
    component.pruebaAgregarMercancia();
    
    expect(component.tablaDeMercancia.datos.length).toBe(1);
    expect(component.tablaDeMercancia.datos[0].claveFraccionArancelaria).toBe('TEST123');
  });

  it('should show validation alert and mark fields as touched when mercancia form is invalid', () => {
    component.mercanciaFormulario = new FormBuilder().group({
      claveFraccionArancelaria: ['', [Validators.required]],
      nico: ['', [Validators.required]]
    });
    component.mostrarAlertaValidacionMercancia = false;
    
    component.agregarMercancia();
    
    expect(component.mercanciaFormulario.get('claveFraccionArancelaria')?.touched).toBe(true);
    expect(component.mercanciaFormulario.get('nico')?.touched).toBe(true);
  });

  it('should show validation alert and mark fields as touched when domicilio form is invalid', () => {
    component.domicilioFormulario = new FormBuilder().group({
      rfc: ['', [Validators.required]],
      claveEntidadFederativa: ['', [Validators.required]]
    });
    component.mostrarAlertaValidacionDomicilio = false;
    
    component.agregarDomicilio();
    
    expect(component.domicilioFormulario.get('rfc')?.touched).toBe(true);
    expect(component.domicilioFormulario.get('claveEntidadFederativa')?.touched).toBe(true);
  });

  it('should return early when eliminarMercancia is called with no selected items', () => {
    component.filaSeleccionadaMercanciaLista = [];
    
    component.eliminarMercancia();
    
    expect(component.elementoParaEliminar).toBeUndefined();
  });

  it('should return early when eliminarDomicilio is called with no selected items', () => {
    component.filaSeleccionadaLista = [];
    
    component.eliminarDomicilio();
    
    expect(component.elementoParaEliminar).toBeUndefined();
  });

  it('should not eliminate anything when eliminarPedimento is called with false', () => {
    component.tablaDeMercancia.datos = tablaDeMercancia;
    component.filaSeleccionadaMercanciaLista = [tablaDeMercancia[0]];
    
    component.eliminarPedimento(false);
    
    expect(component.tablaDeMercancia.datos.length).toBe(2);
  });


  it('should configure notification when eliminarModal is called', () => {
    component.eliminarModal();
    
    expect(component.nuevaNotificacion1).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    });
  });

  it('should call validacionesService.isValid', () => {
    const mockValidacionesService = {
      isValid: jest.fn().mockReturnValue(true)
    };
    (component as any).validacionesService = mockValidacionesService;
    
    const form = new FormBuilder().group({
      test: ['test']
    });
    
    const result = component.isValid(form, 'test');
    
    expect(mockValidacionesService.isValid).toHaveBeenCalledWith(form, 'test');
    expect(result).toBe(true);
  });

  it('should enable fields when tipo aviso is not inicial', () => {
    component.avisoFormulario = new FormBuilder().group({
      datosAviso: new FormBuilder().group({
        tipoAviso: ['modificacion'],
        idTransaccion: [''],
        motivoProrroga: ['']
      })
    });
    
    component.verificaTipoAviso();
    
    expect(component.avisoFormulario.get('datosAviso.idTransaccion')?.enabled).toBe(true);
    expect(component.avisoFormulario.get('datosAviso.motivoProrroga')?.enabled).toBe(true);
  });

  it('should handle error in showModal', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    (Modal as jest.MockedClass<typeof Modal>).mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    const mockElementRef = {
      nativeElement: document.createElement('div')
    } as any;
    
    (AvisoComponent as any).showModal(mockElementRef);
    
    expect(consoleSpy).toHaveBeenCalledWith('Error showing modal:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should handle error in hideModal', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockElementRef = {
      nativeElement: null
    } as any;
    
    (AvisoComponent as any).hideModal(mockElementRef);
    
    expect(consoleSpy).toHaveBeenCalledWith('Error hiding modal:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should successfully show modal', () => {
    const mockShow = jest.fn();
    const mockElement = document.createElement('div');
    const mockElementRef = {
      nativeElement: mockElement
    } as any;
    
    (Modal as jest.MockedClass<typeof Modal>).mockImplementation(() => ({
      show: mockShow,
      hide: jest.fn(),
      toggle: jest.fn(),
      dispose: jest.fn(),
    } as any));
    
    (AvisoComponent as any).showModal(mockElementRef);
    
    expect(Modal).toHaveBeenCalledWith(mockElement);
    expect(mockShow).toHaveBeenCalled();
  });

  it('should successfully hide modal', () => {
    const mockHide = jest.fn();
    const mockElement = document.createElement('div');
    const mockElementRef = {
      nativeElement: mockElement
    } as any;
    
    (Modal as any).getInstance = jest.fn().mockReturnValue(null);
    
    (Modal as jest.MockedClass<typeof Modal>).mockImplementation(() => ({
      show: jest.fn(),
      hide: mockHide,
      toggle: jest.fn(),
      dispose: jest.fn(),
    } as any));
    
    (AvisoComponent as any).hideModal(mockElementRef);
    
    expect(Modal).toHaveBeenCalledWith(mockElement);
    expect(mockHide).toHaveBeenCalled();
  });

  it('should subscribe to consultaioQuery on ngOnInit', () => {
    expect(component.soloLectura).toBe(false); 
  });

});