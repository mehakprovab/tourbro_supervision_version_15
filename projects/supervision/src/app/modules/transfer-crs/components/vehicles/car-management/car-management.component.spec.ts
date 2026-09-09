import { formatDate } from '@angular/common';
import { CarManagementComponent } from './car-management.component';

describe('CarManagementComponent full text search', () => {
  let component: CarManagementComponent;
  const car = {
    status: '1', bookinStatus: 'BOOKING_CONFIRMED', car_name: 'City Sedan',
    car_model: 'Compact', capacity: 4, fuel: 'CNG',
    booked_on: '2026-09-09T10:30:00', travel_date: '2026-09-12T15:45:00',
    car_number: 'KA12AB3456', supplierName: 'Example Supplier', driver_name: 'Ravi',
    driver_phone: '9876543210', reassigned_by: 'Office Admin',
    pickup: 'Bengaluru', drop: 'Mysuru', total: 1250
  };

  beforeEach(() => {
    component = new CarManagementComponent(null, null, 'en-US');
    component.carTypeList = [{ ...car }];
  });

  it('searches every displayed data field, including status, dates, numbers and fare', () => {
    const searches = ['1', 'accepted', 'City Sedan', 'Compact', '4', 'CNG',
      formatDate(car.booked_on, 'short', 'en-US'), formatDate(car.travel_date, 'short', 'en-US'),
      'KA12AB3456', 'Example Supplier', 'Ravi', '9876543210', 'Office Admin',
      'Bengaluru', 'Mysuru', '₹ 1250'];
    searches.forEach(search => {
      component.searchText = search;
      expect(component.filteredCars.length).toBe(1);
    });
  });

  it('matches words across columns regardless of case and extra spaces', () => {
    component.searchText = '  RAVI   mysuru CnG  ';
    expect(component.filteredCars.length).toBe(1);
  });

  it('uses the current selected status and the cancelled label', () => {
    component.carTypeList[0].status = '0';
    component.searchText = 'Rejected';
    expect(component.filteredCars.length).toBe(1);
    component.searchText = 'Accepted';
    expect(component.filteredCars.length).toBe(0);
    component.carTypeList[0].bookinStatus = 'BOOKING_CANCELLED';
    component.searchText = 'Booking Cancelled';
    expect(component.filteredCars.length).toBe(1);
  });

  it('restores all rows when cleared and safely handles missing values', () => {
    component.carTypeList.push({ booked_on: 'invalid' });
    component.searchText = 'no matching car';
    expect(component.filteredCars.length).toBe(0);
    component.searchText = '  ';
    expect(component.filteredCars).toBe(component.carTypeList);
    expect(component.carTypeList.length).toBe(2);
  });
});
