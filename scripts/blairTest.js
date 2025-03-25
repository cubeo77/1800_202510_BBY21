

// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name

// function readQuote(day) {
//     db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
//         .onSnapshot(dayDoc => {                                                              //arrow notation
//             console.log("current document data: " + dayDoc.data());                          //.data() returns data object
//             document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

//             //Here are other ways to access key-value data fields
//             //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
//             //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
//             //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

//         }, (error) => {
//             console.log ("Error calling onSnapshot", error);
//         });
//     }
//  readQuote("tuesday");        //calling the function

function buttonClicked(something){

    db.collection("Posts").doc(something)
    .onSnapshot(someText =>{
        console.log("The text in firestore is: " + someText.data());
        document.getElementById("test").innerHTML = someText.data().myWords;
    }, (error) => {
        console.log ("Error calling onSnapshot", error);
    });
}

document.getElementById("button1").addEventListener("click", () => buttonClicked("test"))

//Capturing Form Data

document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault(); 


    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;

    db.collection("users").add({
        name: name,
        email: email,
        age: parseInt(age),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("User added successfully!");
        document.getElementById("userForm").reset();
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
});