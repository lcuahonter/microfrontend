import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercializadoraImportadoraComponent } from './comercializadora-importadora.component';


import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { EmpresasComercializadorasService } from '../../services/empresas-comercializadoras.service';
import { Solicitud32604Store } from '../../estados/solicitud32604.store';
import { Solicitud32604Query } from '../../estados/solicitud32604.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';

describe('ComercializadoraImportadoraComponent', () => {
  let component: ComercializadoraImportadoraComponent;
  let fixture: ComponentFixture<ComercializadoraImportadoraComponent>;
  let empresasComercializadorasServiceMock: any;
  let solicitud32604StoreMock: any;
  let solicitud32604QueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    const formBuilder = new FormBuilder();
    empresasComercializadorasServiceMock = {
      conseguirOpcionDeRadio: jest.fn(() => of({ requisitos: [] }))
    };
    solicitud32604StoreMock = {};
    solicitud32604QueryMock = {
      selectSolicitud$: of({})
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false })
    };
    const cdrMock = { detectChanges: jest.fn() } as any;
    component = new ComercializadoraImportadoraComponent(
      formBuilder,
      empresasComercializadorasServiceMock,
      solicitud32604StoreMock,
      solicitud32604QueryMock,
      consultaioQueryMock,
      cdrMock
    );
    if (component.ngOnInit) component.ngOnInit();
  });

  (globalThis as any).Modal = { getOrCreateInstance: jest.fn(() => ({ hide: jest.fn() })) };

  it('should call eliminarDato and update transportistasLista', () => {
        const mockTransportista = {
          transportistaRFCModifTrans: 'RFC1',
          transportistaRazonSocial: 'RS1',
          transportistaDomicilio: 'D1',
          transportistaCaat: 'C1'
        };
        const mockTransportista2 = {
          transportistaRFCModifTrans: 'RFC2',
          transportistaRazonSocial: 'RS2',
          transportistaDomicilio: 'D2',
          transportistaCaat: 'C2'
        };
        component.seleccionDatos = [mockTransportista];
        component.transportistasLista = [mockTransportista, mockTransportista2];
        component.solicitud32604Store = { actualizarTransportistasLista: jest.fn() } as any;
        component.eliminarDato();
        expect(component.transportistasLista.length).toBe(1);
        expect(component.solicitud32604Store.actualizarTransportistasLista).toHaveBeenCalledWith([mockTransportista2]);
      });

      it('should show error notification for future date in actualizarFechaPago', () => {
        component.modalidadForm = (component as any).fb.group({ fechaPago: [''] });
        component.solicitud32604Store = { actualizarFechaPago: jest.fn() } as any;
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const dateStr = futureDate.toISOString().split('T')[0];
        component.actualizarFechaPago(dateStr);
        expect(component.nuevaNotificacion.categoria).toBe('danger');
      });

      it('should call actualizarProgramaImmex and show modal for "Sí"', () => {
        component.solicitud32604Store = { actualizarProgramaImmex: jest.fn() } as any;
        component.abrirModal = jest.fn();
        component.actualizarProgramaImmex('Sí');
        expect(component.abrirModal).toHaveBeenCalled();
        expect(component.solicitud32604Store.actualizarProgramaImmex).toHaveBeenCalledWith('Sí');
      });

      it('should call actualizarImportsRadio and show modal for "No"', () => {
        component.solicitud32604Store = { actualizarImportsRadio: jest.fn() } as any;
        component.abrirModal = jest.fn();
        component.actualizarImportsRadio('No');
        expect(component.abrirModal).toHaveBeenCalled();
        expect(component.solicitud32604Store.actualizarImportsRadio).toHaveBeenCalledWith('No');
      });

      it('should add new transportista in seccionTransportistasLista', () => {
        const evento = {
          transportistaRFCModifTrans: 'RFC3',
          transportistaRazonSocial: 'RS3',
          transportistaDomicilio: 'D3',
          transportistaCaat: 'C3'
        };
        component.transportistasLista = [];
        component.solicitud32604Store = { actualizarTransportistasLista: jest.fn() } as any;
        component.agregarTransportistasComponent = { limpiar: jest.fn() } as any;
        component.seccionTransportistasLista(evento);
        expect(component.transportistasLista.length).toBe(1);
        expect(component.solicitud32604Store.actualizarTransportistasLista).toHaveBeenCalledWith([evento]);
      });

      it('should select transportistas in seleccionarDato', () => {
        const datos = [{
          transportistaRFCModifTrans: 'RFC4',
          transportistaRazonSocial: 'RS4',
          transportistaDomicilio: 'D4',
          transportistaCaat: 'C4'
        }];
        component.seleccionarDato(datos);
        expect(component.seleccionDatos).toEqual(datos);
      });

      it('should close modal and reset notification in cerrarModal', () => {
        component.nuevaNotificacion = { mensaje: 'test' } as any;
        component.mostrarNotificacion = true;
        component.alertaNotificacion = { mensaje: 'alert' } as any;
        component.cerrarModal();
        expect(component.nuevaNotificacion).toEqual({});
        expect(component.mostrarNotificacion).toBe(false);
        expect(component.alertaNotificacion).toEqual({});
      });

      it('should open modal and set elementoParaEliminar in abrirModal', () => {
        component.abrirModal('Test mensaje', 5);
        expect(component.nuevaNotificacion.categoria).toBe('danger');
        expect(component.elementoParaEliminar).toBe(5);
      });

      it('should close notification in cerrarNotificacionExito', () => {
        component.alertaNotificacion = { mensaje: 'alert' } as any;
        component.mostrarNotificacion = true;
        component.cerrarNotificacionExito();
        expect(component.alertaNotificacion).toEqual({});
        expect(component.mostrarNotificacion).toBe(false);
      });

      it('should show info notification if no transportista selected in confirmarEliminarTransportista', () => {
        jest.useFakeTimers();
        component.seleccionDatos = [];
        component.mostrarNotificacion = false;
        component.alertaNotificacion = {} as any;
        component.confirmarEliminarTransportista();
        jest.runAllTimers();
        expect(component.mostrarNotificacion).toBe(true);
        expect(component.alertaNotificacion.mensaje).toContain('Debe seleccionar al menos un transportista');
        jest.useRealTimers();
      });

      it('should handle confirmacionEliminacion true and false', () => {
        component.accionConfirmarEliminar = 'transportistas';
        component.transportistaElement = { nativeElement: { } } as any;
        component.eliminarDato = jest.fn();
        component.nuevaNotificacion = {} as any;
        component.mostrarNotificacion = false;
        component.manejarConfirmacionEliminacion(true);
        expect(component.eliminarDato).toHaveBeenCalled();
        component.manejarConfirmacionEliminacion(false);
        expect(component.nuevaNotificacion).toEqual({});
      });

      it('should return true for tieneErroresCamposPago if fields empty with fechaPago', () => {
        component.modalidadForm = (component as any).fb.group({
          monto: [''], operacionesBancarias: [''], llavePago: [''], fechaPago: ['2023-01-01']
        });
        expect(component.tieneErroresCamposPago()).toBe(true);
      });
      it('should return false for tieneErroresCamposPago if no modalidadForm', () => {
        component.modalidadForm = undefined as any;
        expect(component.tieneErroresCamposPago()).toBe(false);
      });
        it('should set nuevaNotificacion and show error modal for empty transportista', () => {
          component.seleccionDatos = [];
          component.transportistasLista = [];
          component.confirmarEliminarTransportista();
          expect(component.nuevaNotificacion).toBeDefined();
          expect(component.nuevaNotificacion.categoria).toBe('info');
        });

        it('should close notification in cerrarNotificacionExito', () => {
          component.mostrarNotificacion = true;
          component.cerrarNotificacionExito();
          expect(component.mostrarNotificacion).toBe(false);
        });
});
