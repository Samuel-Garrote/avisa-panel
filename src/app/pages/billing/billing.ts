import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NexoService } from '../../core/nexo.service';
import { BillingService } from '../../services/billing.service';

// Stripe statuses shown to the merchant
const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  trialing: 'En prueba',
  past_due: 'Pago pendiente',
  unpaid: 'Impago',
  canceled: 'Cancelado',
  incomplete: 'Pago incompleto',
};

@Component({
  selector: 'app-billing',
  imports: [DecimalPipe],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing implements OnInit {
  private readonly billingService = inject(BillingService);
  private readonly nexo = inject(NexoService);

  protected readonly billing = this.billingService.billing;
  // Off in production until Stripe takes real payments (see environment.prod.ts)
  protected readonly billingEnabled = environment.billingEnabled;
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly opening = signal(false);
  protected readonly openError = signal(false);

  protected readonly statusLabel = computed(() => {
    const status = this.billing()?.status ?? '';
    return STATUS_LABELS[status] ?? status;
  });

  // Percentage of the monthly limit already used (for the bar)
  protected readonly usagePercent = computed(() => {
    const billing = this.billing();
    if (!billing || billing.notificationLimit === 0) {
      return 0;
    }
    return Math.min(100, Math.round((billing.notificationsThisMonth / billing.notificationLimit) * 100));
  });

  ngOnInit(): void {
    this.billingService.loadBilling().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  // Free plan: Stripe checkout to subscribe. Paid plan: Stripe portal to change plan or cancel
  protected openStripe(): void {
    this.opening.set(true);
    this.openError.set(false);
    this.billingService.createSession().subscribe({
      next: (session) => {
        this.nexo.openInBrowser(session.url);
        this.opening.set(false);
      },
      error: () => {
        this.opening.set(false);
        this.openError.set(true);
      },
    });
  }
}
