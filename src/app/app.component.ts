import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { WindowRefService } from './services/window-ref.service';
import { HttpService } from './services/http-service';
import { KeyValuePair } from './models/data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AnchorDirective } from './shared/anchor.directive';
import { AdInterface } from './page/ads/ad.interface';
import { AdItem } from './page/ads/ad-Item';
import { SampleAdComponent } from './page/ads/samples/sample-ad/sample-ad.component';
import { ModelInfo } from './models/scrape.model';
import { Models } from './models/models.model';

// https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle
// https://developer.chrome.com/articles/file-system-access/
// https://www.vitamindev.com/angular/how-to-initialize-a-service-on-startup/
// https://angular.io/guide/dynamic-component-loader

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(AnchorDirective, {static: false}) anchor!: AnchorDirective;

  title = 'file-manager';
  directoryHandle: any;
  path: string = '';
  contentText: string;
  showContentWrapper: boolean;
  showGrid: boolean;
  showModelInfoGrid: boolean;
  editableText: string;
  showEditableWrapper: boolean;
  labels: string[];
  modelInfoSet: ModelInfo[];
  appJsonFileId: string;

  constructor(private windowRefService: WindowRefService, private httpService: HttpService, private httpClient: HttpClient) { }

  async getFile(): Promise<any> {
    try {
      const [fileHandle] = await this.windowRefService.nativeWindow.showOpenFilePicker();
      return await fileHandle.getFile();
    } catch (exception: any) {
      throw exception;
    }
  }

  onClickGetFileInfo() {
    this.revealContent();
    
    this.getFile().then((file) => {
      console.log(file);
      const name: string = file.name;
      const size: number = file.size;
      const type: string = file.type;
      const lastModified: string = file.lastModified;
      const lastModifiedDate: string = file.lastModifiedDate;
      this.contentText += `Name: ${name}\nSize: ${size}\nType: ${type}\nLast Modified: ${lastModified}\nLast Modified Date: ${lastModifiedDate}\n`;
    })
    .catch((err: any) => { 
      console.log(`onClickFileRunner error: [${err}]`);
    });
  }

  async getDirectory() {
    try {
      return await this.windowRefService.nativeWindow.showDirectoryPicker();
    } catch (exception: any) {
      throw exception;
    }
  }

  async *getFilesRecursively(relativePath, entry) {
    if (entry.kind === "file") {
      const file = await entry.getFile();

      if (file !== null) {
        file.relativePath = relativePath;
        yield file;
      }
    } else if (entry.kind === "directory") {
      relativePath = `${relativePath}/${entry.name}`;

      for await (const handle of entry.values()) {
        yield* this.getFilesRecursively(relativePath, handle);
      }
    }
  }

  async onClickScapeDirectory() {
    this.revealContent();

    try {
      let directoryHandle = await this.getDirectory();
      console.log(directoryHandle);
      this.contentText += `Directory Handle: ${JSON.stringify(directoryHandle)}\n`;
      
      const name: string = directoryHandle.name;
      this.contentText += `Directory: ${name}\nPath: ${this.path}\n`;

      for await (const file of this.getFilesRecursively(this.path, directoryHandle)) {
        console.log(file);
        this.contentText += `File: ${JSON.stringify(file)}\n`;

        const name: string = file.name;
        const size: number = file.size;
        const type: string = file.type;
        const lastModified: string = file.lastModified;
        const lastModifiedDate: string = file.lastModifiedDate;
        this.contentText += `Name: ${name}\nSize: ${size}\nType: ${type}\nLast Modified: ${lastModified}\nLast Modified Date: ${lastModifiedDate}\n`;
      }
    } catch(err: any) {
      console.log(`onClickDirectoryRunner error: [${err}]`);
    };
  }

  getMatches(text: string, start: string, end: string): any {
    return text.match(new RegExp(start + "(.*)" + end));
  }

  scrapeUrl(baseUrl: string, modelName: string): Promise<ModelInfo> {
    const url: string = `${baseUrl}/${modelName}`;

    return new Promise<ModelInfo>((resolve, reject) => {
      this.httpService.getRaw(url).subscribe(
        (response: string) => {
          const content: string = response.trim().toLowerCase();
          const modelInfo = new ModelInfo();
          
          modelInfo.name = modelName;
          modelInfo.url = url;
          modelInfo.status = this.getMatches(content, `${modelName.toLowerCase()} is`, `now`)[0];
          modelInfo.image = this.getMatches(content, `https://`, `.jpg`)[0];

          resolve(modelInfo);
        },
        (error) => {
          reject(`Error scraping info on ${modelName} [${error.message}]`);
        });
    });
  }
  
  getModelInfo(model: string) : Promise<ModelInfo> {
    return new Promise<ModelInfo>((resolve, reject) => {
      this.scrapeUrl('https://www.sexlikereal.com/vr-cam-girls', model).then(
        (modelInfo: ModelInfo) => {
          resolve(modelInfo);
        }
      ).catch((error) => {
        reject(error);
      });
    });
  }

  scrapeUrlOld(baseUrl: string, modelName: string): void {
    const url: string = `${baseUrl}/${modelName}`;

    console.log(`Scraping info on ${modelName}`);
    // this.contentText += `Scraping info on ${modelName}\n`;

    const modelInfo = new ModelInfo();

    this.httpService.getRaw(url).subscribe(
      (response: string) => {
        console.log(`HTML on ${modelName} Response: ${response}`)
        let content: string = response.trim().toLowerCase();
        // this.contentText += `Info on ${modelName}: ${this.getMatches(content, `${modelName} is`, `</div>`)[0].replace('</div>', '')}\n`;
        // content = content.replace(/\s+/g, '');
        // content = content.replace(/\n/g, ' ');

        // content = content
        // .split('\n')
        // .map((line) => line.trim())
        // .join('');

        // console.log(content);

        // this.contentText += `Info on ${modelName}\n`;
        // this.contentText += `${this.getMatches(content, `chloeharper is`, `now`)[0]}\n`;
        // this.contentText += `${this.getMatches(content, `https://`, `.jpg`)[0]}\n`;

        const result: any = {
          model: modelName,
          status: `${this.getMatches(content, `${modelName} is`, `now`)[0]}`,
          image: `${this.getMatches(content, `https://`, `.jpg`)[0]}`
        };
        
        this.contentText += `${JSON.stringify(result)}\n`;
      },
      (error) => {
        console.log(`Error scraping info on ${modelName} [${error.error.text}]`);
        // this.contentText += `Error scraping info on ${modelName} [${error.error.text}]\n`;
      },
      () => {
        console.log(`End scrape for ${modelName}`);
        // this.contentText += `End scrape for ${modelName}\n`;

        return modelInfo;
      });
  }

  getModelInfoOld(model: string) : Promise<ModelInfo> {
    return new Promise<ModelInfo>((resolve, reject) => {
    /*
      this.scrapeUrl('https://www.sexlikereal.com/vr-cam-girls', model).then(
        (modelInfo: ModelInfo) => {
          resolve(modelInfo);
        }
      )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log(`Model Info: ${JSON.stringify(this.modelInfoSet[this.modelInfoSet.length - 1], null, 2)}`);
      });
      
      resolve(null);
    });
    */

      this.scrapeUrl('https://www.sexlikereal.com/vr-cam-girls', model).then(
        (modelInfo: ModelInfo) => {
          resolve(modelInfo);
        }
      ).catch((error) => {
        reject(error);
      });
    });
  }

  onClickScrapeHTML(): void {
    this.hideContent();
    this.hideGrid();
    this.revealModelInfoGrid();
    
    this.modelInfoSet.splice(0);

    // let models: string[] = [
    //   'chloeharper',
    //   'julietacastell',
    //   'christynaross',
    //   'violetlet',
    //   'juliiiafan',
    //   'kimberlyworld',
    //   'your_sweet_secret',
    //   'lesaismore',
    //   'foxyshy',
    //   'margotbennet',
    //   'imsofa',
    //   'missmooon',
    //   'kristiimax',
    //   'coldblondy',
    //   'petitelexyy',
    //   'devilishdiamond',
    //   'jessyrays',
    //   'P_U_M_A_',
    //   'NicoleSarahX',
    //   'eifyy'
    // ];

    // let models: string[] = new Models().names;

    new Models().names.forEach((model: string) => {
      //try {       
      //} catch(error) {
      //  console.log(error);
      //} finally {
      //  console.log(`Model Info: ${JSON.stringify(this.modelInfoSet[this.modelInfoSet.length - 1], null, 2)}`);
      //}

      // this.scrapeUrl('https://www.sexlikereal.com/vr-cam-girls', model).then(
      //   (modelInfo: ModelInfo) => {
      //     this.modelInfoSet.push(modelInfo);
      //   }
      // ).catch((error) => {
      //   console.error(error);
      // });
      
      this.getModelInfo(model).then(
        (modelInfo: ModelInfo) => {
          if (modelInfo == null) return;
          this.modelInfoSet.push(modelInfo);
        },
        (error) => {
          console.error(error);
        }
      );
    });

    // setTimeout(() => {
    //   let idx = 0;

    //   models.forEach((model: string) => {  
    //     this.getModelInfo(model).then(
    //       (modelInfo: ModelInfo) => {
    //         if (modelInfo != null) {
    //           this.modelInfoSet[idx++] = modelInfo;
    //         }
    //       }
    //     );
    //   });
    // }, 10000);
  }

  onClickRecursiveMediaScraper(): void {
    this.hideContent();
    this.hideGrid();
    this.hideModelInfoGrid();

    // TODO
  }

  loadAdComponent(): void {
    this.revealGrid();
    
    // const viewContainerRef = this.anchor.viewContainerRef;
    // viewContainerRef.clear();
  
    // const componentRef = viewContainerRef.createComponent<AdInterface>(SampleAdComponent);
    // componentRef.instance.data = { name: 'Bombasto', bio: 'Brave as they come' };
  
    // const adItem = new AdItem(HeroProfileComponent, { name: 'Bombasto', bio: 'Brave as they come' });
  
    // const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
    // componentRef.instance.data = adItem.data;
  }

  onClickAddComponents(): void {
    this.hideContent();
    this.loadAdComponent();
  }

  onClickGetGoolgDriveAuthorisation(): void {
    this.revealEditable();
  }

  private fetchFile(id: string): any {
    const headers: KeyValuePair[] = [
      new KeyValuePair('Id', id),
      new KeyValuePair('Accept', 'application/json')
    ];

    return new Promise((resolve, reject) => {
      this.httpService.get('http://localhost:3000/getFile', headers)
      .then((obj: any) => {
        console.log(`[fetchFile] ${JSON.stringify(obj)}`);
        resolve(obj);
      })
      .catch((err: any) => {
        console.log(`[fetchFile] Error: ${JSON.stringify(err)}`);
        reject(err);
      });
    });
  }

  fetchAppFile(): void {
    const emptyHeaders: KeyValuePair[] = [];
    
    this.httpService.get('http://localhost:3000/getFilesInfo', emptyHeaders)
    .then((obj: any) => {
      console.log(`[fetchAppFile] ${JSON.stringify(obj)}`);
  
      // obj.forEach((file: any) => {
      //   console.log(`File: ${file.name} [${file.id}]`);
      // });
  
      const file = obj.find(f => f.name === 'app.json');
  
      if (file !== undefined && file !== null) {
        // console.log(`File: ${file.name} [${file.id}]`);
        
        this.appJsonFileId = file.id;
        this.editableText = `Retrieving file [${file.id}] ...`;
  
        /*
        const headers: KeyValuePair[] = [
          new KeyValuePair('Id', file.id),
          new KeyValuePair('Accept', 'application/json')
        ];
  
        this.httpService.get('http://localhost:3000/getFile', headers)
        .then((obj: any) => {
          // console.log(`Content: ${obj}`);
          this.editableText = obj;
        })
        .catch((err: any) => {
          console.log(`[fetchAppFile] Error: ${JSON.stringify(err)}`);
        });
        */

        this.fetchFile(file.id).then((obj: any) => {
          console.log(`[fetchFile] ${JSON.stringify(obj)}`);
          this.editableText = obj;
        })
        .catch((err: any) => {
          console.log(`[fetchFile] Error: ${JSON.stringify(err)}`);
        });
      }
  
      // obj.forEach((file: any, index) => {
      //   console.log(`File ${index + 1}\n`);
      //   console.log(`Id: ${file.id}\n`);
      //   console.log(`Name: ${file.name}\n`);
      //   console.log(`Size: ${file.size}\n`);
      //   console.log(`MimeType: ${file.mimeType}\n`);
      // });
    })
    .catch((err: any) => {
      console.log(`[fetchAppFile] Error: ${JSON.stringify(err)}`);
    });
  }

  onClickPostFile(): void {
    const body = this.editableText;
    
    const headers: KeyValuePair[] = [
      new KeyValuePair('Id', this.appJsonFileId)
    ];

    this.httpService.put('http://localhost:3000/updateFile', body, headers)
    .then((obj: any) => {
      console.log(`[updateFile] ${JSON.stringify(obj)}`);
    });
  }

  revealContent(): void {
    this.contentText = '';
    this.showGrid = false;
    this.showModelInfoGrid = false;
    this.showContentWrapper = true;
    this.showEditableWrapper = false;
  }

  hideContent(): void {
    this.showContentWrapper = false;
  }

  revealEditable(): void {
    this.editableText = '';
    this.showGrid = false;
    this.showModelInfoGrid = false;
    this.showContentWrapper = false;
    this.showEditableWrapper = true;
  }

  hideEditable(): void {
    this.showEditableWrapper = false;
  }

  revealGrid(): void {
    this.showContentWrapper = false;
    this.showModelInfoGrid = false;
    this.showEditableWrapper = false;
    this.showGrid = true;
  }

  hideGrid(): void {
    this.showGrid = false;
  }

  revealModelInfoGrid(): void {
    this.showContentWrapper = false;
    this.showGrid = false;
    this.showModelInfoGrid = true;
    this.showEditableWrapper = false;
  }

  hideModelInfoGrid(): void {
    this.showModelInfoGrid = false;
  }

  ngOnInit(): void {
    this.labels = [];
    this.modelInfoSet = [];

    for (let itr = 0; itr < 25; itr++) {
      this.labels.push(`Element ${itr+1}`);
    }
  } 
}