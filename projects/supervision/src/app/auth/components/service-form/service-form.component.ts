import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  supplierId: number;
  selectedServices: string[] = [];
  activeTab: number = 0;
  loading = false;
  
  serviceForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router
  ) {
    // Initialize empty form
    this.serviceForm = this.fb.group({
      properties: this.fb.array([]),
      Yatra: this.fb.array([]),
      activities: this.fb.array([]),
      cabs: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Query Params:', params);
      
      this.supplierId = params['supplier_id'] ? +params['supplier_id'] : 0;
      const services = params['services'];
      this.selectedServices = services ? services.split(',') : [];
      
      console.log('Selected Services:', this.selectedServices);
      
      if (this.selectedServices.length === 0) {
        Swal.fire('Error', 'No services selected', 'error').then(() => {
          this.router.navigate(['/auth/registration-form']);
        });
        return;
      }
      
      // Add exactly ONE form for each selected service
      this.addInitialForms();
    });
  }

  addInitialForms() {
    this.selectedServices.forEach(service => {
      switch(service) {
        case 'stays':
          this.addProperty();
          break;
        case 'yatra-packages':
          this.addYatra();
          break;
        case 'experiences':
          this.addActivity();
          break;
        case 'cabs':
          this.addCab();
          break;
      }
    });
    console.log('Forms added successfully');
  }

  // Properties / Hotels
  get propertiesFormArray(): FormArray {
    return this.serviceForm.get('properties') as FormArray;
  }

  addProperty() {
    // Only add if empty
    if (this.propertiesFormArray.length === 0) {
      const propertyForm = this.fb.group({
        propertyName: ['', Validators.required],
        currency: ['INR', Validators.required],
        propertyRating: [3, Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        propertyAddress: ['', Validators.required],
        checkInTime: ['12:00', Validators.required],
        checkOutTime: ['11:00', Validators.required],
        contract_expiry_date: ['', Validators.required],
        hotel_hotel_amenities: ['']
      });
      this.propertiesFormArray.push(propertyForm);
    }
  }

  removeProperty(index: number) {
    // Prevent removal if it's the last one (optional)
    // this.propertiesFormArray.removeAt(index);
  }

  // Yatra Packages
  get yatraFormArray(): FormArray {
    return this.serviceForm.get('Yatra') as FormArray;
  }

  addYatra() {
    // Only add if empty
    if (this.yatraFormArray.length === 0) {
      const yatraForm = this.fb.group({
        TourName: ['', Validators.required],
        TourDescription: ['', Validators.required],
        StartDate: ['', Validators.required],
        ExpiryDate: ['', Validators.required],
        country_id: ['', Validators.required],
        city_id: ['', Validators.required],
        Duration: ['', Validators.required]
      });
      this.yatraFormArray.push(yatraForm);
    }
  }

  removeYatra(index: number) {
    // Remove functionality disabled
  }

  // Activities
  get activitiesFormArray(): FormArray {
    return this.serviceForm.get('activities') as FormArray;
  }

  addActivity() {
    // Only add if empty
    if (this.activitiesFormArray.length === 0) {
      const activityForm = this.fb.group({
        activity_name: ['', Validators.required],
        activity_duration: ['', Validators.required],
        activity_duration_type: ['Hours'],
        activity_country: ['', Validators.required],
        activity_city: ['', Validators.required],
        pickup_location: [''],
        dropoff_location: ['']
      });
      this.activitiesFormArray.push(activityForm);
    }
  }

  removeActivity(index: number) {
    // Remove functionality disabled
  }

  // Cabs
  get cabsFormArray(): FormArray {
    return this.serviceForm.get('cabs') as FormArray;
  }

  addCab() {
    // Only add if empty
    if (this.cabsFormArray.length === 0) {
      const cabForm = this.fb.group({
        vehicle_name: ['', Validators.required],
        vehicle_type: ['', Validators.required],
        capacity: [4, Validators.required],
        ac: [true],
        country_id: ['', Validators.required],
        city_id: ['', Validators.required],
        vehicle_reg_no: ['', Validators.required]
      });
      this.cabsFormArray.push(cabForm);
    }
  }

  removeCab(index: number) {
    // Remove functionality disabled
  }

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  onSubmit() {
    if (this.serviceForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    this.loading = true;
    
    const payload = {
      supplier_id: this.supplierId,
      services: this.selectedServices,
      ...this.serviceForm.value
    };
    
    console.log('Submitting payload:', payload);
    
    // Replace with your actual API call
    setTimeout(() => {
      this.loading = false;
      Swal.fire('Success', 'Service details submitted successfully!', 'success').then(() => {
        this.router.navigate(['/auth/login']);
      });
    }, 1000);
  }
}