export interface BookList {
    id : number,
    title : string,
    author: string, 
    description : string,
    images? : BookImage[]
}

export interface BookDetail {
    id? : number,
    title : string,
    author: string, 
    description : string,
    volume : number,
    total_page : number,
    release_date : Date,
    images? : BookImage[]
}

export interface BookImage {
    id? : number
    file : File
    url : string
}