import { ErrorHandler, inject, Injectable } from '@angular/core';
import { NexoService } from './nexo.service';

// Unexpected errors are logged in the console and reported to the Tiendanube admin
@Injectable()
export class NexoErrorHandler implements ErrorHandler {
  private readonly nexo = inject(NexoService);

  handleError(error: unknown): void {
    console.error(error);
    this.nexo.logError(error);
  }
}
