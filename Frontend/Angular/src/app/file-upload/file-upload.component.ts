import { Component } from '@angular/core';
import { RestService } from '../services-components/rest.service';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {

  svgString: SafeHtml = "";
  waitForSvg: boolean = false;
  csvToSvgUrl: string = "http://127.0.0.1:5000/csvtosvg"

  fileName: string = "";
  fileControl: FormControl;
  formData?: FormData;
  constructor(private restService: RestService, private sanitizer: DomSanitizer, private http: HttpClient) {
    this.fileControl = new FormControl("", [Validators.required]);
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    if (!input.files[0].name.endsWith(".csv")) {
      this.fileControl.setErrors({ "forbiddenName": true });
      return;
    }

    const file: File = input.files[0];
    this.fileName = file.name;

    let data: FormData = new FormData();
    data.append("file", file);
    this.formData = data;
  }

  async onSubmit() {
    if (this.formData) {
      this.waitForSvg = true;
      await this.getSvg(this.formData);
    }
  }

  async getSvg(formData: FormData) {
    await this.http.post(this.csvToSvgUrl, formData, { responseType: "json" }).subscribe((response: svgResponse) => {
      if (response.result) {
        this.updateSvg(response.result);
      }
      this.waitForSvg = false;
      return;
    });
  }

  updateSvg(svgStr: string) {
    this.svgString = this.sanitizer.bypassSecurityTrustHtml(svgStr);
    console.log(this.svgString);
  }

}


class svgResponse {
  result?: string;
  status?: string;
}



