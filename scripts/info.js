// Get the button and template container
const button = document.getElementById("show-template");
const templateContainer = document.getElementById("template-container");

// Show the template when the button is clicked
button.addEventListener("click", () => {
  // Toggle visibility by adding/removing the 'hidden' class
  templateContainer.classList.toggle("hidden");
});



var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        let userName = userDoc.data().name;
        let userAge = userDoc.data().age;
        let userHealthCondition = userDoc.data().healthCondition;

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("nameInput").value = userName;
        }
        if (userSchool != null) {
          document.getElementById("ageInput").value = userAge;
        }
        if (userCity != null) {
          document.getElementById("healthConditionInput").value = userHealthCondition;
        }
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it
populateUserInfo();

function editUserInfo() {
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;

}

document.getElementById("save-user-info").addEventListener("click", () => {
  saveUserInfo();
});

function saveUserInfo() {

    //a) Get user entered values 

    const userName = document.getElementById("nameInput").value;
    const userAge = document.getElementById("ageInput").value;
    const userHealthCondition = document.getElementById("healthConditionInput").value;

    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        age: userAge,
        healthCondition: userHealthCondition
        
    })
    .then(() => {
        console.log("Document successfully updated!");
        document.getElementById('personalInfoFields').disabled = true;
        window.location.assign("main.html"); 
    })

    //c) disable edit 
}



