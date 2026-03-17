import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginaDosAcusesYResolucionesDetallesComponent } from './pagina-dos-acuses-y-resoluciones-detalles.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { AcusesYResolucionesFolioDelTramiteDetallesComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'acuses-y-resoluciones-folio-del-tramite-detalles',
  template: '',
  standalone: true,
})
class MockChild {
  @Input() procedureUrl: any;
  @Input() procedureRegresorUrl = '';
}

describe('AcusesYResolucionesDetalles11105Component', () => {
  let component: PaginaDosAcusesYResolucionesDetallesComponent;
  let fixture: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MockChild
      ],
    })
      .overrideComponent(PaginaDosAcusesYResolucionesDetallesComponent, {
        remove: {
          imports: [AcusesYResolucionesFolioDelTramiteDetallesComponent]
        },
        add: {
          imports: [MockChild]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaginaDosAcusesYResolucionesDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined constructor', () => {
    expect(component).toBeDefined();
  });
});
