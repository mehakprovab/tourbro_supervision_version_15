import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx'; // excel file extension

@Injectable({
    providedIn: 'root'
})

export class UtilityService {

    // list of regExp pattarn. Please maintain the ASCENDING ORDER
    regExp = {
        alphaNum: '^[a-zA-Z0-9]*$',
        userName: '^[aA-zZ]\\w*$',
        lastName: '^[aA-zZ]?$',
        gstn: '^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[a-zA-Z0-9]{3}$',
        password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
        phone: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$',
        phoneCode: /^[+][0-9]{1,4}$/,
        phoneNo: /^(\d[.\-\s]?){7,11}\d$/,
        email: '^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]){0,}@[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})?$',
        zipCode: '[0-9]{5,6}$',
        fullName: /^[a-zA-Z]+( [a-zA-Z]+)*$/,
        numbOnly: '[0-9]+(\.[0-9][0-9]?)?',
    };

    constants = {
        wkDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }

    constructor() { }

    /**
     * this function is to check empty object
     * if empty return true else false
     * @param obj object to be passed
     * @returns boolean true | false
     */
    isEmpty(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    /**
     * this function is to write either in local storage or session storage
     * @key name of the key
     * @value value to be set in sessionStorage or sessionStorage
     * @store type of storage either sessionStorage or sessionStorage
     * @remember is optional boolean if true set as sessionStorage else sessionStorage
    */
    writeStorage(key: string, value: any, store?, remember?: boolean): void {
        store = remember ? sessionStorage : (store || sessionStorage);
        value = (typeof value === 'object') ? JSON.stringify(value) : String(value);
        store.setItem(key, value);
    }

    /**
     * this function is to read and return the storage value
     * @param name of the key
     * @param store type of storage either sessionStorage or localStorage
     * @returns store data | false
     */
    readStorage(key, store): any | boolean {
        store = store || sessionStorage;
        const storeData = JSON.parse(store.getItem(key));
        return storeData ? storeData : false;
    }

    getStorage(key) {
        return JSON.parse(sessionStorage.getItem(key)) || [];
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /**
     * this function is to formate date from yyyy-mm-dd to dd-mm-yyyy and vice versa
     * @param date date in this given format either yyyy-mm-dd or dd-mm-yyyy
     */

    formateDate(date: string): string {
        let formatedDate = '', temp = date.split('-');
        formatedDate = `${temp[2] + '-' + temp[1] + '-' + temp[0]}`;
        return formatedDate;
    }

    /**
     * This function return the age a person pon provided DOB date inastance
     * @param birthday is the instance of a Date
     */

    calculateAge(birthday) { // birthday is a date instance
        let tempDate = (birthday instanceof Date) ? birthday.getTime() : new Date(birthday).getTime();
        let ageDifMs = Date.now() - tempDate;
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    noOfNights(i, o) {
        return Number((new Date(o).getTime() - new Date(i).getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * This function is to get the name of the weekdays 
     * @param d if short form of days like Sun
     * @returns Fullday like Sunday
     */
    getWeekDay(d: string) {
        let tempDay: string = ''
        this.constants.wkDays.forEach(day => {
            let regex = new RegExp(d, 'gi');
            if (day.match(regex)) {
                tempDay = day;
            }
        });
        return tempDay;
    }

    calculateDiff(fromDate, toDate) {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        return Math.floor((Date.UTC(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()) - Date.UTC(toDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())) / (1000 * 60 * 60 * 24));
    }

    calculateDiffTime(fromDate, toDate) {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        const diffInMs = Date.parse(toDate) - Date.parse(fromDate);
        const diffInHours = diffInMs / 1000 / 60;
        return diffInHours;
    }

    calculateDuration(fromDate, toDate) {
        fromDate = new Date(fromDate);
        toDate = new Date(toDate);
        const diffInMs = Date.parse(toDate) - Date.parse(fromDate);
        const diffInHours = diffInMs / 1000 / 60;
        return this.timeConvert(diffInHours);
    }

    timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return (rhours > 0 ? (rhours + " hr ") : '') + rminutes + " min";
    }
    
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    setFromDate(){
        let date = new Date();
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        return fromDate;
    }

    setToDate(){
        let date = new Date();
        return date;
    }

    checkSeatSelection(passengers) {
        let hasValue = false;
        for (const passenger of passengers) {
            if (passenger.SeatInfo && passenger.SeatInfo.length > 0) {
                hasValue = true;
                break;
            }
        }
        return hasValue;
    }

    public exportToExcel(element: any, fileName: string,columnWidth:any): void {
        const EXCEL_EXTENSION = '.xlsx';
        // Function to capitalize the text in a cell
        const capitalizeText = (text: string): string => {
            return text.charAt(0).toUpperCase() + text.slice(1);
        };
        // Generate workbook and add the worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(element);
        // Set column widths (Example: A: 20, B: 15, C: 25, default: 10)
        const columnWidths = columnWidth;
        // Set specific column widths
        columnWidths.forEach((col, index) => {
            const colRef = XLSX.utils.encode_col(index);
            ws['!cols'] = ws['!cols'] || [];
            ws['!cols'].push({ ...col, ...{ wch: col.wch } });
        });
        // Set default column width for remaining columns
        const defaultColumnWidth = 30;
        const lastColumnIndex = columnWidths.length;
        for (let i = lastColumnIndex; i < 100; i++) { // Adjust the loop limit according to the maximum number of columns you expect
            const colRef = XLSX.utils.encode_col(i);
            ws['!cols'].push({ wch: defaultColumnWidth });
        }
        // Capitalize the text in each cell
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
            for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
                if (ws[cellAddress] && ws[cellAddress].t === 's') {
                    ws[cellAddress].v = capitalizeText(ws[cellAddress].v);
                }
            }
        }
        // Set header height
        const headerHeight = 25; // Desired header height
        ws['!rows'] = [{ hpt: headerHeight, hpx: headerHeight }];
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        // Save to file
        XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
    }
}
