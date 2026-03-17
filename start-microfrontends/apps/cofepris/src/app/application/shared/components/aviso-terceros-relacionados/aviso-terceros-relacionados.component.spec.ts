import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoTercerosRelacionadosComponent } from './aviso-terceros-relacionados.component';

describe('AvisoTercerosRelacionadosComponent', () => {
  let component: AvisoTercerosRelacionadosComponent;
  let fixture: ComponentFixture<AvisoTercerosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoTercerosRelacionadosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoTercerosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
