import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosrelacionadosTableComponent } from './tercerosrelacionados.component';
import { CommonModule } from '@angular/common';
import { TablaDinamicaComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosrelacionadosComponent', () => {
  let component: TercerosrelacionadosTableComponent;
  let fixture: ComponentFixture<TercerosrelacionadosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosrelacionadosTableComponent,CommonModule,TituloComponent,AlertComponent,TablaDinamicaComponent,HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosrelacionadosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
