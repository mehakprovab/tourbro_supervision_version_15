import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Injectable({
    providedIn: 'root'
})

export class SwalService {
    alert: any;
    constructor() {
        this.alert = {
            oops: (text) =>
                Swal.fire({
                    title: '',
                    text: text || 'Something went wrong, please try again later',
                    icon: 'warning',
                    timer: 5000
                }),
            success: (text) =>
                Swal.fire({
                    title: 'Success..!',
                    text: text || 'Done successfully',
                    icon: 'success',
                    timer: 5000
                }),
            add: (text) =>
                Swal.fire({
                    title: 'Success..!',
                    text: text || 'Your data has been added successfully',
                    icon: 'success',
                    timer: 3000
                }),
            update: (text) =>
                Swal.fire({
                    title: 'Success..!',
                    text: text || 'Your data has been updated successfully',
                    icon: 'success',
                    timer: 3000
                }),
            info: (text) =>
                Swal.fire({
                    title: 'Wow..!',
                    text: text || '',
                    icon: 'info',
                    timer: 5000
                }),
            delete: (cb) =>
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Once deleted could not be undo',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('cb');
                        return cb(true);
                    } else {
                        return cb(false);
                    }
                }),
            error: (text) =>
                Swal.fire({
                    title: 'Oops..!',
                    text: text || 'An error has occured, please try again later',
                    icon: 'error',
                    timer: 5000
                }),
            confirm: (cb) =>
                Swal.fire({
                    title: 'Payment',
                    text: 'Please select the payment method',
                    input: 'radio',
                    inputOptions: {
                        'wallet': `Wallet <img src="assets/images/wallet-icon.jpg"
                        width="60px" height="50px" style="cursor: pointer;">`
                    },
                    // input validator 
                    inputValidator: function (result) {
                        if (!result) {
                            return 'You need to select payment method!';
                        }
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        return cb(result.value);
                    } else {
                        return cb(false);
                    }
                }),
        }
    }
}
