import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { ModificacionComponent } from '../../components/modificacion/modificacion.component';
import { BitacoraComponent } from '../../components/bitacora/bitacora.component';
import { AnexoUnoPestanaComponent } from '../../components/anexo-uno-pestana/anexo-uno-pestana.component';
import { ComplementarioComponent } from '../../components/complementaria/complementaria.component';
import { MontoYFactorComponent } from '../../components/monto-y-factor/monto-y-factor.component';
import { HttpClientModule } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitanteComponent,
        ModificacionComponent,
        BitacoraComponent,
        AnexoUnoPestanaComponent,
        ComplementarioComponent,
        MontoYFactorComponent,
      HttpClientModule],
      declarations: [PasoUnoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
