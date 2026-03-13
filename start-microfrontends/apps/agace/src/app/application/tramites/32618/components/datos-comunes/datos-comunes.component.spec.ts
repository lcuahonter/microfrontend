import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { DatosComunesComponent } from './datos-comunes.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SolicitudStore} from '../../estados/solicitud.store';
import { SolicitudeService } from '../../services/solicitude.service';
import { SolicitudQuery } from '../../estados/solicitud.query';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TablaConEntradaComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { MiembroDeLaEmpresaComponent } from '../miembro-de-la-empresa/miembro-de-la-empresa.component';
import { SeccionSubcontratadosComponent } from '../seccion-subcontratados/seccion-subcontratados.component';
import { InstalacionesPrincipalesComponent } from '../instalaciones-principales/instalaciones-principales.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Domicilios,
  EnlaceOperativo,
  NumeroDeEmpleados,
  SeccionSociosIC,
} from '../../models/solicitud.model';

describe('DatosComunesComponent', () => {
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let solicitudServiceMock: jest.Mocked<SolicitudeService>;
  let solicitud32605StoreMock: jest.Mocked<SolicitudStore>;
  let solicitud32605QueryMock: jest.Mocked<SolicitudQuery>;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirOpcionDeRadio: jest.fn(() =>
        of({
          requisitos: {
            radioOptions: [
              {
                label: 'Sí',
                value: 1,
              },
              {
                label: 'No',
                value: 2,
              },
            ],
            isRequired: true,
          },
          reconocimientoMutuo: {
            radioOptions: [
              {
                label: 'Sí Autorizo',
                value: 1,
              },
              {
                label: 'No Autorizo',
                value: 2,
              },
            ],
            isRequired: true,
          },
          clasificacionInformacion: {
            radioOptions: [
              {
                label: 'Pública',
                value: 1,
              },
              {
                label: 'Privada',
                value: 2,
              },
            ],
            isRequired: true,
          },
        })
      ),
      conseguirSolicitudCatologoSelectLista: jest.fn(() =>
        of({
          sectorProductivo: {
            labelNombre: 'Sector Productivo',
            required: false,
            primerOpcion: 'Seleccione un valor',
            catalogos: [
              {
                id: 1,
                descripcion: 'Bordado o impresión de prendas',
              },
              {
                id: 2,
                descripcion: 'Bordado o impresión de prendas -n1',
              },
            ],
          },
          servicio: {
            labelNombre: 'Servicio',
            required: false,
            primerOpcion: 'Seleccione un valor',
            catalogos: [
              {
                id: 1,
                descripcion: 'Bordado o impresión de prendas',
              },
              {
                id: 2,
                descripcion: 'Bordado o impresión de prendas -n1',
              },
            ],
          },
          bimestre: {
            labelNombre: 'Bimestre',
            required: false,
            primerOpcion: 'Seleccione un valor',
            catalogos: [
              {
                id: 1,
                descripcion: 'Marzo-Abril',
              },
              {
                id: 2,
                descripcion: 'Marzo-Abril-1',
              },
            ],
          },
          indiqueTodos: {
            labelNombre: '',
            required: false,
            primerOpcion: 'Seleccione un valor',
            catalogos: [
              {
                id: 1,
                descripcion: 'Domicilios registrados',
              },
              {
                id: 2,
                descripcion: '42025 - Autorización Programa Nuevo Industrial',
              },
            ],
          },
          enSuCaracterDe: {
            labelNombre: 'En su caracter de',
            required: true,
            primerOpcion: 'Selecciona un tipo',
            catalogos: [
              {
                id: 1,
                descripcion: 'Accionista',
              },
              {
                id: 2,
                descripcion: 'Accionista - 1',
              },
            ],
          },
          nacionalidad: {
            labelNombre: 'Nacionalidad',
            required: true,
            primerOpcion: 'Selecciona un tipo',
            catalogos: [
              {
                id: 1,
                descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI)',
              },
              {
                id: 2,
                descripcion: 'AZERBAIJAN (REPUBLICA AZERBAIJANI) - 1',
              },
            ],
          },
          tipoDePersona: {
            labelNombre: 'Tipo de Persona',
            required: true,
            primerOpcion: 'Selecciona un tipo',
            catalogos: [
              {
                id: 1,
                descripcion: 'Física',
              },
              {
                id: 2,
                descripcion: 'Moral',
              },
            ],
          },
          tipoDeInstalacion: {
            labelNombre: 'Tipo de instalación',
            required: true,
            primerOpcion: 'Selecciona un tipo',
            catalogos: [
              {
                id: 1,
                descripcion: 'Test 1',
              },
              {
                id: 2,
                descripcion: 'Test 2',
              },
            ],
          },
        })
      ),
      conseguirInventarios: jest.fn(() =>
        of([
          {
            nombre: 'Nombre prueba1',
            lugarRadicacion: 'Mexíco',
            anexo24: '',
          },
        ])
      ),
    } as unknown as jest.Mocked<SolicitudeService>;

    solicitud32605StoreMock = {
      actualizarListaSeccionSociosIC: jest.fn(() => of([])),
      actualizarNumeroDeEmpleadosLista: jest.fn(() => of([])),
      actualizarDomiciliosDatos: jest.fn(() => of([])),
      actualizarCatseleccionados: jest.fn(() => of([])),
      actualizarServicio: jest.fn(() => of([])),
      actualizar190: jest.fn(() => of(1)),
      actualizar191: jest.fn(() => of(1)),
      actualizar199: jest.fn(() => of(1)),
      actualizarEmpleados: jest.fn(() => of('Test')),
      actualizarBimestre: jest.fn(() => of(1)),
      actualizar2034: jest.fn(() => of(1)),
      actualizar236: jest.fn(() => of(1)),
      actualizar237: jest.fn(() => of(1)),
      actualizar239: jest.fn(() => of(1)),
      actualizar240: jest.fn(() => of(1)),
      actualizar243: jest.fn(() => of(1)),
      actualizar244: jest.fn(() => of(1)),
      actualizar245: jest.fn(() => of(1)),
      actualizarIndiqueTodos: jest.fn(() => of('test')),
      actualizar246: jest.fn(() => of(1)),
      actualizarFile1: jest.fn(() => of('test')),
      actualizarFile2: jest.fn(() => of('test')),
      actualizar247: jest.fn(() => of(1)),
      actualizar248: jest.fn(() => of(1)),
      actualizarIdentificacion: jest.fn(() => of('test')),
      actualizarLugarDeRadicacion: jest.fn(() => of('test')),
      actualizar249: jest.fn(() => of(1)),
      actualizar250: jest.fn(() => of(1)),
      actualizar251: jest.fn(() => of(1)),
      actualizarCheckbox1: jest.fn(() => of(true)),
      actualizarCheckbox2: jest.fn(() => of(true)),
      actualizarCheckbox3: jest.fn(() => of(true)),
      actualizarActualmente2: jest.fn(() => of('test')),
      actualizarActualmente1: jest.fn(() => of('test')),
    } as unknown as jest.Mocked<SolicitudStore>;

    solicitud32605QueryMock = {
      selectSolicitud$: of({
        idPersonaSolicitud: '',
        rfcTercero: '',
        rfc: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        correoElectronico: '',

        agregarEnlaceRfcTercero: '',
        agregarEnlaceRfc: '',
        agregarEnlaceNombre: '',
        agregarEnlaceApellidoPaterno: '',
        agregarEnlaceApellidoMaterno: '',
        agregarEnlaceCiudadEstado: '',
        agregarEnlaceCargo: '',
        agregarEnlaceTelefono: '',
        agregarEnlaceCorreoElectronico: '',
        agregarEnlaceSuplente: false,

        '2089': 0,
        '2090': 0,
        '2091': 0,

        '2042': 0,
        '2043': 0,
        '2044': 0,
        fechaInicioComercio: '',
        fechaPago: '',
        monto: '',
        operacionesBancarias: '',
        llavePago: '',

        transportistaRFC: '',
        transportistaRFCModifTrans: '',
        transportistaRazonSocial: '',
        transportistaDomicilio: '',
        transportistaCaat: '',
        transportistaIdDomicilio: '',
        transportistaIdRFC: '',
        transportistaIdRazonSocial: '',
        transportistaIdCaat: '',

        miembroCaracterDe: '',
        miembroTributarMexico: 0,
        miembroNacionalidad: '',
        miembroRfc: '',
        miembroRegistroFederal: '',
        miembroNombreCompleto: '',
        miembroTipoPersonaMuestra: '',
        miembroNombre: '',
        miembroApellidoPaterno: '',
        miembroApellidoMaterno: '',
        miembroNombreEmpresa: '',

        subcontrataRFCBusqueda: '',
        subcontrataRFC: '',
        subcontrataRazonSocial: '',
        subcontrataEmpleados: '',
        subcontrataBimestre: 0,

        principales: 0,
        municipio: '',
        tipoDeInstalacion: 0,
        entidadFederativa: '',
        registroSESAT: '',
        descripcion: '',
        codigoPostal: '',
        procesoProductivo: 0,
        goceDelInmueble: 0,
        empresa: 0,
        comercioExterior: 0,
        mutuo: 0,

        catseleccionados: 0,
        servicio: 0,
        '190': 0,
        '191': 0,
        '199': 0,
        empleados: '',
        bimestre: 0,
        '2034': 0,
        '236': 0,
        '237': 0,
        '238': 0,
        '239': 0,
        '240': 0,
        '243': 0,
        '244': 0,
        '245': 0,
        indiqueTodos: 0,
        '246': 0,
        file1: '',
        file2: '',
        '247': 0,
        '248': 0,
        identificacion: '',
        lugarDeRadicacion: '',
        '249': 0,
        '250': 0,
        '251': 0,
        checkbox1: false,
        checkbox2: false,
        checkbox3: false,
        actualmente2: '',
        actualmente1: '',
        numeroDeEmpleadosLista: [] as NumeroDeEmpleados[],
        domiciliosDatos: [] as Domicilios[],
        listaSeccionSociosIC: [] as SeccionSociosIC[],
        enlaceOperativosLista: [] as EnlaceOperativo[],
      }),
    } as jest.Mocked<SolicitudQuery>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        InputRadioComponent,
        TituloComponent,
        TablaDinamicaComponent,
        MiembroDeLaEmpresaComponent,
        NotificacionesComponent,
        SeccionSubcontratadosComponent,
        InstalacionesPrincipalesComponent,
        TablaConEntradaComponent,
        ToastrModule,
        DatosComunesComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudeService, useValue: solicitudServiceMock },
        { provide: SolicitudStore, useValue: solicitud32605StoreMock },
        { provide: SolicitudQuery, useValue: solicitud32605QueryMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.datosComunesForm).toBeDefined();
    expect(
      component.datosComunesForm.controls['catseleccionados']
    ).toBeDefined();
    expect(component.datosComunesForm.controls['servicio']).toBeDefined();
  });

  it('should call conseguirOpcionDeRadio on initialization', () => {
    jest.spyOn(solicitudServiceMock, 'conseguirOpcionDeRadio');
    solicitudServiceMock.conseguirOpcionDeRadio();
    expect(solicitudServiceMock.conseguirOpcionDeRadio).toHaveBeenCalled();
  });

  it('should call conseguirSolicitudCatologoSelectLista on initialization', fakeAsync(() => {
    jest.spyOn(solicitudServiceMock, 'conseguirSolicitudCatologoSelectLista');
    solicitudServiceMock.conseguirSolicitudCatologoSelectLista();
    expect(
      solicitudServiceMock.conseguirSolicitudCatologoSelectLista
    ).toHaveBeenCalled();
  }));

  it('should call conseguirInventarios on initialization', () => {
    jest.spyOn(solicitudServiceMock, 'conseguirInventarios');
    solicitudServiceMock.conseguirInventarios();
    expect(solicitudServiceMock.conseguirInventarios).toHaveBeenCalled();
  });

  it('should update listaSeccionSociosIC when eventoActualizarMiembro is called', () => {
    const mockEvent = { nombre: 'Test Socio' } as any;
    component.eventoActualizarMiembro(mockEvent);
    expect(component.listaSeccionSociosIC).toContain(mockEvent);
    expect(
      solicitud32605StoreMock.actualizarListaSeccionSociosIC
    ).toHaveBeenCalledWith(component.listaSeccionSociosIC);
  });

  it('should update domiciliosDatos when instalacionesPrincipales is called', () => {
    const mockDomicilio = { tipoInstalacion: 'Test Instalacion' } as any;
    component.instalacionesPrincipales(mockDomicilio);
    expect(component.domiciliosDatos).toContain(mockDomicilio);
    expect(
      solicitud32605StoreMock.actualizarDomiciliosDatos
    ).toHaveBeenCalledWith(component.domiciliosDatos);
  });

  it('should update numeroDeEmpleadosLista when seccionSubcontratados is called', () => {
    const mockEmpleado = { numeroDeEmpleados: 10 } as any;
    component.seccionSubcontratados(mockEmpleado);
    expect(component.numeroDeEmpleadosLista).toContain(mockEmpleado);
    expect(
      solicitud32605StoreMock.actualizarNumeroDeEmpleadosLista
    ).toHaveBeenCalledWith(component.numeroDeEmpleadosLista);
  });

  it('should call actualizarCatseleccionados with correct id', () => {
    const mockCatalogo = { id: 123 } as any;
    solicitud32605StoreMock.actualizarCatseleccionados(mockCatalogo.id);
    expect(solicitud32605StoreMock.actualizarCatseleccionados).toHaveBeenCalledWith(123);
  });

  it('should call actualizarServicio with correct id', () => {
    const mockCatalogo = { id: 456 } as any;
    solicitud32605StoreMock.actualizarServicio(mockCatalogo.id);
    expect(solicitud32605StoreMock.actualizarServicio).toHaveBeenCalledWith(456);
  });

  it('should call actualizar190 with correct value', () => {
    component.actualizar190('test190');
    expect(solicitud32605StoreMock.actualizar190).toHaveBeenCalledWith('test190');
  });

  it('should call actualizar191 with correct value', () => {
    component.actualizar191(191);
    expect(solicitud32605StoreMock.actualizar191).toHaveBeenCalledWith(191);
  });

  it('should call actualizar199 with correct value', () => {
    component.actualizar199('valor199');
    expect(solicitud32605StoreMock.actualizar199).toHaveBeenCalledWith('valor199');
  });

  it('should call actualizarEmpleados with correct value from event', () => {
    const mockEvent = { target: { value: '10' } } as any as Event;
    component.actualizarEmpleados(mockEvent);
    expect(solicitud32605StoreMock.actualizarEmpleados).toHaveBeenCalledWith('10');
  });

  it('should call actualizarBimestre with correct id', () => {
    const mockCatalogo = { id: 2 } as any;
    component.actualizarBimestre(mockCatalogo);
    expect(solicitud32605StoreMock.actualizarBimestre).toHaveBeenCalledWith(2);
  });

  it('should call actualizar2034 with correct value', () => {
    component.actualizar2034(2034);
    expect(solicitud32605StoreMock.actualizar2034).toHaveBeenCalledWith(2034);
  });

  it('should call actualizar236 with correct value', () => {
    component.actualizar236('valor236');
    expect(solicitud32605StoreMock.actualizar236).toHaveBeenCalledWith('valor236');
  });

  it('should call actualizar237 with correct value', () => {
    component.actualizar237(237);
    expect(solicitud32605StoreMock.actualizar237).toHaveBeenCalledWith(237);
  });


    it('should call actualizar240 with correct value', () => {
      component.actualizar240('valor240');
      expect(solicitud32605StoreMock.actualizar240).toHaveBeenCalledWith('valor240');
    });

    it('should call actualizar243 with correct value', () => {
      component.actualizar243(243);
      expect(solicitud32605StoreMock.actualizar243).toHaveBeenCalledWith(243);
    });

    it('should call actualizar244 with correct value', () => {
      component.actualizar244('valor244');
      expect(solicitud32605StoreMock.actualizar244).toHaveBeenCalledWith('valor244');
    });

    it('should call actualizar245 with correct value', () => {
      component.actualizar245(245);
      expect(solicitud32605StoreMock.actualizar245).toHaveBeenCalledWith(245);
    });

    it('should call actualizarIndiqueTodos with correct id', () => {
      const mockCatalogo = { id: 7 } as any;
      solicitud32605StoreMock.actualizarIndiqueTodos(mockCatalogo.id);
      expect(solicitud32605StoreMock.actualizarIndiqueTodos).toHaveBeenCalledWith(7);
    });

    it('should call actualizar246 with correct value', () => {
      component.actualizar246('valor246');
      expect(solicitud32605StoreMock.actualizar246).toHaveBeenCalledWith('valor246');
    });

    it('should call actualizarFile1 with correct value from event', () => {
      const mockEvent = { target: { value: 'file1.pdf' } } as any as Event;
      component.actualizarFile1(mockEvent);
      expect(solicitud32605StoreMock.actualizarFile1).toHaveBeenCalledWith('file1.pdf');
    });

    it('should call actualizarFile2 with correct value from event', () => {
      const mockEvent = { target: { value: 'file2.pdf' } } as any as Event;
      component.actualizarFile2(mockEvent);
      expect(solicitud32605StoreMock.actualizarFile2).toHaveBeenCalledWith('file2.pdf');
    });

    it('should call actualizar247 with correct value', () => {
      component.actualizar247(247);
      expect(solicitud32605StoreMock.actualizar247).toHaveBeenCalledWith(247);
    });

    it('should call actualizar248 with correct value', () => {
      component.actualizar248('valor248');
      expect(solicitud32605StoreMock.actualizar248).toHaveBeenCalledWith('valor248');
    });

    it('should call actualizarIdentificacion with correct value from event', () => {
      const mockEvent = { target: { value: 'identificacion123' } } as any as Event;
      component.actualizarIdentificacion(mockEvent);
      expect(solicitud32605StoreMock.actualizarIdentificacion).toHaveBeenCalledWith('identificacion123');
    });

    it('should call actualizarLugarDeRadicacion with correct value from event', () => {
      const mockEvent = { target: { value: 'CDMX' } } as any as Event;
      component.actualizarLugarDeRadicacion(mockEvent);
      expect(solicitud32605StoreMock.actualizarLugarDeRadicacion).toHaveBeenCalledWith('CDMX');
    });

    it('should call actualizar249 with correct value', () => {
      component.actualizar249(249);
      expect(solicitud32605StoreMock.actualizar249).toHaveBeenCalledWith(249);
    });

    it('should call actualizar250 with correct value', () => {
      component.actualizar250('valor250');
      expect(solicitud32605StoreMock.actualizar250).toHaveBeenCalledWith('valor250');
    });

    it('should call actualizar251 with correct value', () => {
      component.actualizar251(251);
      expect(solicitud32605StoreMock.actualizar251).toHaveBeenCalledWith(251);
    });

    it('should call actualizarCheckbox1 with correct checked value', () => {
      const mockEvent = { target: { checked: true } } as any as Event;
      component.actualizarCheckbox1(mockEvent);
      expect(solicitud32605StoreMock.actualizarCheckbox1).toHaveBeenCalledWith(true);
    });

    it('should call actualizarCheckbox2 with correct checked value', () => {
      const mockEvent = { target: { checked: false } } as any as Event;
      component.actualizarCheckbox2(mockEvent);
      expect(solicitud32605StoreMock.actualizarCheckbox2).toHaveBeenCalledWith(false);
    });

    it('should call actualizarCheckbox3 with correct checked value', () => {
      const mockEvent = { target: { checked: true } } as any as Event;
      component.actualizarCheckbox3(mockEvent);
      expect(solicitud32605StoreMock.actualizarCheckbox3).toHaveBeenCalledWith(true);
    });

    it('should call actualizarActualmente2 with correct value from event', () => {
      const mockEvent = { target: { value: 'actualmente2' } } as any as Event;
      component.actualizarActualmente2(mockEvent);
      expect(solicitud32605StoreMock.actualizarActualmente2).toHaveBeenCalledWith('actualmente2');
    });

    it('should call actualizarActualmente1 with correct value from event', () => {
      const mockEvent = { target: { value: 'actualmente1' } } as any as Event;
      component.actualizarActualmente1(mockEvent);
      expect(solicitud32605StoreMock.actualizarActualmente1).toHaveBeenCalledWith('actualmente1');
    });

    it('should set seleccionarInventarios when seleccionarInventariosDatos is called', () => {
      const inventarios = [{ nombre: 'inv1' }, { nombre: 'inv2' }] as any;
      component.seleccionarInventariosDatos(inventarios);
      expect(component.seleccionarInventarios).toBe(inventarios);
    });

    it('should remove selected inventarios from inventariosDatos when eliminarInventariosDatos is called', () => {
      component.inventariosDatos = [
        { nombre: 'inv1' },
        { nombre: 'inv2' },
        { nombre: 'inv3' },
      ] as any;
      component.seleccionarInventarios = [{ nombre: 'inv2' }] as any;
      component.eliminarInventariosDatos();
      expect(component.inventariosDatos).toEqual([
        { nombre: 'inv1' },
        { nombre: 'inv3' },
      ]);
    });

    it('should set seleccionarListaSeccionSociosIC when seleccionarlistaSeccionSociosIC is called', () => {
      const socios = [{ nombre: 'Socio1' }] as any;
      component.seleccionarlistaSeccionSociosIC(socios);
      expect(component.seleccionarListaSeccionSociosIC).toBe(socios);
    });

    it('should remove selected socios from listaSeccionSociosIC when eliminarlistaSeccionSociosIC is called', () => {
      component.listaSeccionSociosIC = [
        { nombre: 'Socio1' },
        { nombre: 'Socio2' },
      ] as any;
      component.seleccionarListaSeccionSociosIC = [{ nombre: 'Socio1' }] as any;
      component.eliminarlistaSeccionSociosIC();
      expect(component.listaSeccionSociosIC).toEqual([{ nombre: 'Socio2' }]);
    });

    it('should set seleccionarDomiciliosDatos when seleccionarDomiciliosDato is called', () => {
      const domicilios = [{ tipoInstalacion: 'A' }] as any;
      component.seleccionarDomiciliosDato(domicilios);
      expect(component.seleccionarDomiciliosDatos).toBe(domicilios);
    });

    it('should remove selected domicilios from domiciliosDatos when eliminarDomiciliosDatos is called', () => {
      component.domiciliosDatos = [
        { tipoInstalacion: 'A' },
        { tipoInstalacion: 'B' },
      ] as any;
      component.seleccionarDomiciliosDatos = [{ tipoInstalacion: 'A' }] as any;
      component.eliminarDomiciliosDatos();
      expect(component.domiciliosDatos).toEqual([{ tipoInstalacion: 'B' }]);
    });

    it('should set seleccionarNumeroDeEmpleadosLista when seleccionarNumeroDeEmpleadosDato is called', () => {
      const empleados = [{ numeroDeEmpleados: 5 }] as any;
      component.seleccionarNumeroDeEmpleadosDato(empleados);
      expect(component.seleccionarNumeroDeEmpleadosLista).toBe(empleados);
    });

    it('should remove selected empleados from numeroDeEmpleadosLista when eliminarNumeroDeEmpleadosDato is called', () => {
      component.numeroDeEmpleadosLista = [
        { numeroDeEmpleados: 5 },
        { numeroDeEmpleados: 10 },
      ] as any;
      component.seleccionarNumeroDeEmpleadosLista = [{ numeroDeEmpleados: 10 }] as any;
      component.eliminarNumeroDeEmpleadosDato();
      expect(component.numeroDeEmpleadosLista).toEqual([{ numeroDeEmpleados: 5 }]);
    });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
