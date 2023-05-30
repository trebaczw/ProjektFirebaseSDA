import {
	addDoc,
	collection,
	getDocs,
	doc,
	onSnapshot,
	deleteDoc,
} from "firebase/firestore";
import { app, database, storage } from "./firebaseConfig";
import {
	ref,
	uploadBytesResumable,
	downloadURL,
	getDownloadURL,
} from "firebase/storage";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";

const registerForm = document.querySelector("#registerForm");
const emailRegistration = document.querySelector("#emailRegistration");
const passwordRegistration = document.querySelector("#passwordRegistration");

const loginForm = document.querySelector("#loginForm");
const emailLogin = document.querySelector("#emailLogin");
const passwordLogin = document.querySelector("#passwordLogin");

const databaseInputForm = document.querySelector("#databaseInputForm");
const emailInputDatabase = document.querySelector("#emailInputDatabase");
const passwordInputDatabase = document.querySelector("#passwordInputDatabase");

const displayDb = document.querySelector("#displayDb");

const databaseDeleteForm = document.querySelector("#databaseDeleteForm");
const idDeleteDatabase = document.querySelector("#idDeleteDatabase");

const uploadFileForm = document.querySelector("#uploadFileForm");
const uploadFile = document.querySelector("#uploadFile");

const carForm = document.querySelector("#carForm");
const carName = document.querySelector("#carName");
const carNr = document.querySelector("#carNr");
const carPhoto = document.querySelector("#carPhoto");

const auth = getAuth();
const collectionRef = collection(database, "uzytkownicy");
const collectionCarsRef = collection(database, "cars");

const registration = async (event) => {
	event.preventDefault();

	const emailRegistrationValue = emailRegistration.value;
	const passwordRegistrationValue = passwordRegistration.value;

	if (passwordRegistrationValue.length >= 6) {
		try {
			await createUserWithEmailAndPassword(
				auth,
				emailRegistrationValue,
				passwordRegistrationValue
			);

			alert(`wszystko działa user utworzony`);
		} catch (error) {
			const { message } = error;
			if (message.includes("email-already-in-use")) {
				alert(`taki mail istnieje!`);
			}
		}
	} else {
		alert("mniej niż 6 znaków");
	}
};

// 1@gmail.com
const login = async (event) => {
	event.preventDefault();

	const emailLoginValue = emailLogin.value;
	const passwordLoginValue = passwordLogin.value;

	try {
		const response = await signInWithEmailAndPassword(
			auth,
			emailLoginValue,
			passwordLoginValue
		);
		console.log(`${response.user.email} zalogowany`);
	} catch (error) {
		console.log(error);
	}
};

const addDb = async (event) => {
	event.preventDefault();

	const emailInputDatabaseValue = emailInputDatabase.value;
	const paswordInputDatabaseValue = passwordInputDatabase.value;

	try {
		const response = await addDoc(collectionRef, {
			mail: emailInputDatabaseValue,
			password: paswordInputDatabaseValue,
		});
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};

const displayDatabase = async (event) => {
	event.preventDefault();
	const response = await getDocs(collectionRef);
	console.log(
		response.docs.map((item) => {
			return { ...item.data(), id: item.id };
		})
	);
};

const snapshotData = () => {
	onSnapshot(collectionRef, (data) => {
		console.log(
			data.docs.map((item) => ({
				...item.data(),
				id: item.id,
			}))
		);
	});
};

const deleteDatabase = async (event) => {
	event.preventDefault();
	const docToDelete = doc(database, "uzytkownicy", idDeleteDatabase.value);

	try {
		await deleteDoc(docToDelete);
	} catch (e) {
		console.log(e);
	}
};

const upload = async (event) => {
	event.preventDefault();
	const storageRef = ref(storage, "images/" + uploadFile.name);
	try {
		const uploadTask = uploadBytesResumable(storageRef, uploadFile.files[0]);
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
			},
			(error) => {
				console.log(error);
			}
		);
	} catch (error) {
		console.log(error);
	}
};

const addCar = async () => {
	// event.preventDefault();
	const carNameValue = carName.value;
	const carNrValue = carNr.value;
	try {
		const response = await addDoc(collectionCarsRef, {
			name: carNameValue,
			number: carNrValue,
		});
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};

const uploadCar = async (event) => {
	event.preventDefault();
	const carNameValue = carName.value;
	const carNrValue = carNr.value;

	const storageRef = ref(storage, `cars/${carNameValue}_${carNrValue}`);

	const uploadTask = uploadBytesResumable(storageRef, carPhoto.files[0]);
	uploadTask.on(
		"state_changed",
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log("Upload is " + progress + "% done");
		},
		(error) => {
			console.log(error);
		},
		() => {
			// getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{console.log("fileawalible at", downloadURL)})
			addCar();
		}
	);
};

const addReservation = async () => {
	// event.preventDefault();
	const carNameValue = carName.value;
	const carNrValue = carNr.value;
	try {
		const response = await addDoc(collectionRef, {
			name: carNameValue,
			number: carNrValue,
		});
		console.log(response);
	} catch (error) {
		console.log(error);
	}
};

snapshotData();
registerForm.addEventListener("submit", registration);
loginForm.addEventListener("submit", login);
databaseInputForm.addEventListener("submit", addDb);
displayDb.addEventListener("submit", displayDatabase);
databaseDeleteForm.addEventListener("submit", deleteDatabase);
uploadFileForm.addEventListener("submit", upload);
carForm.addEventListener("submit", uploadCar);
