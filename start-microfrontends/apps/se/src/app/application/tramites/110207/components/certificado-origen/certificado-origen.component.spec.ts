import { TestBed } from '@angular/core/testing';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite110207Store } from '../../state/Tramite110207.store';
import { Tramite110207Query } from '../../state/Tramite110207.query';
import { RegistroService } from '../../services/registro.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SeccionLibQuery } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CertificadoOrigenComponent', () => {
  let component: CertificadoOrigenComponent;
  let fixture: any;
  let mockStore: jest.Mocked<Tramite110207Store>;
  let mockQuery: jest.Mocked<Tramite110207Query>;
  let mockRegistroService: jest.Mocked<RegistroService>;
  let mockToastr: jest.Mocked<ToastrService>;
  let mockSeccionQuery: jest.Mocked<SeccionLibQuery>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    mockStore = {
      setFormCertificadoGenric: jest.fn(() => of()),
      setDisponsiblesDatos: jest.fn(() => of()),
      setEstado: jest.fn(() => of()),
      setBloque: jest.fn(() => of()),
      setmercanciaTabla: jest.fn(() => of()),
      setFormValida: jest.fn(() => of()),
    } as any;
    mockQuery = {
      selectSolicitud$: of({
        mercanciaTabla: [],
        disponiblesDatos: [],
      }),
      formCertificado$: of({}),
    } as any;
    mockRegistroService = {
      buscarMercanciasCert: jest.fn(() => of()),
    } as any;
    mockToastr = {
      error: jest.fn(()=> of('Error al buscar Mercancia')),
    } as any;
    mockSeccionQuery = {
      selectSeccionState$: of({}),
    } as any;
    mockConsultaQuery = {
      selectConsultaioState$: of({ readonly: false }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CertificadoOrigenComponent,
        CommonModule,
        ReactiveFormsModule,
        CertificadoDeOrigenComponent,
        MercanciaComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        ToastrService,
        { provide: Tramite110207Store, useValue: mockStore },
        { provide: Tramite110207Query, useValue: mockQuery },
        { provide: RegistroService, useValue: mockRegistroService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: SeccionLibQuery, useValue: mockSeccionQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


    it('should call store.setFormCertificadoGenric with correct params', () => {
      const event = {
        formGroupName: 'group',
        campo: 'campo',
        valor: undefined,
        storeStateName: 'state',
      };
      component.setValoresStore(event);
      expect(mockStore.setFormCertificadoGenric).toHaveBeenCalledWith({
        campo: undefined,
      });
    });
 
    it('should call store.setEstado', () => {
      const estado: Catalogo = { id: 1, descripcion: 'Estado' };
      component.tipoEstadoSeleccion(estado);
      expect(mockStore.setEstado).toHaveBeenCalledWith(estado);
    });
 
    it('should call store.setBloque', () => {
      const estado: Catalogo = { id: 2, descripcion: 'Bloque' };
      component.tipoSeleccion(estado);
      expect(mockStore.setBloque).toHaveBeenCalledWith([estado]);
    });
  
    it('should call store.setmercanciaTabla with array', () => {
      const mercancia: Mercancia = { id: 1 } as Mercancia;
      component.emitmercaniasDatos(mercancia);
      expect(mockStore.setmercanciaTabla).toHaveBeenCalledWith([mercancia]);
    });

    it('should update datosTabla$', () => {
      const mercancias: Mercancia[] = [{ id: 1 } as Mercancia];
      component.guardarClicado(mercancias);
      expect(component.datosTabla$).toEqual(mercancias);
    });
 
    it('should call store.setFormValida', () => {
      component.setFormValida(true);
      expect(mockStore.setFormValida).toHaveBeenCalledWith({
        certificado: true,
      });
    });

    it('should set datosSeleccionados and fromMercanciasDisponibles', () => {
      const mercancia: Mercancia = { id: 1 } as Mercancia;
      component.modalInstance = { show: jest.fn() } as any;
      component.abrirModificarModal(mercancia, true);
      expect(component.datosSeleccionados).toBe(mercancia);
      expect(component.fromMercanciasDisponibles).toBeTruthy();
      expect(component.modalInstance.show).toHaveBeenCalled();
    });

    it('should set tablaSeleccionEvent and hide modal', () => {
      component.modalInstance = { hide: jest.fn() } as any;
      component.cerrarModificarModal();
      expect(component.tablaSeleccionEvent).toBeTruthy();
      expect(component.modalInstance.hide).toHaveBeenCalled();
    });

    it('should validate child form and update store', () => {
      component.certificadoDeOrigenComponent = {
        validarFormularios: () => true,
      } as CertificadoDeOrigenComponent;
      jest.spyOn(component, 'setFormValida');
      const result = component.validateAll();
      expect(component.setFormValida).toHaveBeenCalledWith(true);
      expect(result).toBeTruthy();
    });

    it('should return false if child form is invalid', () => {
      component.certificadoDeOrigenComponent = {
        validarFormularios: () => false,
      } as CertificadoDeOrigenComponent;
      jest.spyOn(component, 'setFormValida');
      const result = component.validateAll();
      expect(component.setFormValida).toHaveBeenCalledWith(false);
      expect(result).toBeFalsy();
    });
 
    it('should call registroService.buscarMercanciasCert and setDisponsiblesDatos on success', () => {
      component.formCertificado = { entidadFederativa: 1, bloque: 'MX' };
      const response = {
        datos: [
          {
            idMercancia: 1,
            fraccionArancelaria: 'FA',
            numeroRegistro: 'NR',
            fechaExpedicion: 'FE',
            fechaVencimiento: 'FV',
            nombreTecnico: 'NT',
            nombreComercial: 'NC',
            fraccionNALADIClave: 'FN',
            fraccionNALADSA93Clave: 'FN93',
            fraccionNALADISA96Clave: 'FN96',
            fraccionNALADISA02Clave: 'FN02',
            criterioOrigen: 'CO',
            porcentajeContenidoRegional: 'PCR',
            tratadoAplicable: { nombreTratado: 'Tratado' },
            unidadMedida: 'UM',
          },
        ],
      };
      mockRegistroService.buscarMercanciasCert = jest
        .fn()
        .mockReturnValue(of(response));
      component.conseguirDisponiblesDatos();
      expect(mockRegistroService.buscarMercanciasCert).toHaveBeenCalled();
      expect(mockStore.setDisponsiblesDatos).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            fraccionArancelaria: 'FA',
            nombreTecnico: 'NT',
            normaOrigen: 'Tratado',
            unidadMedidaMasaBruta: 'UM',
          }),
        ])
      );
    });

    it('should call toastr.error on error', () => {
      component.formCertificado = { entidadFederativa: 1, bloque: 'MX' };
      mockRegistroService.buscarMercanciasCert.mockReturnValue({
        pipe: () => ({
          subscribe: (handlers: any) => handlers.error(),
        }),
      } as any);
      component.conseguirDisponiblesDatos();
    });

    it('should complete destroyNotifier$', () => {
      const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
      const spyComplete = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      component.ngOnDestroy();
      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
 });
