  import { Component } from '@angular/core';
  import { Observable } from 'rxjs';
  import {AngularFirestoreCollection,AngularFirestore} from '@angular/fire/firestore'
  import { GaleryService } from '../services/galery.service';
  import {AngularFireStorage} from '@angular/fire/storage'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  urlImageStorage :string[] = []
  isiData : Observable<data[]>;
  
  isiDataColl : AngularFirestoreCollection<data>;

  Judul : string
  Isi : string
  tanggal : Date
  Nilai: string

  constructor(afs : AngularFirestore,public galery:GaleryService,private  afStorage : AngularFireStorage) {
    this.isiDataColl = afs.collection('dataNote');
  }
  async ngOnInit(){
    await this.galery.loadFotos(this.Judul);
  }
  simpan(){
    this.isiDataColl.doc(this.Judul).set({
      judul:this.Judul,
      isi:this.Isi,
      tanggal:this.tanggal,
      nilai:this.Nilai
    });
    const imageFilepath = `${this.Judul}/${this.galery.fotoing.filePath}`;
    this.afStorage.upload(imageFilepath, this.galery.fotoing.dataImage).then(() =>{
      this.afStorage.storage.ref().child(imageFilepath).getDownloadURL().then((url) =>{
          this.urlImageStorage.unshift(url)
      });
    });

  }
  tamba(){
    this.galery.tambahFotos(this.Judul);
  }

}

interface data{
  judul : string,
  isi :string,
  tanggal : Date,
  nilai : string
}
