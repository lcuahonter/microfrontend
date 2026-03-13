import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Component } from '@angular/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Tramite240308Query } from '../../estados/tramite240308Query.query';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-modal',
  standalone: true,
  template: '',
})
class MockModalComponent {
  abrir = jest.fn();
  cerrar = jest.fn();
}

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: ComponentFixture<TercerosRelacionadosContenedoraComponent>;
  let modalRef: MockModalComponent;

  const mockDestinatarioFinal = [{ id: 1, nombre: 'Destino A' }];
  const mockProveedor = [{ id: 2, nombre: 'Proveedor B' }];
  const mockReadOnly = { readonly: true };

  const mockQuery = {
    getDestinatarioFinalTablaDatos$: of(mockDestinatarioFinal),
    getProveedorTablaDatos$: of(mockProveedor),
  };

  const mockStore = {};

  const mockConsultaQuery = {
    selectConsultaioState$: of(mockReadOnly),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TercerosRelacionadosContenedoraComponent, TercerosRelacionadosComponent],
      providers: [
        { provide: Tramite240308Query, useValue: mockQuery },
        { provide: Tramite240308Store, useValue: mockStore },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({}), queryParams: of({}), data: of({}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(TercerosRelacionadosContenedoraComponent, {
        set: {
          imports: [MockModalComponent, TercerosRelacionadosComponent],
        },
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
        component = fixture.componentInstance;
        modalRef = new MockModalComponent();
        jest.spyOn(modalRef, 'abrir');
        jest.spyOn(modalRef, 'cerrar');
        component.modalComponent = modalRef as any;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
        });
      });
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe establecer esSoloLectura desde consultaQuery', waitForAsync(async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.esSoloLectura).toBe(false);
  }));

  it('debe establecer destinatarioFinalTablaDatos desde el observable del query', () => {
    expect(component.destinatarioFinalTablaDatos).toEqual([{ id: 1, nombre: 'Destino A' }]);
  });

  it('debe establecer proveedorTablaDatos desde el observable del query', () => {
    expect(component.proveedorTablaDatos).toEqual([{ id: 2, nombre: 'Proveedor B' }]);
  });

  it('debe abrir AgregarDestinatarioFinalContenedoraComponent al abrir el modal', () => {
    component.modalComponent = modalRef as any;
    component.openModal('agregar-destino-final');
    fixture.detectChanges();
    expect(modalRef.abrir).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ cerrarModal: expect.any(Function) })
    );
  });

  it('debe abrir AgregarProveedorContenedoraComponent al abrir el modal', () => {
    component.modalComponent = modalRef as any;
    component.openModal('agregar-proveedor');
    expect(modalRef.abrir).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ cerrarModal: expect.any(Function) }));
  });

  it('debe llamar cerrar en modalComponent cuando se invoca cerrarModal', () => {
    component.modalComponent = modalRef as any;
    component.cerrarModal();
    expect(modalRef.cerrar).toHaveBeenCalled();
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    const nextSpy = jest.spyOn((component as any).unsubscribe$, 'next');
    const completeSpy = jest.spyOn((component as any).unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
