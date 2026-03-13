import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComunesComponent } from './datos-comunes.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import {
  CatalogoSelectComponent,
  ConsultaioQuery,
  InputRadioComponent,
  NotificacionesComponent,
  TablaConEntradaComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiembroDeLaEmpresaComponent } from '../miembro-de-la-empresa/miembro-de-la-empresa.component';
import { SeccionSubcontratadosComponent } from '../seccion-subcontratados/seccion-subcontratados.component';
import { InstalacionesPrincipalesComponent } from '../instalaciones-principales/instalaciones-principales.component';
import { ToastrModule } from 'ngx-toastr';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { ModificarInventarioComponent } from '../modificar-inventario/modificar-inventario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosComunesComponent', () => {
  let component: DatosComunesComponent;
  let fixture: ComponentFixture<DatosComunesComponent>;
  let solicitudServiceMock: any;
  let solicitud32607StoreMock: any;
  let solicitud32607QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirOpcionDeRadio: jest
        .fn()
        .mockReturnValue(of({ requisitos: { id: 1, nombre: 'Sí' } })),
      conseguirSolicitudCatologoSelectLista: jest.fn().mockReturnValue(
        of({
          sectorProductivo: { id: 1, nombre: 'Sector' },
          servicio: { id: 2, nombre: 'Servicio' },
          bimestre: { id: 3, nombre: 'Bimestre' },
        })
      ),
      conseguirInventarios: jest
        .fn()
        .mockReturnValue(
          of([{ nombre: 'Inv1', lugarRadicacion: 'Lugar1', anexo24: true }])
        ),
    };
    solicitud32607StoreMock = {
      actualizarListaSeccionSociosIC: jest.fn(),
      actualizarNumeroDeEmpleadosLista: jest.fn(),
      actualizarDomiciliosDatos: jest.fn(),
      actualizarCatseleccionados: jest.fn(),
      actualizarServicio: jest.fn(),
      actualizar190: jest.fn(),
      actualizar191: jest.fn(),
      actualizar199: jest.fn(),
      actualizarEmpleados: jest.fn(),
      actualizarBimestre: jest.fn(),
      actualizar2034: jest.fn(),
      actualizar236: jest.fn(),
      actualizar237: jest.fn(),
      actualizar239: jest.fn(),
      actualizar240: jest.fn(),
      actualizar241: jest.fn(),
      actualizar243: jest.fn(),
      actualizar244: jest.fn(),
      actualizar245: jest.fn(),
      actualizar246: jest.fn(),
      actualizarFile1: jest.fn(),
      actualizarFile2: jest.fn(),
      actualizar247: jest.fn(),
      actualizar248: jest.fn(),
      actualizarIdentificacion: jest.fn(),
      actualizarLugarDeRadicacion: jest.fn(),
      actualizar249: jest.fn(),
      actualizar250: jest.fn(),
      actualizar251: jest.fn(),
      actualizarCheckbox1: jest.fn(),
      actualizarCheckbox2: jest.fn(),
      actualizarCheckbox3: jest.fn(),
      actualizarActualmente2: jest.fn(),
      actualizarActualmente1: jest.fn(),
    };
    solicitud32607QueryMock = {
      selectSolicitud$: of({
        catseleccionados: 1,
        servicio: 2,
        '190': 3,
        '191': 4,
        '199': 5,
        empleados: 10,
        bimestre: 2,
        '2034': 0,
        '236': 0,
        '237': 0,
        '238': 0,
        '239': 0,
        '240': 0,
        '241': 0,
        '243': 0,
        '244': 0,
        '245': 0,
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
        numeroDeEmpleadosLista: [],
        domiciliosDatos: [],
        listaSeccionSociosIC: [],
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [
        DatosComunesComponent,
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
        EnlaceOperativoComponent,
        ModificarInventarioComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with state values', () => {
    expect(component.datosComunesForm).toBeDefined();
    expect(component.datosComunesForm.get('catseleccionados')?.value).toBe(1);
    expect(component.datosComunesForm.get('servicio')?.value).toBe(2);
  });

  it('should call actualizarCatseleccionados on store', () => {
    component.actualizarCatseleccionados({ id: 123, nombre: 'Test' } as any);
    expect(
      solicitud32607StoreMock.actualizarCatseleccionados
    ).toHaveBeenCalledWith(123);
  });

  it('should call actualizarServicio on store', () => {
    component.actualizarServicio({ id: 456, nombre: 'Test' } as any);
    expect(solicitud32607StoreMock.actualizarServicio).toHaveBeenCalledWith(
      456
    );
  });

  it('should call actualizar190 and trigger notificacionDeAlerta if value is 2', () => {
    const spy = jest.spyOn(component, 'notificacionDeAlerta');
    component.actualizar190(2);
    expect(solicitud32607StoreMock.actualizar190).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalled();
  });

  it('should set elimss true if actualizar199 value is 1', () => {
    component.actualizar199(1);
    expect(component.elimss).toBe(true);
    expect(solicitud32607StoreMock.actualizar199).toHaveBeenCalledWith(1);
  });

  it('should set elimss false if actualizar199 value is not 1', () => {
    component.elimss = true;
    component.actualizar199(0);
    expect(component.elimss).toBe(false);
  });

  it('should set especializadas true if actualizar237 value is 1', () => {
    component.actualizar237(1);
    expect(component.especializadas).toBe(true);
    expect(solicitud32607StoreMock.actualizar237).toHaveBeenCalledWith(1);
  });

  it('should set especializadas false if actualizar237 value is not 1', () => {
    component.especializadas = true;
    component.actualizar237(0);
    expect(component.especializadas).toBe(false);
  });

  it('should add pedimento and show modal when actualizar239 is called with 1', () => {
    const spy = jest.spyOn(component, 'abrirModal');
    component.actualizar239(1);
    expect(spy).toHaveBeenCalled();
    expect(component.pedimentos.length).toBeGreaterThan(0);
  });

  it('should update seleccionarInventarios on seleccionarInventariosDatos', () => {
    const inventarios = [{ nombre: 'A', lugarRadicacion: 'B', anexo24: true }];
    component.seleccionarInventariosDatos(inventarios as any);
    expect(component.seleccionarInventarios).toEqual(inventarios);
  });

  it('should remove inventarios on eliminarInventariosDatos', () => {
    component.inventariosDatos = [
      { nombre: 'A', lugarRadicacion: 'B', anexo24: true },
      { nombre: 'B', lugarRadicacion: 'C', anexo24: false },
    ] as any;
    component.seleccionarInventarios = [
      { nombre: 'A', lugarRadicacion: 'B', anexo24: true },
    ] as any;
    component.eliminarInventariosDatos();
    expect(component.inventariosDatos.length).toBe(1);
    expect(component.inventariosDatos[0].nombre).toBe('B');
  });

  it('should remove socios on eliminarlistaSeccionSociosIC', () => {
    component.listaSeccionSociosIC = [
      { nombre: 'Socio1' },
      { nombre: 'Socio2' },
    ] as any;
    component.seleccionarListaSeccionSociosIC = [{ nombre: 'Socio1' }] as any;
    component.eliminarlistaSeccionSociosIC();
    expect(component.listaSeccionSociosIC.length).toBe(1);
    expect(component.listaSeccionSociosIC[0].nombre).toBe('Socio2');
  });

  it('should remove domicilios on eliminarDomiciliosDatos', () => {
    component.domiciliosDatos = [
      { tipoInstalacion: 'A' },
      { tipoInstalacion: 'B' },
    ] as any;
    component.seleccionarDomiciliosDatos = [{ tipoInstalacion: 'A' }] as any;
    component.eliminarDomiciliosDatos();
    expect(component.domiciliosDatos.length).toBe(1);
    expect(component.domiciliosDatos[0].tipoInstalacion).toBe('B');
  });

  it('should remove empleados on eliminarNumeroDeEmpleadosDato', () => {
    component.numeroDeEmpleadosLista = [
      { numeroDeEmpleados: 1 },
      { numeroDeEmpleados: 2 },
    ] as any;
    component.seleccionarNumeroDeEmpleadosLista = [
      { numeroDeEmpleados: 1 },
    ] as any;
    component.eliminarNumeroDeEmpleadosDato();
    expect(component.numeroDeEmpleadosLista.length).toBe(1);
    expect(component.numeroDeEmpleadosLista[0].numeroDeEmpleados).toBe(2);
  });

  it('should add inventario if nombre and lugarRadicacion are present', () => {
    component.datosComunesForm = new FormBuilder().group({
      identificacion: ['TestInv'],
      lugarDeRadicacion: ['Lugar'],
      checkbox3: [true],
    });
    component.inventariosDatos = [];
    component.agregarControlInventarios();
    expect(component.inventariosDatos.length).toBe(1);
    expect(component.inventariosDatos[0].nombre).toBe('TestInv');
  });

  it('should show modal and add pedimento if agregarControlInventarios missing fields', () => {
    component.datosComunesForm = new FormBuilder().group({
      identificacion: [''],
      lugarDeRadicacion: [''],
      checkbox3: [false],
    });
    const spy = jest.spyOn(component, 'abrirModal');
    component.pedimentos = [];
    component.agregarControlInventarios();
    expect(spy).toHaveBeenCalled();
    expect(component.pedimentos.length).toBe(1);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = true;
    component.datosComunesForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.datosComunesForm.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.esFormularioSoloLectura = false;
    component.datosComunesForm = new FormBuilder().group({ test: ['value'] });
    component.guardarDatosFormulario();
    expect(component.datosComunesForm.enabled).toBe(true);
  });

  it('should show modal and add pedimento if modificarInventario has no selection', () => {
    component.seleccionarInventarios = [];
    const spy = jest.spyOn(component, 'abrirModal');
    component.pedimentos = [];
    component.modificarInventario();
    expect(spy).toHaveBeenCalled();
    expect(component.pedimentos.length).toBe(1);
  });

  it('should call abrirModal and add pedimento in notificacionDeAlerta', () => {
    const spy = jest.spyOn(component, 'abrirModal');
    component.pedimentos = [];
    component.notificacionDeAlerta();
    expect(spy).toHaveBeenCalled();
    expect(component.pedimentos.length).toBe(1);
  });

  it('should remove pedimento on eliminarPedimento', () => {
    component.pedimentos = [{ patente: 1 }, { patente: 2 }] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(1);
    expect(component.pedimentos[0].patente).toBe(2);
  });

  it('should not remove pedimento if borrar is false', () => {
    component.pedimentos = [{ patente: 1 }, { patente: 2 }] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(false);
    expect(component.pedimentos.length).toBe(2);
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    const destroy$ = (component as any).destroy$ as Subject<void>;
    const spy = jest.spyOn(destroy$, 'next');
    const spy2 = jest.spyOn(destroy$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call store actualizarEmpleados with value from event', () => {
    const event = { target: { value: '123' } } as any;
    component.actualizarEmpleados(event);
    expect(solicitud32607StoreMock.actualizarEmpleados).toHaveBeenCalledWith(
      '123'
    );
  });

  it('should call store actualizarFile1 with value from event', () => {
    const event = { target: { value: 'file1.pdf' } } as any;
    component.actualizarFile1(event);
    expect(solicitud32607StoreMock.actualizarFile1).toHaveBeenCalledWith(
      'file1.pdf'
    );
  });

  it('should call store actualizarFile2 with value from event', () => {
    const event = { target: { value: 'file2.pdf' } } as any;
    component.actualizarFile2(event);
    expect(solicitud32607StoreMock.actualizarFile2).toHaveBeenCalledWith(
      'file2.pdf'
    );
  });

  it('should call store actualizarIdentificacion with value from event', () => {
    const event = { target: { value: 'ID123' } } as any;
    component.actualizarIdentificacion(event);
    expect(
      solicitud32607StoreMock.actualizarIdentificacion
    ).toHaveBeenCalledWith('ID123');
  });

  it('should call store actualizarLugarDeRadicacion with value from event', () => {
    const event = { target: { value: 'LugarX' } } as any;
    component.actualizarLugarDeRadicacion(event);
    expect(
      solicitud32607StoreMock.actualizarLugarDeRadicacion
    ).toHaveBeenCalledWith('LugarX');
  });

  it('should call store actualizarCheckbox1 with checked value from event', () => {
    const event = { target: { checked: true } } as any;
    component.actualizarCheckbox1(event);
    expect(solicitud32607StoreMock.actualizarCheckbox1).toHaveBeenCalledWith(
      true
    );
  });

  it('should call store actualizarCheckbox2 with checked value from event', () => {
    const event = { target: { checked: false } } as any;
    component.actualizarCheckbox2(event);
    expect(solicitud32607StoreMock.actualizarCheckbox2).toHaveBeenCalledWith(
      false
    );
  });

  it('should call store actualizarCheckbox3 with checked value from event', () => {
    const event = { target: { checked: true } } as any;
    component.actualizarCheckbox3(event);
    expect(solicitud32607StoreMock.actualizarCheckbox3).toHaveBeenCalledWith(
      true
    );
  });

  it('should call store actualizarActualmente2 with value from event', () => {
    const event = { target: { value: 'val2' } } as any;
    component.actualizarActualmente2(event);
    expect(solicitud32607StoreMock.actualizarActualmente2).toHaveBeenCalledWith(
      'val2'
    );
  });

  it('should call store actualizarActualmente1 with value from event', () => {
    const event = { target: { value: 'val1' } } as any;
    component.actualizarActualmente1(event);
    expect(solicitud32607StoreMock.actualizarActualmente1).toHaveBeenCalledWith(
      'val1'
    );
  });

  it('should call store actualizarBimestre with id', () => {
    component.actualizarBimestre({ id: 7, nombre: 'Bim' } as any);
    expect(solicitud32607StoreMock.actualizarBimestre).toHaveBeenCalledWith(7);
  });

  it('should call store actualizar2034 with value', () => {
    component.actualizar2034('abc');
    expect(solicitud32607StoreMock.actualizar2034).toHaveBeenCalledWith('abc');
  });

  it('should call store actualizar236 with value', () => {
    component.actualizar236(123);
    expect(solicitud32607StoreMock.actualizar236).toHaveBeenCalledWith(123);
  });

  it('should call store actualizar237 with value', () => {
    component.actualizar237(456);
    expect(solicitud32607StoreMock.actualizar237).toHaveBeenCalledWith(456);
  });

  it('should call store actualizar239 with value', () => {
    component.actualizar239(789);
    expect(solicitud32607StoreMock.actualizar239).toHaveBeenCalledWith(789);
  });

  it('should call store actualizar240 with value', () => {
    component.actualizar240('v240');
    expect(solicitud32607StoreMock.actualizar240).toHaveBeenCalledWith('v240');
  });

  it('should call store actualizar241 with value', () => {
    component.actualizar241('v241');
    expect(solicitud32607StoreMock.actualizar241).toHaveBeenCalledWith('v241');
  });

  it('should call store actualizar243 with value', () => {
    component.actualizar243('v243');
    expect(solicitud32607StoreMock.actualizar243).toHaveBeenCalledWith('v243');
  });

  it('should call store actualizar244 with value', () => {
    component.actualizar244('v244');
    expect(solicitud32607StoreMock.actualizar244).toHaveBeenCalledWith('v244');
  });

  it('should call store actualizar245 with value', () => {
    component.actualizar245('v245');
    expect(solicitud32607StoreMock.actualizar245).toHaveBeenCalledWith('v245');
  });

  it('should call store actualizar246 with value', () => {
    component.actualizar246('v246');
    expect(solicitud32607StoreMock.actualizar246).toHaveBeenCalledWith('v246');
  });

  it('should call store actualizar247 with value', () => {
    component.actualizar247('v247');
    expect(solicitud32607StoreMock.actualizar247).toHaveBeenCalledWith('v247');
  });

  it('should call store actualizar248 with value', () => {
    component.actualizar248('v248');
    expect(solicitud32607StoreMock.actualizar248).toHaveBeenCalledWith('v248');
  });

  it('should call store actualizar249 with value', () => {
    component.actualizar249('v249');
    expect(solicitud32607StoreMock.actualizar249).toHaveBeenCalledWith('v249');
  });

  it('should call store actualizar250 with value', () => {
    component.actualizar250('v250');
    expect(solicitud32607StoreMock.actualizar250).toHaveBeenCalledWith('v250');
  });

  it('should call store actualizar251 with value', () => {
    component.actualizar251('v251');
    expect(solicitud32607StoreMock.actualizar251).toHaveBeenCalledWith('v251');
  });
});
