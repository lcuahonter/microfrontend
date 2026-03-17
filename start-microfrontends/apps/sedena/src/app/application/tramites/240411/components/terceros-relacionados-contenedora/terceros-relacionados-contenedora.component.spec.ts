import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240411Query } from '../../estados/tramite240411Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: ComponentFixture<TercerosRelacionadosContenedoraComponent>;
  let tramiteQueryMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    tramiteQueryMock = {
      getDestinatarioFinalTablaDatos$: of([{ id: 1, nombre: 'Destino 1' }]),
      getProveedorTablaDatos$: of([{ id: 1, nombre: 'Proveedor 1' }])
    };

    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: true })
    };

    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosContenedoraComponent],
      providers: [
        { provide: Tramite240411Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos de destinatarios finales al inicializar', () => {
    expect(component.destinatarioFinalTablaDatos.length).toBeGreaterThan(0);
    expect(component.destinatarioFinalTablaDatos[0].nombres).toBe('Destino 1');
  });

  it('debería establecer el formulario en solo lectura si el estado lo indica', () => {
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('debería limpiar las suscripciones al destruir el componente', () => {
    const spy = spyOn(component['unsubscribe$'], 'next').and.callThrough();
    const spyComplete = spyOn(component['unsubscribe$'], 'complete').and.callThrough();
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });
});