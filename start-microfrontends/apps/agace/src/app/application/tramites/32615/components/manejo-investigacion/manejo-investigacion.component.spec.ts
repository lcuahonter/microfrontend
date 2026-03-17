import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManejoInvestigacionComponent } from './manejo-investigacion.component';

describe('ManejoInvestigacionComponent', () => {
  let component: ManejoInvestigacionComponent;
  let fixture: ComponentFixture<ManejoInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManejoInvestigacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManejoInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
