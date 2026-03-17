import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerospageComponent } from './tercerospage.component';
import { of, Subject } from 'rxjs';
import { CertificadoZoosanitarioServiceService } from '../../services/220201/certificado-zoosanitario.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TercerosrelacionadosService } from '../../../../shared/components/services/tercerosrelacionados/tercerosrelacionados.service';
import { ActivatedRoute } from '@angular/router';

describe('TercerospageComponent', () => {
  let component: TercerospageComponent;
  let fixture: ComponentFixture<TercerospageComponent>;
  let MOCK_CONSULTA_QUERY: any;
  let MOCK_CERTIFICADO_SERVICE: any;
  let MOCK_TERCEROS_SERVICE: any;

  beforeEach(async () => {
    MOCK_CONSULTA_QUERY = {
      selectConsultaioState$: of({ readonly: true })
    };

    MOCK_CERTIFICADO_SERVICE = {
      getAllDatosForma: jest.fn().mockReturnValue(of({
        tercerosRelacionados: [{  tipoMercancia: 'Física',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      razonSocial: 'Empresa SA',
      pais: 'MX',
      codigoPostal: '12345',
      estado: 'CDMX',
      calle: 'Calle 1',
      numeroExterior: '100'}],
        datosForma: [{ id: 1 }]
      })),
      updateTercerosRelacionado: jest.fn()
    };

    MOCK_TERCEROS_SERVICE = {
      obtenerSelectorList: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'MX' }]))
    };

    await TestBed.configureTestingModule({
      imports: [TercerospageComponent],
      providers: [
         { provide: ActivatedRoute, useValue: {} },
        { provide: ConsultaioQuery, useValue: MOCK_CONSULTA_QUERY },
        { provide: CertificadoZoosanitarioServiceService, useValue: MOCK_CERTIFICADO_SERVICE },
        { provide: TercerosrelacionadosService, useValue: MOCK_TERCEROS_SERVICE }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerospageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar la bandera de solo lectura y cargar personas/datosForma al iniciar', () => {
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.personas.length).toBe(1);
    expect(component.datosForma.length).toBe(1);
  });

  it('debe cargar los catálogos de país y estado en ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(MOCK_TERCEROS_SERVICE.obtenerSelectorList).toHaveBeenCalledWith('paisprocedencia.json');
    expect(MOCK_TERCEROS_SERVICE.obtenerSelectorList).toHaveBeenCalledWith('estados.json');
  });

  it('debe limpiar personas y llamar updateTercerosRelacionado en handleEliminar', () => {
    component.personas = [{
      tipoMercancia: 'Física',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      razonSocial: 'Empresa SA',
      pais: 'MX',
      codigoPostal: '12345',
      estado: 'CDMX',
      calle: 'Calle 1',
      numeroExterior: '100'
    }];
    component.handleEliminar();
    expect(component.personas.length).toBe(0);
    expect(MOCK_CERTIFICADO_SERVICE.updateTercerosRelacionado).toHaveBeenCalledWith([]);
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const DESTROY_SPY = jest.spyOn((component as any).destroyNotifier$, 'next');
    const COMPLETE_SPY = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(DESTROY_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });
});
