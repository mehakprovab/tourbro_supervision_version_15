export function formatDate(dt: Date, format: string){
    const result = new Date(dt);
    const YYYY = result.getFullYear();
    const MM = ((result.getMonth()+1)+"").padStart(2, '0');
    const DD = (result.getDate()+"").padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
}

export function formatDateNew(dt: Date, format: string){
    const result = new Date(dt);
    const YYYY = result.getFullYear();
    const MM = ((result.getMonth()+1)+"").padStart(2, '0');
    const DD = (result.getDate()+"").padStart(2, '0');
    return `${DD}-${MM}-${YYYY}`;
}

export function formatDateUniversal(dt: string){
    var date1 = dt.split('-')
    var newDate = date1[1] + '/' +date1[0] +'/' +date1[2];
    var date = new Date(newDate);
    return date;
}



