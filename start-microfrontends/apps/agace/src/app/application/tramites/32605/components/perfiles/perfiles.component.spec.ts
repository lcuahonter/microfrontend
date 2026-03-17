import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PerfilesComponent } from './perfiles.component';
import { Solicitud32605Store } from '../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../estados/solicitud32605.query';
import { ConsultaioQuery, InputFechaComponent, InputRadioComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { PlaneacionDelaSeguridadComponent } from './planeacion-de-la-seguridad/planeacion-de-la-seguridad.component';
import { SeguridadFisicaComponent } from './seguridad-fisica/seguridad-fisica.component';
import { ControlesFisicoComponent } from './controles-fisico/controles-fisico.component';
import { SociosComercialesComponent } from './socios-comerciales/socios-comerciales.component';
import { SeguridadProcesosComponent } from './seguridad-procesos/seguridad-procesos.component';
import { GestionAduaneraComponent } from './gestion-aduanera/gestion-aduanera.component';
import { SeguridadLosVehiculosComponent } from './seguridad-los-vehiculos/seguridad-los-vehiculos.component';
import { CapacitacionSeguridadComponent } from './capacitacion-seguridad/capacitacion-seguridad.component';
import { SeguridadPersonalComponent } from './seguridad-personal/seguridad-personal.component';
import { SeguridadInformacionDocumentacionComponent } from './seguridad-informacion-documentacion/seguridad-informacion-documentacion.component';
import { ManejoInvestigacionComponent } from './manejo-investigacion/manejo-investigacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let store: Solicitud32605Store;
  let query: Solicitud32605Query;
  let consultaioQueryMock: any;

  beforeEach(() => {
    consultaioQueryMock = {
      selectConsultaioState$: of({
        readonly: false,
        procedureId: '',
        parameter: '',
        department: '',
        folioTramite: '',
        tramiteCompleto: false,
        loading: false,
        error: null,
        success: false,
        isConsultaio: false,
        tipoDeTramite: '',
        estadoDeTramite: '',
        create: false,
        update: false,
        consultaioSolicitante: null,
      }),
    };

    TestBed.configureTestingModule({
      imports: [
        PerfilesComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PlaneacionDelaSeguridadComponent,
        SeguridadFisicaComponent,
        ControlesFisicoComponent,
        SociosComercialesComponent,
        SeguridadProcesosComponent,
        GestionAduaneraComponent,
        SeguridadLosVehiculosComponent,
        SeguridadPersonalComponent,
        SeguridadInformacionDocumentacionComponent,
        CapacitacionSeguridadComponent,
        ManejoInvestigacionComponent,
        InputFechaComponent,
        InputRadioComponent,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        {
          provide: Solicitud32605Store,
          useValue: {
            actualizarEstado: jest.fn(),
          },
        },
        {
          provide: Solicitud32605Query,
          useValue: {
            selectSolicitud$: of({
              perfiles: {
                domicilio: 'Test Domicilio',
                antiguedad: '5 años',
                productos: 'Test Productos',
                embarquesExp: '10',
                embarquesImp: '15',
                empleados: '50',
                superficie: '1000 m2',
                nombre: 'Test Nombre',
                categoria: 'A',
                vigencia: '2025',
                blCtpat: '1',
                blnPip: '1',
                blnOea: '1',
                blnOtrosProgramasSegu: '1',
              },
            }),
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: consultaioQueryMock,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Solicitud32605Store);
    query = TestBed.inject(Solicitud32605Query);
    (component as any).tramite32605Store = store;
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    component.ngOnInit();
    expect(component.profileForm).toBeDefined();
  });

  it('debe alternar el valor de mostrarContenido', () => {
    expect(component.mostrarContenido).toBe(false);
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(true);
  });

  it('debe alternar el valor de mostrarSeguridad', () => {
    expect(component.mostrarSeguridad).toBe(false);
    component.alternarSeguridad();
    expect(component.mostrarSeguridad).toBe(true);
  });

  it('debe actualizar antiguedad en el store', () => {
    component.profileForm.get('antiguedad')?.setValue('antiguedad');
    component.actualizarAntiguedad();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { antiguedad: 'antiguedad' },
    });
  });

  it('debe actualizar productos en el store', () => {
    component.profileForm.get('productos')?.setValue('New Product');
    component.actualizarProductos();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { productos: 'New Product' },
    });
  });

  it('debe actualizar embarquesExp en el store', () => {
    component.profileForm.get('embarquesExp')?.setValue('20');
    component.actualizarEmbarquesExp();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { embarquesExp: '20' },
    });
  });

  it('debe actualizar embarquesImp en el store', () => {
    component.profileForm.get('embarquesImp')?.setValue('25');
    component.actualizarEmbarquesImp();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { embarquesImp: '25' },
    });
  });

  it('debe actualizar empleados en el store', () => {
    component.profileForm.get('empleados')?.setValue('100');
    component.actualizarEmpleados();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { empleados: '100' },
    });
  });

  it('debe actualizar superficie en el store', () => {
    component.profileForm.get('superficie')?.setValue('2000 m2');
    component.actualizarSuperficie();
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { superficie: '2000 m2' },
    });
  });

  it('debe establecer vigencia en el store', () => {
    component.seleccionarVigenciaUno('2026');
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { vigencia: '2026' },
    });
  });

  it('debe establecer vigenciaDos en el store', () => {
    component.seleccionarVigenciaDos('2027');
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { vigencia2: '2027' },
    });
  });

  it('debe establecer vigenciaTres en el store', () => {
    component.seleccionarVigenciaTres('2028');
    expect(store.actualizarEstado).toHaveBeenCalledWith({
      perfiles: { vigencia3: '2028' },
    });
  });

  it('debe limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  describe('guardarDatosFormulario', () => {
    it('debe crear formulario y habilitarlo cuando no está en modo solo lectura', () => {
      component.esFormularioSoloLectura = false;
      const crearFormularioSpy = jest.spyOn(
        component,
        'crearFormularioProfileForm'
      );

      component.guardarDatosFormulario();

      expect(crearFormularioSpy).toHaveBeenCalled();
      expect(component.profileForm.enabled).toBe(true);
    });

    it('debe crear formulario y deshabilitarlo cuando está en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;
      const crearFormularioSpy = jest.spyOn(
        component,
        'crearFormularioProfileForm'
      );

      component.guardarDatosFormulario();

      expect(crearFormularioSpy).toHaveBeenCalled();
      expect(component.profileForm.disabled).toBe(true);
    });
  });

  describe('Métodos de alternado de visibilidad', () => {
    it('debe alternar el valor de mostrarAccesoFisico', () => {
      expect(component.mostrarAccesoFisico).toBe(false);
      component.alternarAccesoFisico();
      expect(component.mostrarAccesoFisico).toBe(true);
      component.alternarAccesoFisico();
      expect(component.mostrarAccesoFisico).toBe(false);
    });

    it('debe alternar el valor de mostrarSociosComerciales', () => {
      expect(component.mostrarSociosComeciales).toBe(false);
      component.alternarSociosComerciales();
      expect(component.mostrarSociosComeciales).toBe(true);
      component.alternarSociosComerciales();
      expect(component.mostrarSociosComeciales).toBe(false);
    });

    it('debe alternar el valor de mostrarSeguridadProcesos', () => {
      expect(component.mostrarSeguridadProcesos).toBe(false);
      component.alternarSeguridadProcesos();
      expect(component.mostrarSeguridadProcesos).toBe(true);
      component.alternarSeguridadProcesos();
      expect(component.mostrarSeguridadProcesos).toBe(false);
    });

    it('debe alternar el valor de mostrarGestionAduanera', () => {
      expect(component.mostrarGestionAduanera).toBe(false);
      component.alternarGestionAduanera();
      expect(component.mostrarGestionAduanera).toBe(true);
      component.alternarGestionAduanera();
      expect(component.mostrarGestionAduanera).toBe(false);
    });

    it('debe alternar el valor de mostrarSeguridadVehiculos', () => {
      expect(component.mostrarSeguridadVehiculos).toBe(false);
      component.alternarSeguridadVehiculos();
      expect(component.mostrarSeguridadVehiculos).toBe(true);
      component.alternarSeguridadVehiculos();
      expect(component.mostrarSeguridadVehiculos).toBe(false);
    });

    it('debe alternar el valor de mostrarSeguridadPersonal', () => {
      expect(component.mostrarSeguridadPersonal).toBe(false);
      component.alternarSeguridadPersonal();
      expect(component.mostrarSeguridadPersonal).toBe(true);
      component.alternarSeguridadPersonal();
      expect(component.mostrarSeguridadPersonal).toBe(false);
    });

    it('debe alternar el valor de mostrarSeguridadInformacion', () => {
      expect(component.mostrarSeguridadInformacion).toBe(false);
      component.alternarSeguridadInformacion();
      expect(component.mostrarSeguridadInformacion).toBe(true);
      component.alternarSeguridadInformacion();
      expect(component.mostrarSeguridadInformacion).toBe(false);
    });

    it('debe alternar el valor de mostrarCapacitacionSeguridad', () => {
      expect(component.mostrarCapacitacionSeguridad).toBe(false);
      component.alternarCapacitacionSeguridad();
      expect(component.mostrarCapacitacionSeguridad).toBe(true);
      component.alternarCapacitacionSeguridad();
      expect(component.mostrarCapacitacionSeguridad).toBe(false);
    });

    it('debe alternar el valor de mostrarManejoInvestigacion', () => {
      expect(component.mostrarManejoInvestigacion).toBe(false);
      component.alternarManejoInvestigacion();
      expect(component.mostrarManejoInvestigacion).toBe(true);
      component.alternarManejoInvestigacion();
      expect(component.mostrarManejoInvestigacion).toBe(false);
    });
  });

  describe('setValoresStore', () => {
    let testForm: FormGroup;
    let fb: FormBuilder;

    beforeEach(() => {
      fb = TestBed.inject(FormBuilder);
      testForm = fb.group({
        testField: ['test value'],
        nullField: [null],
        undefinedField: [undefined],
        emptyStringField: [''],
      });
    });

    it('debe retornar si el form es null', () => {
      component.setValoresStore(null, 'testField');
      expect(store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene un valor válido', () => {
      component.setValoresStore(testForm, 'testField');
      expect(store.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { testField: 'test value' },
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'nullField');
      expect(store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'undefinedField');
      expect(store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene string vacío', () => {
      component.setValoresStore(testForm, 'emptyStringField');
      expect(store.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { emptyStringField: '' },
      });
    });

    it('no debe actualizar el store si el control no existe', () => {
      jest.clearAllMocks();
      component.setValoresStore(testForm, 'nonExistentField');
      expect(store.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar valores numéricos correctamente', () => {
      testForm.addControl('numberField', fb.control(123));
      component.setValoresStore(testForm, 'numberField');
      expect(store.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { numberField: 123 },
      });
    });

    it('debe manejar valores booleanos correctamente', () => {
      testForm.addControl('booleanField', fb.control(true));
      component.setValoresStore(testForm, 'booleanField');
      expect(store.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { booleanField: true },
      });
    });
  });

  describe('Métodos adicionales', () => {
    it('debe actualizar fecha correctamente', () => {
      const nuevoValor = '2024-12-25';
      const campo = 'fecUltimaCtapt';

      component.actualizarFecha(nuevoValor, campo);

      expect(component.profileForm.get(campo)?.value).toBe(nuevoValor);
      expect(component.profileForm.get(campo)?.untouched).toBe(true);
    });

    it('debe inicializar estado del formulario correctamente cuando no está en modo solo lectura', () => {
      component.esFormularioSoloLectura = false;
      const guardarDatosSpy = jest.spyOn(component, 'guardarDatosFormulario');
      const crearFormularioSpy = jest.spyOn(
        component,
        'crearFormularioProfileForm'
      );

      component.inicializarEstadoFormulario();

      expect(crearFormularioSpy).toHaveBeenCalled();
      expect(guardarDatosSpy).not.toHaveBeenCalled();
    });

    it('debe inicializar estado del formulario correctamente cuando está en modo solo lectura', () => {
      component.esFormularioSoloLectura = true;
      const guardarDatosSpy = jest.spyOn(component, 'guardarDatosFormulario');

      component.inicializarEstadoFormulario();

      expect(guardarDatosSpy).toHaveBeenCalled();
    });
  });
});
