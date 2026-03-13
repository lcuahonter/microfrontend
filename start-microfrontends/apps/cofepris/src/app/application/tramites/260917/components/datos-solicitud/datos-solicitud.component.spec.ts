import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { Tramite260917Query } from '../../estados/queries/tramite260917.query';
import { Tramite260917Store } from '../../estados/tramites/tramite260917.store';
import { of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, QueryList } from '@angular/core';

describe('DatosSolicitudComponent', () => {
  let componente: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;

  const ESTADO_SOLICITUD_MOCK: Record<string, string> = {
    tipoOperacion: 'importación',
    justificacion: 'Razón válida',
    rfcResponsableSanitario: 'RFC123456ABC',
    razonSocial: 'Empresa S.A. de C.V.',
    correoElectronico: 'correo@ejemplo.com',
    codigoPostal: '12345',
    estado: 'CDMX',
    muncipio: 'Benito Juárez',
    localidad: 'Del Valle',
    colonia: 'Colonia A',
    calle: 'Calle Falsa 123',
    lada: '55',
    telefono: '12345678',
    avisoCheckbox: 'true',
    licenciaSanitaria: 'LS123',
    marcarEnCasoDeQueSea: 'Sí',
    regimen: 'General',
    aduanasEntradas: 'Aduana 1',
    numeroPermiso: 'NP123',
    claveScianModal: 'SC123',
    claveDescripcionModal: 'Descripción SC',
    clasificacion: 'tipoA',
    especificarClasificacionProducto: 'ProductoX',
    denominacionEspecifica: 'EspX',
    denominacionDistintiva: 'DistX',
    denominacionComun: 'ComX',
    tipoDeProducto: 'Químico',
    estadoFisico: 'Líquido',
    fraccionArancelaria: '12345678',
    descripcionFraccion: 'Fracción X',
    cantidadUMT: '100',
    UMT: 'kg',
    cantidadUMC: '200',
    UMC: 'litros',
    presentacion: 'Botella',
    numeroRegistro: 'REG123',
    fechaCaducidad: '2025-12-31',
    claveDeLosLotes: 'LOTE123',
    aceptaManifiestos: 'Sí',
    aceptaPublicacion: 'Sí',
    rfcRepresentante: 'RFCREP123',
    razonSocialRepresentante: 'Representante S.A.',
    apellidoPaternoRepresentante: 'Pérez',
    apellidoMaternoRepresentante: 'Gómez',
  };

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosSolicitudComponent,require('@angular/common/http/testing').HttpClientTestingModule],
      providers: [
        {
          provide: Tramite260917Query,
          useValue: {
            selectSolicitud$: of(ESTADO_SOLICITUD_MOCK),
          },
        },
        {
          provide: Tramite260917Store,
          useValue: {
            setTipoOperacion: jest.fn(),
            setJustificacion: jest.fn(),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosSolicitudComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', (): void => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el formulario "domicilio" con valores del estado', (): void => {
    const formulario = componente.domicilio;
    expect(formulario.get('tipoOperacion')?.value).toBe(ESTADO_SOLICITUD_MOCK['tipoOperacion']);
    expect(formulario.get('justificacion')?.value).toBe(ESTADO_SOLICITUD_MOCK['justificacion']);
    expect(formulario.get('rfcResponsableSanitario')?.value).toBe(ESTADO_SOLICITUD_MOCK['rfcResponsableSanitario']);
    expect(formulario.get('estado')?.value).toBe(ESTADO_SOLICITUD_MOCK['estado']);
  });

  it('debería inicializar el formulario "formAgente" con valores del estado', (): void => {
    const formulario = componente.formAgente;
    expect(formulario.get('claveScianModal')?.value).toBe(ESTADO_SOLICITUD_MOCK['claveScianModal']);
    expect(formulario.get('claveDescripcionModal')?.value).toBe(ESTADO_SOLICITUD_MOCK['claveDescripcionModal']);
  });

  it('debería inicializar el formulario "formMercancias" con valores del estado', (): void => {
    const formulario = componente.formMercancias;
    expect(formulario.get('clasificacion')?.value).toBe(ESTADO_SOLICITUD_MOCK['clasificacion']);
    expect(formulario.get('cantidadUMT')?.value).toBe(ESTADO_SOLICITUD_MOCK['cantidadUMT']);
    expect(formulario.get('presentacion')?.value).toBe(ESTADO_SOLICITUD_MOCK['presentacion']);
  });

  it('debería inicializar el formulario "formularioManifiestos" con valores del estado', (): void => {
    const formulario = componente.formularioManifiestos;
    expect(formulario.get('aceptaManifiestos')?.value).toBe(ESTADO_SOLICITUD_MOCK['aceptaManifiestos']);
    expect(formulario.get('rfcRepresentante')?.value).toBe(ESTADO_SOLICITUD_MOCK['rfcRepresentante']);
    expect(formulario.get('razonSocialRepresentante')?.value).toBe(ESTADO_SOLICITUD_MOCK['razonSocialRepresentante']);
  });

  it('debería cambiar el valor de fechaCaducidad al llamar cambioFechaFinal()', (): void => {
    const NUEVA_FECHA: string = '2026-01-01';

    componente.formMercancias = new FormGroup({
      fechaCaducidad: new FormControl(''),
    });

    componente.cambioFechaFinal(NUEVA_FECHA);

    expect(componente.formMercancias.get('fechaCaducidad')?.value).toBe(NUEVA_FECHA);
    expect(componente.formMercancias.get('fechaCaducidad')?.untouched).toBe(true);
  });

  it('debería alternar el valor de colapsable al llamar mostrar_colapsable()', (): void => {
    componente.colapsable = false;
    componente.mostrar_colapsable();
    expect(componente.colapsable).toBe(true);

    componente.mostrar_colapsable();
    expect(componente.colapsable).toBe(false);
  });

  it('debería alternar el valor de colapsableDos al llamar mostrar_colapsableDos()', (): void => {
    componente.colapsableDos = false;
    componente.mostrar_colapsableDos();
    expect(componente.colapsableDos).toBe(true);

    componente.mostrar_colapsableDos();
    expect(componente.colapsableDos).toBe(false);
  });

  it('debería alternar el valor de colapsableTres al llamar mostrar_colapsableTres()', (): void => {
    componente.colapsableTres = false;
    componente.mostrar_colapsableTres();
    expect(componente.colapsableTres).toBe(true);

    componente.mostrar_colapsableTres();
    expect(componente.colapsableTres).toBe(false);
  });

  it('debería llamar al método del store con el valor del campo usando setValoresStore()', (): void => {
    const CAMPO: string = 'justificacion';
    const VALOR_ESPERADO: string = 'valor de prueba';

    const formulario = new FormGroup({
      [CAMPO]: new FormControl(VALOR_ESPERADO),
    });

    const metodoMock = jest.fn();
    componente['tramite260917Store'] = {
      setJustificacion: metodoMock,
    } as unknown as Tramite260917Store;

    componente.setValoresStore(formulario, CAMPO, 'setJustificacion');

    expect(metodoMock).toHaveBeenCalledWith(VALOR_ESPERADO);
  });

  it('debería establecer nueva notificación y el índice del elemento para eliminar al abrir el modal', (): void => {
    componente.abrirModal(2);

    expect(componente['nuevaNotificacion']).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Por el momento no hay comunicación con el Sistema de COFEPRIS, favor de capturar su establecimiento.',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    });

    expect(componente['elementoParaEliminar']).toBe(2);
  });

  it('debería ejecutar correctamente las funciones de paisDeProcedenciaBotons', (): void => {
    const mockAgregar = jest.fn();
    const mockQuitar = jest.fn();

    // Simular el crossList con funciones agregadas/quitar
    componente['crossList'] = {
      toArray: (): unknown[] => [
        { agregar: mockAgregar, quitar: mockQuitar },
        { agregar: jest.fn(), quitar: jest.fn() },
        { agregar: jest.fn(), quitar: jest.fn() },
      ],
    } as unknown as QueryList<any>;

    // Ejecutar cada función del grupo uno
    componente.paisDeProcedenciaBotons[0].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('t');

    componente.paisDeProcedenciaBotons[1].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotons[2].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotons[3].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('t');
  });

  it('debería ejecutar correctamente las funciones de paisDeProcedenciaBotonsDos', (): void => {
    const mockAgregar = jest.fn();
    const mockQuitar = jest.fn();

    componente['crossList'] = {
      toArray: (): unknown[] => [
        { agregar: jest.fn(), quitar: jest.fn() },
        { agregar: mockAgregar, quitar: mockQuitar },
        { agregar: jest.fn(), quitar: jest.fn() },
      ],
    } as unknown as QueryList<any>;

    componente.paisDeProcedenciaBotonsDos[0].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('t');

    componente.paisDeProcedenciaBotonsDos[1].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotonsDos[2].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotonsDos[3].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('t');
  });

  it('debería ejecutar correctamente las funciones de paisDeProcedenciaBotonsTres', (): void => {
    const mockAgregar = jest.fn();
    const mockQuitar = jest.fn();

    componente['crossList'] = {
      toArray: (): unknown[] => [
        { agregar: jest.fn(), quitar: jest.fn() },
        { agregar: jest.fn(), quitar: jest.fn() },
        { agregar: mockAgregar, quitar: mockQuitar },
      ],
    } as unknown as QueryList<any>;

    componente.paisDeProcedenciaBotonsTres[0].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('t');

    componente.paisDeProcedenciaBotonsTres[1].funcion();
    expect(mockAgregar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotonsTres[2].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('');

    componente.paisDeProcedenciaBotonsTres[3].funcion();
    expect(mockQuitar).toHaveBeenCalledWith('t');
  });



});
