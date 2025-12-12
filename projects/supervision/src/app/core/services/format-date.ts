export function formatDate(dt: Date, format: string){
    const result = new Date(dt);
    const YYYY = result.getFullYear();
    const MM = ((result.getMonth()+1)+"").padStart(2, '0');
    const DD = (result.getDate()+"").padStart(2, '0');
    return `${YYYY}-${MM}-${DD}`;
}