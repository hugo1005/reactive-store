import { Injectable } from '@angular/core';
import { DbObject } from './db-object';

import { BehaviorSubject } from 'rxjs';

import * as io from 'socket.io-client';

@Injectable()
export class DbService {

  private socket: io.Socket;

  private userDb = {};

  private pathError = (search, path) => { 
    return {msg: 'Error access value at path', accessing: JSON.stringify(search), 'path': path}
  };

  /* Accessing DbObjects*/
  private userDbSubjects = {}; 

  socketLoaded: boolean = false;
  socketMonitor: BehaviorSubject<boolean>;
  

  constructor() { 
    // Declare socket and establish connection
    this.socket = io();

    //Receive initial data payload
    this.socket.on('db', (data)=>{ 
      this.userDb = data;

      this.socketLoaded = true;
      this.socketMonitor.next(this.socketLoaded);
    });
     // Any updates broadcast from other clients 
    this.socket.on('clientUpdate', (data: any)=>{ 
      if(this.socketLoaded) 
      this.UpdateSubjects(data.path, this.userDb, data.data);
    });
  }
      
  Ref(url: string): DbObject<any> { 
    let subject: DbObject<any> = this.userDbSubjects[url]; 

    if(!subject) {
      let route = url.trim().split('/');

      if(this.socketLoaded) {
        let routeValue = this.Value(route.slice(), this.userDb);
  
        subject = new DbObject(routeValue, route.slice(), this);
        this.userDbSubjects[url] = subject;
      } else {
        subject = new DbObject({'socketLoading': true}, route.slice(), this);
      }
     
    }

    return subject;
  }
      

  // Accepts a JSON Object, e.g. userDb snd searches for value at url
  // Eg. 'users/test/nickname' , 
  // Returns error if invalid url, else the value at route.

  private Value(route, search): any { 

    if(route.length < 1) return search; 
    let next = route.shift(); 
    let data = search[next]; 
    let dataUndefined = data !== 0 && !data;

    if(dataUndefined) throw this.pathError(search, next); 

    return this.Value(route, data); 
  }

  // Access Db implicitly without passing userDb variable
  DbValue(route): any {
    return this.Value(route, this.userDb);
  }
  
  // Update any active DbObjects + Write socket changes to userDb 
  private UpdateSubjects(route: string[], store: any, newValue: any) {
    this.socketMonitor.next(this.socketLoaded);
    let subject: DbObject<any> = this.userDbSubjects[route.join('/')];
    
    this.UpdateDb(route, store, newValue);
    if(subject) subject.QuietUpdate(newValue);
  }
  
  // Same implementation as for backend
  private UpdateDb(route, store, value) {
    var next = null;
    
    //Return condition (Assign value to store[next])
    if(route.length <= 1) {
    next = route.shift();
    store[next] = value;
    return;
    };
    
    next = route.shift();
    var subStore = store[next]; 
    this.UpdateDb(route, subStore, value);
  }
}
