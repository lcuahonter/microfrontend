import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite32508Store } from '../../state/Tramite32508.store';
import { AdaceService } from '../../services/adace.service';
import { of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockRouter: any;
  let mockConsultaioQuery: any;
  let mockTramite32508Store: any;
  let mockAdaceService: any;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() };
    
    mockConsultaioQuery = {
      selectConsultaioState$: of({
        readonly: false,
        update: false
      })
    };

    mockTramite32508Store = {
      setClaveFiscalizador: jest.fn(),
      setAdace: jest.fn(),
      setTipoDictamen: jest.fn(),
      setRfc: jest.fn(),
      setNombre: jest.fn(),
      setNumeroInscripcion: jest.fn(),
      setAno: jest.fn(),
      setMes: jest.fn(),
      setRadioPartial: jest.fn(),
      setRadioTotal: jest.fn(),
      setSaldoPendiente: jest.fn(),
      setAprovechamiento: jest.fn(),
      setDisminucionAplicada: jest.fn(),
      setCompensacionAplicada: jest.fn(),
      setSaldoPendienteDisminuir: jest.fn(),
      setCantidad: jest.fn(),
      setLlaveDePago: jest.fn(),
      setArchivo: jest.fn(),
      setFechaPago: jest.fn(),
      setFechaElaboracion: jest.fn(),
      setSaldoPendienteCompensar: jest.fn()
    };

    mockAdaceService = {
      getDatosConsulta: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: Tramite32508Store, useValue: mockTramite32508Store },
        { provide: AdaceService, useValue: mockAdaceService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('seleccionaTab should update indice', () => {
    component.indice = 1;
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab(1);
  });

  it('should run ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  describe('inicializarEstadoFormulario', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should disable adace form control when esFormularioSoloLectura is true', () => {
      component.esFormularioSoloLectura = true;
      
      component.inicializarEstadoFormulario();
      
      expect(component.solicitanteForm.get('adace')?.disabled).toBe(true);
    });

    it('should enable adace form control when esFormularioSoloLectura is false', () => {
      component.esFormularioSoloLectura = false;
      
      component.inicializarEstadoFormulario();
      
      expect(component.solicitanteForm.get('adace')?.disabled).toBe(false);
    });

    it('should handle null form control gracefully', () => {
      component.solicitanteForm = component['fb'].group({});
      component.esFormularioSoloLectura = true;
      
      expect(() => component.inicializarEstadoFormulario()).not.toThrow();
    });
  });

  describe('fetchGetDatosConsulta', () => {
    it('should call all store setters when response is successful', () => {
      const mockResponse = {
        success: true,
        datos: {
          claveFiscalizado: 'test-clave',
          adace: 'ADACE-01',
          tipoDictamen: 'tipo-test',
          rfc: 'RFC123456789',
          nombre: 'Test Name',
          numeroInscripcion: '123',
          ano: [{ id: 1, descripcion: '2024' }],
          mes: [{ id: 1, descripcion: 'Enero' }],
          radioParcial: 'parcial',
          radioTotal: 'total',
          saldoPendiente: '1000',
          aprovechamiento: '2000',
          disminucionAplicada: '100',
          compensacionAplicada: '200',
          saldoPendienteDisminuir: '300',
          cantidad: '500',
          llaveDePago: 'llave123',
          archivo: [],
          fechaPago: '2024-01-01',
          fechaElaboracion: '2024-01-02',
          saldoPendienteCompensar: '400'
        }
      };
      mockAdaceService.getDatosConsulta.mockReturnValue(of(mockResponse));

      component.fetchGetDatosConsulta();

      expect(mockAdaceService.getDatosConsulta).toHaveBeenCalled();
      expect(mockTramite32508Store.setClaveFiscalizador).toHaveBeenCalledWith('test-clave');
      expect(mockTramite32508Store.setAdace).toHaveBeenCalledWith('ADACE-01');
      expect(mockTramite32508Store.setTipoDictamen).toHaveBeenCalledWith('tipo-test');
      expect(mockTramite32508Store.setRfc).toHaveBeenCalledWith('RFC123456789');
      expect(mockTramite32508Store.setNombre).toHaveBeenCalledWith('Test Name');
      expect(mockTramite32508Store.setNumeroInscripcion).toHaveBeenCalledWith('123');
      expect(mockTramite32508Store.setAno).toHaveBeenCalledWith([{ id: 1, descripcion: '2024' }]);
      expect(mockTramite32508Store.setMes).toHaveBeenCalledWith([{ id: 1, descripcion: 'Enero' }]);
      expect(mockTramite32508Store.setRadioPartial).toHaveBeenCalledWith('parcial');
      expect(mockTramite32508Store.setRadioTotal).toHaveBeenCalledWith('total');
      expect(mockTramite32508Store.setSaldoPendiente).toHaveBeenCalledWith('1000');
      expect(mockTramite32508Store.setAprovechamiento).toHaveBeenCalledWith('2000');
      expect(mockTramite32508Store.setDisminucionAplicada).toHaveBeenCalledWith('100');
      expect(mockTramite32508Store.setCompensacionAplicada).toHaveBeenCalledWith('200');
      expect(mockTramite32508Store.setSaldoPendienteDisminuir).toHaveBeenCalledWith('300');
      expect(mockTramite32508Store.setCantidad).toHaveBeenCalledWith('500');
      expect(mockTramite32508Store.setLlaveDePago).toHaveBeenCalledWith('llave123');
      expect(mockTramite32508Store.setArchivo).toHaveBeenCalledWith([]);
      expect(mockTramite32508Store.setFechaPago).toHaveBeenCalledWith('2024-01-01');
      expect(mockTramite32508Store.setFechaElaboracion).toHaveBeenCalledWith('2024-01-02');
      expect(mockTramite32508Store.setSaldoPendienteCompensar).toHaveBeenCalledWith('400');
    });

    it('should not call store setters when response is unsuccessful', () => {
      const mockResponse = {
        success: false,
        datos: null
      };
      mockAdaceService.getDatosConsulta.mockReturnValue(of(mockResponse));

      component.fetchGetDatosConsulta();

      expect(mockAdaceService.getDatosConsulta).toHaveBeenCalled();
      expect(mockTramite32508Store.setClaveFiscalizador).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setAdace).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setTipoDictamen).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setRfc).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setNombre).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setNumeroInscripcion).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setAno).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setMes).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setRadioPartial).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setRadioTotal).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setSaldoPendiente).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setAprovechamiento).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setDisminucionAplicada).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setCompensacionAplicada).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setSaldoPendienteDisminuir).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setCantidad).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setLlaveDePago).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setArchivo).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setFechaPago).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setFechaElaboracion).not.toHaveBeenCalled();
      expect(mockTramite32508Store.setSaldoPendienteCompensar).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockAdaceService.getDatosConsulta.mockReturnValue(of(null));

      expect(() => component.fetchGetDatosConsulta()).not.toThrow();
      
      errorSpy.mockRestore();
    });

    it('should use takeUntil operator for subscription management', () => {
      const mockResponse = { success: true, datos: {} };
      mockAdaceService.getDatosConsulta.mockReturnValue(of(mockResponse));
      const takeUntilSpy = jest.spyOn(component.destroyNotifier$, 'next');

      component.fetchGetDatosConsulta();

      expect(mockAdaceService.getDatosConsulta).toHaveBeenCalled();
      
      component.ngOnDestroy();
      expect(takeUntilSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit integration tests', () => {
    it('should call fetchGetDatosConsulta when consultaDatos.update is true', () => {
      mockConsultaioQuery.selectConsultaioState$ = of({
        readonly: false,
        update: true
      });
      const fetchSpy = jest.spyOn(component, 'fetchGetDatosConsulta').mockImplementation(() => {});

      component.ngOnInit();

      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should set esFormularioSoloLectura to true when readonly is true', () => {
      mockConsultaioQuery.selectConsultaioState$ = of({
        readonly: true,
        update: false
      });

      component.ngOnInit();

      expect(component.esFormularioSoloLectura).toBe(true);
    });
  });

});