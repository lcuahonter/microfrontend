import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { SolicitudComponent } from './solicitud.component';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { Solicitud220402Store } from '../../estados/tramites/tramites220402.store';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';
import { of } from 'rxjs';
import { Modal } from 'bootstrap';
import { CatalogoSelectComponent, TituloComponent, ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { DatosGenerales, TablaMercancia } from '../../models/pantallas-captura.model';


describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let mediodetransporteServiceMock: any;
  let solicitud220402StoreMock: any;
  let solicitud220402QueryMock: any;
  let validacionesServiceMock: any;
  let datosGeneralesArr: DatosGenerales[] = [];
  let origenArr: TablaMercancia[] = [];

  beforeEach(async () => {
    datosGeneralesArr = [
      {
        UMC: "Med2",
        UMT: "Kilogramo",
        USO: "Med2",
        cantidadUMC: "11",
        cantidadUMT: "valor ficticio",
        descdelaFraccion: "Aguacates (paltas)",
        descripcionProducto: "producto",
        empaques: "Med2",
        fraccionArancelaria: "08044001",
        id: 1,
        marcasDistintivas: "distintivas",
        nombreCientifico: "Med2",
        nombreComun: "Med1",
        numero: "2",
        paisdeOrigen: "Med3"
      },
      {
        UMC: "Med2",
        UMT: "Kilogramo",
        USO: "Med2",
        cantidadUMC: "11",
        cantidadUMT: "valor ficticio",
        descdelaFraccion: "Aguacates (paltas)",
        descripcionProducto: "producto",
        empaques: "Med2",
        fraccionArancelaria: "08044001",
        id: 2,
        marcasDistintivas: "distintivas",
        nombreCientifico: "Med2",
        nombreComun: "Med1",
        numero: "2",
        paisdeOrigen: "Med3"
      }
    ];
    origenArr = [
      {
        id: 1,
        federativaOrigen: 'federativaOrigen',
        origen: 'origen',
      },
      {
        id: 2,
        federativaOrigen: 'federativaOrigen',
        origen: 'origen',
      }
    ];
    mediodetransporteServiceMock = {
      getMedioDeTransporte: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Opción 1' }])),
    };

    solicitud220402StoreMock = {
      setTipoDeCertificado: jest.fn(),
      setSeccionAduanera: jest.fn(),
      setPuntoDestino: jest.fn(),
      setPaisDeDestino: jest.fn(),
      setPaisDeProcedencia: jest.fn(),
      setFechaInicio: jest.fn(),
      setFechaFinal: jest.fn(),
    };

    solicitud220402QueryMock = {
      selectSolicitud$: of({
        tipoDeCertificado: 'Certificado 1',
        seccionAduanera: 'Aduana 1',
        puntoDestino: 'Destino 1',
        paisDeDestino: 'País 1',
        paisDeProcedencia: 'País 2',
        fechaInicio: '2023-01-01',
        fechaFinal: '2023-01-10',
      }),
    };

    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(false),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, FormsModule, SolicitudComponent],
      providers: [
        FormBuilder,
        { provide: MediodetransporteService, useValue: mediodetransporteServiceMock },
        { provide: Solicitud220402Store, useValue: solicitud220402StoreMock },
        { provide: Solicitud220402Query, useValue: solicitud220402QueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.FormSolicitud).toBeDefined();
    expect(component.FormSolicitud.get('datosDelTramiteRealizar')).toBeDefined();
    expect(component.FormSolicitud.get('datosMercancia')).toBeDefined();
  });

  it('should fetch transport data on inicializaCatalogos', () => {
    component.inicializaCatalogos();
    expect(mediodetransporteServiceMock.getMedioDeTransporte).toHaveBeenCalled();
    expect(component.Opciones.length).toBe(1);
    expect(component.Opciones[0].descripcion).toBe('Opción 1');
  });

  it('should validate the form field using isValid method', () => {
    const isValid = component.isValid(component.FormSolicitud, 'datosDelTramiteRealizar.tipoDeCertificado');
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
    expect(isValid).toBe(false);
  });

  it('should call setValoresStore when updating a field', () => {
    const form = component.FormSolicitud;
    component.setValoresStore(form, 'datosDelTramiteRealizar.tipoDeCertificado', 'setTipoDeCertificado');
    expect(solicitud220402StoreMock.setTipoDeCertificado).toHaveBeenCalled();
  });

  it('should open the modal on agregar', () => {
    const modalElement = fixture.debugElement.nativeElement.querySelector('#modalGeneralesMercancia');
    component.modalGeneralesMercancia = { nativeElement: modalElement };
    const modalInstanceSpy = jest.spyOn(Modal.prototype, 'show');
    component.agregar();
    expect(modalInstanceSpy).toHaveBeenCalled();
  });

  it('should add data to datosGeneralesArr on agregarModel', () => {
    component.generalesMercanciaForm = component.fb.group({
      datosGenerales: component.fb.group({
        nombreComun: ['Nombre común'],
        nombreCientifico: ['Nombre científico'],
        descripcionProducto: ['Descripción'],
        fraccionArancelaria: ['12345678'],
        descdelaFraccion: ['Fracción'],
        cantidadUMT: ['10'],
        UMT: ['Kilogramo'],
        cantidadUMC: ['20'],
        UMC: ['Unidad'],
        paisdeOrigen: ['País 1'],
        marcasDistintivas: ['Marca'],
        USO: ['Uso'],
      }),
      numeroDescDeLosEmpaques: component.fb.group({
        numero: ['1'],
        empaques: ['Caja'],
      }),
    });

    component.Opciones = [
      { id: 1, descripcion: 'Unidad' },
      { id: 2, descripcion: 'País 1' },
    ];

    component.agregarModel();
    expect(component.datosGeneralesArr.length).toBe(1);
  });

  it('should reset the form on limpiar', () => {
    component.limpiar();
    expect(component.generalesMercanciaForm.get('datosGenerales.nombreComun')?.value).toBe("");
    expect(component.origenArr.length).toBe(0);
  });







  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.disabled).toBe(true);
  });

  it('should enable the form when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.enabled).toBe(true);
  });

  it('should update fechaInicio in the form when cambioFechaInicio is called', () => {
    component.cambioFechaInicio('2023-01-01');
    expect(component.datosMercancia.get('fechaInicio')?.value).toBe('2023-01-01');
  });

  it('should update fechaFinal in the form when cambioFechaFinal is called', () => {
    component.cambioFechaFinal('2023-12-31');
    expect(component.datosMercancia.get('fechaFinal')?.value).toBe('2023-12-31');
  });

  it('should remove an item from datosGeneralesArr when mercanciaBorrar is called', () => {
    component.datosGeneralesArr = datosGeneralesArr;
    component.mercanciaBorrar(0);
    expect(component.datosGeneralesArr.length).toBe(1);
    expect(component.datosGeneralesArr[0].id).toBe(2);
  });

  it('should update origenArr when municipioAgregar is called', () => {
    component.datosGenerales.get('entidadFederativadeOrigen')?.setValue('1');
    component.datosGenerales.get('municipiodeOrigen')?.setValue('Municipio 1');
    component.Opciones = [{ id: 1, descripcion: 'Entidad 1' }];
    component.municipioAgregar();
    expect(component.origenArr.length).toBe(1);
    expect(component.origenArr[0].federativaOrigen).toBe('Entidad 1');
    expect(component.origenArr[0].origen).toBe('Municipio 1');
  });

  it('should remove items from origenArr when municipioEliminar is called', () => {
    component.origenArr = origenArr;
    component.seleccionarArr = [origenArr[0]];
    component.municipioEliminar();
    expect(component.origenArr.length).toBe(1);
    expect(component.origenArr[0].id).toBe(2);
  });

  it('should remove items from datosGeneralesArr when eliminar is called', () => {
    component.datosGeneralesArr = datosGeneralesArr;
    component.seleccionarDatosGeneralesArr = [datosGeneralesArr[0]];
    component.eliminar();
    expect(component.datosGeneralesArr.length).toBe(1);
    expect(component.datosGeneralesArr[0].id).toBe(2);
  });

  it('should update generalesMercanciaForm when modificar is called', () => {
    component.seleccionarDatosGeneralesArr = [datosGeneralesArr[0]];
    component.Opciones = [{ descripcion: 'Kilogramo', id: 1 }];
    component.modificar();
    expect(component.generalesMercanciaForm.get('datosGenerales.fraccionArancelaria')?.value).toBe('08044001');
    expect(component.generalesMercanciaForm.get('datosGenerales.UMT')?.value).toBe("Kilogramo");
  });

  it('should call setValoresStore with fechaFinal when changeFechaFinal is called', () => {
    const spy = jest.spyOn(component, 'setValoresStore');
    component.changeFechaFinal();
    expect(spy).toHaveBeenCalledWith(component.datosMercancia, 'fechaFinal', 'setFechaFinal');
  });

  it('should call setValoresStore with tipoDeCertificado when tipoDeCertificadoCambio is called', () => {
    component.solicitudState = { tipoDeCertificado: null } as any;
    const spy = jest.spyOn(component, 'setValoresStore');
    component.tipoDeCertificadoCambio();
    expect(spy).toHaveBeenCalledWith(component.datosDelTramiteRealizar, 'tipoDeCertificado', 'setTipoDeCertificado');
  });

  it('should update descdelaFraccion and UMT when fraccionArancelariaActualizar is called', () => {
    component.datosGenerales.get('fraccionArancelaria')?.setValue('12345678');
    component.fraccionArancelariaActualizar();
    expect(component.datosGenerales.get('descdelaFraccion')?.value).toBe('Aguacates (paltas)');
    expect(component.datosGenerales.get('UMT')?.value).toBe('Kilogramo');
  });
});