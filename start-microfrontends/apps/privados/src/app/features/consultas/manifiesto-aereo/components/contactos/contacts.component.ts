import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { TableData } from '../../../../../shared/interfaces/table.interface';
import { ConsultasAereosService } from '../../services/consultas-aereos/consultas-aereos.service';
import { catchError, of, take, tap } from 'rxjs';
import { ContactsResponse } from '../../interfaces/consultas-aereos.interface';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
  private consultasAereosService = inject(ConsultasAereosService);
  tableContactsData = signal<TableData>({
    headers: [
      'Nombre contacto',
      'Número Telefonico',
      'Número de fax',
      'Correo electronico',
      'Telex',
    ],
    body: [],
  });
  isLoadingContactsData = signal<boolean>(true);
  errorDataContacs = false;

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.consultasAereosService
      .getContacts()
      .pipe(
        tap((resp: ContactsResponse) => {
          if (resp.codigo === '00') {
            const body = resp.datos.map((item) => [
              item.nombreContacto,
              item.telefono,
              item.fax,
              item.correoElectronico,
              item.telex,
            ]);
            this.tableContactsData.set({
              ...this.tableContactsData(),
              body,
            });
          }
          this.isLoadingContactsData.set(false);
        }),
        catchError(() => {
          this.errorDataContacs = true;
          this.isLoadingContactsData.set(false);
          return of();
        }),
        take(1),
      )
      .subscribe();
  }
}
