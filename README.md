# ProjektFirebaseSDA

0. Kończymy to co zostało z 29.05
   0.1 Dodajemy Hosting (jak to zrobić jest w PDF/dosc)
1. Tworzymy baze samochodów na bazie formularza

- formularz zawiera:
- nazwe samochodu
- zdjęcie
- rejestracje
- wrzucenie samochodu do bazy /cars następuje po wrzuceniu zdjecia samochodu
- wrzucenie zdjecia samochodu otrzymuje nazwe zgodne ze standardem /cars/nazwa_samochodu_nr_rejestracji

2. Tworzymy rezerwacje auta

- formularz zawiera
- imie i nazwisko klienta
- czy jest stały klient
- date wynajmu start (input type="date")
- date wynajmu koniec (input type="date")
- auto (wybór auta z dostępnej bazy aut pobranej z firestore bez zdjecia)
- po pomyslnym utworzeniu dodaje nam uzytkowwnika do listy klientów (onSnapshot powinien nam zaktualizowac liste w html)

3. Lista klientów

- zawiera:
- imie i nazwisko
- po kliknieciu w szczegóły wyswietla nam informacje o wynajmowanym aucie (zdjecie, nazwa, nr rejestracji oraz date wynajmu start/koniec)
- jezeli data konca wynajmu jest wczesniejsza niz dzien aktualny, to uzytkownika nie powinno byc na liscie (filtrowanie za pomoca query)
- posiada search form do filtrowania klientóww

4. Lista samochodów dostępnych w rezerwacji

- pozwala usunac samochód z listy (oraz bazy)
- pozwala ustawić samochód jako niedostępny - brak mozliwosci zarezerwowania
- pozwala na edycje danego samochodu
- posiada search form do filtrowania aut

5. Logowanie

- logowanie pozwala nam na edycje rezerwacji oraz obsługe całego panelu (nasz projekt)
- powinno dodać zwrócony token do storage
- tworzymy funkcje która sprawdza czy token istnieje w storage
  if (localStorage.getItem('userToken') !== null) {
  // Klucz istnieje w local storage
  } else {
  // Klucz nie istnieje w local storage
  }
- jezeli token nie istnieje to zwracany zostaje alert, ze powinnismy sie zalogowac
- jezeli token istnieje, to dana funkcja moze zostac wykonana

# STORAGE

1. Dodawanie elementu do storage
   localStorage.setItem('username', 'John');

2. Odczytywawnie elementu w storage

const username = localStorage.getItem('username');
console.log(username); // Wyświetli "John"

3. Usuwanie elementu ze storage

localStorage.removeItem('username');
