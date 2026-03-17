  import { HttpClientModule } from '@angular/common/http';
  import { ComponentFixture, TestBed } from '@angular/core/testing';
  import { PagoDeDerechosComponent } from './pago-de-derechos.component';
  import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';
  import { Tramite270101Store } from '../../../../estados/tramites/270101/tramite270101.store';
  import { Tramite270101Query } from '../../../../estados/queries/270101/tramite270101.query';
  import { of } from 'rxjs';
  import { ReactiveFormsModule } from '@angular/forms';
import { ModeloDeFormaDinamica } from '@libs/shared/data-access-user/src';

  describe('PagoDeDerechosComponent', () => {
    let component: PagoDeDerechosComponent;
    let fixture: ComponentFixture<PagoDeDerechosComponent>;
    let exportarIlustracionesService: jest.Mocked<ExportarIlustracionesService>;
    let tramiteStore: jest.Mocked<Tramite270101Store>;
    let tramiteQuery: jest.Mocked<Tramite270101Query>;

    const mockBancoData = [
      { id: 1, descripcion: 'Banco A' },
      { id: 2, descripcion: 'Banco B' },
    ];
    
    beforeEach(async () => {
      const mockExportService = {
        getBancoData: jest.fn().mockReturnValue(of(mockBancoData)),
        setForm: jest.fn(),
      };
  
      const mockStore = {
        setDynamicFieldValue: jest.fn(),
      };
  
      const mockQuery = {
        selectExportarIlustraciones$: of({ test: 'state' }),
      };
  
      await TestBed.configureTestingModule({
        imports: [PagoDeDerechosComponent, ReactiveFormsModule],
        providers: [
          { provide: ExportarIlustracionesService, useValue: mockExportService },
          { provide: Tramite270101Store, useValue: mockStore },
          { provide: Tramite270101Query, useValue: mockQuery },
        ],
      }).compileComponents();
    
      fixture = TestBed.createComponent(PagoDeDerechosComponent);
      exportarIlustracionesService = TestBed.inject(ExportarIlustracionesService) as jest.Mocked<ExportarIlustracionesService>;
      tramiteStore = TestBed.inject(Tramite270101Store) as jest.Mocked<Tramite270101Store>;
      tramiteQuery = TestBed.inject(Tramite270101Query) as jest.Mocked<Tramite270101Query>;
      component = fixture.componentInstance;
      component.consultaState = {
      readonly: false,
    } as any;
      fixture.detectChanges();
    });
    

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize exportarIlustracionesState in ngOnInit', () => {
      component.ngOnInit();
      expect(component.exportarIlustracionesState).toEqual({ test: 'state' });
    });

    it('should initialize the component and set form data in ngOnInit', () => {
      const mockFormData = [
        {
          id: 'test',
          labelNombre: 'test',
          campo: 'test',
          clase: 'col-md-4',
          tipoInput: 'text',
          desactivado: false,
          soloLectura: false,
          validadores: [{ tipo: 'required' }],
          marcadorDePosicion: '',
          valorPredeterminado: '500',
          marginTop: 0,
        }
      ];
      component.pagoDeDerechosFormData = mockFormData;
      component.ngOnInit();
      expect(component.pagoDeDerechosFormData[0].valorPredeterminado).toEqual('500');
    });
    

    it('should clean up subscriptions in ngOnDestroy', () => {
      const destroySpy = jest.spyOn<any, any>(component['destroy$'], 'next');
      const completeSpy = jest.spyOn<any, any>(component['destroy$'], 'complete');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should call getBancoData and set opciones if not already set', () => {
      const bancoMockField = [{
        id: 'banco',
        labelNombre: 'Banco',
        campo: 'banco',
        clase: 'col-md-4',
        tipoInput: 'select-catalogos',
        desactivado: false,
        soloLectura: false,
        validadores: [{ tipo: 'required' }],
        marcadorDePosicion: 'Selecciona un valor',
        valorPredeterminado: '',
        marginTop: 0,
      }];
      component.pagoDeDerechosFormData = bancoMockField;
      exportarIlustracionesService.getBancoData.mockReturnValue(of([
        { id: 1, descripcion: 'Banco A' },
        { id: 2, descripcion: 'Banco B' },
      ]));
      component.obtenerBancoDatos();
      expect(exportarIlustracionesService.getBancoData).toHaveBeenCalled();
    });

    it('should call setDynamicFieldValue and setForm in establecerCambioDeValor', () => {
      const mockEvent = { campo: 'monto', valor: '1000' };
      component.establecerCambioDeValor(mockEvent);
      expect(tramiteStore.setDynamicFieldValue).toHaveBeenCalledWith('monto', '1000');
      expect(exportarIlustracionesService.setForm).toHaveBeenCalledWith('pagoDeDerechos', component.ninoFormGroup);
    });
  });
