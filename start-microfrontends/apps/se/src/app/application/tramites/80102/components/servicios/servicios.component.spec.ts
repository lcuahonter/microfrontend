import { ServiciosComponent } from "./servicios.component";



describe('ServiciosComponent', () => {
  let component: ServiciosComponent;
  let fb: any;
  let Tramite80102Query: any;
  let Tramite80102Store: any;
  let autorizacionProgrmaNuevoService: any;
  let catalogosServices: any;
  let consultaQuery: any;
  let servicioDeFormularioService: any;

  beforeEach(() => {
    fb = { group: jest.fn().mockReturnValue({
      patchValue: jest.fn(),
      get: jest.fn().mockReturnValue({ setValue: jest.fn() }),
      disable: jest.fn(),
      reset: jest.fn(),
      valid: true,
      value: {}
    }) };
    Tramite80102Query = {
      selectAduanaDeIngresoSelecion$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      selectdatosEmpresaExtranjera$: { subscribe: jest.fn() },
      select: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }),
      selectDatos$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() },
      selectDatosImmex$: { subscribe: jest.fn() },
      selectAduanaDeIngreso$: { subscribe: jest.fn() }
    };
    Tramite80102Store = {
      setFormValida: jest.fn(),
      setPaisesOrigen: jest.fn(),
      setRfcEmpresa: jest.fn(),
      setNumeroPrograma: jest.fn(),
      setTiempoPrograma: jest.fn(),
      setInfoRegistro: jest.fn(),
      setDatosImmex: jest.fn(),
      setDatos: jest.fn(),
      setCamposEmpresa: jest.fn(),
      setAduanaDeIngreso: jest.fn(),
      setAduanaDeIngresoSeleccion: jest.fn(),
      eliminarDatosEmpresaExtranjera: jest.fn(),
      agregarDdatosEmpresaExtranjera: jest.fn()
    };
    autorizacionProgrmaNuevoService = {
      getPais: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn(cb => cb({ datos: [{ clave: '1' }] })) }),
      getDatos: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn(cb => cb({})) }),
      obtenerIngresoSelectList: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn(cb => cb([{ id: 1 }])) }),
      getServicoImmex: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis(), subscribe: jest.fn(cb => cb({ datos: [{ id: 1 }] })) })
    };
    catalogosServices = {};
    consultaQuery = {
      selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() }
    };
    servicioDeFormularioService = {
      setArray: jest.fn(),
      registerArray: jest.fn()
    };

    component = new ServiciosComponent(
      fb,
      Tramite80102Query,
      Tramite80102Store,
      autorizacionProgrmaNuevoService,
      catalogosServices,
      consultaQuery,
      servicioDeFormularioService
    );
    component.camposFormulario = [{
      campo: 'entidadFederativaEmpresaExt',
      opciones: [],
      labelNombre: '',
      class: '',
      tipo_input: '',
      required: false,
      orden: 0
    }];
    component.recibioDatos = [{ descripcion: 'desc', clave: 'clave', tipode: 'tipo' }];
    component.datosEmpresaExtranjera = [{ id: '1', taxIdEmpresaExt: 'tax', nombreEmpresaExt: 'nombre', entidadFederativaEmpresaExt: 'entidad', direccionEmpresaExtranjera: 'dir' }];
    component.formularioEmpresaExtranjera = fb.group();
    component.datos = [];
    component.datosImmex = [];
    component.empresaExtranjeraSeleccionados = [];
    component.empresasSeleccionados = [];
    component.domiciliosSeleccionados = [];
    component.rfcEmpresa = 'RFC';
    component.numeroPrograma = 'NUM';
    component.tiempoPrograma = 'TIME';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCatalogoPaises and update camposFormulario', () => {
    component.getCatalogoPaises();
    expect(Tramite80102Store.setPaisesOrigen).toHaveBeenCalled();
    expect(component.camposFormulario[0].opciones).toBeDefined();
  });

  it('should call enCambioDeCampo for rfcEmpresa', () => {
    component.enCambioDeCampo('rfcEmpresa', 'RFC123');
    expect(Tramite80102Store.setRfcEmpresa).toHaveBeenCalledWith('RFC123');
  });

  it('should call enCambioDeCampo for numeroPrograma', () => {
    component.enCambioDeCampo('numeroPrograma', 'NP');
    expect(Tramite80102Store.setNumeroPrograma).toHaveBeenCalledWith('NP');
  });

  it('should call enCambioDeCampo for tiempoPrograma', () => {
    component.enCambioDeCampo('tiempoPrograma', 'TP');
    expect(Tramite80102Store.setTiempoPrograma).toHaveBeenCalledWith('TP');
  });

  it('should not call anything for unknown field in enCambioDeCampo', () => {
    expect(() => component.enCambioDeCampo('other', 'val')).not.toThrow();
  });

  it('should call suscribirseADatos', () => {
    component.suscribirseADatos();
    expect(servicioDeFormularioService.setArray).toHaveBeenCalledWith('empresasNacionales', component.datos);
  });

  it('should call suscribirseAFields', () => {
    component.suscribirseAFields();
    expect(component.rfcEmpresa).toBeDefined();
    expect(component.numeroPrograma).toBeDefined();
    expect(component.tiempoPrograma).toBeDefined();
  });

  it('should call getDatos', () => {
    component.getDatos();
    expect(Tramite80102Store.setInfoRegistro).toHaveBeenCalled();
  });

  it('should call suscribirseADatosImmex', () => {
    component.suscribirseADatosImmex();
    expect(servicioDeFormularioService.setArray).toHaveBeenCalledWith('serviciosImmex', component.datosImmex);
  });

  it('should call obtenerIngresoSelectList', () => {
    component.obtenerIngresoSelectList();
    expect(Tramite80102Store.setAduanaDeIngreso).toHaveBeenCalled();
  });

  it('should show error notification if domiciliosSeleccionados is empty on eliminarServiciosGrid', () => {
    component.domiciliosSeleccionados = [];
    component.eliminarServiciosGrid();
    expect(component.nuevaNotificacionRfc).toBeTruthy();
    expect(component.mostrarNotificacionAgregar).toBeFalsy();
  });

  it('should show modal for eliminarServiciosGrid', () => {
    component.domiciliosSeleccionados = [{ descripionDelServicio: 'desc' }];
    component.eliminarServiciosGrid();
    expect(component.mostrarNotificacionAgregar).toBeTruthy();
    expect(component.notificacionAgregarServicio).toBeTruthy();
  });

  it('should show error notification if recibioDatos is empty on agregarServiciosAmpliacion', () => {
    component.recibioDatos = [];
    component.agregarServiciosAmpliacion();
    expect(component.nuevaNotificacionRfc).toBeTruthy();
  });

  it('should call ejecutarAgregarServicio on agregarServiciosAmpliacion', () => {
    component.recibioDatos = [{ descripcion: 'desc', clave: 'clave', tipode: 'tipo' }];
    component.datosImmex = [];
    component.agregarServiciosAmpliacion();
    expect(Tramite80102Store.setDatosImmex).toHaveBeenCalled();
  });

  it('should handle manejarConfirmacion for agregar', () => {
    component.tipoAccionModal = 'agregar';
    component.recibioDatos = [{ descripcion: 'desc', clave: 'clave', tipode: 'tipo' }];
    component.datosImmex = [];
    component.manejarConfirmacion(true);
    expect(Tramite80102Store.setDatosImmex).toHaveBeenCalled();
  });

  it('should handle manejarConfirmacion for eliminar', () => {
    component.tipoAccionModal = 'eliminar';
    component.datosImmex = [{ descripionDelServicio: 'desc' }];
    component.domiciliosSeleccionados = [{ descripionDelServicio: 'desc' }];
    component.manejarConfirmacion(true);
    expect(Tramite80102Store.setDatosImmex).toHaveBeenCalled();
    expect(component.domiciliosSeleccionados.length).toBe(0);
  });

  it('should not call anything if confirmado is false in manejarConfirmacion', () => {
    component.manejarConfirmacion(false);
    expect(component.mostrarNotificacionAgregar).toBeFalsy();
  });

  it('should show error notification in mostrarNotificacionError', () => {
    //component.mostrarNotificacionError('error');
    expect(component.nuevaNotificacionRfc).toBeTruthy();
  });

  it('should clear notification in confirmarNotificacionRfc', () => {
    component.nuevaNotificacionRfc = { tipoNotificacion: 'alert', categoria: 'danger', modo: 'error', titulo: '', mensaje: '', ttl: '', cerrar: true, txtBtnAceptar: '', txtBtnCancelar: '' };
    component.confirmarNotificacionRfc(true);
    expect(component.nuevaNotificacionRfc).toBeNull();
  });

  it('should show error notification if empresasSeleccionados is empty on eliminarEmpresasNacionales', () => {
    component.empresasSeleccionados = [];
    component.eliminarEmpresasNacionales();
    expect(component.notificacionAgregarServicios).toBeTruthy();
  });

  it('should show modal for eliminarEmpresasNacionales', () => {
    component.empresasSeleccionados = [{ registroContribuyentes: 'reg' }];
    component.eliminarEmpresasNacionales();
    expect(component.notificacionAgregarEmpresas).toBeTruthy();
    expect(component.mostrarEmpresasAgregar).toBeTruthy();
  });

  it('should execute ejecutarEliminarEmpresasServicio', () => {
    component.datos = [{ registroContribuyentes: 'reg' }];
    component.empresasSeleccionados = [{ registroContribuyentes: 'reg' }];
    component.ejecutarEliminarEmpresasServicio();
    expect(Tramite80102Store.setDatos).toHaveBeenCalled();
    expect(component.empresasSeleccionados.length).toBe(0);
  });

  it('should show error notification if domiciliosSeleccionados is empty on actualizaGridEmpresasNacionales', () => {
    component.domiciliosSeleccionados = [];
    component.actualizaGridEmpresasNacionales();
    expect(component.nuevaNotificacionRfc).toBeTruthy();
  });

  it('should show error notification if rfcEmpresa, numeroPrograma, tiempoPrograma are empty on actualizaGridEmpresasNacionales', () => {
    component.domiciliosSeleccionados = [{ descripionDelServicio: 'desc' }];
    component.rfcEmpresa = '';
    component.numeroPrograma = '';
    component.tiempoPrograma = '';
    component.actualizaGridEmpresasNacionales();
    expect(component.nuevaNotificacionRfc).toBeTruthy();
  });

  it('should update grid on actualizaGridEmpresasNacionales', () => {
    component.domiciliosSeleccionados = [{ descripionDelServicio: 'desc' }];
    component.rfcEmpresa = 'RFC';
    component.numeroPrograma = 'NUM';
    component.tiempoPrograma = 'TIME';
    component.recibioDatos = [{ descripcion: 'desc' }];
    component.datos = [];
    component.actualizaGridEmpresasNacionales();
    expect(Tramite80102Store.setDatos).toHaveBeenCalled();
    expect(Tramite80102Store.setCamposEmpresa).toHaveBeenCalled();
    expect(component.rfcEmpresa).toBe('');
    expect(component.numeroPrograma).toBe('');
    expect(component.tiempoPrograma).toBe('');
  });

  it('should process data in procesarDatosDelHijo', () => {
    const data:any = { descripcion: 'desc' };
    component.formularioEmpresaExtranjera = fb.group();
    component.procesarDatosDelHijo(data);
    expect(component.recibioDatos.length).toBe(1);
    expect(Tramite80102Store.setAduanaDeIngresoSeleccion).toHaveBeenCalled();
  });

  it('should select domicilios', () => {
    component.seleccionarDomicilios({ descripionDelServicio: 'desc' });
    expect(component.domiciliosSeleccionados.length).toBe(1);
  });

  it('should select empresas', () => {
    component.seleccionarEmpresas({ registroContribuyentes: 'reg' });
    expect(component.empresasSeleccionados.length).toBe(1);
  });

  it('should not call eliminarEmpresaExtranjera if empresaExtranjeraSeleccionados is empty', () => {
    component.empresaExtranjeraSeleccionados = [];
    component.eliminarEmpresaExtranjera();
    expect(Tramite80102Store.eliminarDatosEmpresaExtranjera).not.toHaveBeenCalled();
  });

  it('should call eliminarEmpresaExtranjera', () => {
    component.empresaExtranjeraSeleccionados = [{
      id: '1',
      taxIdEmpresaExt: 'tax',
      nombreEmpresaExt: 'nombre',
      entidadFederativaEmpresaExt: 'entidad',
      direccionEmpresaExtranjera: 'dir'
    }];
    component.eliminarEmpresaExtranjera();
    expect(Tramite80102Store.eliminarDatosEmpresaExtranjera).toHaveBeenCalled();
    expect(component.empresaExtranjeraSeleccionados.length).toBe(0);
  });

  it('should call agregarEmpresaExtranjera', () => {
    component.formularioEmpresaExtranjera = {
      value: { servicioExt: 'desc', taxIdEmpresaExt: '', nombreEmpresaExt: '', entidadFederativaEmpresaExt: '', direccionEmpresaExtranjera: '' },
      reset: jest.fn(),
      patchValue: jest.fn()
    } as any;
    component.recibioDatos = [{ descripcion: 'desc' }];
    component.agregarEmpresaExtranjera();
    expect(Tramite80102Store.agregarDdatosEmpresaExtranjera).toHaveBeenCalled();
    expect(component.formularioEmpresaExtranjera.reset).toHaveBeenCalled();
  });

  it('should convert input to uppercase in onInputChange', () => {
    component.formularioEmpresaExtranjera = { patchValue: jest.fn() } as any;
    const event = { target: { value: 'abc' } } as any;
    component.onInputChange('nombreEmpresaExt', event);
    expect(component.formularioEmpresaExtranjera.patchValue).toHaveBeenCalledWith({ nombreEmpresaExt: 'ABC' });
    component.onInputChange('direccionEmpresaExtranjera', event);
    expect(component.formularioEmpresaExtranjera.patchValue).toHaveBeenCalledWith({ direccionEmpresaExtranjera: 'ABC' });
  });

  it('should call obtainorServico', () => {
    component.obtainorServico();
    expect(component.aduanaDeIngreso).toBeDefined();
  });

  it('should handle manejarEmpresasConfirmacion', () => {
    component.empresasSeleccionados = [{ registroContribuyentes: 'reg' }];
    component.datos = [{ registroContribuyentes: 'reg' }];
    component.mostrarEmpresasAgregar = true;
    component.manejarEmpresasConfirmacion(true);
    expect(component.mostrarEmpresasAgregar).toBeFalsy();
    expect(component.empresasSeleccionados.length).toBe(0);
  });

  it('should handle manejarEmpresasConfirmacion with false', () => {
    component.mostrarEmpresasAgregar = true;
    component.manejarEmpresasConfirmacion(false);
    expect(component.mostrarEmpresasAgregar).toBeFalsy();
  });

  it('should call ngOnChanges and register/set arrays', () => {
    component.datosImmex = [];
    component.datos = [];
    component.datosEmpresaExtranjera = [];
    component.ngOnChanges();
    expect(servicioDeFormularioService.registerArray).toHaveBeenCalled();
    component.datosImmex = [{} as any];
    component.datos = [{} as any];
    component.datosEmpresaExtranjera = [{} as any];
    component.ngOnChanges();
    expect(servicioDeFormularioService.setArray).toHaveBeenCalled();
  });

  it('should call ngOnInit and disable forms if readonly', () => {
    consultaQuery.selectConsultaioState$.pipe().subscribe = jest.fn(cb => cb({ readonly: true }));
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(component.formulario.disable).toHaveBeenCalled();
    expect(component.formularioEmpresaExtranjera.disable).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyNotifier$'], 'next');
    const spyComplete = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});