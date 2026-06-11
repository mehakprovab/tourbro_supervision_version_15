import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { environment } from 'projects/supervision/src/environments/environment';

@Component({
  selector: 'app-patanjali-wellness-gallery',
  templateUrl: './patanjali-wellness-gallery.component.html',
  styleUrls: ['./patanjali-wellness-gallery.component.scss']
})
export class PatanjaliWellnessGalleryComponent implements OnInit {
  @ViewChild('galleryInput', { static: false }) galleryInput: ElementRef<HTMLInputElement>;
  @ViewChild('updateInput', { static: false }) updateInput: ElementRef<HTMLInputElement>;

  readonly galleryId = 1;
  readonly imageBaseUrl = `${environment.baseUrl}/wellness/getGalleryImages`;

  galleryImages: any[] = [];
  selectedFiles: File[] = [];
  updateFile: File | null = null;
  editingImage: any = null;
  editingIndex: number | null = null;
  isTrending = false;
  loading = false;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService
  ) { }

  ngOnInit(): void {
    this.getGalleryList();
  }

  getGalleryList(): void {
    const request = {
      id: this.galleryId,
      offset: 0,
      limit: 100
    };

    this.apiHandlerService.apiHandler('patanjaliWellnessGalleryList', 'post', {}, {}, request).subscribe(
      (response) => {
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
          this.galleryImages = this.normalizeImages(response.data);
          this.isTrending = this.getTrendingValue(response.data, this.isTrending);
        }
      },
      () => {
        this.galleryImages = [];
      }
    );
  }

  onGallerySelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = this.validateFiles(input.files);
  }

  onUpdateSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = this.validateFiles(input.files, 1);
    this.updateFile = files.length ? files[0] : null;
  }

  uploadGallery(): void {
    if (!this.selectedFiles.length) {
      this.swalService.alert.oops('Please select image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('id', String(this.galleryId));
    formData.append('is_trending', String(this.isTrending));
    this.selectedFiles.forEach((file) => formData.append('Gallery', file, file.name));

    this.loading = true;
    this.apiHandlerService.apiHandler('patanjaliWellnessUploadGallery', 'post', {}, {}, formData).subscribe(
      (response) => {
        this.loading = false;
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
          this.swalService.alert.success('Gallery images uploaded successfully.');
          this.galleryImages = this.normalizeImages(response.data, this.galleryImages);
          this.selectedFiles = [];
          this.clearFileInput(this.galleryInput);
          this.getGalleryList();
          return;
        }
        this.swalService.alert.oops(response && (response.Message || response.message) || 'Image upload failed.');
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err, 'Image upload failed.'));
      }
    );
  }

  editImage(image: any, index: number): void {
    this.editingImage = image;
    this.editingIndex = index;
    this.updateFile = null;
    this.clearFileInput(this.updateInput);
  }

  cancelEdit(): void {
    this.editingImage = null;
    this.editingIndex = null;
    this.updateFile = null;
    this.clearFileInput(this.updateInput);
  }

  updateImage(): void {
    if (this.editingIndex === null) {
      this.swalService.alert.oops('Please select gallery image to update.');
      return;
    }

    const formData = new FormData();
    formData.append('id', String(this.galleryId));
    formData.append('index', String(this.editingIndex));
    formData.append('image_url', this.getImageValue(this.editingImage));
    formData.append('is_trending', String(this.isTrending));
    if (this.updateFile) {
      formData.append('Gallery', this.updateFile, this.updateFile.name);
    }

    this.loading = true;
    this.apiHandlerService.apiHandler('patanjaliWellnessUploadGallery', 'post', {}, {}, formData).subscribe(
      (response) => {
        this.loading = false;
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
          this.swalService.alert.success('Gallery image updated successfully.');
          this.cancelEdit();
          this.getGalleryList();
          return;
        }
        this.swalService.alert.oops(response && (response.Message || response.message) || 'Image update failed.');
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.swalService.alert.error(this.getErrorMessage(err, 'Image update failed.'));
      }
    );
  }

  deleteImage(image: any, index: number): void {
    this.swalService.alert.delete((action) => {
      if (!action) {
        return;
      }

      const request = {
        id: String(this.galleryId),
        image_url: this.getImageName(image)
      };

      this.loading = true;
      this.apiHandlerService.apiHandler('patanjaliWellnessDeleteGallery', 'post', {}, {}, request).subscribe(
        (response) => {
          this.loading = false;
          if (response && (response.statusCode === 200 || response.statusCode === 201)) {
            this.swalService.alert.success('Gallery image deleted successfully.');
            this.galleryImages.splice(index, 1);
            this.galleryImages = [...this.galleryImages];
            return;
          }
          this.swalService.alert.oops(response && (response.Message || response.message) || 'Image delete failed.');
        },
        (err: HttpErrorResponse) => {
          this.loading = false;
          this.swalService.alert.error(this.getErrorMessage(err, 'Image delete failed.'));
        }
      );
    });
  }

  getImageUrl(image: any): string {
    const imageValue = this.getImageValue(image);
    if (!imageValue) {
      return '';
    }
    if (/^https?:\/\//i.test(imageValue)) {
      return imageValue;
    }
    return `${this.imageBaseUrl}/${imageValue.replace(/^\/+/, '')}`;
  }

  getImageName(image: any): string {
    const imageValue = this.getImageValue(image);
    return imageValue ? imageValue.split('/').pop() : 'Gallery image';
  }

  private validateFiles(fileList: FileList | null, maxFiles?: number): File[] {
    if (!fileList || !fileList.length) {
      return [];
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const maxSize = 1 * 1024 * 1024;
    const files = Array.from(fileList).slice(0, maxFiles || fileList.length);
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        this.swalService.alert.oops('Only JPG, JPEG, PNG, SVG, and WEBP images are allowed.');
        return false;
      }
      if (file.size > maxSize) {
        this.swalService.alert.oops(`"${file.name}" exceeds 1 MB size limit.`);
        return false;
      }
      return true;
    });

    if (maxFiles && fileList.length > maxFiles) {
      this.swalService.alert.oops(`Please select only ${maxFiles} image.`);
    }

    return validFiles;
  }

  private normalizeImages(data: any, fallback: any[] = []): any[] {
    if (Array.isArray(data)) {
      const images = data.reduce((list, item) => list.concat(this.normalizeImages(item, [])), []);
      return images.length ? images : data;
    }
    if (data && Array.isArray(data.gallery)) {
      return data.gallery;
    }
    if (data && Array.isArray(data.images)) {
      return data.images;
    }
    if (data && Array.isArray(data.image_url)) {
      return data.image_url;
    }
    if (data && typeof data.gallery === 'string') {
      return data.gallery.split(',').map((image) => image.trim()).filter((image) => image);
    }
    if (typeof data === 'string') {
      return data.split(',').map((image) => image.trim()).filter((image) => image);
    }
    return fallback;
  }

  private getTrendingValue(data: any, fallback: boolean): boolean {
    const record = Array.isArray(data) ? data.find((item) => item && typeof item === 'object' && 'is_trending' in item) : data;
    if (!record || typeof record !== 'object' || !('is_trending' in record)) {
      return fallback;
    }
    return record.is_trending === true || record.is_trending === 1 || record.is_trending === '1' || record.is_trending === 'true';
  }

  private getImageValue(image: any): string {
    if (!image) {
      return '';
    }
    if (typeof image === 'string') {
      return image;
    }
    return image.image_url || image.image || image.url || image.path || image.name || '';
  }

  private clearFileInput(input: ElementRef<HTMLInputElement>): void {
    if (input && input.nativeElement) {
      input.nativeElement.value = '';
    }
  }

  private getErrorMessage(err: HttpErrorResponse, fallback: string): string {
    return err && err.error && (err.error.Message || err.error.message) ? (err.error.Message || err.error.message) : fallback;
  }
}
