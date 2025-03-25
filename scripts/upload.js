document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  /*-----------Element References----------*/

  const fileInput = document.getElementById("file");
  const imagePreview = document.getElementById("imagePreview");
  const uploadButton = document.getElementById("uploadButton");
  const descriptionInput = document.getElementById("inputname");

  /*----------- Image Preview Handler ---------*/
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add("show");
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
      imagePreview.classList.remove("show");
    }
  });

  /*----------  Set Upload Button Loading State-------*/

  function setLoadingState(isLoading) {
    uploadButton.disabled = isLoading;
    uploadButton.textContent = isLoading ? "Uploading..." : "Upload";
  }

  /*-------- Convert File to Base64 String------*/

  function encodeFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /*------ Upload File to Firestore as Base64----*/

  async function uploadFileAsBase64(file, description, category) {
    /*---------Validation checks------*/
    if (!file) {
      alert("Please select an image file to upload.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).");
      return;
    }

    const maxSizeInBytes = 500 * 1024;
    if (file.size > maxSizeInBytes) {
      const sizeInKB = (file.size / 1024).toFixed(1);
      alert(`Image is too large (${sizeInKB} KB). Please upload an image smaller than 500KB.`);
      return;
    }

    try {
      setLoadingState(true);
      const base64String = await encodeFileToBase64(file);

      /*---------Check if user is signed in------*/
      firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const userId = user.uid;
          const uploadsCollection = db.collection("uploads").doc(category).collection("images");

          const docRef = await uploadsCollection.add({
            userId: userId,
            description: description,
            category: category,
            base64Image: base64String,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

          console.log("Document written with ID:", docRef.id);
          alert("🎉 Upload successful!");
        } else {
          alert("User not signed in.");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image. See console for details.");
    } finally {
      setLoadingState(false);
    }
  }

  /*------- Upload Button Click Handler------*/

  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();
    const selectedCard = document.querySelector(".card.selected");
    const category = selectedCard ? selectedCard.innerText : "Uncategorized";

    if (!description) {
      alert("Please enter a description.");
      return;
    }

    await uploadFileAsBase64(file, description, category);
  });

  /*------- Category Selection Handler-----*/

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      console.log("Category selected:", this.innerText);
    });
  });
});
