import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosrelacionadosComponent } from './tercerosrelacionados.component';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosrelacionadosComponent', () => {
  let component: TercerosrelacionadosComponent;
  let fixture: ComponentFixture<TercerosrelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosrelacionadosComponent,CommonModule,TituloComponent,AlertComponent,TablaDinamicaComponent,HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosrelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
