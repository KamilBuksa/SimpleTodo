# Dokument Wymagań Produktu (PRD) – SimpleTodo

## 1. Przegląd produktu

SimpleTodo to prosta aplikacja webowa umożliwiająca użytkownikom zarządzanie zadaniami. Aplikacja pozwala na dodawanie, edycję, oznaczanie jako wykonane oraz usuwanie zadań. Dzięki przejrzystemu interfejsowi, użytkownik może szybko i efektywnie organizować swoje codzienne obowiązki. Projekt wykorzystuje nowoczesny tech stack, który zapewnia wysoką wydajność, responsywność i skalowalność:
- Astro 5
- React 19
- TypeScript 5
- Tailwind 4
- Shadcn/ui
- Supabase (backend i autoryzacja)

## 2. Problem użytkownika

W codziennym życiu użytkownicy potrzebują narzędzia, które pomoże im skutecznie zarządzać zadaniami i obowiązkami. Główne problemy to:
- Trudność w śledzeniu licznych, drobnych zadań do wykonania.
- Brak przejrzystego interfejsu do szybkiego dodawania i modyfikacji zadań.
- Problemy z zarządzaniem priorytetami i stanem wykonania zadań.

SimpleTodo rozwiązuje te problemy, oferując prosty, intuicyjny system, który umożliwia tworzenie listy zadań, ich edycję, oznaczanie jako wykonane oraz usuwanie. Dzięki integracji z Supabase, każdy użytkownik ma dostęp tylko do swoich danych.

## 3. Wymagania funkcjonalne

1. **Autoryzacja:**
   - Rejestracja konta użytkownika (email i hasło).
   - Logowanie poprzez JWT i ochrona endpointów (użytkownik widzi tylko swoje zadania).

2. **Zarządzanie zadaniami (CRUD):**
   - Dodawanie zadania z polem `title` oraz opcjonalnym `description`.
   - Edycja zadania – możliwość modyfikacji tytułu i opisu.
   - Usunięcie zadania.
   - Oznaczanie zadania jako wykonane lub niewykonane.
   - Wyświetlanie listy zadań z opcją filtrowania (np. wszystkie, wykonane, niewykonane).

3. **Interfejs użytkownika:**
   - Responsywny design z użyciem Tailwind CSS oraz komponentów Shadcn/ui.
   - Minimalistyczny i intuicyjny interfejs, umożliwiający szybkie operacje.

## 4. Granice produktu

W ramach MVP aplikacja nie obejmuje:
- Współdzielenia zadań między użytkownikami.
- Zaawansowanego zarządzania projektami lub tagowania zadań.
- Integracji z kalendarzem czy systemem powiadomień.
- Wersji mobilnej – planowane na kolejne etapy rozwoju.

## 5. Historyjki użytkowników

### US-001: Rejestracja konta
**Opis:** Jako nowy użytkownik, chcę móc się zarejestrować, aby korzystać z aplikacji.
**Kryteria akceptacji:**
- Formularz rejestracyjny zawierający pola `email` i `password`.
- Po udanej rejestracji, użytkownik jest automatycznie logowany i przekierowywany do głównego widoku zadań.

### US-002: Logowanie do konta
**Opis:** Jako zarejestrowany użytkownik, chcę móc się zalogować, aby mieć dostęp do swoich zadań.
**Kryteria akceptacji:**
- Formularz logowania z polami `email` i `password`.
- Po logowaniu, użytkownik widzi listę swoich zadań.

### US-003: Dodanie nowego zadania
**Opis:** Jako użytkownik, chcę móc dodawać nowe zadania, aby móc rejestrować swoje obowiązki.
**Kryteria akceptacji:**
- Formularz dodawania zadania z obowiązkowym polem `title` oraz opcjonalnym `description`.
- Nowe zadanie pojawia się na liście po jego zapisaniu.

### US-004: Edycja zadania
**Opis:** Jako użytkownik, chcę móc edytować istniejące zadania, aby mogły one odpowiadać aktualnemu stanowi moich obowiązków.
**Kryteria akceptacji:**
- Możliwość modyfikacji tytułu lub opisu zadania.
- Po zapisaniu zmian, edytowane zadanie odzwierciedla wprowadzone modyfikacje.

### US-005: Oznaczanie zadania jako wykonane/niewykonane
**Opis:** Jako użytkownik, chcę móc zaznaczyć zadanie jako wykonane lub niewykonane, aby mieć jasny wgląd w postęp prac.
**Kryteria akceptacji:**
- Przycisk lub przełącznik umożliwiający zmianę statusu zadania.
- Zmiana statusu jest widoczna na liście zadań.

### US-006: Usunięcie zadania
**Opis:** Jako użytkownik, chcę móc usuwać zadania, których nie potrzebuję, aby utrzymać porządek w liście.
**Kryteria akceptacji:**
- Opcja usunięcia zadania przy każdym elemencie listy.
- Zadanie znika z listy po potwierdzeniu usunięcia.

## 6. Metryki sukcesu

- Użytkownik bez problemu rejestruje się, loguje oraz zarządza zadaniami (dodawanie, edycja, oznaczanie, usuwanie).
- Czas reakcji aplikacji nie przekracza 1 sekundy dla operacji CRUD.
- Interfejs użytkownika jest intuicyjny i niezawodny oraz nie generuje krytycznych błędów.
- Każdy użytkownik ma dostęp tylko do swoich danych dzięki odpowiedniej autoryzacji. 