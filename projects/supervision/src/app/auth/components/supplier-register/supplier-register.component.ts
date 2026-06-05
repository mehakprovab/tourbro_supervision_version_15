import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type ServiceModule = 
  | 'stays' 
  | 'yatra-packages' 
  | 'experiences' 
  | 'cabs' 
  |'wellness-retreat'
  | 'travel-heli';

@Component({
  selector: 'app-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.scss']
})
export class SupplierRegisterComponent  {
    // Store multiple selected modules in an array
  selectedModules: ServiceModule[] = [];
  
  // Loading state
  isLoading: boolean = false;

  constructor(private router: Router) {}

  /**
   * Toggle the selection of a module
   * @param module The module to toggle
   */
  toggleModule(module: ServiceModule): void {
    const index = this.selectedModules.indexOf(module);
    if (index === -1) {
      // Add to selection if not already selected
      this.selectedModules.push(module);
    } else {
      // Remove from selection if already selected
      this.selectedModules.splice(index, 1);
    }
  }

  /**
   * Check if a module is currently selected
   * @param module The module to check
   * @returns True if the module is selected
   */
  isSelected(module: ServiceModule): boolean {
    return this.selectedModules.includes(module);
  }

  /**
   * Proceed to next page with selected modules
   * Redirects to another page on proceed click
   */
  proceedToNext(): void {
    if (this.selectedModules.length === 0) {
      return;
    }

    this.isLoading = true;

    // Simulate async operation (optional)
    setTimeout(() => {
      this.isLoading = false;
      
      // Store selected modules in localStorage as a JSON string
      localStorage.setItem('selectedModules', JSON.stringify(this.selectedModules));
      
      // Redirect to another page with query params (convert array to comma-separated string)
      this.router.navigate(['/auth/registration-form'], {
        queryParams: { services: this.selectedModules.join(',') }
      });
      
      // Alternative: Navigate with state data
      // this.router.navigate(['/registration'], {
      //   state: { selectedModules: this.selectedModules }
      // });
      
    }, 500);
  }

  /**
   * Get the selected modules array (useful for debugging)
   */
  getSelectedModules(): ServiceModule[] {
    return this.selectedModules;
  }
}