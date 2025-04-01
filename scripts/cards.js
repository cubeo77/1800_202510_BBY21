
const myCollection = db.collection("posts");

// async function getDocumentCount() {
//     const snapshot = await getCountFromServer(myCollection);
//     console.log("Total documents:", snapshot.data().count);
// }

document.addEventListener("DOMContentLoaded", () => {

    function displayCardsDynamically(collection) {
        let cardTemplate = document.getElementById("postCardTemplate");

        db.collection(collection).get()
            .then(allPosts => {

                allPosts.forEach(doc => {
    
                    var title = doc.data().title;
                    var description = doc.data().description;
                    var imageSource = doc.data().imgSRC;
                    // var userId = doc.data().userId; 
                    // var rating = doc.data().rating;
                    // var medicalCategory = doc.data().medicalCategory;
                    // var postDate = doc.data().postDate;
                    // let newcard = cardTemplate.content.cloneNode(true); 

                    let newCard = cardTemplate.content.cloneNode(true);

                    console.log("This is the newCard: newCard");

                    console.log(newCard);
                    //update title and text and image
                    newCard.querySelector('.card-title').innerHTML = title;
                    newCard.querySelector('.card-text').innerHTML = description;
                    newCard.querySelector('.card-img-top').src = `./${imageSource}`;
    
                    //Optional: give unique ids to all elements for future use
                    // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                    // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                    // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);
    
                    //attach to gallery
                    document.getElementById("body-container-posts").appendChild(newCard);
    
                    //i++;   //Optional: iterate variable to serve as unique ID
                })
                // let space = document.createElement("div");
                // space.className = "space";
                // document.getElementById("body-container-posts").appendChild(space);
            })

    }

    displayCardsDynamically("posts");  //input param is the name of the collection
    
    // const myCollection = collection(db, "posts");

    // async function getDocumentCount() {
    //     const snapshot = await getCountFromServer(myCollection);
    //     console.log("Total documents:", snapshot.data().count);
    // }

    // getDocumentCount();

    // function buttonClicked(something) {

    //     db.collection("Posts").doc(something)
    //         .onSnapshot(someText => {
    //             console.log("The text in firestore is: " + someText.data());
    //             document.getElementById("test").innerHTML = someText.data().myWords;
    //         }, (error) => {
    //             console.log("Error calling onSnapshot", error);
    //         });
    // }

    // function loadPosts() {

    //     db.collection("posts")
    // }
    // loadPosts();

    // console.log("Data is here: ", data);

    //------------------------------------------------------------------------------
    // Input parameter is a string representing the collection we are reading from


});
//------------------------------------------------------------------------------
