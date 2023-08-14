// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIZkVjmGd2vEAPXv-dnf1ZSrz8MHTCvNU",
    authDomain: "test-table-ceae9.firebaseapp.com",
    projectId: "test-table-ceae9",
    storageBucket: "test-table-ceae9.appspot.com",
    messagingSenderId: "1095645093609",
    appId: "1:1095645093609:web:11f10583b5f62d72465a78"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const userTable = document.getElementById('userTable');
const userForm = document.getElementById('userForm');
const imageTable = document.getElementById('imageTable');
const imageInput = document.getElementById('imageInput');
const uploadButton = document.getElementById('uploadButton');

// Load users from Firestore
function loadUsers() {
    db.collection('users').onSnapshot(snapshot => {
        userTable.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Actions</th>
            </tr>
        `;
        
        snapshot.forEach(doc => {
            const user = doc.data();
            userTable.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                    <td>
                        <button onclick="deleteUser('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;
        });
    });
}

// Add a new user to Firestore
userForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = userForm.name.value;
    const age = parseInt(userForm.age.value, 10);

    db.collection('users').add({ name, age });
    userForm.reset();
});

// Delete a user from Firestore
function deleteUser(id) {
    db.collection('users').doc(id).delete();
}

// Load user images from Firebase Storage
function loadImages() {
    storage.ref().child('images').listAll().then(images => {
        imageTable.innerHTML = `
            <tr>
                <th>Image</th>
            </tr>
        `;

        images.items.forEach(async item => {
            const url = await item.getDownloadURL();
            imageTable.innerHTML += `
                <tr>
                    <td><img src="${url}" alt="User Image"></td>
                </tr>
            `;
        });
    });
}

// Upload user image to Firebase Storage
uploadButton.addEventListener('click', () => {
    const file = imageInput.files[0];
    if (file) {
        const storageRef = storage.ref(`images/${file.name}`);
        storageRef.put(file).then(() => {
            loadImages();
        });
    }
});

// Load data on page load
window.addEventListener('load', () => {
    loadUsers();
    loadImages();
});
