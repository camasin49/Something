// Initialize Firebase
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

// Add profile to Firestore
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value, 10);

    if (name && age) {
        await db.collection('profiles').add({ name, age });
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
    }
});

// Load profiles from Firestore
const tableBody = document.getElementById('tableBody');

db.collection('profiles').onSnapshot(snapshot => {
    tableBody.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const row = `<tr data-id="${doc.id}">
                        <td>${data.name}</td>
                        <td>${data.age}</td>
                        <td>
                            <button class="editBtn">Edit</button>
                        </td>
                    </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Handle Edit button clicks
    const editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.closest('tr').getAttribute('data-id');
            const doc = await db.collection('profiles').doc(id).get();
            const data = doc.data();

            document.getElementById('detailsName').textContent = data.name;
            document.getElementById('detailsAge').textContent = data.age;

            document.getElementById('updateBtn').addEventListener('click', async () => {
                const newName = prompt('Enter new name:', data.name);
                const newAge = parseInt(prompt('Enter new age:', data.age), 10);
            
                if (newName && !isNaN(newAge)) {
                    await db.collection('profiles').doc(id).update({ name: newName, age: newAge });
                    document.querySelector('.prompt-container').remove();
                }
            });
            

            document.getElementById('deleteBtn').addEventListener('click', async () => {
                const confirmDelete = confirm('Are you sure you want to delete this profile?');

                if (confirmDelete) {
                    await db.collection('profiles').doc(id).delete();
                }
            });

            document.getElementById('profileDetails').style.display = 'block';
        });
    });
});
