import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'td.text-left, td.text-center, td.text-right, td.mat-cell'
})
export class ReportNaFallbackDirective implements AfterViewInit, OnDestroy {
  private readonly fallbackText = 'N/A';
  private observer: MutationObserver;
  private updating = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.updateFallback();
    this.observer = new MutationObserver(() => this.updateFallback());
    this.observer.observe(this.elementRef.nativeElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private updateFallback(): void {
    if (this.updating) {
      return;
    }

    this.updating = true;
    const element = this.elementRef.nativeElement;

    if (this.shouldSkip(element)) {
      this.removeFallback(element);
      this.updating = false;
      return;
    }

    const fallbackElement = element.querySelector('[data-report-na-fallback="true"]');
    const visibleText = this.getVisibleText(element, fallbackElement);

    if (this.hasValue(visibleText)) {
      this.removeFallback(element);
      this.updating = false;
      return;
    }

    if (!fallbackElement) {
      const span = this.renderer.createElement('span');
      this.renderer.setAttribute(span, 'data-report-na-fallback', 'true');
      this.renderer.appendChild(span, this.renderer.createText(this.fallbackText));
      this.renderer.appendChild(element, span);
    }

    this.updating = false;
  }

  private shouldSkip(element: HTMLElement): boolean {
    return !!element.querySelector(
      'a, button, input, select, textarea, mat-select, mat-checkbox, mat-radio-button, img, svg, i, .fa, .material-icons'
    );
  }

  private getVisibleText(element: HTMLElement, fallbackElement: Element | null): string {
    const clone = element.cloneNode(true) as HTMLElement;
    const clonedFallback = clone.querySelector('[data-report-na-fallback="true"]');

    if (fallbackElement && clonedFallback) {
      clonedFallback.remove();
    }

    return (clone.textContent || '').trim();
  }

  private hasValue(value: string): boolean {
    return value !== '' && value !== 'undefined' && value !== 'null';
  }

  private removeFallback(element: HTMLElement): void {
    const fallbackElement = element.querySelector('[data-report-na-fallback="true"]');

    if (fallbackElement) {
      this.renderer.removeChild(element, fallbackElement);
    }
  }
}
