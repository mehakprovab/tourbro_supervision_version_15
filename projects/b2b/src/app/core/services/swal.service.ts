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
                    text: text != 500 ? text : 'Something went wrong, please try again later',
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
            welcome: (text) =>
                Swal.fire({
                    title: 'Welcome' + ' ' + text,
                    text: 'You have successful logged',
                    icon: 'success',
                    timer: 5000
                }),
            welcomeAlert: (text) =>
                Swal.fire({
                    // title:  text,
                    html: text,
                    icon: 'success',
                    timer: 5000
                }),
            sessionTime: (text) =>
                Swal.fire({
                    title: 'Info',
                    text: text || 'No Action Since 15 Minutes',
                    icon: 'info',
                    timer: 5000
                }),
            confirm: (cb) =>
                Swal.fire({
                    title: 'Payment',
                    text: 'Please select the payment method',
                    input: 'radio',
                    inputOptions: {
                        'bKash': `bKash <img src="assets/images/bKash-logo.png"
                        width="100px" style="cursor: pointer;">`,
                        'nagad': `Nagad <img src="assets/images/nagad-logo.png"
                        width="90px" style="cursor: pointer;">`,
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
            delete: (cb) =>
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Once deleted could not be undo',
                    icon: 'warning',
                    timer: 5000,
                }).then((willDelete) => {
                    if (willDelete) {
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
            oopsWallet: () =>
            Swal.fire({
                title: '',
                icon: 'warning',
                timer: 5000,
                html: `Dear Agent <br/>
                Unable to proceed with booking. 
                <br>
                Your current wallet balance is not enough. 
                Kindly add funds to your wallet to complete the transaction.`
            }),
        }
    }
}
