import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { empty } from 'rxjs';

const { Camera,Storage,Filesystem } = Plugins
@Injectable({
  providedIn: 'root'
})
export class GaleryService {
  
  public dataFoto:foto[]=[];
  public fotoing:foto  
  private keyFoto :string = "foto";
  private platform : Platform

  constructor(platform: Platform) { 
    this.platform=platform;
  }
  public async tambahFoto(){
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality:100
    });
    
    const fileFoto = await this.simpanFoto(Foto);

    this.fotoing=fileFoto;

    this.dataFoto.unshift(fileFoto);

    Storage.set({
      key: this.keyFoto,
      value: JSON.stringify(this.dataFoto)
    })
    this.simpanFoto(Foto);
  }
  
  public async tambahFotos(judul:string){
    const Foto = await Camera.getPhoto({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality:100
    });
    const fileFoto = await this.simpanFoto(Foto);
    this.fotoing=fileFoto;
    this.dataFoto.unshift(fileFoto);

    Storage.set({
      key: judul,
      value: JSON.stringify(fileFoto)
    })
    
    this.simpanFoto(Foto);

    Storage.set({
      key: this.keyFoto,
      value: JSON.stringify(this.dataFoto)
    })
    this.simpanFoto(Foto);
  }

  public async simpanFoto(foto:CameraPhoto){
  
    const base64Data = await this.readAsBase64(foto);
    
    const namaFile = new Date().getTime()+'.jpeg';

    const simpanFile = await Filesystem.writeFile({
      path:namaFile,
      data:base64Data,
      directory:FilesystemDirectory.Data
    });

    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    const dataFoto = new File([blob],foto.path,{
      type: "image/jpeg"
    });

    if(this.platform.is('hybrid')){
      return{
        filePath:simpanFile.uri,
        webviewPath:Capacitor.convertFileSrc(simpanFile.uri),
        dataImage: dataFoto
      }
    }else{
      return{
        filePath:namaFile,
        webviewPath : foto.webPath,
        dataImage: dataFoto
      }
    }
    
  }

  private async readAsBase64(foto: CameraPhoto){
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path:foto.path
      });
      return file.data;
    }else{
    const response = await fetch(foto.webPath);
    const blob = await response.blob();
    
    return await this.convertBlobToBase64(blob) as string;

    }
    
  }

  convertBlobToBase64 = (blob:Blob) => new Promise((resolve,reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = ()=>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  public async loadFoto(){
    const listFoto = await Storage.get({key:this.keyFoto});
    this.dataFoto = JSON.parse(listFoto.value)|| [];

    if(!this.platform.is('hybrid')){
      for ( let foto of this.dataFoto){
        const readFile = await Filesystem.readFile({
          path: foto.filePath,
          directory:FilesystemDirectory.Data
        });
        foto.webviewPath=`data:image/jpeg;base64,${readFile.data}`

        const response = await fetch(foto.webviewPath);
        const blob =await response.blob();

        foto.dataImage =new File([blob], foto.filePath,{
          type: "image/jpeg"
        });
      }
    }
    console.log(this.dataFoto);
  }

  public async loadFotos(judul:string){
    const listFoto = await Storage.get({key:judul});
    this.dataFoto = JSON.parse(listFoto.value)|| [];

    if(!this.platform.is('hybrid')){
      for ( let foto of this.dataFoto){
        const readFile = await Filesystem.readFile({
          path: foto.filePath,
          directory:FilesystemDirectory.Data
        });
        foto.webviewPath=`data:image/jpeg;base64,${readFile.data}`

        const response = await fetch(foto.webviewPath);
        const blob =await response.blob();

        foto.dataImage =new File([blob], foto.filePath,{
          type: "image/jpeg"
        });
      }
    }
    console.log(this.dataFoto);
  }


}

export interface foto{
  filePath: string;
  webviewPath : string;
  dataImage:File;
}
