import { app, auth, db , storage} from './firebase.mjs'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


document.getElementById('SignUp').addEventListener('click', () => {
  let fname = document.getElementById('fname').value;
  let lname = document.getElementById('lname').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let file = document.getElementById('file').files[0];

  if (fname == '' || lname == '' || password == '' || email == '' || file[0] == '') {
    alert("Please fill the Input");
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          const docRef = await addDoc(collection(db, "users"), {
            fname: fname,
            lname: lname,
            password: password,
            email: email,
          });
          console.log("Document written with ID: ", docRef.id);
        } catch (e) {
          console.error("Error adding document: ", e);  
        }

        // File Upload
        const storageRef = ref(storage, email);
        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, file).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        });
  
        alert('singUp successfully');
        setTimeout(() => {
          window.location.href = './login.html'
        }, 5000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
      })
  }
})



