import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAX_MESSAGE_LENGTH } from '../../models/store-settings.model';
import { SettingsService } from '../../services/settings.service';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Example used to preview the message
const EXAMPLE_PRODUCT = 'Camiseta azul';
const EXAMPLE_URL = 'https://tutienda.com/productos/camiseta-azul';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private readonly settingsService = inject(SettingsService);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly maxLength = MAX_MESSAGE_LENGTH;
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);
  protected readonly saveStatus = signal<SaveStatus>('idle');

  protected readonly form = this.formBuilder.group({
    messageTemplate: ['', [Validators.required, Validators.maxLength(MAX_MESSAGE_LENGTH)]],
    emailEnabled: [true],
    // WhatsApp arrives with the Meta integration (backend block 8)
    whatsappEnabled: [{ value: false, disabled: true }],
  });

  private readonly template = toSignal(this.form.controls.messageTemplate.valueChanges, { initialValue: '' });

  // What the shopper will receive, with an example product
  protected readonly preview = computed(() =>
    this.template().replaceAll('{product}', EXAMPLE_PRODUCT).replaceAll('{url}', EXAMPLE_URL),
  );

  ngOnInit(): void {
    this.settingsService.loadSettings().subscribe({
      next: (settings) => {
        this.form.patchValue(settings);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saveStatus.set('saving');
    this.settingsService.updateSettings(this.form.getRawValue()).subscribe({
      next: (saved) => {
        this.form.patchValue(saved);
        this.form.markAsPristine();
        this.saveStatus.set('saved');
      },
      error: () => this.saveStatus.set('error'),
    });
  }
}
