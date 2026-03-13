import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { of, Subject } from 'rxjs';
import { Exportador, Destinatario } from '../../models/pago-de-derechos.model';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;
  let revisionServiceMock: any;

  const mockExportadores: Exportador[] = [
  {
    nombre: 'Exportador 1',
    rfc: 'RFC1',
    pais: 'MX',
    telefono: '1234567890',
    correoElectronico: 'exp1@mail.com',
    domoicilio: 'Calle 1',
  } as Exportador,
  {
    nombre: 'Exportador 2',
    rfc: 'RFC2',
    pais: 'US',
    telefono: '0987654321',
    correoElectronico: 'exp2@mail.com',
    domoicilio: 'Calle 2',
  } as Exportador,
];

const mockDestinatarios: Destinatario[] = [
  {
    nombre: 'Destinatario 1',
    rfc: 'RFC3',
    pais: 'MX',
    telefono: '1111111111',
    correoElectronico: 'dest1@mail.com',
    calle: 'Calle D1',
    numeroExterior: '10',
    numeroInterior: 'A',
    colonia: 'Colonia D1',
    municipioAlcaldia: 'Municipio D1',
    entidadFederativa: 'Estado D1',
    codigoPostal: '12345'
  } as Destinatario,
  {
    nombre: 'Destinatario 2',
    rfc: 'RFC4',
    pais: 'US',
    telefono: '2222222222',
    correoElectronico: 'dest2@mail.com',
    calle: 'Calle D2',
    numeroExterior: '20',
    numeroInterior: 'B',
    colonia: 'Colonia D1',
    municipioAlcaldia: 'Municipio D1',
    entidadFederativa: 'Estado D1',
    codigoPostal: '12345'
  } as Destinatario,
];

  beforeEach(async () => {
    revisionServiceMock = {
      obtenerTablaExportador: jest.fn().mockReturnValue(of(mockExportadores)),
      obtenerTablaDestinatario: jest.fn().mockReturnValue(of(mockDestinatarios)),
    };

    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosComponent],
      providers: [
        { provide: SolicitudPantallasService, useValue: revisionServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and call obtenerTablaExportador and obtenerTablaDestinatario on ngOnInit', () => {
    const obtenerTablaExportadorSpy = jest.spyOn(component, 'obtenerTablaExportador');
    const obtenerTablaDestinatarioSpy = jest.spyOn(component, 'obtenerTablaDestinatario');
    component.ngOnInit();
    expect(obtenerTablaExportadorSpy).toHaveBeenCalled();
    expect(obtenerTablaDestinatarioSpy).toHaveBeenCalled();
  });

  it('should set exportadorDatos when obtenerTablaExportador is called', () => {
    component.exportadorDatos = [];
    component.obtenerTablaExportador();
    expect(component.exportadorDatos).toEqual(mockExportadores);
    expect(revisionServiceMock.obtenerTablaExportador).toHaveBeenCalled();
  });

  it('should set destinatarioDatos when obtenerTablaDestinatario is called', () => {
    component.destinatarioDatos = [];
    component.obtenerTablaDestinatario();
    expect(component.destinatarioDatos).toEqual(mockDestinatarios);
    expect(revisionServiceMock.obtenerTablaDestinatario).toHaveBeenCalled();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have default values for inputs and properties', () => {
    expect(component.enableScrollbar).toBe(false);
    expect(component.TEXTO_DE_ALERTA).toBeDefined();
    expect(component.items).toBeDefined();
    expect(component.persona).toBeDefined();
    expect(component.TablaSeleccion).toBeDefined();
    expect(component.exportadorConfiguracionTabla).toBeDefined();
    expect(component.destinatarioConfiguracionTabla).toBeDefined();
    expect(component.exportadorDatos).toBeDefined();
    expect(component.destinatarioDatos).toBeDefined();
  });
});