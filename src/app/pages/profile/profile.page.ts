import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx'; 

import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage'; 
import { HttpClientModule } from '@angular/common/http';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AppComponent } from 'src/app/app.component';
 
const STORAGE_KEY_PROFILE ='my_images/profile';
const STORAGE_KEY_BACKGROUND ='my_images/background';
const STORAGE_KEY ='my_images';
const PROFILE_IMAGE = 'profile_picture';
const BACKGROUND_IMAGE = 'background_picture';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  images = []; 
  imageBackground = {};
  imageProfile ={}; 
  userName='';
  public isLogged;
  constructor(private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath, private platform: Platform) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.loadStoredImages(STORAGE_KEY_PROFILE);
      this.loadStoredImages(STORAGE_KEY_BACKGROUND);
    });
  }
  ionViewWillEnter() { 
    this.loadStoredImages(STORAGE_KEY_PROFILE);
    this.loadStoredImages(STORAGE_KEY_BACKGROUND);
    this.loadUsername();
  }
  loadUsername(){
    this.userName=AppComponent.userName;
  }
  loadStoredImages(storageKey) {
    console.log("load images");
    this.storage.get(storageKey).then(images => {
      console.log("images "+images);
      if (images) {
        let arr = JSON.parse(images);
        //Solo hay un elemento
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          console.log(filePath);
          let resPath = this.pathForImage(filePath);
          console.log(resPath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
          console.log("imagenes cargadas "+JSON.stringify({ name: img, path: resPath, filePath: filePath }));
          if(storageKey==STORAGE_KEY_PROFILE)
            this.imageProfile= resPath;
          if(storageKey==STORAGE_KEY_BACKGROUND)
            this.imageBackground=resPath;
        }
        
      }
    });
  }
 
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
 
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

    async selectImage(type) {
      const actionSheet = await this.actionSheetController.create({
          header: "Select Image source",
          buttons: [{
                  text: 'Load from Library',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,type);
                  }
              },
              {
                  text: 'Use Camera',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.CAMERA,type);
                  }
              },
              {
                  text: 'Cancel',
                  role: 'cancel'
              }
          ]
      });
      await actionSheet.present();
    }
    takePicture(sourceType: PictureSourceType,type) {
      var options: CameraOptions = {
          quality: 100,
          sourceType: sourceType,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };

      this.camera.getPicture(options).then(imagePath => {
          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.filePath.resolveNativePath(imagePath)
                  .then(filePath => {
                      let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                      let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                      this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),type);
                  });
          } else {
              var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
              var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),type);
          }
      });

    }

    createFileName() {
      var d = new Date(),
          n = d.getTime(),
          newFileName = n + ".jpg";
      return newFileName;
      //return type+".jpg";
    }

    copyFileToLocalDir(namePath, currentName, newFileName, type) {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
          this.updateStoredImages(newFileName, type);
      }, error => {
          this.presentToast('Error while storing file.');
      });
    }

    updateStoredImages(name, type) {
      let storageKey = type==PROFILE_IMAGE ? STORAGE_KEY_PROFILE : STORAGE_KEY_BACKGROUND;
      this.storage.get(storageKey).then(images => {
          let newImages = [name];
          this.storage.set(storageKey, JSON.stringify(newImages));
          
          let filePath = this.file.dataDirectory + name;
          let resPath = this.pathForImage(filePath);

          let newEntry = {
              name: name,
              path: resPath,
              filePath: filePath
          };
          if(type==PROFILE_IMAGE){
            this.imageProfile=resPath;
          }
          else if(type==BACKGROUND_IMAGE){
            this.imageBackground=resPath;
          }
          this.ref.detectChanges(); // trigger change detection cycle
      });
    }

    deleteImage(imgEntry, position, storageKey) {
      this.images.splice(position, 1);

      this.storage.get(storageKey).then(images => {
          let arr = JSON.parse(images);
          let filtered = arr.filter(name => name != imgEntry.name);
          this.storage.set(storageKey, JSON.stringify(filtered));

          var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

          this.file.removeFile(correctPath, imgEntry.name).then(res => {
              this.presentToast('File removed.');
          });
      });
    }


}
