import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAduaneraComponent } from './gestion-aduanera.component';

describe('GestionAduaneraComponent', () => {
  let component: GestionAduaneraComponent;
  let fixture: ComponentFixture<GestionAduaneraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAduaneraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAduaneraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
