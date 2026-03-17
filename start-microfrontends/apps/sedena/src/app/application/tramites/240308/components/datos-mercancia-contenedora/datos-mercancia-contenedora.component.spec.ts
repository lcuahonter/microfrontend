import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {
  Component,
  EventEmitter,
  Output,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
import { DatosMercanciaContenedoraComponent } from './datos-mercancia-contenedora.component';
import { Tramite240308Store } from '../../estados/tramite240308Store.store';
import { ActivatedRoute } from '@angular/router';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
import { MercanciaDetalle } from '../../../../shared/models/datos-del-tramite.model';

@Component({
  selector: 'app-datos-mercancia',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class MockDatosMercanciaComponent {
  @Output() guardarDatos = new EventEmitter<MercanciaDetalle[]>();
  @Output() cerrar = new EventEmitter<void>();
  @Input() datos: MercanciaDetalle[] = [];
}

describe('DatosMercanciaContenedoraComponent', () => {
  let component: DatosMercanciaContenedoraComponent;
  let fixture: ComponentFixture<DatosMercanciaContenedoraComponent>;
  let mockTramiteStore: jest.Mocked<Tramite240308Store>;

  beforeEach(async () => {
    mockTramiteStore = {
      updateMercanciaTablaDatos: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [DatosMercanciaContenedoraComponent],
      providers: [
        { provide: Tramite240308Store, useValue: mockTramiteStore },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: DatosSolicitudService,
          useValue: {
            obtenerFraccionesCatalogo: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) }),
            obtenerUMCCatalogo: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) }),
            obtenerMonedaCatalogo: jest.fn().mockReturnValue({ pipe: () => ({ subscribe: jest.fn() }) })
          }
        }
      ]
    }).overrideComponent(DatosMercanciaContenedoraComponent, {
      remove: {
        imports: [require('../../../../shared/components/datos-mercancia/datos-mercancia.component').DatosMercanciaComponent]
      },
add: {
  imports: [MockDatosMercanciaComponent]
}
    }).compileComponents();

    fixture = TestBed.createComponent(DatosMercanciaContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('debe emitir el evento cerrar', fakeAsync(() => {
    const cerrarSpy = jest.spyOn(component.cerrar, 'emit');
    component.cerrar.emit();
    tick();
    fixture.detectChanges();
    expect(cerrarSpy).toHaveBeenCalled();
  }));

  it('debe llamar tramiteStore.updateMercanciaTablaDatos al ejecutar updateMercanciaDetalle', fakeAsync(() => {
    const mockData: MercanciaDetalle[] = [{ id: 1, nombre: 'Mercancia' }] as any;
    component.updateMercanciaDetalle(mockData);
    tick();
    fixture.detectChanges();
    expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(mockData);
  }));

  it('debe manejar el evento guardarDatos del componente hijo', fakeAsync(() => {
    const mockData: MercanciaDetalle[] = [{ nombre: 'Test Mercancia' } as unknown as MercanciaDetalle];

    component.updateMercanciaDetalle(mockData);
    tick();
    fixture.detectChanges();

    expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(mockData);
  }));

  it('debe manejar el evento cerrar del componente hijo y emitir hacia afuera', fakeAsync(() => {
    const cerrarSpy = jest.spyOn(component.cerrar, 'emit');

    const childDebugElement = fixture.debugElement.query(
      d => d.componentInstance instanceof MockDatosMercanciaComponent
    );
    const childInstance = childDebugElement?.componentInstance as MockDatosMercanciaComponent;

    component.cerrar.emit();
    tick();
    fixture.detectChanges();

    expect(cerrarSpy).toHaveBeenCalled();
  }));
});
