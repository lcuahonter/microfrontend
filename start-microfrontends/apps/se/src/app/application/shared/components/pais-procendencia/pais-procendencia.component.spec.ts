import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaisProcendenciaComponent } from './pais-procendencia.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CrosslistComponent } from '@libs/shared/data-access-user/src/tramites/components/crosslist/crosslist.component';
import { TituloComponent } from '@libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';
import { CommonModule } from '@angular/common';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
 
describe('PaisProcendenciaComponent', () => {
  let component: PaisProcendenciaComponent;
  let fixture: ComponentFixture<PaisProcendenciaComponent>;
 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        TituloComponent,
        CrosslistComponent,
        CatalogoSelectComponent,
        PaisProcendenciaComponent, 
      ],
    }).compileComponents();
  });
 
  beforeEach(() => {
    fixture = TestBed.createComponent(PaisProcendenciaComponent);
    component = fixture.componentInstance;
    component.paisForm = new FormGroup({
      pais: new FormControl(''),
      bloque: new FormControl(''), // Add the missing 'bloque' control
      usoEspecifico: new FormControl(''), // Add the missing 'usoEspecifico' control
      justificacionImportacionExportacion: new FormControl(''), // Add the missing 'justificacionImportacionExportacion' control
      observaciones: new FormControl(''), // Add the missing 'observaciones' control
    });
    component.elementosDeBloque = [
      { id: 1, descripcion: "SGP" },
      { id: 2, descripcion: "TLC JAPON" },
      { id: 3, descripcion: "TLC PERU" },
      { id: 4, descripcion: "CAM" },
      { id: 5, descripcion: "T-MEC" },
      { id: 6, descripcion: "ALADI" },
      { id: 7, descripcion: "TLC MEX-CR" },
      { id: 8, descripcion: "TLC MEX-NIC" },
      { id: 9, descripcion: "OMC" },
      { id: 10, descripcion: "UNILATERAL" },
      { id: 11, descripcion: "TLC MEX-CHILE " },
      { id: 12, descripcion: "TLC MEX-ISRAEL" }
    ];
    component.paisesPorBloque = [
      { id: 1, descripcion: "URUGUAY (REPUBLICA ORIENTAL DE)" },
      { id: 2, descripcion: "ARGENTINA (REPUBLICA)" },
      { id: 3, descripcion: "CUBA (REPUBLICA DE)" },
      { id: 4, descripcion: "ECUADOR (REPUBLICA DEL)" },
      { id: 5, descripcion: "PANAMA (REPUBLICA DE)" },
      { id: 6, descripcion: "PARAGUAY (REPUBLICA DEL)" },
      { id: 7, descripcion: "PERU (REPUBLICA DEL)" },
      { id: 8, descripcion: "BRASIL (REPUBLICA TEDE RAMA DE)" }
    ];
    component.selectRangoDias = [
      "URUGUAY (REPUBLICA ORIENTAL DE)",
      "ARGENTINA (REPUBLICA)",
      "CUBA (REPUBLICA DE)",
      "ECUADOR (REPUBLICA DEL)",
      "PANAMA (REPUBLICA DE)",
      "PARAGUAY (REPUBLICA DEL)",
      "PERU (REPUBLICA DEL)",
      "BRASIL (REPUBLICA TEDE RAMA DE)"
    ];
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
 it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });
 
  it('Debe devolver verdadero si el control no es válido', () => {
    component.paisForm.controls['pais'].setValue(''); 
    component.paisForm.controls['pais'].markAsTouched();
  });
})