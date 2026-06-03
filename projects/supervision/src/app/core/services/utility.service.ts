import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
const EXCEL_EXTENSION = '.xlsx'; // excel file extension
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SwalService } from './swal.service';

type SupportedExtensions = 'pdf' | 'png' | 'xlsx' | 'xls' | 'docx' | 'doc' | 'txt' | 'csv' | 'json' | 'xml';
type PdfOrientation = 'portrait' | 'landscape' | 'p' | 'l';

@Injectable({
    providedIn: 'root'
})

export class UtilityService {
    // list of regExp pattarn. Please maintain the ASCENDING ORDER
    regExp = {
        numbOnly: '[0-9]{1,15}$',
        alphaNum: '^[a-zA-Z0-9]*$',
        userName: '^[aA-zZ]\\w*$',
        lastName: '^[aA-zZ]?$',
        gstn: '^[0-9]{2}[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[a-zA-Z0-9]{3}$',
        password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
        phone: '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$',
        phoneCode: /^[+][0-9]{1,4}$/,
        phoneNo: /^([.-\s]?)?(\d{3}[.-]?){2}\d{4,10}$/,
        email: '^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$',
        zipCode: '[0-9]{5,6}$',
        fullName: /^[a-zA-Z]+(\s{1}[a-zA-Z]+)?$/
    };
    constructor(
        private swalService: SwalService
    ) { }

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
    * @value value to be set in localstorage or sessionStorage
    * @store type of storage either localStorage or sessionStorage
    * @remember is optional boolean if true set as localStorage else sessionStorage
    */
    writeStorage(key: string, value: any, store?, remember?: boolean): void {
        store = remember ? localStorage : (store || sessionStorage);
        value = (typeof value === 'object') ? JSON.stringify(value) : String(value);
        store.setItem(key, value);
    }

    /**
     * this function is to read and return the storage value
     * @param name of the key
     * @param store type of storage either localStorage or sessionStorage
     * @returns store data | false
     */
    readStorage(key, store): any | boolean {
        store = store || localStorage;
        const storeData = JSON.parse(store.getItem(key));
        return storeData ? storeData : false;
    }

    /**Compare two any two values for sorting the table data */
    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    /* Calculate No of days between two dates*/
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
    /*Not to accept special chars*/
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k > 47 && k < 58)  || k == 8 || k == 32);
    }

    /*To accept only numbers*/
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    setFromDate(){
        let date = new Date(),
        firstDay = new Date(date.getFullYear(), date.getMonth(), 1),
        lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0),
        fromDate = new Date(date.valueOf()-(365*24*60*60*1000));
        return fromDate;
    }

    setToDate(){
        let date = new Date();
        let tommorow = date;
        tommorow.setDate(tommorow.getDate());
        return tommorow;
    }

    setAcountFromDate(){
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        return fromDate;
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

    public downloadElementAsExcel(elementId: string, fileName: string): void {
        const element = document.getElementById(elementId);
        const table = element && element.tagName.toLowerCase() === 'table'
            ? element
            : element ? element.querySelector('table') : null;
        if (!table) {
            this.swalService.alert.oops();
            return;
        }

        const workbook = XLSX.utils.table_to_book(table as HTMLTableElement, { sheet: 'Sheet1' });
        XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);
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
    downloadExcel(respData,fileName){
        const fileToExport = respData.map((response: any,index:number) => {
            return {
                "Sl No.":index+1,
                "Email":response.email_id,
                "Subscribed Date": moment(response.created_at).format("MMM DD, YYYY"),
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 40 },
            { wch: 20 },
        ];
        this.exportToExcel(
            fileToExport,
            fileName,
            columnWidths
        );
    
    }

    downloadElementAsPdf(elementId: string, fileName: string, orientation: PdfOrientation = 'landscape'): void {
        const element = document.getElementById(elementId);
        if (!element) {
            this.swalService.alert.oops();
            return;
        }

        const pdfOrientation = orientation === 'portrait' || orientation === 'p' ? 'p' : 'l';
        const pageWidth = pdfOrientation === 'p' ? 210 : 297;
        window['html2canvas'] = html2canvas;

        html2canvas(element, {
            allowTaint: true,
            useCORS: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgHeight = (canvas.height * pageWidth) / canvas.width;
            const doc = new jsPDF(pdfOrientation, 'mm', 'a4');

            doc.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
            doc.save(`${fileName}.pdf`);
            this.swalService.alert.success();
        }).catch(() => {
            this.swalService.alert.oops();
        });
    }

    downloadA4(type: any,app_reference, print_voucher:any,orientation?: string): void {
        let fileName = app_reference;
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });
        const content = print_voucher.nativeElement;
        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },
            callback: async (doc) => {
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();
            }
        });
    }
    
    
    
}
