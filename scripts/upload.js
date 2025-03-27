document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const fileInput = document.getElementById("file");
  const imagePreview = document.getElementById("imagePreview");
  const uploadButton = document.getElementById("uploadButton");
  const descriptionInput = document.getElementById("inputname");

  // Image Preview
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

  // Upload Button Loading State
  function setLoadingState(isLoading) {
    uploadButton.disabled = isLoading;
    uploadButton.textContent = isLoading ? "Uploading..." : "Upload";
  }

  // Upload to Firebase Storage
  async function uploadFileToStorage(file, description, category) {
    if (!file) {
      Swal.fire("Please select an image file to upload.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSizeInBytes) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      Swal.fire(`Image is too large (${sizeInMB} MB). Please upload an image smaller than 2MB.`);
      return;
    }

    try {
      setLoadingState(true);

      firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
          const userId = user.uid;
          const storage = firebase.storage();
          const storageRef = storageRef();
          const imageRef = storageRef.child(`uploads/${category}/${Date.now()}_${file.name}`);

          // Upload image
          await imageRef.put(file);

          // Get URL
          const downloadURL = await imageRef.getDownloadURL();

          // Save to Firestore
          const uploadsCollection = db.collection("uploads").doc(category).collection("images");
          const docRef = await uploadsCollection.add({
            userId: userId,
            description: description,
            category: category,
            imageUrl: downloadURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

          console.log("Document written with ID:", docRef.id);
          Swal.fire("🎉 Upload successful! Redirecting to your profile...");
          window.location.href = "profile.html";
        } else {
          Swal.fire("User not signed in.");
        }
      });
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Error uploading image. See console for details.");
    } finally {
      setLoadingState(false);
    }
  }

  // Upload Button Click
  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();
    const selectedCard = document.querySelector(".card.selected");

    if (!selectedCard) {
      Swal.fire("Please select a category before uploading.");
      return;
    }

    const category = selectedCard.innerText;

    if (!description) {
      Swal.fire("Please enter a description.");
      return;
    }

    await uploadFileToStorage(file, description, category);
  });

  // Category Selection
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      console.log("Category selected:", this.innerText);
    });
  });
});
