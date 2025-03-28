document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  const db = firebase.firestore();
  const postContainer = document.querySelector(".post");
  const postCountEl = document.getElementById("postCount");
  const categories = ["Diabetic", "IBS", "Celiac"];

  // 🔢 Count total posts by user
  async function countUserPosts(userId) {
    let total = 0;
    for (const category of categories) {
      const snap = await db
        .collection("uploads")
        .doc(category)
        .collection("images")
        .where("userId", "==", userId)
        .get();
      total += snap.size;
    }
    return total;
  }

  // ❌ Delete post with SweetAlert2 confirmation
  function bindDeleteHandlers(userId) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const postId = btn.dataset.id;
        const category = btn.dataset.category;
        const card = btn.closest(".card");

        Swal.fire({
          title: "Delete this post?",
          text: "This action cannot be undone.",
          icon: "warning",
          background: "#f1fff0",
          iconColor: "#4CAF50",
          showCancelButton: true,
          confirmButtonColor: "#a12525",
          cancelButtonColor: "#388e3c",
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              card.classList.add("deleting");
              await db
                .collection("uploads")
                .doc(category)
                .collection("images")
                .doc(postId)
                .delete();
              card.remove();

              const newCount = await countUserPosts(userId);
              postCountEl.innerHTML = `${newCount}<br>posts`;

              Swal.fire({
                icon: "success",
                title: "Deleted!",
                background: "#f1fff0",
                iconColor: "#4CAF50",
                confirmButtonColor: "#4CAF50",
              });
            } catch (err) {
              console.error("Delete error:", err);
              Swal.fire("Failed to delete post.");
            }
          }
        });
      });
    });
  }

  // 🔄 Load ALL posts in real-time
  function loadAllPostsRealtime(userId) {
    const posts = [];

    categories.forEach((category) => {
      db.collection("uploads")
        .doc(category)
        .collection("images")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          const filtered = posts.filter((p) => p.category !== category);
          posts.length = 0;
          posts.push(...filtered);

          snapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
              ...data,
              id: doc.id,
              category,
              timestamp: data.timestamp?.toDate?.() || new Date(0),
            });
          });

          // Sort & render
          posts.sort((a, b) => b.timestamp - a.timestamp);
          postContainer.innerHTML = "";
          posts.forEach((post) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
              <img src="${post.imageBase64}" class="card-img-top" alt="Uploaded Image" />
              <button class="delete-btn" data-id="${post.id}" data-category="${post.category}">🗑 Delete</button>
            `;
            postContainer.appendChild(card);
          });

          bindDeleteHandlers(userId);
        });
    });
  }

  // 🔗 Share profile
  document.getElementById("shareProfileBtn").addEventListener("click", async () => {
    const user = firebase.auth().currentUser;
    const tooltip = document.getElementById("copyTooltip");

    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Not signed in",
        text: "Please sign in to share your profile.",
      });
    }

    const link = `https://yourapp.com/u/${user.uid}`;
    try {
      await navigator.clipboard.writeText(link);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Profile link copied to clipboard.",
        showConfirmButton: false,
        timer: 1500,
        background: "#f1fff0",
        iconColor: "#4caf50",
        color: "#1b5e20",
      });

      tooltip?.classList.add("show");
      setTimeout(() => tooltip?.classList.remove("show"), 1800);
    } catch (err) {
      console.error("Clipboard error:", err);
      Swal.fire("Failed to copy link.");
    }
  });

  // 🧑 Edit profile (display name, bio, image)
  document.querySelector(".edit-profile").addEventListener("click", async () => {
    const user = firebase.auth().currentUser;
    if (!user) return Swal.fire("You must be signed in to edit your profile.");

    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    const userData = doc.exists ? doc.data() : {};

    Swal.fire({
      title: "Edit Profile",
      html: `
        <input type="text" id="swalDisplayName" class="swal2-input" placeholder="Display Name" value="${
          userData.displayName || ""
        }">
        <textarea id="swalBio" class="swal2-textarea" placeholder="Bio">${
          userData.bio || ""
        }</textarea>
        <input type="file" id="swalProfilePic" accept="image/*" class="swal2-file">
        <img id="previewImage" src="${
          userData.photoURL || ""
        }" style="max-width:100px; margin-top:10px; display:${
        userData.photoURL ? "block" : "none"
      }" />
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      preConfirm: async () => {
        const displayName = document.getElementById("swalDisplayName")?.value.trim();
        const bio = document.getElementById("swalBio")?.value.trim();
        const file = document.getElementById("swalProfilePic")?.files[0];

        let photoURL = userData.photoURL || "";

        if (file) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
              photoURL = reader.result;
              await userRef.set({ displayName, bio, photoURL }, { merge: true });
              resolve();
            };
            reader.readAsDataURL(file);
          });
        } else {
          await userRef.set({ displayName, bio, photoURL }, { merge: true });
        }
      },
      didOpen: () => {
        const input = document.getElementById("swalProfilePic");
        const preview = document.getElementById("previewImage");
        input?.addEventListener("change", () => {
          const file = input.files[0];
          if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
              preview.src = e.target.result;
              preview.style.display = "block";
            };
            reader.readAsDataURL(file);
          } else {
            preview.style.display = "none";
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Saved!", "Profile updated.", "success").then(() => {
          userRef.get().then((doc) => {
            if (doc.exists) {
              const updated = doc.data();
              document.getElementById("userDisplayName").textContent =
                updated.displayName || "Your Name";
              document.getElementById("userBio").textContent = updated.bio || "No bio yet...";
              if (updated.photoURL) {
                document.getElementById("profileImage").src = updated.photoURL;
              }
            }
          });
        });
      }
    });
  });

  // 🔐 Load user profile + posts after auth
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      return Swal.fire({
        icon: "warning",
        title: "Not signed in",
        text: "Sign in to view your profile.",
        background: "#fffdf6",
        confirmButtonColor: "#388e3c",
      });
    }

    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    const userData = doc.data();

    if (userData) {
      document.getElementById("userDisplayName").textContent =
        userData.displayName || user.displayName || "No Name";
      document.getElementById("userBio").textContent = userData.bio || "No bio yet...";
      if (userData.photoURL) {
        document.getElementById("profileImage").src = userData.photoURL;
      }
    }

    loadAllPostsRealtime(user.uid);
    const totalPosts = await countUserPosts(user.uid);
    postCountEl.innerHTML = `${totalPosts}<br>posts`;
  });
});
