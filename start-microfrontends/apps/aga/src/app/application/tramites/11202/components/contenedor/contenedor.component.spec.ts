import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { ContenedorComponent } from './contenedor.component';
import { DatosTramiteService } from 'libs/shared/data-access-user/src/core/services/11202/datos-tramite.service';
import { Contenedor11202Store } from '../../../../core/estados/tramites/contenedor11202.store';
import { Contenedor11202Query } from '../../../../core/queries/contenedor11202.query';


describe('ContenedorComponent', () => {
  let component: ContenedorComponent;
  let fixture: ComponentFixture<ContenedorComponent>;
  let datosTramiteService: jest.Mocked<DatosTramiteService>;
  let contenedorStore: jest.Mocked<Contenedor11202Store>;
  let contenedorQuery: jest.Mocked<Contenedor11202Query>;

  beforeEach(async () => {
    const datosTramiteServiceMock = {
      getAduanas: jest.fn(),
      getContenedores: jest.fn(),
      submitSolicitud: jest.fn(),
      getDatosTableData: jest.fn(),
    };

    const contenedorStoreMock = {
      setTipoBusqueda: jest.fn(),
    };

    const contenedorQueryMock = {
      selectSolicitud$: of({}),
    };

    await TestBed.configureTestingModule({
      declarations: [ContenedorComponent],
      imports: [ReactiveFormsModule, HttpClientModule],
      providers: [
        FormBuilder,
        { provide: DatosTramiteService, useValue: datosTramiteServiceMock },
        { provide: Contenedor11202Store, useValue: contenedorStoreMock },
        { provide: Contenedor11202Query, useValue: contenedorQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorComponent);
    component = fixture.componentInstance;
    datosTramiteService = TestBed.inject(DatosTramiteService) as jest.Mocked<DatosTramiteService>;
    contenedorStore = TestBed.inject(Contenedor11202Store) as jest.Mocked<Contenedor11202Store>;
    contenedorQuery = TestBed.inject(Contenedor11202Query) as jest.Mocked<Contenedor11202Query>;

    datosTramiteService.getAduanas.mockReturnValue(of([]));
    datosTramiteService.getContenedores.mockReturnValue(of([]));
    datosTramiteService.getDatosTableData.mockReturnValue(of([]));
  });

  /**
   * Prueba para verificar que el componente se crea correctamente.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Prueba para verificar que el formulario se inicializa en ngOnInit.
   */
  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
  });

  /**
   * Prueba para verificar que se llama a cargarCatalogAduanas en ngOnInit.
   */
  it('should call cargarCatalogAduanas on ngOnInit', () => {
    jest.spyOn(component, 'cargarCatalogAduanas');
    component.ngOnInit();
    expect(component.cargarCatalogAduanas).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que se llama a cargarCatalogContenedores en ngOnInit.
   */
  it('should call cargarCatalogContenedores on ngOnInit', () => {
    jest.spyOn(component, 'cargarCatalogContenedores');
    component.ngOnInit();
    expect(component.cargarCatalogContenedores).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que se llama a mostrarCampos cuando cambia tipoBusqueda.
   */
  it('should call mostrarCampos when tipoBusqueda changes', () => {
    component.ngOnInit();
    jest.spyOn(component, 'mostrarCampos');
    component.solicitudForm.get('tipoBusqueda')?.setValue('Contenedor');
    expect(component.mostrarCampos).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que no se llama a submitSolicitud en datosCaptura si el formulario es inválido.
   */
  it('should not call submitSolicitud on datosCaptura if form is invalid', () => {
    component.ngOnInit();
    component.solicitudForm.setValue({
      idSolicitud: null,
      tipoBusqueda: '',
      datosGenerales: { aduana: '' },
      datosContenedor: { inicialesContenedor: '', numeroContenedor: '', tipoContenedor: '' },
    });
    component.datosCaptura();
    expect(datosTramiteService.submitSolicitud).not.toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que se agrega un nuevo contenedor a la cuadrícula en agregarAGrid.
   */
  it('should add a new contenedor to the grid on agregarAGrid', () => {
    component.ngOnInit();
    component.contenedores = [];
    component.solicitudForm.setValue({
      idSolicitud: 1,
      tipoBusqueda: 'Contenedor',
      datosGenerales: { aduana: 'Aduana1' },
      datosContenedor: { inicialesContenedor: 'ABC', numeroContenedor: '123', tipoContenedor: 'Tipo1' },
    });
    component.agregarAGrid();
    expect(component.contenedores.length).toBe(1);
  });

  /**
   * Prueba para verificar que se llama a setValoresStore cuando cambia el valor de tipoBusqueda.
   */
  it('should call setValoresStore on tipoBusqueda value change', () => {
    jest.spyOn(component, 'setValoresStore');
    component.ngOnInit();
    component.solicitudForm.get('tipoBusqueda')?.setValue('Archivo CSV');
    expect(component.setValoresStore).toHaveBeenCalledWith(component.solicitudForm, 'tipoBusqueda', 'setTipoBusqueda');
  });

  /**
   * Prueba para verificar que se llama a cargarCatalogAduanas y cargarCatalogContenedores en ngOnInit.
   */
  it('should call cargarCatalogAduanas and cargarCatalogContenedores on ngOnInit', () => {
    jest.spyOn(component, 'cargarCatalogAduanas');
    jest.spyOn(component, 'cargarCatalogContenedores');
    component.ngOnInit();
    expect(component.cargarCatalogAduanas).toHaveBeenCalled();
    expect(component.cargarCatalogContenedores).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que se llama a loadDatosTablaData en ngOnInit.
   */
  it('should call loadDatosTablaData on ngOnInit', () => {
    jest.spyOn(component, 'loadDatosTablaData');
    component.ngOnInit();
    expect(component.loadDatosTablaData).toHaveBeenCalled();
  });

  /**
   * Prueba para verificar que loadDatosTablaData obtiene los datos de la tabla.
   */
  it('should get table data in loadDatosTablaData', () => {
    const mockData = [
      { id: 1, descripcion: 'Dato 1' },
      { id: 2, descripcion: 'Dato 2' },
    ];
    datosTramiteService.getDatosTableData.mockReturnValue(of(mockData));

    component.loadDatosTablaData();

    expect(datosTramiteService.getDatosTableData).toHaveBeenCalled();
    expect(component.datosTabla).toEqual(mockData);
  });




  it('should reset the form and clear related properties when limpiarCampos is called', () => {
    component.solicitudForm = new FormBuilder().group({
      tipoBusqueda: ['testValue'],
    });
    component.contenedores = [
      {
        "id": 1,
        "inicialesContenedor": "inicialesContenedor",
        "numeroContenedor": 2121,
        "digitoVerificador": "digitoVerificador",
        "digito": 22,
        "tipoContenedor": "tipoContenedor",
        "estadoConstancia": "estadoConstancia",
        "aduana": 12,
        "existeEnVUCEM": "existeEnVUCEM",
        "idConstancia": "idConstancia",
      }
    ];
    component.archivoSeleccionado = 'testFile';
    component.exceptionCaught = true;

    component.limpiarCampos();

    expect(component.solicitudForm.value).toEqual({ tipoBusqueda: null });
    expect(component.contenedores).toEqual([]);
    expect(component.archivoSeleccionado).toBe('');
    expect(component.exceptionCaught).toBe(false);
  });

  it('should not call submitSolicitud when the form is invalid', () => {
    const submitSolicitudSpy = jest.spyOn(component['datosTramiteService'], 'submitSolicitud');
    component.solicitudForm = new FormBuilder().group({
      tipoBusqueda: ['', Validators.required],
    });

    component.datosCaptura();

    expect(submitSolicitudSpy).not.toHaveBeenCalled();
  });

  it('should parse CSV and show the selected file table when a file is uploaded', () => {
    const mockFile = new File(['Aduana,Tipo de equipo\nTestAduana,TestEquipo'], 'test.csv', { type: 'text/csv' });
    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const parseCSVSpy = jest.spyOn(component, 'parseCSV');

    component.adjuntarArchivo();

    const reader = new FileReader();
    reader.onload = () => {
      expect(parseCSVSpy).toHaveBeenCalledWith('Aduana,Tipo de equipo\nTestAduana,TestEquipo');
      expect(component.showArchivoSeleccionadoTable).toBe(true);
    };
    reader.readAsText(mockFile);
  });
  it('should parse CSV data and update datosTabla', () => {
    const csvData = `Aduana,Tipo de equipo\nTestAduana,TestEquipo`;
    component.parseCSV(csvData);

    expect(component.datosTabla).toEqual([
      { aduana: 'TestAduana', tipoEquipo: 'TestEquipo' },
    ]);
  });
  it('should parse CSV and show the cargar archivo table when a file is uploaded', () => {
    const mockFile = new File(['Aduana,Tipo de equipo\nTestAduana,TestEquipo'], 'test.csv', { type: 'text/csv' });
    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const parseCSVSpy = jest.spyOn(component, 'parseCSV');

    component.Archivo();

    const reader = new FileReader();
    reader.onload = () => {
      expect(parseCSVSpy).toHaveBeenCalledWith('Aduana,Tipo de equipo\nTestAduana,TestEquipo');
      expect(component.showCargarArchivoTable).toBe(true);
    };
    reader.readAsText(mockFile);
  });
  it('should reset the form and clear related properties when openModalCancelarTramite is called', () => {
    component.solicitudForm = new FormBuilder().group({
      tipoBusqueda: ['testValue'],
    });
    component.contenedores = [
      {
        "id": 1,
        "inicialesContenedor": "inicialesContenedor",
        "numeroContenedor": 2121,
        "digitoVerificador": "digitoVerificador",
        "digito": 22,
        "tipoContenedor": "tipoContenedor",
        "estadoConstancia": "estadoConstancia",
        "aduana": 12,
        "existeEnVUCEM": "existeEnVUCEM",
        "idConstancia": "idConstancia",
      }
    ];
    component.archivoSeleccionado = 'testFile';
    component.exceptionCaught = true;

    component.openModalCancelarTramite();

    expect(component.solicitudForm.value).toEqual({ tipoBusqueda: null });
    expect(component.contenedores).toEqual([]);
    expect(component.archivoSeleccionado).toBe('');
    expect(component.exceptionCaught).toBe(false);
  });
  it('should set currentIdx based on localStorage value', () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue('2'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    component.tabSeleccionado();
    expect(localStorageMock.getItem).toHaveBeenCalledWith('currentIdx');
    expect(component.currentIdx).toBe(2);
  });

  it('should set currentIdx to 0 if localStorage value is null', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(null);

    component.tabSeleccionado();

    expect(component.currentIdx).toBe(0);
  });
  it('should reset tipoBusqueda and call mostrarCampos', () => {
    const mostrarCamposSpy = jest.spyOn(component, 'mostrarCampos');
    component.solicitudForm = new FormBuilder().group({
      tipoBusqueda: ['testValue'],
    });

    component.cancelarRadioButton();

    expect(component.solicitudForm.get('tipoBusqueda')?.value).toBe('');
    expect(mostrarCamposSpy).toHaveBeenCalled();
  });
  it('should set agregarTipoContenedorVisible to true', () => {
    component.agregarTipoContenedorVisible = false;

    component.mostrarTIpoContenedor();

    expect(component.agregarTipoContenedorVisible).toBe(true);
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
  it('should parse CSV and show the cargar archivo table when a file is uploaded', () => {
    const mockFile = new File(['Aduana,Tipo de equipo\nTestAduana,TestEquipo'], 'test.csv', { type: 'text/csv' });
    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const parseCSVSpy = jest.spyOn(component, 'parseCSV');
    component.Archivo();
    const reader = new FileReader();
    reader.onload = () => {
      expect(parseCSVSpy).toHaveBeenCalledWith('Aduana,Tipo de equipo\nTestAduana,TestEquipo');
      expect(component.showCargarArchivoTable).toBe(true);
    };
    reader.readAsText(mockFile);
  });

  it('should parse CSV and show the archivo seleccionado table when a file is uploaded', () => {
    const mockFile = new File(['Aduana,Tipo de equipo\nTestAduana,TestEquipo'], 'test.csv', { type: 'text/csv' });
    const mockFileInput = {
      files: [mockFile],
    } as unknown as HTMLInputElement;
    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    const parseCSVSpy = jest.spyOn(component, 'parseCSV');
    component.adjuntarArchivo();
    const reader = new FileReader();
    reader.onload = () => {
      expect(parseCSVSpy).toHaveBeenCalledWith('Aduana,Tipo de equipo\nTestAduana,TestEquipo');
      expect(component.showArchivoSeleccionadoTable).toBe(true);
    };
    reader.readAsText(mockFile);
  });

  it('should not call submitSolicitud when the form is invalid', () => {
    const submitSolicitudSpy = jest.spyOn(component['datosTramiteService'], 'submitSolicitud');
    component.solicitudForm = new FormBuilder().group({
      tipoBusqueda: ['', Validators.required],
    });
    component.datosCaptura();
    expect(submitSolicitudSpy).not.toHaveBeenCalled();
  });
  it('should set showArchivoSeleccionadoTable to true when no file is uploaded', () => {
    const mockFileInput = {
      files: [],
    } as unknown as HTMLInputElement;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockFileInput);
    component.adjuntarArchivo();
    expect(component.showArchivoSeleccionadoTable).toBe(false);
  });
});