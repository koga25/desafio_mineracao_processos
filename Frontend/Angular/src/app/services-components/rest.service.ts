import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})

export class RestService implements OnInit{
    private csvToSvgUrl: string = "http://127.0.0.1:5000/csvtosvg"
    constructor(private http: HttpClient) {}
    
    ngOnInit(): void {
        
    }
    
    
}

