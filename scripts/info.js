// Get the button and template container
const button = document.getElementById("show-template");
const templateContainer = document.getElementById("template-container");

// Show the template when the button is clicked
button.addEventListener("click", () => {
  // Toggle visibility by adding/removing the 'hidden' class
  templateContainer.classList.toggle("hidden");
});

<<<<<<< HEAD:scripts/index.js
// Temporary storage for form data before user logs in
let tempData = {};

var currentUser; //points to the document of the user who is logged in
=======


var currentUser;               //points to the document of the user who is logged in
>>>>>>> c40134768013a069b152aeb91b82158211407917:scripts/info.js
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


function saveUserInfo() {
<<<<<<< HEAD:scripts/index.js
  const userName = document.getElementById("nameInput").value;
  const userAge = document.getElementById("ageInput").value;
  const userHealthCondition = document.getElementById("healthConditionInput").value;

  // Save data to Firestore (without checking if user is logged in)
  db.collection("users")
    .add({
      name: userName,
      age: userAge,
      healthCondition: userHealthCondition,
    })
    .then(() => {
      console.log("User info saved to Firestore");
      alert("Your information has been saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving user info to Firestore:", error);
      alert("There was an error saving your information.");
    });
}
=======

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
    })

    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}


>>>>>>> c40134768013a069b152aeb91b82158211407917:scripts/info.js
