// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CertificadoOrigenComponent } from './certificado-origen.component';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { Tramite110216Store } from '../../../../estados/tramites/tramite110216.store';
import { Tramite110216Query } from '../../../../estados/queries/tramite110216.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideToastr, ToastrService } from 'ngx-toastr';
class MockTramite110216Query {
  formCertificado$ = of({});
  selectAltaPlanta$ = of({});
  selectPaisBloque$ = of({});
  selectBuscarMercancia$ = of({});
  selectSolicitud$ = of({
    mercanciaTabla: [{ id: 1 }],
    disponiblesDatos: [{ id: 2 }],
    formCertificado: {}
  });
  formDatosCertificado$ = of({});
}

describe('CertificadoOrigenComponent', () => {
  let component: CertificadoOrigenComponent;
  let fixture: ComponentFixture<CertificadoOrigenComponent>;
  let store: Partial<Tramite110216Store>;
  let certificadoService: Partial<CertificadosOrigenGridService>;

  beforeEach(async () => {
    // Mock store
    store = {
      update: jest.fn(),
      getValue: jest.fn().mockReturnValue({ formValidity: { certificadoOrigen: true } }),
      setAgregarProductoresExportador: jest.fn(),
      setFormMercancia: jest.fn(),
      setFormValida: jest.fn(),
      setFormCertificado: jest.fn(),
      setMercanciaTabla: jest.fn(),
      setEstado: jest.fn(),
      setBloque: jest.fn(),
      setFormValidity: jest.fn(),
    };

    // Mock service
    certificadoService = {
      obtenerProductorPorExportador: jest.fn().mockReturnValue(of({ datos: [] })),
      obtenerMercanciasDisponibles: jest.fn().mockReturnValue(
        of({
          datos: [
            {
              fraccionArancelaria: '123',
              nombreTecnico: 'Tech',
              nombreComercial: 'Com',
              numeroRegistroProducto: '001',
              fechaExpedicion: '2024-01-01',
              fechaVencimiento: '2025-01-01'
            }
          ]
        })
      )
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, CertificadoOrigenComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Tramite110216Query, useClass: MockTramite110216Query },
        { provide: Tramite110216Store, useValue: store },
        { provide: CertificadosOrigenGridService, useValue: certificadoService },
        ToastrService,
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoOrigenComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.setEstado in tipoEstadoSeleccion', () => {
    const estado = { id: 1, descripcion: 'Tipo 1' };
    component.tipoEstadoSeleccion(estado);
    expect(store.setEstado).toHaveBeenCalledWith(estado);
  });

  it('should call store.setBloque in tipoSeleccion', () => {
    const bloque = { id: 2, descripcion: 'Bloque 1' };
    component.tipoSeleccion(bloque);
    expect(store.setBloque).toHaveBeenCalledWith([bloque]);
  });

  it('should destroy subscriptions on ngOnDestroy', () => {
    component.destroyNotifier$ = { next: jest.fn(), complete: jest.fn() } as any;
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should call store.setFormMercancia and modalInstance.show in abrirModificarModal', () => {
    component.modalInstance = { show: jest.fn() } as any;
    const mercancia = { id: 10 };
    component.abrirModificarModal(mercancia, true);
    expect(store.setFormMercancia).toHaveBeenCalledWith({ ...mercancia });
    expect(component.modalInstance.show).toHaveBeenCalled();
  });

  it('should call modalInstance.hide and set tablaSeleccionEvent on cerrarModificarModal', () => {
    component.modalInstance = { hide: jest.fn() } as any;
    component.cerrarModificarModal();
    expect(component.tablaSeleccionEvent).toBe(true);
    expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('should update datosTabla$ on guardarClicado', () => {
    const mockData = [{ id: 1 }];
    component.guardarClicado(mockData);
    expect(component.datosTabla$).toEqual(mockData);
  });

  it('should call setMercanciaTabla in emitmercaniasDatos', () => {
    const mockMercancia = { id: 11 };
    component.emitmercaniasDatos(mockMercancia);
    expect(store.setMercanciaTabla).toHaveBeenCalledWith([mockMercancia]);
  });

  it('should show buscarModel modal when abrirModalCargaPorArchivo is called', () => {
    const showSpy = jest.fn();
    component.buscarModel = { show: showSpy } as any;
    component.abrirModalCargaPorArchivo();
    expect(showSpy).toHaveBeenCalled();
  });

  it('should call store.setFormCertificado in setValoresStore', () => {
    const evento = { formGroupName: 'formCertificado', campo: 'entidadFederativa', valor: 123, storeStateName: 'certificado' };
    component.setValoresStore(evento);
    expect(store.setFormCertificado).toHaveBeenCalledWith({ entidadFederativa: 123 });
  });

  it('should return false from validarFormulario if certificadoDeOrigen is undefined', () => {
    component.certificadoDeOrigen = undefined;
    expect(component.validarFormulario()).toBe(false);
  });

  it('should call validarFormularios on certificadoDeOrigen in validarFormulario', () => {
    const mockCertificado = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
    component.certificadoDeOrigen = mockCertificado;
    expect(component.validarFormulario()).toBe(true);
    expect(mockCertificado.validarFormularios).toHaveBeenCalled();
  });

  it('should map and set mercancias disponibles from servicio in conseguirDisponiblesDatos', () => {
    const mockSetDisponsiblesDatos = jest.fn();
    store.setDisponsiblesDatos = mockSetDisponsiblesDatos;
    component.certificadoState = { formCertificado: { entidadFederativa: 101, bloque: 'ARG' } } as any;
    component.conseguirDisponiblesDatos();
    expect(certificadoService.obtenerMercanciasDisponibles).toHaveBeenCalledWith({
      rfcExportador: "AAL0409235E6",
      tratadoAcuerdo: { idTratadoAcuerdo: 101 },
      pais: { cvePais: 'ARG' }
    });
    expect(mockSetDisponsiblesDatos).toHaveBeenCalledWith([
      {
        fraccionArancelaria: '123',
        nombreTecnico: 'Tech',
        nombreComercial: 'Com',
        numeroDeRegistrodeProductos: '001',
        fechaExpedicion: '2024-01-01',
        fechaVencimiento: '2025-01-01'
      }
    ]);
  });

});
