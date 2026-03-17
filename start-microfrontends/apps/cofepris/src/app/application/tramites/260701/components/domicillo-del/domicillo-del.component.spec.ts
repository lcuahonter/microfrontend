import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilloDelComponent } from './domicillo-del.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { CertificadosLicenciasService } from '../../services/certificados-licencias.service';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src/core/queries/consulta.query';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';

describe('DomicilloDelComponent', () => {
  let component: DomicilloDelComponent;
  let fixture: ComponentFixture<DomicilloDelComponent>;

  const mockSolicitudState = {
    codigoPostal: '12345',
    estado: 'Test State',
    muncipio: 'Test Municipio',
    localidad: 'Test Localidad',
    colonia: 'Test Colonia',
    calle: 'Test Calle',
    lada: '123',
    telefono: '4567890',
    avisoCheckbox: true,
    licenciaSanitaria: 'Test Licencia',
    marcarEnCasoDeQueSea: false,
    regimen: 'Test Regimen',
    aduanasEntradas: ['Aduana 1'],
    numeroPermiso: '123456',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilloDelComponent, ReactiveFormsModule,HttpClientTestingModule],
      providers: [
        {
          provide: Tramite260701Query,
          useValue: {
            selectSolicitud$: of(mockSolicitudState),
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: of({ readonly: false }),
          },
        },
        {
          provide: CertificadosLicenciasService,
          useValue: {
            getEstadoCatalogo: () => of({ data: [] }),
            getScianTablaDatos: () => of([]),
            getMercanciasTablaDatos: () => of([]),
            getListaClaveTablaDatos: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilloDelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const crossListMock = [
      { agregar: jest.fn(), quitar: jest.fn() }, // Primer CrosslistComponent
      { agregar: jest.fn(), quitar: jest.fn() }, // Segundo CrosslistComponent
      { agregar: jest.fn(), quitar: jest.fn() }, // Tercer CrosslistComponent (si lo necesitas)
    ];
    component.crossList = {
      toArray: () => crossListMock
    } as any;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los formularios en ngOnInit', () => {
    component.ngOnInit();
    expect(component.domicilio.value).toEqual({
      codigoPostal: '12345',
      estado: 'Test State',
      muncipio: 'Test Municipio',
      localidad: 'Test Localidad',
      colonia: 'Test Colonia',
      calle: 'Test Calle',
      lada: '123',
      telefono: '4567890',
      avisoCheckbox: true,
      licenciaSanitaria: 'Test Licencia',
      marcarEnCasoDeQueSea: false,
      regimen: 'Test Regimen',
      aduanasEntradas: ['Aduana 1'],
      numeroPermiso: '123456',
    });

    expect(component.formAgente.value).toEqual({
      claveScianModal: null,
      claveDescripcionModal: null
    });
  });

  it('debería alternar el estado colapsable', () => {
    component.colapsable = false;
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('debería llamar agregar("t") en el segundo CrosslistComponent cuando se hace clic en "Agregar todos"', () => {
    const crossListArray = component.crossList.toArray();
    component.paisDeProcedenciaBotonsDos[0].funcion();
    expect(crossListArray[1].agregar).toHaveBeenCalledWith('t');
  });
  
  it('debería llamar agregar("") en el segundo CrosslistComponent cuando se hace clic en "Agregar selección"', () => {
    const mockCrosslist = component.crossList.toArray()[1];
    component.paisDeProcedenciaBotonsDos[1].funcion();
    expect(mockCrosslist.agregar).toHaveBeenCalledWith('');
  });
  
  it('debería llamar quitar("") en el segundo CrosslistComponent cuando se hace clic en "Restar selección"', () => {
    const crossListArray = component.crossList.toArray();
    component.paisDeProcedenciaBotonsDos[2].funcion();
    expect(crossListArray[1].quitar).toHaveBeenCalledWith('');
  });
  

  it('debería alternar el estado colapsableDos', () => {
    expect(component.colapsableDos).toBe(false);
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(true);
    component.mostrar_colapsableDos();
    expect(component.colapsableDos).toBe(false);
  });

  it('debería alternar el estado colapsableTres', () => {
    expect(component.colapsableTres).toBe(false);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(false);
  });


  it('debería llamar crearFormularioDomicilio y establecer valores', () => {
    component.solicitudState = { codigoPostal: 'cp', estado: 'es', muncipio: 'mu', localidad: 'lo', colonia: 'co', calle: 'ca', lada: 'la', telefono: 'te', avisoCheckbox: false, licenciaSanitaria: 'li', marcarEnCasoDeQueSea: false, regimen: 're', aduanasEntradas: [], numeroPermiso: 'np' } as any;
    component.crearFormularioDomicilio();
    expect(component.domicilio.value.codigoPostal).toBe('cp');
  });

  it('debería llamar crearFormularioAgente y establecer valores', () => {
    component.solicitudState = { claveScianModal: 'scian', claveDescripcionModal: 'desc' } as any;
    component.crearFormularioAgente();
    expect(component.formAgente.value.claveScianModal).toBe('scian');
  });

  it('debería llamar crearFormularioMercancias y establecer valores', () => {
    component.solicitudState = { clasificacion: 'cl', especificarClasificacionProducto: 'ecp', denominacionEspecifica: 'de', denominacionDistintiva: 'dd', denominacionComun: 'dc', tipoDeProducto: 'tp', estadoFisico: 'ef', fraccionArancelaria: 'fa', descripcionFraccion: 'df', cantidadUMT: 1, UMT: 'umt', cantidadUMC: 2, UMC: 'umc', presentacion: 'pr', numeroRegistro: 'nr', fechaCaducidad: 'fc', claveDeLosLotes: 'cll' } as any;
    component.crearFormularioMercancias();
    expect(component.formMercancias.value.clasificacion).toBe('cl');
  });

  it('debería llamar guardarDatosFormulario y deshabilitar/habilitar formulario', async () => {
    component.inicializarFormulario = jest.fn();
    component.domicilio = { disable: jest.fn(), enable: jest.fn() } as any;
    component.esFormularioSoloLectura = true;
    await component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    component.esFormularioSoloLectura = false;
    await component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('debería llamar inicializarEstadoFormulario y manejar modo solo lectura', () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });
});
