
const myCollection = db.collection(db, "posts");

async function getDocumentCount() {
    const snapshot = await getCountFromServer(myCollection);
    console.log("Total documents:", snapshot.data().count);
}

document.addEventListener("DOMContentLoaded", () => {


    // const myCollection = collection(db, "posts");

    async function getDocumentCount() {
        const snapshot = await getCountFromServer(myCollection);
        console.log("Total documents:", snapshot.data().count);
    }

    // getDocumentCount();

    function buttonClicked(something) {

        db.collection("Posts").doc(something)
            .onSnapshot(someText => {
                console.log("The text in firestore is: " + someText.data());
                document.getElementById("test").innerHTML = someText.data().myWords;
            }, (error) => {
                console.log("Error calling onSnapshot", error);
            });
    }

    // function loadPosts() {

    //     db.collection("posts")
    // }
    // loadPosts();

    // console.log("Data is here: ", data);

    let imageTable = document.getElementById("imageList");
    imageTable.innerHTML = "";
    imageTable.innerHTML = "<thead><tr><th>Title</th><th>Medium</th><th>Year</th><th>Location</th><th>Link</th></tr></thead>";

    data.forEach(image => {
        let tr = document.createElement("tr");

        let title = document.createElement("td");
        title.textContent = image.title;
        tr.appendChild(title);

        let medium = document.createElement("td");
        medium.textContent = image.medium;
        tr.appendChild(medium);

        let year = document.createElement("td");
        year.textContent = image.year;
        tr.appendChild(year);

        let location = document.createElement("td");
        location.textContent = image.location;
        tr.appendChild(location);

        let link = document.createElement("td");
        let anchor = document.createElement("a");
        anchor.href = `/${image.link}`;
        anchor.textContent = "View Image";
        anchor.target = "_blank";

        link.appendChild(anchor);
        tr.appendChild(link);

        imageTable.appendChild(tr);
    })
        .catch(error => console.error("No JSON file found", error));

});