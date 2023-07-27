import { app , auth } from './firebase.mjs'
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

document.getElementById('Login').addEventListener('click' , ()=>{
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert('Sing In successfully');
        window.location.href = './home.html'
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        alert("singUp is first");
        window.location.href = './signup.html'
    })
    });

