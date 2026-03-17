import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud32607Store } from '../../estados/solicitud32607.store';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { CommonModule } from '@angular/common';
import {
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { AgregarEnlaceOperativoComponent } from '../agregar-enlace-operativo/agregar-enlace-operativo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  Domicilios,
  EnlaceOperativo,
  NumeroDeEmpleados,
  SeccionSociosIC,
} from '../../models/solicitud.model';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;
  let solicitudServiceMock: jest.Mocked<SolicitudService>;
  let solicitud32607StoreMock: jest.Mocked<Solicitud32607Store>;
  let solicitud32607QueryMock: jest.Mocked<Solicitud32607Query>;

  beforeEach(async () => {
    solicitudServiceMock = {
      conseguirRecibirNotificaciones: jest.fn(() =>
        of([
          {
            rfc: 'LEQI8101314S7',
            curp: 'LEQI810131HDGSXG05',
            nombre: 'MISAEL',
            apellidoPaterno: 'BARRAGAN',
            apellidoMaterno: 'RUIZ',
          },
          {
            rfc: 'MAJIth621207C95',
            curp: 'MAVL621207HDGRLS06',
            nombre: 'EUROFOODS DE MEXICO',
            apellidoPaterno: 'GONZALEZ',
            apellidoMaterno: 'PINAL',
          },
        ])
      ),
      conseguirEnlaceOperativoDatos: jest.fn(() =>
        of([
          {
            rfc: 'ABC123456XYZ',
            nombre: 'Juan',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'Gómez',
            claveCiudad: '001',
            ciudad: 'Ciudad de México',
            cargo: 'Gerente',
            telefono: '+52 55 1234 5678',
            correo: 'juan.perez@example.com',
            suplente: 'Maria López',
            calle: 'Avenida Reforma',
            numeroExterior: '123',
            numeroInterior: '4B',
            colonia: 'Centro',
            codigoPostal: '01000',
            localidad: 'Ciudad de México',
            delegacionMunicipio: 'Cuauhtémoc',
          },
        ])
      ),
      conseguirRepresentanteLegalDatos: jest.fn(() =>
        of({
          rfcTercero: 'ZURC721023D12',
          rfc: 'ZURC721023D12',
          nombre: 'ROBERTO CARLOS',
          apellidoPaterno: 'CRUZ',
          apellidoMaterno: 'VELAZQUEZ',
          telefono: '22234323',
          correoElectronico: 'vucem2.5@hotmail.com',
        })
      ),
    } as unknown as jest.Mocked<SolicitudService>;

    solicitud32607StoreMock = {
      actualizarRfc: jest.fn(() => of('ZURC721023D12')),
      actualizarNombre: jest.fn(() => of('test')),
      actualizarApellidoPaterno: jest.fn(() => of('test')),
      actualizarApellidoMaterno: jest.fn(() => of('test')),
      actualizarTelefono: jest.fn(() => of('12345')),
      actualizarCorreoElectronico: jest.fn(() => of('vucem2.5@hotmail.com')),
      actualizarRfcTercero: jest.fn(() => of('ZURC721023D12')),
      actualizarEnlaceOperativosLista: jest.fn(() => of('test')),
    } as unknown as jest.Mocked<Solicitud32607Store>;

    solicitud32607QueryMock = {
      selectSolicitud$: of({
        idPersonaSolicitud: 'test',
        rfcTercero: 'test',
        rfc: 'test',
        nombre: 'test',
        apellidoPaterno: 'test',
        apellidoMaterno: 'test',
        telefono: 'test',
        correoElectronico: 'test',

        agregarEnlaceRfcTercero: 'test',
        agregarEnlaceRfc: 'test',
        agregarEnlaceNombre: 'test',
        agregarEnlaceApellidoPaterno: 'test',
        agregarEnlaceApellidoMaterno: 'test',
        agregarEnlaceCiudadEstado: 'test',
        agregarEnlaceCargo: 'test',
        agregarEnlaceTelefono: 'test',
        agregarEnlaceCorreoElectronico: 'test',
        agregarEnlaceSuplente: false,

        '2089': 1,
        '2090': 1,
        '2091': 1,

        '2042': 1,
        '2043': 1,
        '2044': 1,
        fechaInicioComercio: 'test',
        fechaPago: 'test',
        monto: 'test',
        operacionesBancarias: 'test',
        llavePago: 'test',

        transportistaRFC: 'test',
        transportistaRFCModifTrans: 'test',
        transportistaRazonSocial: 'test',
        transportistaDomicilio: 'test',
        transportistaCaat: 'test',
        transportistaIdDomicilio: 'test',
        transportistaIdRFC: 'test',
        transportistaIdRazonSocial: 'test',
        transportistaIdCaat: 'test',

        miembroCaracterDe: 'test',
        miembroTributarMexico: 1,
        miembroNacionalidad: 'test',
        miembroRfc: 'test',
        miembroRegistroFederal: 'test',
        miembroNombreCompleto: 'test',
        miembroTipoPersonaMuestra: 'test',
        miembroNombre: 'test',
        miembroApellidoPaterno: 'test',
        miembroApellidoMaterno: 'test',
        miembroNombreEmpresa: 'test',

        subcontrataRFCBusqueda: 'test',
        subcontrataRFC: 'test',
        subcontrataRazonSocial: 'test',
        subcontrataEmpleados: 'test',
        subcontrataBimestre: 1,

        principales: 1,
        municipio: 'test',
        tipoDeInstalacion: 1,
        entidadFederativa: 'test',
        registroSESAT: 'test',
        descripcion: 'test',
        codigoPostal: 'test',
        procesoProductivo: 1,
        goceDelInmueble: 1,
        empresa: 1,
        comercioExterior: 1,
        mutuo: 1,

        catseleccionados: 1,
        servicio: 1,
        '190': 1,
        '191': 1,
        '199': 1,
        empleados: 'test',
        bimestre: 1,
        '2034': 1,
        '236': 1,
        '237': 1,
        '238': 1,
        '239': 1,
        '240': 1,
        '243': 1,
        '244': 1,
        '245': 1,
        indiqueTodos: 1,
        '246': 1,
        file1: 'test',
        file2: 'test',
        '247': 1,
        '248': 1,
        identificacion: 'test',
        lugarDeRadicacion: 'test',
        '249': 1,
        '250': 1,
        '251': 1,
        checkbox1: true,
        checkbox2: true,
        checkbox3: true,
        actualmente2: 'test',
        actualmente1: 'test',
        numeroDeEmpleadosLista: [] as NumeroDeEmpleados[],
        domiciliosDatos: [] as Domicilios[],
        listaSeccionSociosIC: [] as SeccionSociosIC[],
        enlaceOperativosLista: [] as EnlaceOperativo[],
      }),
    } as unknown as jest.Mocked<Solicitud32607Query>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        TablaDinamicaComponent,
        HttpClientModule,
        AgregarEnlaceOperativoComponent,
        NotificacionesComponent,
        ReactiveFormsModule,
        TercerosRelacionadosComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        { provide: SolicitudService, useValue: solicitudServiceMock },
        { provide: Solicitud32607Store, useValue: solicitud32607StoreMock },
        { provide: Solicitud32607Query, useValue: solicitud32607QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    solicitud32607QueryMock.selectSolicitud$ = of({
      idPersonaSolicitud: 'test',
      rfcTercero: 'test',
      rfc: 'test',
      nombre: 'test',
      apellidoPaterno: 'test',
      apellidoMaterno: 'test',
      telefono: 'test',
      correoElectronico: 'test',
      agregarEnlaceRfcTercero: 'test',
      agregarEnlaceRfc: 'test',
      agregarEnlaceNombre: 'test',
      agregarEnlaceApellidoPaterno: 'test',
      agregarEnlaceApellidoMaterno: 'test',
      agregarEnlaceCiudadEstado: 'test',
      agregarEnlaceCargo: 'test',
      agregarEnlaceTelefono: 'test',
      agregarEnlaceCorreoElectronico: 'test',
      agregarEnlaceSuplente: true,
      '2089': 1,
      '2090': 1,
      '2091': 1,
      '2042': 1,
      '2043': 1,
      '2044': 1,
      fechaInicioComercio: 'test',
      fechaPago: 'test',
      monto: 'test',
      operacionesBancarias: 'test',
      llavePago: 'test',
      transportistaRFC: 'test',
      transportistaRFCModifTrans: 'test',
      transportistaRazonSocial: 'test',
      transportistaDomicilio: 'test',
      transportistaCaat: 'test',
      transportistaIdDomicilio: 'test',
      transportistaIdRFC: 'test',
      transportistaIdRazonSocial: 'test',
      transportistaIdCaat: 'test',
      miembroCaracterDe: 'test',
      miembroTributarMexico: 1,
      miembroNacionalidad: 'test',
      miembroRfc: 'test',
      miembroRegistroFederal: 'test',
      miembroNombreCompleto: 'test',
      miembroTipoPersonaMuestra: 'test',
      miembroNombre: 'test',
      miembroApellidoPaterno: 'test',
      miembroApellidoMaterno: 'test',
      miembroNombreEmpresa: 'test',
      subcontrataRFCBusqueda: 'test',
      subcontrataRFC: 'test',
      subcontrataRazonSocial: 'test',
      subcontrataEmpleados: 'test',
      subcontrataBimestre: 1,
      principales: 1,
      municipio: 'test',
      tipoDeInstalacion: 1,
      entidadFederativa: 'test',
      registroSESAT: 'test',
      descripcion: 'test',
      codigoPostal: 'test',
      procesoProductivo: 1,
      goceDelInmueble: 1,
      empresa: 1,
      comercioExterior: 1,
      mutuo: 1,
      catseleccionados: 1,
      servicio: 1,
      '190': 1,
      '191': 1,
      '199': 1,
      empleados: 'test',
      bimestre: 1,
      '2034': 1,
      '236': 1,
      '237': 1,
      '238': 1,
      '239': 1,
      '240': 1,
      '241': 1,
      '243': 1,
      '244': 1,
      '245': 1,
      indiqueTodos: 1,
      '246': 1,
      file1: 'test',
      file2: 'test',
      '247': 1,
      '248': 1,
      identificacion: 'test',
      lugarDeRadicacion: 'test',
      '249': 1,
      '250': 1,
      '251': 1,
      checkbox1: true,
      checkbox2: true,
      checkbox3: true,
      actualmente2: 'test',
      actualmente1: 'test',
      numeroDeEmpleadosLista: [] as NumeroDeEmpleados[],
      domiciliosDatos: [] as Domicilios[],
      listaSeccionSociosIC: [] as SeccionSociosIC[],
      enlaceOperativosLista: [] as EnlaceOperativo[],
      entidad: 0,
      '301': 0,
      numeroIMMEX: '',
      modalidadIMMEX: '',
      '302': 0,
      rubroCertificacion: '',
      fechaFinVigenciaRubro: '',
      numeroOficio: '',
      '306': 0,
      '307': 0,
      '308': 0,
      inventarioNombre: '',
      inventarioAnexo: false,
      inventarioLugar: '',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    expect(component.tercerosRelacionadosForm.value).toEqual({
      idPersonaSolicitud: 'test',
      rfcTercero: 'test',
      telefono: 'test',
      correoElectronico: 'test',
    });
  });

  it('should call conseguirRecibirNotificaciones on init', () => {
    solicitudServiceMock.conseguirRecibirNotificaciones.mockReturnValue(
      of([
        {
          rfc: 'LEQI8101314S7',
          curp: 'LEQI810131HDGSXG05',
          nombre: 'MISAEL',
          apellidoPaterno: 'BARRAGAN',
          apellidoMaterno: 'RUIZ',
        },
        {
          rfc: 'MAJIth621207C95',
          curp: 'MAVL621207HDGRLS06',
          nombre: 'EUROFOODS DE MEXICO',
          apellidoPaterno: 'GONZALEZ',
          apellidoMaterno: 'PINAL',
        },
      ])
    );
    solicitudServiceMock.conseguirRecibirNotificaciones();
    expect(
      solicitudServiceMock.conseguirRecibirNotificaciones
    ).toHaveBeenCalled();
  });

  it('should call conseguirEnlaceOperativoDatos on init', () => {
    solicitudServiceMock.conseguirEnlaceOperativoDatos.mockReturnValue(
      of([
        {
          rfc: 'ABC123456XYZ',
          nombre: 'Juan',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'Gómez',
          claveCiudad: '001',
          ciudad: 'Ciudad de México',
          cargo: 'Gerente',
          telefono: '+52 55 1234 5678',
          correo: 'juan.perez@example.com',
          suplente: 'Maria López',
          calle: 'Avenida Reforma',
          numeroExterior: '123',
          numeroInterior: '4B',
          colonia: 'Centro',
          codigoPostal: '01000',
          localidad: 'Ciudad de México',
          delegacionMunicipio: 'Cuauhtémoc',
        },
      ])
    );
    solicitudServiceMock.conseguirEnlaceOperativoDatos();
    expect(
      solicitudServiceMock.conseguirEnlaceOperativoDatos
    ).toHaveBeenCalled();
  });

  it('should update store on actualizarRfcTercero', () => {
    const event = { target: { value: 'RFC789' } } as any;
    component.actualizarRfcTercero(event);
    expect(solicitud32607StoreMock.actualizarRfcTercero).toHaveBeenCalledWith(
      'RFC789'
    );
  });

  it('should update store on actualizarTelefono', () => {
    const event = { target: { value: '9876543210' } } as any;
    component.actualizarTelefono(event);
    expect(solicitud32607StoreMock.actualizarTelefono).toHaveBeenCalledWith(
      '9876543210'
    );
  });

  it('should not throw if guardarDatosEnlaceOperativo is called and modificacionEnlaceOperativoElement does not exist', () => {
    component.modificacionEnlaceOperativoElement = null as any;
    expect(() => component.guardarDatosEnlaceOperativo()).not.toThrow();
  });

  it('should not throw if guardarModificacionEnlaceOperativo is called and modificacionEnlaceOperativoElement does not exist', () => {
    component.modificacionEnlaceOperativoElement = null as any;
    expect(() => component.guardarModificacionEnlaceOperativo()).not.toThrow();
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(
      component,
      'guardarDatosFormulario'
    );
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(
      component,
      'inicializarFormulario'
    );
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario and disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.tercerosRelacionadosForm = {
      disable: jest.fn(),
      enable: jest.fn(),
    } as any;
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.tercerosRelacionadosForm.disable).toHaveBeenCalled();
    expect(component.tercerosRelacionadosForm.enable).not.toHaveBeenCalled();
  });

  it('should call inicializarFormulario and enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.tercerosRelacionadosForm = {
      disable: jest.fn(),
      enable: jest.fn(),
    } as any;
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.tercerosRelacionadosForm.enable).toHaveBeenCalled();
    expect(component.tercerosRelacionadosForm.disable).not.toHaveBeenCalled();
  });

  it('should not call enable or disable if esFormularioSoloLectura is neither true nor false in guardarDatosFormulario', () => {
    component.inicializarFormulario = jest.fn();
    component.tercerosRelacionadosForm = {
      disable: jest.fn(() => of()),
      enable: jest.fn(() => of()),
    } as any;
    component.guardarDatosFormulario();
    expect(component.inicializarFormulario).toHaveBeenCalled();
  });

  it('should set seleccionEnlaceOperativoDatos when seleccionEnlaceOperativo is called', () => {
    const mockEnlaces: any[] = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }];
    component.seleccionEnlaceOperativo(mockEnlaces);
    expect(component.seleccionEnlaceOperativoDatos).toBe(mockEnlaces);
  });

  it('should remove the selected enlace operativo when cerrarDialogoEnlaceOperativo is called and seleccionEnlaceOperativoDatos has elements', () => {
    component.seleccionEnlaceOperativoDatos = [{ rfc: 'RFC1' }] as any;
    component.enlaceOperativosLista = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }] as any;
    component.cerrarDialogoEnlaceOperativo();
    expect(component.enlaceOperativosLista).toEqual([{ rfc: 'RFC2' }]);
  });

  it('should not modify enlaceOperativosLista if seleccionEnlaceOperativoDatos is empty when cerrarDialogoEnlaceOperativo is called', () => {
    component.seleccionEnlaceOperativoDatos = [] as any;
    component.enlaceOperativosLista = [{ rfc: 'RFC1' }, { rfc: 'RFC2' }] as any;
    component.cerrarDialogoEnlaceOperativo();
    expect(component.enlaceOperativosLista).toEqual([
      { rfc: 'RFC1' },
      { rfc: 'RFC2' },
    ]);
  });

  it('should update store on actualizarCorreoElectronico', () => {
    const event = { target: { value: 'new@example.com' } } as any;
    component.actualizarCorreoElectronico(event);
    expect(
      solicitud32607StoreMock.actualizarCorreoElectronico
    ).toHaveBeenCalledWith('new@example.com');
  });

  it('should add a new enlace operativo and pedimento, open modal, and update store when agregarEnlaceOperativo is called', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    const actualizarEnlaceOperativosListaSpy = jest.spyOn(
      solicitud32607StoreMock,
      'actualizarEnlaceOperativosLista'
    );
    component.pedimentos = [];
    component.enlaceOperativosLista = [{ rfc: 'RFC_EXISTENTE' }] as any;
    const nuevoEnlace: any = { rfc: 'RFC_NUEVO', nombre: 'Nuevo' };

    component.agregarEnlaceOperativo(nuevoEnlace);

    expect(abrirModalSpy).toHaveBeenCalledWith(
      'Se debe registrar por lo menos un enlace operativo que no sea suplente.'
    );

    expect(component.pedimentos.length).toBe(1);
    expect(component.pedimentos[0]).toEqual({
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    });

    expect(component.enlaceOperativosLista).toContainEqual(nuevoEnlace);
    expect(component.enlaceOperativosLista.length).toBe(2);

    expect(actualizarEnlaceOperativosListaSpy).toHaveBeenCalledWith(
      component.enlaceOperativosLista
    );
  });

  it('should set nuevaNotificacion and elementoParaEliminar when abrirModal is called', () => {
    component.nuevaNotificacion = undefined as any;
    component.elementoParaEliminar = undefined as any;
    const mensaje = 'Mensaje de prueba';
    const index = 3;

    component.abrirModal(mensaje, index);

    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
    expect(component.elementoParaEliminar).toBe(index);
  });

  it('should set elementoParaEliminar to 0 if not provided in abrirModal', () => {
    component.elementoParaEliminar = undefined as any;
    component.abrirModal('Mensaje sin índice');
    expect(component.elementoParaEliminar).toBe(0);
  });

  it('should not call store update methods if rfcTercero does not exist in buscarTerceroNacionalIDC', () => {
    component.tercerosRelacionadosForm = {
      get: jest.fn().mockReturnValue({ value: '' }),
    } as any;

    component.buscarTerceroNacionalIDC();

    expect(
      solicitudServiceMock.conseguirRepresentanteLegalDatos
    ).not.toHaveBeenCalled();
    expect(solicitud32607StoreMock.actualizarRfc).not.toHaveBeenCalled();
    expect(solicitud32607StoreMock.actualizarNombre).not.toHaveBeenCalled();
    expect(
      solicitud32607StoreMock.actualizarApellidoPaterno
    ).not.toHaveBeenCalled();
    expect(
      solicitud32607StoreMock.actualizarApellidoMaterno
    ).not.toHaveBeenCalled();
    expect(solicitud32607StoreMock.actualizarTelefono).not.toHaveBeenCalled();
    expect(
      solicitud32607StoreMock.actualizarCorreoElectronico
    ).not.toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
