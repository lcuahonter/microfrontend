import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPorRegimenComponent } from './datos-por-regimen.component';

describe('DatosPorRegimenComponent', () => {
  let component: DatosPorRegimenComponent;
  let fixture: ComponentFixture<DatosPorRegimenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosPorRegimenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPorRegimenComponent);
    component = fixture.componentInstance;
  component.consultaState = {
      procedureId: '',
      parameter: '',
      department: '',
      folioTramite: '',
      tipoDeTramite: '',
      estadoDeTramite: '',
      readonly: false,
      create: false,
      update: true,
      consultaioSolicitante: null,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
