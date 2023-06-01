import {
	addDoc,
	collection,
	getDocs,
	doc,
	onSnapshot,
	deleteDoc,
	getDoc,
	query,
	where,
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

const bookCarForm = document.querySelector("#bookCarForm");
const bookName = document.querySelector("#bookName");
const bookSureName = document.querySelector("#bookSureName");
const regCust = document.querySelector("#regCust");
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const carSelect = document.querySelector("#carSelect");

const userList = document.querySelector("#userList");
const userInfo = document.querySelector("#userInfo");

const userSearch = document.querySelector("#userSearch");
const userSearchList = document.querySelector("#userSearchList");

const auth = getAuth();
const collectionRef = collection(database, "uzytkownicy");
const collectionCarsRef = collection(database, "cars");
let carList = [];

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
	console.log(carList);
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

const addReservation = async (event) => {
	event.preventDefault();
	const bookNameValue = bookName.value;
	const bookSureNameValue = bookSureName.value;
	const regCustValue = regCust.checked;
	const startDateValue = startDate.value;
	const endDateValue = endDate.value;

	const docRef = doc(database, "cars", carSelect.value);

	try {
		const carObject = await getDoc(docRef);
		const response = await addDoc(collectionRef, {
			name: bookNameValue,
			surename: bookSureNameValue,
			regular: regCustValue,
			startDate: startDateValue,
			endDate: endDateValue,
			car: carObject.data(),
		});
		console.log(response);
		alert("dokonano rezerwacji");
	} catch (error) {
		console.log(error);
	}
};

const snapshotCars = () => {
	onSnapshot(collectionCarsRef, (data) => {
		carList = [];
		carSelect.innerHTML = "";
		data.docs.forEach((item) => {
			carList.push({ ...item.data(), id: item.id });
		});
		carList.forEach((car) => {
			const option = document.createElement("option");
			option.value = car.id;
			option.textContent = `${car.name} nr rej. ${car.number}`;
			carSelect.appendChild(option);
		});
		console.log(carList);
	});
};

const createList = (list)=>{
	userInfo.innerHTML = "";
	list.forEach((item) => {
		const user = item.data();
		const {
			name,
			surename,
			startDate,
			endDate,
			regular,
			car: { name: nameCar, number },
		} = user;
		const li = document.createElement("li");
		userInfo.appendChild(li);
		const h2 = document.createElement("h2");
		li.appendChild(h2);
		h2.innerText = name + " " + surename;
		const button = document.createElement("button");
		li.appendChild(button);
		button.innerText = "szczegóły";
		const div = document.createElement("div");
		li.appendChild(div);
		const p = document.createElement("p");
		div.appendChild(p);
		div.classList = "divHidden";
		p.innerText = `data rozpoczczęcia ${startDate}, data zakończenia ${endDate}`;
		const span = document.createElement("span");
		div.appendChild(span);
		div.style.display = "none";
		span.innerText = `nazwa pojazdu ${nameCar}`;
		const h3Div = document.createElement("h3");
		div.appendChild(h3Div);
		h3Div.innerText = `numer pojazdu ${number}`;

		button.addEventListener("click", function () {
			div.style.display = div.style.display === "none" ? "block" : "none";
		});
	})


}

const userDataSearch = async (event) => {
	event.preventDefault();

	try {
		const surenameQuery = query(
			collectionRef,
			where("surename", "==", userSearchList.value)
		);
		const response = await getDocs(surenameQuery);
		createList(response)
		;
	} catch (error) {
		console.log(error);
	}
};

const spapshotUserList = () => {
	onSnapshot(collectionRef, (data) => {
		createList(data.docs)
	});
};

snapshotCars();
spapshotUserList();
// snapshotData();
registerForm.addEventListener("submit", registration);
loginForm.addEventListener("submit", login);
databaseInputForm.addEventListener("submit", addDb);
displayDb.addEventListener("submit", displayDatabase);
databaseDeleteForm.addEventListener("submit", deleteDatabase);
uploadFileForm.addEventListener("submit", upload);
carForm.addEventListener("submit", uploadCar);
bookCarForm.addEventListener("submit", addReservation);
userSearch.addEventListener("submit", userDataSearch);
