document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const ToastStyle = Swal.mixin({
    background: "#f1fff0",
    confirmButtonColor: "#4caf50",
    cancelButtonColor: "#388e3c",
    color: "#1b5e20",
    iconColor: "#4caf50",
  });

  const fileInput = document.getElementById("file");
  const imagePreview = document.getElementById("imagePreview");
  const uploadButton = document.getElementById("uploadButton");
  const descriptionInput = document.getElementById("inputname");

  // Show Image Preview
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      imagePreview.classList.remove("show");

      reader.onload = function (e) {
        setTimeout(() => {
          imagePreview.src = e.target.result;
          imagePreview.onload = () => {
            imagePreview.classList.add("show");
          };
        }, 150);
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
      imagePreview.classList.remove("show");
    }
  });

  // Button Loading State
  function setLoadingState(isLoading) {
    uploadButton.disabled = isLoading;
    uploadButton.textContent = isLoading ? "Uploading..." : "Upload";
  }

  // Upload Only Once (to first selected category)
  async function uploadFileAsBase64ToFirestore(file, description, categories) {
    if (!file) return ToastStyle.fire("Please select an image file to upload.");

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return ToastStyle.fire("Invalid file type. Please use JPEG, PNG, GIF, or WebP.");
    }

    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      const sizeInKB = (file.size / 1024).toFixed(1);
      return ToastStyle.fire(`Image too large (${sizeInKB} KB). Must be under 500KB.`);
    }

    const db = firebase.firestore();
    try {
      setLoadingState(true);
      const progressBar = document.getElementById("uploadProgressBar");
      progressBar.style.width = "0%";

      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) return ToastStyle.fire("User not signed in.");

        const reader = new FileReader();

        reader.onloadstart = () => {
          progressBar.style.width = "10%";
        };

        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.min(70, (e.loaded / e.total) * 70);
            progressBar.style.width = `${percent.toFixed(0)}%`;
          }
        };

        reader.onloadend = async () => {
          progressBar.style.width = "85%";
          const base64String = reader.result;

          const chosenCategory = categories[0]; // ✅ Upload only to first selected category

          await db.collection("uploads").doc(chosenCategory).collection("images").add({
            userId: user.uid,
            description,
            category: chosenCategory,
            imageBase64: base64String,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });

          progressBar.style.width = "100%";
          ToastStyle.fire("🎉 Upload successful! Redirecting...");
          setTimeout(() => (window.location.href = "profile.html"), 1200);
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("Upload error:", error);
      ToastStyle.fire("Error uploading. See console.");
    } finally {
      setLoadingState(false);
    }
  }

  // Upload Button Click
  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    const description = descriptionInput.value.trim();
    const selected = Array.from(document.querySelectorAll(".card.selected")).map(
      (c) => c.innerText
    );

    if (selected.length === 0) return ToastStyle.fire("Please select at least one category.");
    if (!description) return ToastStyle.fire("Please enter a description.");

    await uploadFileAsBase64ToFirestore(file, description, selected);
  });

  // Multi-category select UI
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
    });
  });
});
