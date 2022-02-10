import { Component } from '@angular/core';
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
  csvToSvgUrl: string = "http://127.0.0.1:5000/csvtosvg";

  fileName: string = "";
  fileControl: FormControl;
  formData?: FormData;

  csvInfoUrl: string = "http://127.0.0.1:5000/csvinfo";
  displayedColumns: string[] = ["Activity", "TimeElapsed", "Quantity"];
  dataSource: any;

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
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
      await this.getCsvInfo(this.formData);
    }
  }

  async getSvg(formData: FormData) {
    await this.http.post(this.csvToSvgUrl, formData, { responseType: "json" }).subscribe((response: SvgResponse) => {
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

  async getCsvInfo(formData: FormData) {
    await this.http.post(this.csvInfoUrl, formData, { responseType: "json" }).subscribe((response: CsvInfo) => {
      if (response.activities && response.quantityActivities) {
        //treating json data to use it in MatTable
        let tempActivities = JSON.parse(response.activities).TimeElapsed;
        let tempQuantityActivities = JSON.parse(response.quantityActivities);
        let keys: string[] = Object.keys(tempActivities)
        let tempJson: any = [];
        keys.forEach(element => {
          tempJson.push({
            "Activity": element,
            "TimeElapsed": this.msToCustomTime(tempActivities[element]),
            "Quantity": tempQuantityActivities[element]
          })
        });
        this.dataSource = tempJson;
      }
    });
  }

  msToCustomTime(ms: number) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);
    return days + "D:" + hours + "H:" + minutes + "M:" + sec + "S";
  }

}


class SvgResponse {
  result?: string;
  status?: string;
}

class CsvInfo {
  status?: string;
  activities?: string;
  quantityActivities?: string;
}



