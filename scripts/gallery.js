document.addEventListener("DOMContentLoaded", () => {
  const categories = ["Diabetic", "IBS", "Celiac"];


  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      categories.forEach((category) => loadImages(category));
    } else {
      alert("Please sign in to view uploads.");
    }
  });

  async function loadImages(category) {
    const container = document.getElementById(category);
    container.innerHTML = "<p>Loading...</p>";

    try {
      const snapshot = await db
        .collection("uploads")
        .doc(category)
        .collection("images")
        .orderBy("timestamp", "desc")
        .get();

      container.innerHTML = "";

      if (snapshot.empty) {
        container.innerHTML = "<p>No uploads yet.</p>";
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();

        const imageCard = document.createElement("div");
        imageCard.classList.add("image-card");

        imageCard.innerHTML = `
          <img src="data:image/jpeg;base64,${data.base64Image}" alt="Uploaded Image">
          <p>${data.description || "No description"}</p>
        `;

        container.appendChild(imageCard);
      });
    } catch (err) {
      console.error("Error loading images:", err);
      container.innerHTML = "<p>Error loading images.</p>";
    }
  }
});
