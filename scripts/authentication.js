// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in
            var user = authResult.user; // get the user object from Firebase Authentication
            if (authResult.additionalUserInfo.isNewUser) {
                // If the user is new, create a new user record in Firestore
                firebase.firestore().collection("users").doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                  
                }).then(function () {
                    console.log("New user added to Firestore");
                    window.location.assign("info.html"); // Redirect after sign-up
                }).catch(function (error) {
                    console.log("Error adding new user: " + error);
                });
            } else {
                return true;
            }
            return false; // Prevent automatic redirect if it's a new user
        },
        
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },

    // Will use popup for IDP Providers sign-in flow instead of the default redirect.
    signInFlow: 'popup',
    signInSuccessUrl: "info.html", // Redirect URL after login success
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID // Only Email provider for now
    ],
    tosUrl: '<your-tos-url>', // Replace with your actual Terms of Service URL
    privacyPolicyUrl: '<your-privacy-policy-url>' // Replace with your actual Privacy Policy URL
};

// Start FirebaseUI
ui.start('#firebaseui-auth-container', uiConfig);

