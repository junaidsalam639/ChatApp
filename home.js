import { app, auth, db, storage } from './firebase.mjs'
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { collection, addDoc, query, where, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


let myName0 = document.getElementById("myName");
var myEmail;
var myId;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        myEmail = user.email;
        myId = uid;
        console.log(user);
        console.log(myId);
        console.log(myEmail);

        // user name ki value get krne ke lye firestore se
        const q = query(collection(db, "users"), where("email", "==", myEmail));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            myName0.innerHTML = doc.data().fname + " " + doc.data().lname;
        });

        // file lane ke lye storage se
        getDownloadURL(ref(storage, myEmail))
            .then((url) => {
                // Or inserted into an <img> element
                const img = document.getElementById('myImg');
                img.src = url
            })
            .catch((error) => {
                // Handle any errors
                console.log(error);
            });

        // user name ki value get krne ke lye firestore se
        const query1 = query(collection(db, "users"), where("email", "!=", myEmail));
        const querySnapshot1 = await getDocs(query1);
        querySnapshot1.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let users = document.getElementById("users");
            users.innerHTML += `
                <div class="items" onclick='selectedUser("${doc.data().fname}" , "${doc.data().email}" , "${doc.id}")'>
                <div id='hello' class="userName">
                ${doc.data().fname}
                </div>
            </div>`
        });


        // selected User code
        function selectedUser(fname, email , id) {
            console.log(email);
            console.log(fname);
            console.log(id);
            // file lane ke lye storage se
            getDownloadURL(ref(storage, email))
                .then((url) => {
                    // Or inserted into an <img> element
                    const img = document.getElementById('selectedImg');
                    img.src = url
                    const selectedName = document.getElementById("selectedName");
                    selectedName.innerHTML = fname;
                })
                .catch((error) => {
                    // Handle any errors
                    console.log(error);
                });
                message(id);
        }

        window.selectedUser = selectedUser

        
        // chat code
        console.log(myId);
        function message (userID){
            var mergedId ;
            document.getElementById('message').addEventListener('keydown', async(e) => {
                let inputMessage = document.getElementById("message").value;
                if(userID > myId){
                   mergedId = myId + userID;
                }else{
                    mergedId = userID + myId
                }
                
                if (e.keyCode === 13) {
                    try {
                        const docRef = await addDoc(collection(db, "messages"), {
                            inputValue : inputMessage,
                            myId : myId,
                            userID : userID,
                            mergedId : mergedId,
                        });
                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                }
            })
        }
         
        
    }
    else {
        //  
        //....
    }
});
















// logout code
document.getElementById("logout").addEventListener('click', () => {
    signOut(auth).then(() => {
        alert('SingOut successfully');
        window.location.href = './index.html'
    }).catch((error) => {
        console.log(error);
    });
})


