import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { TransferService } from '../../services/transfer.service';
import { catchError, of, take, tap } from 'rxjs';
import { Manifest, ManifestResponse } from '../../interfaces/transfers.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';

@Component({
  selector: 'app-manifest-info',
  standalone: true,
  imports: [],
  templateUrl: './manifest-info.component.html',
})
export class ManifestInfoComponent implements OnInit {
  @Output() onManifestRequested = new EventEmitter<void>();

  private transferService = inject(TransferService);
  private sessionStorage = inject(SessionStorageService);
  manifest = signal<Manifest | null>(null);
  displayErrorAlert = signal<boolean>(false);

  ngOnInit(): void {
    this.loadFromSessionStorage();
    this.getManifest();
  }

  getManifest() {
    this.displayErrorAlert.set(false);
    this.transferService
      .getManifest()
      .pipe(
        tap((response: ManifestResponse) => {
          if (response.codigo === '00') {
            this.manifest.set(response.datos);
            this.onManifestRequested.emit();
          } else {
            this.displayErrorAlert.set(true);
          }
        }),
        catchError(() => {
          this.displayErrorAlert.set(true);

          return of();
        }),
        take(1),
      )
      .subscribe();
  }

  private loadFromSessionStorage() {
    const manifestNumber = this.sessionStorage.get<string>('manifestNumber');
    const flight = this.sessionStorage.get<string>('flight');
    if (manifestNumber && flight) {
      this.transferService.manifest.set(manifestNumber);
      this.transferService.flight.set(flight);
    }
  }
}
