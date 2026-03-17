import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AnexoComponent } from './anexo.component';
import { PermisoImmexDatosService } from '../services/permiso-immex-datos.service';
import { ImmexAmpliacionSensiblesStore } from '../estados/immex-ampliacion-sensibles.store';
import { ImmexAmpliacionSensiblesQuery } from '../estados/immex-ampliacion-sensibles.query';
import { CatalogoServices, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

describe('AnexoComponent', () => {
  let component: AnexoComponent;
  let fixture: ComponentFixture<AnexoComponent>;

  beforeEach(async () => {
    const mockPermisoService = {
      guardarFraccion: jest.fn(),
      guardarFraccionExportacion: jest.fn()
    };

    const mockStore = {
      updateImportacion: jest.fn(),
      updateExportacion: jest.fn()
    };

    const mockQuery = {
      selectImportacion$: of([]),
      selectExportacion$: of([])
    };

    const mockConsultaQuery = {
      selectConsultaioState$: of({
        create: false,
        procedureId: '80203',
        readonly: false
      })
    };

    const mockCatalogoService = {
      nicosCatalogo: jest.fn().mockReturnValue(of({ datos: [] }))
    };

    await TestBed.configureTestingModule({
      imports: [AnexoComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: PermisoImmexDatosService, useValue: mockPermisoService },
        { provide: ImmexAmpliacionSensiblesStore, useValue: mockStore },
        { provide: ImmexAmpliacionSensiblesQuery, useValue: mockQuery },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: CatalogoServices, useValue: mockCatalogoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnexoComponent);
    component = fixture.componentInstance;
  });

  it('component exists', () => {
    expect(component).toBeTruthy();
  });
});