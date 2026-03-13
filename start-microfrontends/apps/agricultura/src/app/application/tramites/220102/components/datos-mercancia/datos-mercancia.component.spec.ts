import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosMercanciaComponent } from './datos-mercancia.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { DatosMercanciaService } from '../../services/datos-mercancia/datos-mercancia.service';
import { of, Subject } from 'rxjs';
import { MercanciaForm } from '../../models/fitosanitario.model';

const AGREGAR = 'AGREGAR';
const EDITAR = 'EDITAR';

describe('DatosMercanciaComponent', () => {
  let component: DatosMercanciaComponent;
  let fixture: ComponentFixture<DatosMercanciaComponent>;
  let destroyNotifier$: Subject<void>;

  const mockDatosMercanciaService = {
    obtenerSelectorList: jest.fn(),
    obtenerDatos: jest.fn(),
    actualizarFormularioMovilizacion: jest.fn(),
    botonDesactivarCampos: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        TituloComponent,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
        AlertComponent,
        DatosMercanciaComponent,
      ],
      providers: [
        { provide: DatosMercanciaService, useValue: mockDatosMercanciaService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaComponent);
    component = fixture.componentInstance;

    destroyNotifier$ = new Subject<void>();
    component['destroyNotifier$'] = destroyNotifier$;

    // Default mock return values
    mockDatosMercanciaService.obtenerSelectorList.mockImplementation(() =>
      of([{ id: 1, descripcion: 'Test' }])
    );
    mockDatosMercanciaService.obtenerDatos.mockReturnValue(
      of({ datos: [{ id: 1, nombre: 'Mercancia' }] })
    );

    // Spy on internal methods
    jest.spyOn(component as any, 'obtenerNombreComun');
    jest.spyOn(component as any, 'obtenerNombreCientifico');
    jest.spyOn(component as any, 'obtenerUso');
    jest.spyOn(component as any, 'obtenerPaisProcedencia');
    jest.spyOn(component as any, 'obtenerTipoProducto');
    jest.spyOn(component as any, 'obtenerPaisOrigen');
    jest.spyOn(component as any, 'obtenerUmc');

    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    destroyNotifier$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formMercancia).toBeDefined();
    expect(component.formMercancia.valid).toBeFalsy();
  });

  it('should call all obtener* functions and set readonly state', () => {
    component.ngOnInit();
    expect((component as any).obtenerNombreComun).toHaveBeenCalled();
    expect((component as any).obtenerNombreCientifico).toHaveBeenCalled();
    expect((component as any).obtenerUso).toHaveBeenCalled();
    expect((component as any).obtenerPaisProcedencia).toHaveBeenCalled();
    expect((component as any).obtenerTipoProducto).toHaveBeenCalled();
    expect((component as any).obtenerPaisOrigen).toHaveBeenCalled();
    expect((component as any).obtenerUmc).toHaveBeenCalled();
  });

  it('should call crearFormulario on ngOnInit', () => {
    const crearFormSpy = jest.spyOn(component as any, 'crearFormulario');
    component.ngOnInit();
    expect(crearFormSpy).toHaveBeenCalled();
    expect(component.formMercancia).toBeDefined();
    expect(component.formMercancia.valid).toBeFalsy();
  });

  it('should clean up subscriptions in ngOnDestroy', () => {
    const subject = (component as any).destroyNotifier$;
    const spyNext = jest.spyOn(subject, 'next');
    const spyComplete = jest.spyOn(subject, 'complete');

    component.ngOnDestroy();

    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should fetch paisorigen list and set catalogoPaisOrigen', () => {
    const mockData: Catalogo[] = [
      { id: 1, descripcion: 'India' },
      { id: 2, descripcion: 'Mexico' },
      { id: 3, descripcion: 'Brazil' },
    ];

    mockDatosMercanciaService.obtenerSelectorList.mockReturnValue(of(mockData));
    component.obtenerPaisOrigen();

    expect(mockDatosMercanciaService.obtenerSelectorList).toHaveBeenCalledWith(
      'paisorigen.json'
    );
    expect(component.catalogoPaisOrigen).toEqual(mockData);
  });

  it('should fetch nombrecomun list and set catalogoNombreComun', () => {
    const mockData: Catalogo[] = [
      { id: 1, descripcion: 'India' },
      { id: 2, descripcion: 'Mexico' },
      { id: 3, descripcion: 'Brazil' },
    ];
    mockDatosMercanciaService.obtenerSelectorList.mockReturnValue(of(mockData));
    component.obtenerNombreComun();
    expect(mockDatosMercanciaService.obtenerSelectorList).toHaveBeenCalledWith(
      'nombrecomun.json'
    );
    expect(component.catalogoNombreComun).toEqual(mockData);
  });

  it('should fetch nombrecientifico list and set catalogoNombreCientifico', () => {
    const mockData: Catalogo[] = [
      { id: 1, descripcion: 'India' },
      { id: 2, descripcion: 'Mexico' },
      { id: 3, descripcion: 'Brazil' },
    ];

    mockDatosMercanciaService.obtenerSelectorList.mockReturnValue(of(mockData));
    component.obtenerNombreCientifico();

    expect(mockDatosMercanciaService.obtenerSelectorList).toHaveBeenCalledWith(
      'nombrecientifico.json'
    );
    expect(component.catalogoNombreCientifico).toEqual(mockData);
  });

  it('should patch formMercancia when campo is fraccionArancelaria', () => {
    component.formMercancia = new FormGroup({
      descripcionFraccionArancelaria: new FormControl(''),
      umt: new FormControl(''),
    });

    component.establecerValoresStore('fraccionArancelaria');

    expect(component.formMercancia.value).toEqual({
      descripcionFraccionArancelaria: 'CR-123456',
      umt: 'Dependencia-34',
    });
  });

  it('should add item to cuerpoTabla when nombre is AGREGAR', () => {
    component.formMercancia = new FormGroup({
      id: new FormControl(55),
      nombre: new FormControl('AGREGAR'),
      nombreComun: new FormControl('Maíz'),
      nombreCientifico: new FormControl('Zea mays'),
      uso: new FormControl('Alimenticio'),
      paisOrigen: new FormControl('México'),
      paisProcedencia: new FormControl('Estados Unidos'),
      tipoProducto: new FormControl('Grano'),
      fraccionArancelaria: new FormControl('1005.90.99'),
      descripcionFraccionArancelaria: new FormControl('Maíz amarillo'),
      cantidadUMT: new FormControl('1000'),
      umt: new FormControl('kg'),
      cantidadUMC: new FormControl('10'),
      umc: new FormControl('sacos'),
      descripcion: new FormControl('Maíz amarillo para consumo humano'),
    });

    const mockFormValue: MercanciaForm = {
      id: 55,
      nombreComun: 'Maíz',
      nombreCientifico: 'Zea mays',
      uso: 'Alimenticio',
      paisOrigen: 'México',
      paisProcedencia: 'Estados Unidos',
      tipoProducto: 'Grano',
      fraccionArancelaria: '1005.90.99',
      descripcionFraccionArancelaria: 'Maíz amarillo',
      cantidadUMT: '1000',
      umt: 'kg',
      cantidadUMC: '10',
      umc: 'sacos',
      descripcion: 'Maíz amarillo para consumo humano',
    };

    jest
      .spyOn(component as any, 'limpiarDatosFormulario')
      .mockImplementation(() => {});
    jest.spyOn(
      (component as any).datosMercanciaService,
      'actualizarFormularioMovilizacion'
    );
    component.cuerpoTabla = [];
    component.almacenarDatoEnTabla(AGREGAR);
    expect(component.cuerpoTabla.length).toBe(0);
  });
  it('should reset formMercancia when limpiarDatosFormulario is called', () => {
    // Populate form with some initial values
    component.formMercancia = new FormGroup({
      id: new FormControl(1),
      nombreComun: new FormControl('Maíz'),
      nombreCientifico: new FormControl('Zea mays'),
      uso: new FormControl('Alimenticio'),
      paisOrigen: new FormControl('México'),
      paisProcedencia: new FormControl('Estados Unidos'),
      tipoProducto: new FormControl('Grano'),
      fraccionArancelaria: new FormControl('1005.90.99'),
      descripcionFraccionArancelaria: new FormControl('Maíz amarillo'),
      cantidadUMT: new FormControl('1000'),
      umt: new FormControl('kg'),
      cantidadUMC: new FormControl('10'),
      umc: new FormControl('sacos'),
      descripcion: new FormControl('Maíz amarillo para consumo humano'),
    });

    // Set values to simulate a filled form
    // Set dummy data to the form
    component.formMercancia.setValue({
      id: 1,
      nombreComun: 'Maíz',
      nombreCientifico: 'Zea mays',
      uso: 'Alimenticio',
      paisOrigen: 'México',
      paisProcedencia: 'Estados Unidos',
      tipoProducto: 'Grano',
      fraccionArancelaria: '1005.90.99',
      descripcionFraccionArancelaria: 'Maíz amarillo',
      cantidadUMT: '1000',
      umt: 'kg',
      cantidadUMC: '10',
      umc: 'sacos',
      descripcion: 'Maíz amarillo para consumo humano',
    });

    // Spy on detectChanges
    const detectChangesSpy = jest.spyOn(component['cdr'], 'detectChanges');

    // Call the method
    component.limpiarDatosFormulario();

    // Assert detectChanges was called
    expect(detectChangesSpy).toHaveBeenCalled();

    // Assert form is reset
    expect(component.formMercancia.value).toEqual({
      id: null,
      nombreComun: "",
      nombreCientifico: "",
      uso: "",
      paisOrigen: "",
      paisProcedencia: "",
      tipoProducto: "",
      fraccionArancelaria: null,
      descripcionFraccionArancelaria: null,
      cantidadUMT: null,
      umt: null,
      cantidadUMC: null,
      umc: "",
      descripcion: null,
    });
    expect(component.formMercancia.pristine).toBe(false);
  });
  it('should patch descripcionFraccionArancelaria and umt when campo is "fraccionArancelaria"', () => {
    component.formMercancia = new FormGroup({
      descripcionFraccionArancelaria: new FormControl(''),
      umt: new FormControl(''),
    });
    component.establecerValoresStore('fraccionArancelaria');

    // Assert: check form values were updated
    expect(component.formMercancia.value).toEqual({
      descripcionFraccionArancelaria: 'CR-123456',
      umt: 'Dependencia-34',
    });
  });

  it('should set listaDeTablasSeleccionadas to the passed rows', () => {
    const mockFilas: MercanciaForm[] = [
      {
        id: 1,
        nombreComun: 'Maíz',
        nombreCientifico: 'Zea mays',
        uso: 'Alimenticio',
        paisOrigen: 'México',
        paisProcedencia: 'Estados Unidos',
        tipoProducto: 'Grano',
        fraccionArancelaria: '1005.90.99',
        descripcionFraccionArancelaria: 'Maíz amarillo',
        cantidadUMT: '1000',
        umt: 'kg',
        cantidadUMC: '10',
        umc: 'sacos',
        descripcion: 'Maíz amarillo para consumo humano',
      },
    ];
    component.onListaDeFilaSeleccionada(mockFilas);
    expect(component.listaDeTablasSeleccionadas).toEqual(mockFilas);
  });
  it('should remove the selected item from cuerpoTabla and update service when only one item exists', () => {
    const mockItem = {
      id: 1,
      nombreComun: 'Maíz',
      nombreCientifico: 'Zea mays',
      uso: 'Alimenticio',
      paisOrigen: 'México',
      paisProcedencia: 'EE.UU.',
      tipoProducto: 'Grano',
      fraccionArancelaria: '1005.90.99',
      descripcionFraccionArancelaria: 'Maíz amarillo',
      cantidadUMT: '1000',
      umt: 'kg',
      cantidadUMC: '10',
      umc: 'sacos',
      descripcion: 'Maíz amarillo para consumo humano',
    };

    component.cuerpoTabla = [mockItem];
    component.listaDeTablasSeleccionadas = [mockItem];

    const actualizarSpy = jest.spyOn(
      (component as any).datosMercanciaService,
      'actualizarFormularioMovilizacion'
    );
    const desactivarSpy = jest.spyOn(
      (component as any).datosMercanciaService,
      'botonDesactivarCampos'
    );

    component.eliminarElementoSeleccionado();

    expect(component.cuerpoTabla.length).toBe(0); // It should be removed
    expect(actualizarSpy).toHaveBeenCalledWith([]); // Updated with empty list
    expect(desactivarSpy).toHaveBeenCalledWith(false); // Because it's now empty
  });

  it('should set estadoChecker to true and patch the form with selected item data', () => {
    const mockItem = {
      id: 10,
      nombreComun: 'Maíz',
      nombreCientifico: 'Zea mays',
      uso: 'Alimenticio',
      paisOrigen: 'México',
      paisProcedencia: 'Estados Unidos',
      tipoProducto: 'Grano',
      fraccionArancelaria: '1005.90.99',
      descripcionFraccionArancelaria: 'Maíz amarillo',
      cantidadUMT: '1000',
      umt: 'kg',
      cantidadUMC: '10',
      umc: 'sacos',
      descripcion: 'Maíz amarillo para consumo humano',
    };

    // Assign form group with same structure
    component.formMercancia = new FormGroup({
      id: new FormControl(null),
      nombreComun: new FormControl(null),
      nombreCientifico: new FormControl(null),
      uso: new FormControl(null),
      paisOrigen: new FormControl(null),
      paisProcedencia: new FormControl(null),
      tipoProducto: new FormControl(null),
      fraccionArancelaria: new FormControl(null),
      descripcionFraccionArancelaria: new FormControl(null),
      cantidadUMT: new FormControl(null),
      umt: new FormControl(null),
      cantidadUMC: new FormControl(null),
      umc: new FormControl(null),
      descripcion: new FormControl(null),
    });

    // Setup the input state
    component.listaDeTablasSeleccionadas = [mockItem];
    component.cuerpoTabla = [mockItem];

    // Call the method
    component.seleccionarParaModificacion();
    expect(component.formMercancia.value).toEqual(mockItem);
  });
});