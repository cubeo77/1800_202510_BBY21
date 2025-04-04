
const myCollection = db.collection("posts");
const categories = ["Diabetic", "IBS", "Celiac"];
// const postContainer = document.querySelector(".post");
const postContainer = document.getElementById("post");


// async function getDocumentCount() {
//     const snapshot = await getCountFromServer(myCollection);
//     console.log("Total documents:", snapshot.data().count);
// }

document.addEventListener("DOMContentLoaded", () => {

    const db = firebase.firestore();
    const postContainer = document.getElementById("post");
    const categories = ["Diabetic", "IBS", "Celiac"];

    // 🔎 Detect category based on page title
    let pageCategory = categories.find(cat => document.title.includes(cat));

    if (!pageCategory) {
        console.warn("Category not found in page title. Defaulting to 'Diabetic'");
        pageCategory = "Diabetic"; // Default fallback
    }

    // 🔄 Load posts dynamically based on category
    function loadPostsByCategory(category) {
        db.collection("uploads")
            .doc(category)
            .collection("images")
            .orderBy("timestamp", "desc") // Sort by newest first
            .onSnapshot((snapshot) => {
                postContainer.innerHTML = ""; // Clear previous posts

                snapshot.forEach((doc) => {
                    const post = doc.data();
                    const card = document.createElement("div");
                    card.classList.add("card");

                    card.innerHTML = `
                        <img src="${post.imageBase64 || 'default-placeholder.jpg'}" class="card-img-top" alt="Uploaded Image" />
                        <div class="card-body">
                            <h5 class="card-title">${post.title || "No Title"}</h5>
                            <p class="card-text">${post.description || "No description available."}</p>

                        </div>
                    `;

                    postContainer.appendChild(card);
                });

                bindDeleteHandlers(category);
            });
    }

    // ✅ Load posts dynamically for the detected category
    loadPostsByCategory(pageCategory);

    // Get the category from the page title or URL

    // If the category is in the URL instead, use this:
    // const urlParams = new URLSearchParams(window.location.search);
    // const pageCategory = urlParams.get("category") || "defaultCategory"; 




    // let category;
    // if (document.title.includes("Diabetic")) {
    //     category = "Diabetic";
    // } else if (document.title.includes("IBS")) {
    //     category = "IBS";
    // } else if (document.title.includes("Celiac")) {
    //     category = "Celiac";
    // }

    // // 🔄 Load ALL posts in real-time
    // function loadAllPostsRealtime(category) {
    //     const posts = [];

    //     categories.forEach((category) => {

    //         db.collection("uploads")
    //             .doc(category)
    //             .collection("images")
    //             .where("userId", "==", userId)
    //             .orderBy("timestamp", "desc")
    //             .onSnapshot((snapshot) => {
    //                 const filtered = posts.filter((p) => p.category !== category);
    //                 posts.length = 0;
    //                 posts.push(...filtered);

    //                 snapshot.forEach((doc) => {
    //                     const data = doc.data();
    //                     posts.push({
    //                         ...data,
    //                         id: doc.id,
    //                         category,
    //                         timestamp: data.timestamp?.toDate?.() || new Date(0),
    //                     });
    //                 });

    //                 // Sort & render
    //                 posts.sort((a, b) => b.timestamp - a.timestamp);
    //                 postContainer.innerHTML = "";
    //                 posts.forEach((post) => {
    //                     const card = document.createElement("div");
    //                     card.classList.add("card");
    //                     card.innerHTML = `
    //           <img src="${post.imageBase64}" class="card-img-top" alt="Uploaded Image" />
    //           <button class="delete-btn" data-id="${post.id}" data-category="${post.category}">🗑 Delete</button>
    //         `;
    //                     postContainer.appendChild(card);
    //                 });

    //                 bindDeleteHandlers(userId);
    //             });
    //     });
    // }
    function displayCardsDynamically(collection) {
        let cardTemplate = document.getElementById("postCardTemplate");

        db.collection(collection).get()
            .then(allPosts => {

                allPosts.forEach(doc => {

                    var title = doc.data().title;
                    var description = doc.data().description;
                    var imageSource = doc.data().imgSRC;
                    var userId = doc.data().userId;
                    var rating = doc.data().rating;
                    var medicalCategory = doc.data().medicalCategory;
                    var postDate = doc.data().postDate;
                    let newcard = cardTemplate.content.cloneNode(true);

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
});
//------------------------------------------------------------------------------
