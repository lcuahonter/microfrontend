import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeriodoEnElExtranjeroComponent } from './periodo-en-el-extranjero.component';
import { HttpClientModule } from '@angular/common/http';
import { ExportarIlustracionesService } from '../../services/exportar-ilustraciones.service';

describe('PeriodoEnElExtranjeroComponent', () => {
  let component: PeriodoEnElExtranjeroComponent;
  let fixture: ComponentFixture<PeriodoEnElExtranjeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodoEnElExtranjeroComponent, HttpClientModule],
      providers: [ExportarIlustracionesService],
    }).compileComponents();

    fixture = TestBed.createComponent(PeriodoEnElExtranjeroComponent);
    component = fixture.componentInstance;
    component.consultaState = {
      readonly: false,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
