
  import firebase  from 'firebase';

  const firebaseApp=
      firebase.initializeApp({
        apiKey: "AIzaSyD3djcAFoeYpBOQM0uzqRIJlzU1OEzJKl8",
        authDomain: "quickai-ca272.firebaseapp.com",
        databaseURL: "https://quickai-ca272.firebaseio.com",
        projectId: "quickai-ca272",
        storageBucket: "quickai-ca272.appspot.com",
        messagingSenderId: "899168442231",
        appId: "1:899168442231:web:80f9de4f2140c14d54f372"
    });
    const db=firebaseApp.firestore();
    const auth=firebase.auth();
    const storage=firebase.storage();
  
  
    export {db,auth,storage,firebase,firebaseApp}; 
    