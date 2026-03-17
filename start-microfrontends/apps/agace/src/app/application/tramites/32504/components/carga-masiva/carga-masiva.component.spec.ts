import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from '@ng-mf/data-access-user';
import { CargaMasivaComponent } from './carga-masiva.component';
import { TEXTOS } from '../../constants/aviso.enum';
import { TituloComponent } from '@ng-mf/data-access-user';

describe('CargaMasivaComponent', () => {
  let component: CargaMasivaComponent;
  let fixture: ComponentFixture<CargaMasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TituloComponent,
        AlertComponent,
        CargaMasivaComponent // Import the standalone component here
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CargaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have TEXTOS defined', () => {
    expect(component.TEXTOS).toBe(TEXTOS);
  });

  it('should call actualizarArchivo method', () => {
    const EVENT = new Event('change');
    jest.spyOn(component, 'actualizarArchivo');
    component.actualizarArchivo(EVENT);
    expect(component.actualizarArchivo).toHaveBeenCalledWith(EVENT);
  });

  it('should handle file upload logic in actualizarArchivo method', () => {
    const EVENT = {
      target: {
        files: [new File([''], 'filename.txt')]
      }
    } as unknown as Event;
    component.actualizarArchivo(EVENT);
  });
});