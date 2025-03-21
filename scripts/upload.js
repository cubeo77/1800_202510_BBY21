
// Ensure DOM is loaded before running event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  function setLoadingState(isLoading) {
    const uploadButton = document.getElementById("uploadButton");
    uploadButton.disabled = isLoading;
    uploadButton.textContent = isLoading ? "Uploading..." : "Upload";
  }

  // Function to validate and upload file
  async function uploadFile(file, description, category) {
    if (!file) {
      console.error(" No file selected.");
      alert("Please select an image file to upload.");
      return;
    }

    console.log("Selected file:", file);

    // Validate file type (only images)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.error(" Invalid file type:", file.type);
      alert("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).");
      return;
    }

    try {
      console.log(" Uploading file to Firebase Storage...");
      setLoadingState(true);

      // Upload file to Firebase Storage
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytes(storageRef, file);

      console.log(" File successfully uploaded to Firebase Storage");

      // Get the file's URL
      const fileURL = await getDownloadURL(uploadSnapshot.ref);
      console.log(" File URL:", fileURL);

      if (!fileURL) {
        console.error(" Failed to retrieve file URL from Firebase Storage.");
        alert("Error retrieving uploaded file URL.");
        return;
      }

      // Save metadata in Firestore
      console.log(" Saving metadata to Firestore...");
      const uploadsCollection = collection(db, `uploads/${category}/images`);
      await addDoc(uploadsCollection, {
        fileURL: fileURL,
        description: description,
        category: category,
        timestamp: new Date().toISOString(),
      });

      console.log("Document written in Firestore with ID:", docRef.id);
      alert("🎉 Upload successful!");
    } catch (error) {
      console.error(" Upload error:", error);
      alert("Error uploading file. Check console for details.");
    } finally {
      setLoadingState(false);
    }
  }

  // Event Listener for Upload Button
  document.getElementById("uploadButton").addEventListener("click", async () => {
    const fileInput = document.getElementById("file");
    const descriptionInput = document.getElementById("inputname");

    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();

    // Get selected category
    const selectedCard = document.querySelector(".card.selected");
    const category = selectedCard ? selectedCard.innerText : "Uncategorized";

    console.log(" File:", file);
    console.log(" Description:", description);
    console.log("Category:", category);

    if (!description) {
      alert(" Please enter a description.");
      return;
    }

    await uploadFile(file, description, category);
  });

  // Event Listener for Category Selection
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", function () {
      document.querySelectorAll(".card").forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      console.log("Category selected:", this.innerText);
    });
  });
});
