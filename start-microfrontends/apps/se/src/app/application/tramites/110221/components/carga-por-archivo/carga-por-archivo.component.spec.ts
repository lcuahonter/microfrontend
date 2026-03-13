import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargaPorArchivoComponent } from './carga-por-archivo.component';

describe('CargaPorArchivoComponent', () => {
  let component: CargaPorArchivoComponent;
  let fixture: ComponentFixture<CargaPorArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaPorArchivoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CargaPorArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
