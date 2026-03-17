import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DomicilioEstablecimientoAduanasComponent } from './domicilio-establecimiento-aduanas.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AvisocalidadStore } from '../../estados/stores/aviso-calidad.store';
import { AvisocalidadQuery } from '../../estados/queries/aviso-calidad.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDomicilioLegalService } from '../../services/datos-domicilio-legal.service';
import { DatosDomicilioService } from '../../../tramites/260512/services/datos-domicilio.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DomicilioEstablecimientoAduanasComponent', () => {
  let component: DomicilioEstablecimientoAduanasComponent;
  let fixture: ComponentFixture<DomicilioEstablecimientoAduanasComponent>;
  let avisocalidadStoreMock: any;
  let avisocalidadQueryMock: any;
  let consultaioQueryMock: any;
  let datosDomicilioLegalServiceMock: any;
  let datosDomicilioServiceMock: any;

  beforeEach(async () => {
    avisocalidadStoreMock = {
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setClaveScianModal: jest.fn(),
      setClaveDescripcionModal: jest.fn(),
      setNombreComercial: jest.fn(),
      setNombreComun: jest.fn(),
      setNombreCientifico: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setEstadoFisico: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionFraccion: jest.fn(),
      setCantidadUMT: jest.fn(),
      setUMT: jest.fn(),
      setCantidadUMC: jest.fn(),
      setUMC: jest.fn(),
      setNumerocas: jest.fn(),
      setPorcentajeConcentracion: jest.fn(),
      setClasificacionToxicologica: jest.fn(),
      setObjetoImportacion: jest.fn(),
    };
    avisocalidadQueryMock = {
      selectSolicitud$: of({
        codigoPostal: '12345',
        estado: 'Estado',
        muncipio: 'Municipio',
        localidad: 'Localidad',
        colonia: 'Colonia',
        calle: 'Calle',
        lada: '01',
        telefono: '5555555',
        avisoCheckbox: true,
        licenciaSanitaria: 'LS123',
        claveScianModal: 'SCIAN',
        claveDescripcionModal: 'Desc',
        nombreComercial: 'Comercial',
        nombreComun: 'Comun',
        nombreCientifico: 'Cientifico',
        usoEspecifico: 'Uso',
        estadoFisico: 'Solido',
        fraccionArancelaria: 'FA',
        descripcionFraccion: 'DescF',
        cantidadUMT: '1',
        UMT: 'UMT',
        cantidadUMC: '2',
        UMC: 'UMC',
        numeroCas: 'CAS',
        porcentajeConcentracion: '10',
        clasificacionToxicologica: 'Tox',
        objetoImportacion: 'Obj',
      }),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };
    datosDomicilioLegalServiceMock = {
      getObtenerEstadoList: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Estado1' }] })),
    };
    datosDomicilioServiceMock = {
      getObtenerTablaDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Nico1' }] })),
      getObtenerMercanciasDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, nombre: 'Mercancia1' }] })),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicilioEstablecimientoAduanasComponent],
      providers: [
        FormBuilder,
        { provide: AvisocalidadStore, useValue: avisocalidadStoreMock },
        { provide: AvisocalidadQuery, useValue: avisocalidadQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: DatosDomicilioLegalService, useValue: datosDomicilioLegalServiceMock },
        { provide: DatosDomicilioService, useValue: datosDomicilioServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioEstablecimientoAduanasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar los formularios con valores de solicitudState', () => {
    expect(component.domicilio.value.codigoPostal).toBe('12345');
    expect(component.formAgente.value.claveScianModal).toBe('SCIAN');
    expect(component.formMercancias.value.nombreComercial).toBe('Comercial');
  });

  it('debe deshabilitar los formularios si esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;
    component.solicitudState = {
      codigoPostal: '12345',
      estado: 'Estado',
      muncipio: 'Municipio',
      localidad: 'Localidad',
      colonia: 'Colonia',
      calle: 'Calle',
      lada: '01',
      telefono: '5555555',
      avisoCheckbox: true,
      licenciaSanitaria: 'LS123',
      claveScianModal: 'SCIAN',
      claveDescripcionModal: 'Desc',
      nombreComercial: 'Comercial',
      nombreComun: 'Comun',
      nombreCientifico: 'Cientifico',
      usoEspecifico: 'Uso',
      estadoFisico: 'Solido',
      fraccionArancelaria: 'FA',
      descripcionFraccion: 'DescF',
      cantidadUMT: '1',
      UMT: 'UMT',
      cantidadUMC: '2',
      UMC: 'UMC',
      numeroCas: 'CAS',
      porcentajeConcentracion: '10',
      clasificacionToxicologica: 'Tox',
      objetoImportacion: 'Obj',
      claveReferencia: '',
      cadenaDependencia: '',
      banco: '',
      llavePago: '',
      fechaPago: '',
      importePago: '', 
      rfcDel: '', 
      denominacionRazonSocial: '', 
      correoElectronico: '', 
    };
    component.configurarGrupoForm();
    expect(component.domicilio.disabled).toBe(true);
    expect(component.formAgente.disabled).toBe(true);
    expect(component.formMercancias.disabled).toBe(true);
  });

  it('debe llamar setValoresStore y actualizar el store', () => {
    component.domicilio.get('codigoPostal')?.setValue('54321');
    component.setValoresStore(component.domicilio, 'codigoPostal', 'setCodigoPostal');
    expect(avisocalidadStoreMock.setCodigoPostal).toHaveBeenCalledWith('54321');
  });

  it('debe llamar setValoresStore para todos los formularios y campos', () => {
    // domicilio
    component.domicilio.get('estado')?.setValue('NuevoEstado');
    component.setValoresStore(component.domicilio, 'estado', 'setEstado');
    expect(avisocalidadStoreMock.setEstado).toHaveBeenCalledWith('NuevoEstado');
    component.domicilio.get('muncipio')?.setValue('NuevoMunicipio');
    component.setValoresStore(component.domicilio, 'muncipio', 'setMuncipio');
    expect(avisocalidadStoreMock.setMuncipio).toHaveBeenCalledWith('NuevoMunicipio');
    component.domicilio.get('localidad')?.setValue('NuevaLocalidad');
    component.setValoresStore(component.domicilio, 'localidad', 'setLocalidad');
    expect(avisocalidadStoreMock.setLocalidad).toHaveBeenCalledWith('NuevaLocalidad');
    component.domicilio.get('colonia')?.setValue('NuevaColonia');
    component.setValoresStore(component.domicilio, 'colonia', 'setColonia');
    expect(avisocalidadStoreMock.setColonia).toHaveBeenCalledWith('NuevaColonia');
    component.domicilio.get('calle')?.setValue('NuevaCalle');
    component.setValoresStore(component.domicilio, 'calle', 'setCalle');
    expect(avisocalidadStoreMock.setCalle).toHaveBeenCalledWith('NuevaCalle');
    component.domicilio.get('lada')?.setValue('02');
    component.setValoresStore(component.domicilio, 'lada', 'setLada');
    expect(avisocalidadStoreMock.setLada).toHaveBeenCalledWith('02');
    component.domicilio.get('telefono')?.setValue('1234567');
    component.setValoresStore(component.domicilio, 'telefono', 'setTelefono');
    expect(avisocalidadStoreMock.setTelefono).toHaveBeenCalledWith('1234567');
    component.domicilio.get('avisoCheckbox')?.setValue(false);
    component.setValoresStore(component.domicilio, 'avisoCheckbox', 'setAvisoCheckbox');
    expect(avisocalidadStoreMock.setAvisoCheckbox).toHaveBeenCalledWith(false);
    component.domicilio.get('licenciaSanitaria')?.setValue('LS999');
    component.setValoresStore(component.domicilio, 'licenciaSanitaria', 'setLicenciaSanitaria');
    expect(avisocalidadStoreMock.setLicenciaSanitaria).toHaveBeenCalledWith('LS999');
    // formAgente
    component.formAgente.get('claveScianModal')?.setValue('NEWSCIAN');
    component.setValoresStore(component.formAgente, 'claveScianModal', 'setClaveScianModal');
    expect(avisocalidadStoreMock.setClaveScianModal).toHaveBeenCalledWith('NEWSCIAN');
    component.formAgente.get('claveDescripcionModal')?.setValue('NEWDESC');
    component.setValoresStore(component.formAgente, 'claveDescripcionModal', 'setClaveDescripcionModal');
    expect(avisocalidadStoreMock.setClaveDescripcionModal).toHaveBeenCalledWith('NEWDESC');
    // formMercancias
    component.formMercancias.get('nombreComercial')?.setValue('NuevoComercial');
    component.setValoresStore(component.formMercancias, 'nombreComercial', 'setNombreComercial');
    expect(avisocalidadStoreMock.setNombreComercial).toHaveBeenCalledWith('NuevoComercial');
    component.formMercancias.get('nombreComun')?.setValue('NuevoComun');
    component.setValoresStore(component.formMercancias, 'nombreComun', 'setNombreComun');
    expect(avisocalidadStoreMock.setNombreComun).toHaveBeenCalledWith('NuevoComun');
    component.formMercancias.get('nombreCientifico')?.setValue('NuevoCientifico');
    component.setValoresStore(component.formMercancias, 'nombreCientifico', 'setNombreCientifico');
    expect(avisocalidadStoreMock.setNombreCientifico).toHaveBeenCalledWith('NuevoCientifico');
    component.formMercancias.get('usoEspecifico')?.setValue('NuevoUso');
    component.setValoresStore(component.formMercancias, 'usoEspecifico', 'setUsoEspecifico');
    expect(avisocalidadStoreMock.setUsoEspecifico).toHaveBeenCalledWith('NuevoUso');
    component.formMercancias.get('estadofisico')?.setValue('NuevoEstadoFisico');
    component.setValoresStore(component.formMercancias, 'estadofisico', 'setEstadoFisico');
    expect(avisocalidadStoreMock.setEstadoFisico).toHaveBeenCalledWith('NuevoEstadoFisico');
    component.formMercancias.get('fraccionArancelaria')?.setValue('NuevaFA');
    component.setValoresStore(component.formMercancias, 'fraccionArancelaria', 'setFraccionArancelaria');
    expect(avisocalidadStoreMock.setFraccionArancelaria).toHaveBeenCalledWith('NuevaFA');
    component.formMercancias.get('descripcionFraccion')?.setValue('NuevaDescF');
    component.setValoresStore(component.formMercancias, 'descripcionFraccion', 'setDescripcionFraccion');
    expect(avisocalidadStoreMock.setDescripcionFraccion).toHaveBeenCalledWith('NuevaDescF');
    component.formMercancias.get('cantidadUMT')?.setValue('99');
    component.setValoresStore(component.formMercancias, 'cantidadUMT', 'setCantidadUMT');
    expect(avisocalidadStoreMock.setCantidadUMT).toHaveBeenCalledWith('99');
    component.formMercancias.get('cantidadUMC')?.setValue('88');
    component.setValoresStore(component.formMercancias, 'cantidadUMC', 'setCantidadUMC');
    expect(avisocalidadStoreMock.setCantidadUMC).toHaveBeenCalledWith('88');
    component.formMercancias.get('porcentajeConcentracion')?.setValue('77');
    component.setValoresStore(component.formMercancias, 'porcentajeConcentracion', 'setPorcentajeConcentracion');
    expect(avisocalidadStoreMock.setPorcentajeConcentracion).toHaveBeenCalledWith('77');
    component.formMercancias.get('clasificacionToxicologica')?.setValue('NEWTOX');
    component.setValoresStore(component.formMercancias, 'clasificacionToxicologica', 'setClasificacionToxicologica');
    expect(avisocalidadStoreMock.setClasificacionToxicologica).toHaveBeenCalledWith('NEWTOX');
    component.formMercancias.get('objetoImportacion')?.setValue('NEWOBJ');
    component.setValoresStore(component.formMercancias, 'objetoImportacion', 'setObjetoImportacion');
    expect(avisocalidadStoreMock.setObjetoImportacion).toHaveBeenCalledWith('NEWOBJ');
  });

  it('debe llamar obtenerEstadoList y establecer estado', () => {
    component.estado = [];
    component.obtenerEstadoList();
    expect(component.estado.length).toBeGreaterThan(0);
    expect(datosDomicilioLegalServiceMock.getObtenerEstadoList).toHaveBeenCalled();
  });

  it('debe llamar obtenerTablaDatos y establecer nicoTablaDatos', () => {
    component.nicoTablaDatos = [];
    component.obtenerTablaDatos();
    expect(component.nicoTablaDatos.length).toBeGreaterThan(0);
    expect(datosDomicilioServiceMock.getObtenerTablaDatos).toHaveBeenCalled();
  });

  it('debe llamar obtenerMercanciasDatos y establecer mercanciasTablaDatos', () => {
    component.mercanciasTablaDatos = [];
    component.obtenerMercanciasDatos();
    expect(component.mercanciasTablaDatos.length).toBeGreaterThan(0);
    expect(datosDomicilioServiceMock.getObtenerMercanciasDatos).toHaveBeenCalled();
  });

  it('debe alternar colapsableDuos', () => {
    component.colapsableDuos = false;
    component.mostrar_colapsableDuos();
    expect(component.colapsableDuos).toBe(true);
    component.mostrar_colapsableDuos();
    expect(component.colapsableDuos).toBe(false);
  });

  it('debe alternar colapsableTres', () => {
    component.colapsableTres = false;
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(false);
  });

  it('debe limpiar recursos en ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spy2 = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('no debe lanzar error si setValoresStore es llamado con un control faltante', () => {
    const dummyForm = new FormGroup({});
    expect(() => component.setValoresStore(dummyForm, 'notExist', 'setCodigoPostal')).not.toThrow();
  });

  it('no debe lanzar error si obtenerEstadoList retorna datos indefinidos', () => {
    datosDomicilioLegalServiceMock.getObtenerEstadoList.mockReturnValueOnce(of(undefined));
    expect(() => component.obtenerEstadoList()).not.toThrow();
  });

  it('no debe lanzar error si obtenerTablaDatos retorna datos indefinidos', () => {
    datosDomicilioServiceMock.getObtenerTablaDatos.mockReturnValueOnce(of(undefined));
    expect(() => component.obtenerTablaDatos()).not.toThrow();
  });

  it('no debe lanzar error si obtenerMercanciasDatos retorna datos indefinidos', () => {
    datosDomicilioServiceMock.getObtenerMercanciasDatos.mockReturnValueOnce(of(undefined));
    expect(() => component.obtenerMercanciasDatos()).not.toThrow();
  });

  it('debe llamar funciones de paisDeProcedenciaBotones sin error', () => {
    // crossList is a QueryList, mock it
    component.crossList = {
      toArray: () => [{
        agregar: jest.fn(),
        quitar: jest.fn(),
      }]
    } as any;
    component.paisDeProcedenciaBotones[0].funcion();
    component.paisDeProcedenciaBotones[1].funcion();
    component.paisDeProcedenciaBotones[2].funcion();
    component.paisDeProcedenciaBotones[3].funcion();
    expect(true).toBe(true); 
  });
});

