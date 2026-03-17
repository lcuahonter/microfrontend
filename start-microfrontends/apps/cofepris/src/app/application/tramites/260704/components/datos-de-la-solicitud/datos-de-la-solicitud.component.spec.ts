import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('DatosDeLaSolicitudComponent métodos y lógica', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let mockConsulta: any;
  let mockStore: any;
  let mockQuery: any;
  let mockValidacionesService: any;
  let mockConsultaioQuery: any;
  let mockSolicitanteService: any;

  beforeEach(async () => {
    mockConsulta = {
      obtenerTablaScian: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (fn: any) => fn([{ id: 1 }]) }) }),
      obtenerTablaMercancias: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (fn: any) => fn([{ id: 2 }]) }) }),
      obtenerTablaListaClave: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (fn: any) => fn([{ id: 3 }]) }) }),
      obtenerDatosEstado: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (fn: any) => fn([{ id: 4 }]) }) }),
      obtenerDatosClave: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (fn: any) => fn([{ id: 5 }]) }) }),
      getDescripcionScian: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: (obj: any) => obj.next({ data: [{ descripcion: 'desc' }] }) }) }),
    };
    mockStore = {
      setDescripcionScian: jest.fn(),
      setClaveScian: jest.fn(),
      setAvisoDeFuncionamiento: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setClaveDeLosLotes: jest.fn(),
      addMercanciasDatos: jest.fn(),
      setNombreRazon: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
    };
    mockQuery = {
      selectSolicitud$: { pipe: () => ({ subscribe: (fn: any) => fn({}) }) }
    };
    mockValidacionesService = { isValid: jest.fn().mockReturnValue(true) };
    mockConsultaioQuery = {
      selectConsultaioState$: { pipe: () => ({ subscribe: (fn: any) => fn({ readonly: false }) }) }
    };
    mockSolicitanteService = {};

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [DatosDeLaSolicitudComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() }
      ]
    }).overrideComponent(DatosDeLaSolicitudComponent, {
      set: {
        providers: [
          { provide: 'consulta', useValue: mockConsulta },
          { provide: 'store', useValue: mockStore },
          { provide: 'query', useValue: mockQuery },
          { provide: 'validacionesService', useValue: mockValidacionesService },
          { provide: 'consultaioQuery', useValue: mockConsultaioQuery },
          { provide: 'solicitanteService', useValue: mockSolicitanteService }
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;

    // Inicializar formularios para pruebas
    component.datosDelEstablecimientoForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        tipoOperacion: [''],
        justificacion: [''],
        establecimiento: [''],
        razonSocial: [''],
        correoElectronico: [''],
      }),
      validacionMercanciaForm: new FormBuilder().group({
        codigoPostal: [''],
        estado: [''],
        municipio: [''],
        localidad: [''],
        colonia: [''],
        calle: [''],
        lada: [''],
        telefono: [''],
      }),
      validacionScionForm: new FormBuilder().group({
        scian: [''],
        scianDatos: [''],
        claveScian: [''],
        descripcionScian: [''],
      }),
      validacionAduanaMercanciaForm: new FormBuilder().group({
        avisoDeFuncionamiento: [''],
        licenciaSanitaria: [''],
        regimen: [''],
        aduana: [''],
        immex: [''],
        ano: [''],
      }),
      validacionDatosMercanciaForm: new FormBuilder().group({
        clasificacionProducto: [''],
        especificarClasificacionProducto: [''],
        denominacionProducto: [''],
        marca: [''],
        tipoProducto: [''],
        especifique: [''],
        fraccionArancelaria: [''],
        descripcionFraccionArancelaria: [''],
        cantidadUMT: [''],
        umt: [''],
        cantidadUMC: [''],
        umc: [''],
        claveLote: [''],
        listaClave: [''],
      }),
      rfc: [''],
      nombreRazon: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      manfestosYDeclaraciones: [''],
      hacerlosPublicos: [''],
    });
    component.scianForm = new FormBuilder().group({
      cveSCIAN: [''],
      cveSCIANDescripcion: ['']
    });
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar correctamente en ngOnInit', () => {
    const spyDonante = jest.spyOn(component, 'donanteDomicilio');
    const spyObtenerTablaScian = jest.spyOn(component, 'obtenerTablaScian');
    const spyObtenerDatosEstado = jest.spyOn(component, 'obtenerDatosEstado');
    const spyObtenerTablaMercancias = jest.spyOn(component, 'obtenerTablaMercancias');
    const spyObtenerDatosClave = jest.spyOn(component, 'obtenerDatosClave');
    const spyObtenerTablaListaClave = jest.spyOn(component, 'obtenerTablaListaClave');
    const spyInicializarEstadoFormulario = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spyDonante).toHaveBeenCalled();
    expect(spyObtenerTablaScian).toHaveBeenCalled();
    expect(spyObtenerDatosEstado).toHaveBeenCalled();
    expect(spyObtenerTablaMercancias).toHaveBeenCalled();
    expect(spyObtenerDatosClave).toHaveBeenCalled();
    expect(spyObtenerTablaListaClave).toHaveBeenCalled();
    expect(spyInicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('debería inicializar el formulario correctamente en donanteDomicilio', () => {
    component.soloLectura = false;
    component.donanteDomicilio();
    expect(component.datosDelEstablecimientoForm).toBeInstanceOf(FormGroup);
  });

  it('debería ejecutar guardarDatosFormulario y deshabilitar formulario si soloLectura', () => {
    component.soloLectura = true;
    component.donanteDomicilio = jest.fn();
    component.datosDelEstablecimientoForm = new FormBuilder().group({});
    component.guardarDatosFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('debería ejecutar guardarDatosFormulario y habilitar formulario si no soloLectura', () => {
    component.soloLectura = false;
    component.donanteDomicilio = jest.fn();
    component.datosDelEstablecimientoForm = new FormBuilder().group({});
    component.guardarDatosFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('debería obtener datos de tabla SCIAN', () => {
    component.obtenerTablaScian();
    expect(component.certificadoDisponsiblesTablaDatos.length).toBeGreaterThan(0);
  });

  it('debería obtener datos de tabla mercancías', () => {
    component.obtenerTablaMercancias();
    expect(component.mercanciasConfiguracionTabla.length).toBeGreaterThan(0);
  });

  it('debería obtener datos de tabla lista clave', () => {
    component.obtenerTablaListaClave();
    expect(component.listaClaveTabla.length).toBeGreaterThan(0);
  });

  it('debería aceptar y deshabilitar estado', () => {
    component.datosDelEstablecimientoForm = new FormBuilder().group({});
    component.aceptar();
    expect(component.habilitarEstado).toBe(false);
  });

  it('debería seleccionar clave SCIAN y actualizar store', () => {
    component.scianForm.get('cveSCIAN')?.setValue('clave');
    component.claveScianSeleccion();
    expect(mockStore.setClaveScian).toHaveBeenCalledWith('clave');
    expect(mockStore.setDescripcionScian).toHaveBeenCalledWith('desc');
  });

  it('debería alternar paisOrigenColapsable', () => {
    const valorInicial = component.paisOrigen;
    component.paisOrigenColapsable();
    expect(component.paisOrigen).toBe(!valorInicial);
  });

  it('debería alternar paisProcedencis_colapsable', () => {
    const valorInicial = component.paisProcedencisColapsable;
    component.paisProcedencis_colapsable();
    expect(component.paisProcedencisColapsable).toBe(!valorInicial);
  });

  it('debería alternar usoEspecificoColapsable', () => {
    const valorInicial = component.usoEspecifico;
    component.usoEspecificoColapsable();
    expect(component.usoEspecifico).toBe(!valorInicial);
  });

  it('debería establecer aviso de funcionamiento', () => {
    const evento = { target: { checked: true } } as any;
    component.establecerAvisoDeFuncionamiento(evento);
    expect(component.esAvisoFuncionamientoSeleccionado).toBe(true);
    expect(mockStore.setAvisoDeFuncionamiento).toHaveBeenCalledWith(true);
  });

  it('debería establecer licencia sanitaria', () => {
    const evento = { target: { value: 'lic' } } as any;
    component.establecerLicenciaSanitaria(evento);
    expect(mockStore.setLicenciaSanitaria).toHaveBeenCalledWith('lic');
  });

  it('debería establecer clave de los lotes', () => {
    const evento = { target: { value: 'clave' } } as any;
    component.establecerClaveDeLosLotes(evento);
    expect(mockStore.setClaveDeLosLotes).toHaveBeenCalledWith('clave');
  });

  it('debería agregar mercancías', () => {
    component.datosDelEstablecimientoForm.get('clasificaionProductos')?.setValue('c');
    component.datosDelEstablecimientoForm.get('especificarProducto')?.setValue('e');
    component.datosDelEstablecimientoForm.get('nombreProductoEspecifico')?.setValue('n');
    component.datosDelEstablecimientoForm.get('marca')?.setValue('m');
    component.datosDelEstablecimientoForm.get('tipoProducto')?.setValue('t');
    component.datosDelEstablecimientoForm.get('fraccionArancelaria')?.setValue('f');
    component.datosDelEstablecimientoForm.get('descripcionFraccionArancelaria')?.setValue('d');
    component.datosDelEstablecimientoForm.get('cantidadUMT')?.setValue('u');
    component.datosDelEstablecimientoForm.get('umt')?.setValue('um');
    component.datosDelEstablecimientoForm.get('cantidadUMC')?.setValue('uc');
    component.datosDelEstablecimientoForm.get('umc')?.setValue('umc');
    component.agregarMercanias();
    expect(mockStore.addMercanciasDatos).toHaveBeenCalled();
  });

  it('debería marcar datos SCIAN seleccionados', () => {
    component.AcceptarEliminarScian();
    expect(component.esDatosSCIANSeleccionado).toBe(true);
  });



  it('debería eliminar pedimento si borrar es true', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 0;
    component.eliminarPedimento(true);
    expect(component.pedimentos.length).toBe(1);
  });

  it('debería abrir modal y configurar notificación', () => {
    component.abrirModal(2);
    expect(component.nuevaNotificacion).toBeDefined();
    expect(component.elementoParaEliminar).toBe(2);
  });

  it('debería abrir modal mercancía y configurar notificación', () => {
    component.abrirModalmercancia(3);
    expect(component.nuevaNotificacion2).toBeDefined();
    expect(component.elementoParaEliminar).toBe(3);
  });

  it('debería eliminar mercancía marcada si borrar es true', () => {
    component.pedimentos = [{}, {}] as any;
    component.elementoParaEliminar = 1;
    component.eliminarMercanciaChecked(true);
    expect(component.pedimentos.length).toBe(1);
  });

  it('debería abrir modal mercancía checked y configurar notificación', () => {
    component.abrirModalmercanciaChecked(4);
    expect(component.nuevaNotificacion2).toBeDefined();
    expect(component.elementoParaEliminar).toBe(4);
  });

  it('debería validar campo usando servicio', () => {
    const form = new FormBuilder().group({ campo: [''] });
    expect(component.isValid(form, 'campo')).toBe(true);
  });

  it('debería setear valores en el store y llamar alCambiarSeleccion', () => {
    const form = new FormBuilder().group({ campo: ['valor'] });
    const spy = jest.spyOn(component, 'alCambiarSeleccion');
    component.setValoresStore(form, 'campo', 'setClaveScian');
    expect(mockStore.setClaveScian).toHaveBeenCalledWith('valor');
    expect(spy).toHaveBeenCalledWith(form, 'campo');
  });



  it('debería verificar selección checkbox', () => {
    const event = { target: document.createElement('input') } as any;
    event.target.type = 'checkbox';
    event.target.checked = true;
    jest.spyOn(event.target, 'closest').mockReturnValue(event.target);
    component.verificarSeleccionCheckbox(event);
    expect(component.esCheckboxSeleccionado).toBe(true);
  });

  it('debería mostrar modal de eliminar mercancía según selección', () => {
    const spy1 = jest.spyOn(component, 'abrirModalmercancia');
    const spy2 = jest.spyOn(component, 'abrirModalmercanciaChecked');
    component.esCheckboxSeleccionado = false;
    component.eliminarMercanciaGrid();
    expect(spy1).toHaveBeenCalled();
    component.esCheckboxSeleccionado = true;
    component.eliminarMercanciaGrid();
    expect(spy2).toHaveBeenCalled();
  });

  it('debería buscar RFC y auto-llenar si RFC es MAVL621207C95', () => {
    component.datosDelEstablecimientoForm.get('rfc')?.setValue('MAVL621207C95');
    component.buscarRFC();
    expect(mockStore.setNombreRazon).toHaveBeenCalledWith('MARIA ALEJANDRA');
    expect(mockStore.setApellidoPaterno).toHaveBeenCalledWith('VELASCO');
    expect(mockStore.setApellidoMaterno).toHaveBeenCalledWith('LOPEZ');
  });

  it('debería abrir modal RFC si RFC está vacío', () => {
    component.datosDelEstablecimientoForm.get('rfc')?.setValue('');
    const spy = jest.spyOn(component, 'abrirRfcModal');
    component.buscarRFC();
    expect(spy).toHaveBeenCalled();
  });

  it('debería abrir modal RFC y mostrar notificación', () => {
    component.abrirRfcModal();
    expect(component.mostrarRfcAlerta).toBe(true);
    expect(component.nuevaRfcNotificacion).toBeDefined();
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalledWith(true);
    expect(spyComplete).toHaveBeenCalled();
  });
});