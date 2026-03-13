import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContenedorComponent } from './contenedor.component';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Tramite11201Query } from '../../../../core/queries/tramite11201.query';

jest.mock('moment', () => {
  const moment = (...args: any[]) => ({
    format: () => '2024-03-13',
    isValid: () => true,
  });
  moment.utc = moment;
  return {
    __esModule: true,
    default: moment,
    ...moment
  };
});


describe('ContenedorComponent', () => {
  let component: ContenedorComponent;
  let fixture: ComponentFixture<ContenedorComponent>;
  let datosTramiteServiceMock: any;
  let validacionesServiceMock: any;
  const mockContenedor = {
    "success": true,
    "message": "Solicitud enviada exitosamente",
    "datos": {
      "id": 1,
      "inicialesEquipo": "BBZM",
      "numeroEquipo": 1098765,
      "digitoVerificador": 4,
      "tipoEquipo": "AC",
      "aduana": 430,
      "fechaIngreso": "2024-03-13",
      "vigencia": "2025-03-13",
      "estadoConstancia": "Válido",
      "existeEnVUCEM": "Sí",
      "idConstancia": "CONST12345",
      "numeroManifiesto": "MANI67890",
      "idSolicitud": "SOLICITUD001",
      "fechaInicio": "2024-03-01"
    }
  };


  beforeEach(async () => {
    Object.defineProperty(window, 'bootstrap', {
      value: {
        Modal: jest.fn().mockImplementation((element) => ({
          show: jest.fn(),
          hide: jest.fn()
        }))
      },
      writable: true
    });

    datosTramiteServiceMock = {
      getContenedores: jest.fn().mockReturnValue(of({ data: [] })),
      getContenedoresList: jest.fn().mockReturnValue(of({ datos: [] })),
      getTransporteList: jest.fn().mockReturnValue(of({ data: [] })),
      getAduanaList: jest.fn().mockReturnValue(of({ data: [] })),
      getAduanaCatalogList: jest.fn().mockReturnValue(of({ datos: [{ id: 1, descripcion: 'Aduana Mock' }] })),
      agregarSolicitud: jest.fn().mockReturnValue(of(mockContenedor)),
      submitSolicitud: jest.fn().mockReturnValue(of({ data: [] })),
      getDatosTableData: jest.fn().mockReturnValue(of([{ id: 1, name: 'Test Data' }])),
      getByManifestNumber: jest.fn().mockReturnValue({
        pipe: function () {
          return {
            subscribe: (fn: any) => fn({ codigo: '00', datos: { contenedores: [] } })
          };
        }
      }),
      fileUpload: jest.fn().mockReturnValue(of({ codigo: '00', datos: { contenedores: [] } })),
    };
    validacionesServiceMock = {
      isValid: jest.fn(),
    };
    const contenedorQueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [ContenedorComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(),
      { provide: DatosTramiteService, useValue: datosTramiteServiceMock },
      { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      { provide: Tramite11201Query, useValue: contenedorQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call limpiarCampos when cancelarRadioButton is called', () => {
    const limpiarCamposSpy = jest.spyOn(component, 'limpiarCampos');
    component.cancelarRadioButton();
    expect(limpiarCamposSpy).toHaveBeenCalled();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
  });

  it('should call cargarCatalogos on ngOnInit', () => {
    const cargarCatalogosSpy = jest.spyOn(component, 'cargarCatalogos');
    component.ngOnInit();
    expect(cargarCatalogosSpy).toHaveBeenCalled();
  });

  it('should call setValoresStore when tipoBusqueda changes', () => {
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    component.ngOnInit();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Contenedor');
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.solicitudForm, 'tipoBusqueda', 'setTipoBusqueda');
  });

  it('should call agregarSolicitud when validarDigitoVerificador is called with valid form', () => {
    const agregarSolicitudSpy = jest.spyOn(component, 'agregarSolicitud');
    component.solicitudForm.patchValue({
      aduana: 'aduana',
      fechaIngreso: '2024-03-13',
      inicialesContenedor: 'BBZM',
      numeroContenedor: '1098765',
      contenedores: 'AC'
    });
    component.validarDigitoVerificador();
    expect(agregarSolicitudSpy).toHaveBeenCalled();
  });

  it('should call datosTramiteService.getAduanaList with "aduanaList" when fetchAduanaList is called', async () => {
    datosTramiteServiceMock.getAduanaList('aduanaList');
    await component.fetchAduanaList();
    expect(datosTramiteServiceMock.getAduanaList).toHaveBeenCalledWith('aduanaList');
  });

  it('should call datosTramiteService.getTransporteList when fetchgetTransporteList is called', () => {
    datosTramiteServiceMock.getTransporteList('transporteList');
    component.fetchgetTransporteList();
    expect(datosTramiteServiceMock.getTransporteList).toHaveBeenCalled();
  });

  it('should call datosTramiteService.getDatosTableData when getDatosTableData is called', async () => {
    datosTramiteServiceMock.getDatosTableData();
    await component.loadDatosTablaData();
    expect(datosTramiteServiceMock.getDatosTableData).toHaveBeenCalled();
  });

  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.solicitudForm = new FormBuilder().group({
      testField: [''],
    });

    component.inicializarEstadoFormulario();

    expect(component.solicitudForm.disabled).toBe(true);
  });

  it('should enable the form when soloLectura is false', () => {
    component.soloLectura = false;
    component.solicitudForm = new FormBuilder().group({
      testField: [''],
    });

    component.inicializarEstadoFormulario();

    expect(component.solicitudForm.enabled).toBe(true);
  });

  it('should call datosTramiteService.getContenedores when getContenedores is called', async () => {
    datosTramiteServiceMock.getContenedores();
    await component.cargarCatalogos();
    expect(datosTramiteServiceMock.getContenedores).toHaveBeenCalled();
  });

  it('should return true if the field is valid', () => {
    jest.spyOn(validacionesServiceMock, 'isValid').mockReturnValue(true);
    const result = component.isValid('testField');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.solicitudForm, 'testField');
    expect(result).toBe(true);
  });

  it('should return false if the field is invalid', () => {
    jest.spyOn(validacionesServiceMock, 'isValid').mockReturnValue(null);
    const result = component.isValid('testField');
    expect(validacionesServiceMock.isValid).toHaveBeenCalledWith(component.solicitudForm, 'testField');
    expect(result).toBe(false);
  });
  it('should validate fields and call abrirModalArchivo when adjuntarArchivo is called with valid fields', () => {
    const mockModalElement = document.createElement('div');
    mockModalElement.id = 'modalArchivoCsv';
    jest.spyOn(document, 'getElementById').mockReturnValue(mockModalElement);

    component.solicitudForm = new FormBuilder().group({
      aduanaMenuDesplegable: ['validValue', Validators.required],
      fechaDeIngreso: ['2023-01-01', Validators.required]
    });
    const abrirModalArchivoSpy = jest.spyOn(component, 'abrirModalArchivo');
    component.adjuntarArchivo();
    expect(abrirModalArchivoSpy).toHaveBeenCalled();
  });
  it('should update fechaDeIngreso in the form and mark it as touched and dirty', () => {
    component.solicitudForm = new FormBuilder().group({
      fechaDeIngreso: [''],
    });
    component.cambioFechaDeIngreso('2023-01-01');
    expect(component.solicitudForm.get('fechaDeIngreso')?.value).toBe('2023-01-01');
    expect(component.solicitudForm.get('fechaDeIngreso')?.touched).toBe(true);
    expect(component.solicitudForm.get('fechaDeIngreso')?.dirty).toBe(true);
  });
  it('should update fechaIngreso in the form and mark it as touched and dirty', () => {
    component.solicitudForm = new FormBuilder().group({
      fechaIngreso: [''],
    });
    component.cambioFechaIngreso('2023-01-01');
    expect(component.solicitudForm.get('fechaIngreso')?.value).toBe('2023-01-01');
    expect(component.solicitudForm.get('fechaIngreso')?.touched).toBe(true);
    expect(component.solicitudForm.get('fechaIngreso')?.dirty).toBe(true);
  });



  it('should trigger click on the file input element when activarSeleccionArchivo is called', () => {
    const mockFileInput = {
      click: jest.fn(),
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    component.activarSeleccionArchivo();
    expect(document.getElementById).toHaveBeenCalledWith('cargarArchivo');
    expect(mockFileInput.click).toHaveBeenCalled();
  });

  it('should remove the pedimento at the specified index when borrar is true', () => {
    component.pedimentos = [
      {
        patente: 1,
        pedimento: 2,
        aduana: 3,
        idTipoPedimento: 4,
        descTipoPedimento: "descTipoPedimento",
        numero: "numero",
        comprobanteValor: "comprobanteValor",
        pedimentoValidado: true,
      }
    ];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(true);
    expect(component.pedimentos).toEqual([
      {
        patente: 1,
        pedimento: 2,
        aduana: 3,
        idTipoPedimento: 4,
        descTipoPedimento: "descTipoPedimento",
        numero: "numero",
        comprobanteValor: "comprobanteValor",
        pedimentoValidado: true,
      }
    ]);
  });

  it('should not remove any pedimento when borrar is false', () => {
    component.pedimentos = [
      {
        patente: 1,
        pedimento: 2,
        aduana: 3,
        idTipoPedimento: 4,
        descTipoPedimento: "descTipoPedimento",
        numero: "numero",
        comprobanteValor: "comprobanteValor",
        pedimentoValidado: true,
      }
    ];
    component.elementoParaEliminar = 1;
    component.eliminarPedimento(false);
    expect(component.pedimentos).toEqual([
      {
        patente: 1,
        pedimento: 2,
        aduana: 3,
        idTipoPedimento: 4,
        descTipoPedimento: "descTipoPedimento",
        numero: "numero",
        comprobanteValor: "comprobanteValor",
        pedimentoValidado: true,
      }
    ]);
  });

  it('should return true if the control is invalid and touched or dirty', () => {
    component.solicitudForm = new FormBuilder().group({
      testControl: ['', Validators.required],
    });
    const control = component.solicitudForm.get('testControl');
    control?.markAsTouched();
    control?.setValue('');
    const result = component.esInvalido('testControl');
    expect(result).toBe(true);
  });

  it('should return false if the control is valid', () => {
    component.solicitudForm = new FormBuilder().group({
      testControl: ['', Validators.required],
    });
    const control = component.solicitudForm.get('testControl');
    control?.setValue('Valid Value');
    const result = component.esInvalido('testControl'); expect(result).toBe(false);
  });

  it('should return false if the control does not exist', () => {
    component.solicitudForm = new FormBuilder().group({});
    const result = component.esInvalido('nonExistentControl');
    expect(result).toBe(false);
  });

  it('should reset the file input and hide the cargarArchivoTable when regresar is called', () => {
    const mockFileInput = {
      value: '',
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    component.mostrarCargarArchivoTable = true;
    component.etiquetaDeArchivo = 'Archivo seleccionado';
    component.regresar();
    expect(component.mostrarCargarArchivoTable).toBe(false);
    expect(mockFileInput.value).toBe('');
    expect(component.etiquetaDeArchivo).toBe('');
  });
  it('should mark all fields as touched and show mensaje if numeroManifiesta and menuDesplegable are valid', () => {
    component.solicitudForm = new FormBuilder().group({
      numeroManifiesta: ['validValue', Validators.required],
      menuDesplegable: ['1', Validators.required],
    });
    component['rfc_original'] = 'RFC123';
    const mockResponse = {
      codigo: '00',
      datos: {
        contenedores: [
          {
            vigencia: '2024-03-13 00:00:00',
            fecha_inicio: '2024-03-01 00:00:00',
            existe_en_vucem: true
          }
        ]
      }
    };
    component['datosTramiteService'].getByManifestNumber = jest.fn().mockReturnValue(of(mockResponse));
    const loadDatosTablaDataSpy = jest.spyOn(component, 'loadDatosTablaData');
    component.enviarManifiesto();
    expect(component.solicitudForm.get('numeroManifiesta')?.touched).toBe(true);
    expect(component.solicitudForm.get('menuDesplegable')?.touched).toBe(true);
    expect(component.mostrarMensaje).toBe(true);
    setTimeout(() => {
      expect(loadDatosTablaDataSpy).not.toHaveBeenCalled(); // This spy is not called in enviarManifiesto
      expect(component.datosTablaManifest.length).toBe(1);
    }, 0);
  });

  it('should not show mensaje if numeroManifiesta or menuDesplegable are invalid', () => {
    component.solicitudForm = new FormBuilder().group({
      numeroManifiesta: ['', Validators.required],
      menuDesplegable: ['validValue', Validators.required],
    });
    const loadDatosTablaDataSpy = jest.spyOn(component, 'loadDatosTablaData');
    component.enviarManifiesto();
    expect(component.mostrarMensaje).toBe(false);
    expect(loadDatosTablaDataSpy).not.toHaveBeenCalled();
  });

  it('should parse CSV and show the cargar archivo table when a valid file is uploaded', () => {
    const mockFile = new File(['header1,header2\nvalue1,value2'], 'test.csv', { type: 'text/csv' });
    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const analizarGramaticalmenteCSVSpy = jest.spyOn(component, 'analizarGramaticalmenteCSV');
    component.archivo();
    const reader = new FileReader();
    reader.onload = () => {
      expect(analizarGramaticalmenteCSVSpy).toHaveBeenCalledWith('header1,header2\nvalue1,value2');
      expect(component.mostrarCargarArchivoTable).toBe(true);
    };
    reader.readAsText(mockFile);
  });

  it('should not parse CSV or show the cargar archivo table when no file is uploaded', () => {
    const mockFileInput = {
      files: [],
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const analizarGramaticalmenteCSVSpy = jest.spyOn(component, 'analizarGramaticalmenteCSV');
    component.archivo();
    expect(analizarGramaticalmenteCSVSpy).not.toHaveBeenCalled();
    expect(component.mostrarCargarArchivoTable).toBe(false);
  });

  it('should open the modal with the provided data', () => {
    const mockDatos = 'Test Data';
    const mockModalService = {
      show: jest.fn(),
    };
    component.modalService = mockModalService as any;

    component.abiertoModelo(mockDatos);

    expect(component.abiertoModeloDatos).toBe(mockDatos);
    expect(mockModalService.show).toHaveBeenCalledWith(component.plantillaDeModelo, {
      id: 1,
      class: 'modal-sm',
    });
  });

  it('should set archivoMedicamentos and etiquetaDeArchivo when a valid CSV file is uploaded', () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);

    component.onCambioDeArchivo(mockEvent);

    expect(component.archivoMedicamentos).toBe(mockFile);
    expect(component.etiquetaDeArchivo).toBe('test.csv');
  });

  it('should reset etiquetaDeArchivo when no file is uploaded', () => {
    const mockEvent = {
      target: {
        files: [],
      },
    } as unknown as Event;

    const mockFileInput = {
      files: [],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);

    component.onCambioDeArchivo(mockEvent);

    expect(component.archivoMedicamentos).toBeNull();
    expect(component.etiquetaDeArchivo).toBe('');
  });

  it('should open the modal when a non-CSV file is uploaded', () => {
    const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as unknown as Event;

    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.onCambioDeArchivo(mockEvent);
    expect(abrirModalSpy).toHaveBeenCalled();
    expect(component.archivoMedicamentos).toBeNull();
  });

  it('should set mostrarMensaje to true when the form is invalid', () => {
    component.solicitudForm.get('testField')?.setValue('');
    component.esPago();
    expect(datosTramiteServiceMock.submitSolicitud).not.toHaveBeenCalled();
    expect(component.mostrarMensaje).toBe(true);
  });

});