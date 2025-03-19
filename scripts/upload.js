
// File upload event listener
document.getElementById("uploadButton").addEventListener("click", function () {
  const file = document.getElementById("file").files[0];
  const description = document.getElementById("inputname").value;
  if (!file) {
    alert("Please select a file first!");
    return;
  }

  const storageRef = storage.ref("uploads/" + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log(`Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
    },
    (error) => {
      console.error("Upload failed:", error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        db.collection("uploads")
          .add({
            url: downloadURL,
            description: description,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
          })
          .then(() => {
            alert("File uploaded successfully!");
          })
          .catch((error) => {
            console.error("Error saving to Firestore:", error);
          });
      });
    }
  );
});
