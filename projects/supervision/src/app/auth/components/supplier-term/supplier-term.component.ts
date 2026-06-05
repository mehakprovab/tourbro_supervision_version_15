import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthService } from '../../../auth/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiHandlerService } from '../../../core/api-handlers';

@Component({
  selector: 'app-supplier-term',
  templateUrl: './supplier-term.component.html',
  styleUrls: ['./supplier-term.component.scss']
})
export class SupplierTermComponent implements OnInit, OnDestroy {
  protected subs = new SubSink();
  staticData = { page_title: '', page_description: '' };
  sanitizedPageDescription: SafeHtml = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private apiHandlerService: ApiHandlerService
  ) { }

  ngOnInit() {
    this.loadStaticContent();
  }

  loadStaticContent(): void {
    const staticTitle = sessionStorage.getItem('static_title');
    if (!staticTitle) {
      console.error('Static title is not available in session storage.');
      this.errorMessage = 'Unable to load content. Please try again later.';
      return;
    }

    this.isLoading = true;
    const title = { page_title: staticTitle };

    this.apiHandlerService.apiHandler('staticPageContentsList', 'POST', '', '', title).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        
        // Check if response has the expected structure from your JSON
        if (res.Status === true && res.statusCode === 201 && res.data) {
          // Your response shows a single object in data, not an array
          this.staticData = {
            page_title: res.data.page_title || '',
            page_description: res.data.page_description || ''
          };
          this.sanitizedPageDescription = this.sanitizeAndLinkify(this.staticData.page_description);
        } 
        // Alternative if data is actually an array
        else if (res.statusCode === 200 && Array.isArray(res.data) && res.data.length > 0) {
          this.staticData = res.data[0];
          this.sanitizedPageDescription = this.sanitizeAndLinkify(this.staticData.page_description);
        } 
        else {
          console.warn('Static content response is invalid or empty.', res);
          this.errorMessage = 'No content available.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching static content:', err);
        this.errorMessage = 'Failed to load content. Please check your connection.';
      }
    });
  }

  private sanitizeAndLinkify(content: string): SafeHtml {
    if (!content) return '';
    
    // Remove HTML tags for URL detection to avoid false positives
    const textContent = content.replace(/<[^>]*>/g, ' ');
    
    const linkifiedContent = textContent.replace(
      /(https?:\/\/[^\s<>"]+|[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s<>"]*)?)/g,
      (match) => {
        let href = match;
        if (!href.startsWith('http://') && !href.startsWith('https://')) {
          href = `https://${href}`;
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
      }
    );
    
    return this.sanitizer.bypassSecurityTrustHtml(linkifiedContent);
  }

  getContent(event: any): void {
    if (event && event.length > 0) {
      this.staticData = event[0];
      this.sanitizedPageDescription = this.sanitizeAndLinkify(this.staticData.page_description);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}