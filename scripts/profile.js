document.addEventListener("DOMContentLoaded", () => {
  const postContainer = document.querySelector(".post");
  const postCountEl = document.getElementById("postCount");
  const categories = ["Diabetic", "IBS", "Celiac"];

  async function countUserPosts(userId) {
    let totalPosts = 0;

    for (const category of categories) {
      const snapshot = await db
        .collection("uploads")
        .doc(category)
        .collection("images")
        .where("userId", "==", userId)
        .get();

      totalPosts += snapshot.size;
    }

    return totalPosts;
  }

  async function loadLatestPosts(userId) {
    const posts = [];

    for (const category of categories) {
      const snapshot = await db
        .collection("uploads")
        .doc(category)
        .collection("images")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .get();

      snapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          ...data,
          id: doc.id,
          category: category,
          timestamp: data.timestamp?.toDate?.() || new Date(0),
        });
      });
    }

    posts.sort((a, b) => b.timestamp - a.timestamp);
    const latestPosts = posts.slice(0, 4);

    postContainer.innerHTML = "";

    latestPosts.forEach((post) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
          <img src="data:image/jpeg;base64,${post.base64Image}" class="card-img-top" alt="Uploaded Image" />
          <button class="delete-btn" data-id="${post.id}" data-category="${post.category}">🗑 Delete</button>
        `;

      postContainer.appendChild(card);
    });

    // Add delete button handlers
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const postId = btn.dataset.id;
        const category = btn.dataset.category;
        const card = btn.closest(".card");

        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        try {
          card.classList.add("deleting");

          setTimeout(async () => {
            await db.collection("uploads").doc(category).collection("images").doc(postId).delete();

            card.remove();

            const newTotal = await countUserPosts(user.uid);
            postCountEl.innerHTML = `${newTotal}<br>posts`;
          }, 300);
        } catch (error) {
          console.error("Error deleting post:", error);
          alert("Failed to delete post.");
        }
      });
    });
  }

  //  MOVE THIS OUTSIDE so it runs on page load
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const [totalPosts] = await Promise.all([countUserPosts(user.uid), loadLatestPosts(user.uid)]);

      postCountEl.innerHTML = `${totalPosts}<br>posts`;
    } else {
      alert("Sign in to view your profile.");
    }
  });
});
