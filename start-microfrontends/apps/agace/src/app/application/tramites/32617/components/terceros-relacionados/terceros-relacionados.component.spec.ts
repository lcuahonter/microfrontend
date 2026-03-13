import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { RepresentanteLegalComponent } from '../representante-legal/representante-legal.component';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { PersonasNotificacionesComponent } from '../personas-notificaciones/personas-notificaciones.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosComponent', () => {
  let component: TercerosRelacionadosComponent;
  let fixture: ComponentFixture<TercerosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
    CommonModule,
    HttpClientTestingModule,
    TercerosRelacionadosComponent, 
    RepresentanteLegalComponent,
    EnlaceOperativoComponent,
    PersonasNotificacionesComponent,
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar app-representante-legal', () => {
    const el = fixture.nativeElement.querySelector('app-representante-legal');
    expect(el).toBeTruthy();
  });

  it('debería renderizar app-enlace-operativo', () => {
    const el = fixture.nativeElement.querySelector('app-enlace-operativo');
    expect(el).toBeTruthy();
  });

  it('debería renderizar app-personas-notificaciones', () => {
    const el = fixture.nativeElement.querySelector('app-personas-notificaciones');
    expect(el).toBeTruthy();
  });
});
