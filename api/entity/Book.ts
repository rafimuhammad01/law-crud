export interface BookList {
    id : number,
    title : string,
    author: string, 
    description : string,
}

export interface BookDetail {
    id? : number,
    title : string,
    author: string, 
    description : string,
    volume : number,
    total_page : number,
    release_date : Date,
}