import { formatDate } from '@angular/common';
import { decimalDigest } from '@angular/compiler/src/i18n/digest';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GaleryService } from '../services/galery.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  Judul:string
  Isi:string
  Nilai:string
  Tanggal:Date
  ss:string
  patens:string
  x
  isiData : Observable<data[]>;

  isiDataColl : AngularFirestoreCollection<data>;
  urlImageStorage :string[] = []
  constructor(afs:AngularFirestore,public router : Router,public route : ActivatedRoute,public fotoService : GaleryService,private  afStorage : AngularFireStorage) {
    this.isiDataColl = afs.collection('dataNote');
    this.Judul=this.route.snapshot.paramMap.get('judul');
    this.Isi=this.route.snapshot.paramMap.get('isi');
    this.Nilai=this.route.snapshot.paramMap.get('nilai');
    this.ss=this.route.snapshot.paramMap.get('tanggal')
    this.patens=this.route.snapshot.paramMap.get('paten')
    this.Tanggal=new Date(this.ss)
    this.x = formatDate(this.Tanggal,"yyyy-MM-dd","en-us")
     
  }

  async ngOnInit() {
    this.tampilkanData();
    
  }

  simpan(){
    this.isiDataColl.doc(this.patens).set({
      judul:this.Judul,
      isi:this.Isi,
      tanggal:this.x,
      nilai:this.Nilai,
      paten:this.patens
    });
    const imageFilepath = `${this.patens}/${this.fotoService.fotoing.filePath}`;
    this.afStorage.upload(imageFilepath, this.fotoService.fotoing.dataImage).then(() =>{
      this.afStorage.storage.ref().child(imageFilepath).getDownloadURL().then((url) =>{
          this.urlImageStorage.unshift(url)
      });
    });
  }
  tambafoto(){
    this.fotoService.tambahFotos(this.patens);
  }

  tampilkanData(){
    this.urlImageStorage=[];
    var refImage = this.afStorage.storage.ref(this.patens);
    refImage.listAll()
    .then((res)=>{
      res.items.forEach((itemRef)=>{
        itemRef.getDownloadURL().then(url=>{
          this.urlImageStorage.unshift(url)
        })
      });
    }).catch((error)=>{
      console.log(error);
    })
    
  }
  
}

interface data{
  judul : string,
  isi :string,
  tanggal : Date,
  nilai : string,
  paten:string
}
