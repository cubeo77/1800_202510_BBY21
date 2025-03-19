    // Simulated user database (in a real app, this would be on a server)
    const users = [
        {
            email: 'test@example.com',
            password: 'password123'
        }
    ];

    function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const rememberMe = document.getElementById('remember').checked;

        // Basic validation
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields';
            return false;
        }

        // Check credentials
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store authentication state
            if (rememberMe) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
            } else {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userEmail', email);
            }

            // Redirect to main page
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid email or password';
            return false;
        }
    }

    // Check if user is already logged in
    function checkAuthState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            window.location.href = 'index.html';
        }
    }

    // Add this to index.html to protect the main page
    function requireAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }

    // Check auth state when page loads
    document.addEventListener('DOMContentLoaded', checkAuthState); 

    // Firebase Auth listener to check when a user logs in
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log("User is logged in:", user);

        // Retrieve temporary data from localStorage
        const tempData = JSON.parse(localStorage.getItem("tempData"));

        if (tempData) {
            const currentUser = db.collection("users").doc(user.uid);

            // Save the data to Firestore
            currentUser.set(tempData, { merge: true })
                .then(() => {
                    console.log("Data successfully saved to Firestore:", tempData);
                    alert("Your information has been saved to your account.");
                    localStorage.removeItem("tempData"); // Clear temporary storage
                })
                .catch(error => {
                    console.error("Error saving data to Firestore:", error);
                });
        } else {
            console.log("No temporary data found in localStorage.");
        }
    } else {
        console.log("No user is logged in.");
    }
});


    