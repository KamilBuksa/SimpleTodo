# Architektura UI dla SimpleTodo

## 1. Przegląd struktury UI

SimpleTodo to minimalistyczna aplikacja do zarządzania zadaniami, zbudowana z myślą o prostocie i efektywności. Architektura UI składa się z trzech głównych widoków: Auth (logowanie/rejestracja), Dashboard (lista zadań) oraz Task Detail (szczegóły/edycja zadania). Interfejs wykorzystuje komponenty Shadcn/ui dla spójnego designu i Tailwind CSS dla responsywności.

## 2. Lista widoków

### 2.1. Auth View

- **Ścieżka**: `/auth`
- **Główny cel**: Umożliwienie użytkownikom logowania i rejestracji
- **Kluczowe informacje**:
  - Formularz logowania/rejestracji
  - Opcja "Zapamiętaj mnie"
  - Komunikaty błędów walidacji
- **Kluczowe komponenty**:
  - AuthForm (przełączany między logowaniem a rejestracją)
  - RememberMeCheckbox
  - SubmitButton
- **Względy UX/Dostępność/Bezpieczeństwo**:
  - Walidacja w czasie rzeczywistym
  - Wyraźne komunikaty błędów
  - Zabezpieczenie przed wielokrotnym submitowaniem
  - Dostępność z klawiatury
  - ARIA labels dla pól formularza

### 2.2. Dashboard View

- **Ścieżka**: `/`
- **Główny cel**: Wyświetlanie i zarządzanie listą zadań
- **Kluczowe informacje**:
  - Lista zadań z paginacją
  - Filtry statusu (wszystkie/wykonane/niewykonane)
  - Relative time dla deadline'ów
  - Status wykonania zadań
- **Kluczowe komponenty**:
  - TaskList
  - TaskCard
  - AddTaskButton
  - PaginationControls
  - StatusFilter
- **Względy UX/Dostępność/Bezpieczeństwo**:
  - Inline editing dla szybkich zmian
  - Loading states dla operacji
  - Responsywny układ
  - Keyboard navigation
  - Focus management

### 2.3. Task Detail View

- **Ścieżka**: Modal na `/` lub expandable card
- **Główny cel**: Szczegółowy widok i edycja zadania
- **Kluczowe informacje**:
  - Pełny opis zadania
  - Formularz edycji
  - Data utworzenia/modyfikacji
  - Deadline
- **Kluczowe komponenty**:
  - TaskForm
  - DatePicker
  - DescriptionEditor
  - StatusToggle
- **Względy UX/Dostępność/Bezpieczeństwo**:
  - Walidacja długości opisu (max 4000 znaków)
  - Autosave dla zmian
  - Dostępność modalu
  - Escape key handling

## 3. Mapa podróży użytkownika

### 3.1. Nowy użytkownik

1. Wejście na stronę -> Przekierowanie do `/auth`
2. Wybór opcji rejestracji
3. Wypełnienie formularza rejestracji
4. Automatyczne logowanie po rejestracji
5. Przekierowanie do dashboard
6. Wyświetlenie pustej listy z CTA do dodania pierwszego zadania

### 3.2. Powracający użytkownik

1. Wejście na stronę -> Przekierowanie do `/auth`
2. Logowanie (opcjonalnie z "Zapamiętaj mnie")
3. Przekierowanie do dashboard z listą zadań
4. Zarządzanie zadaniami (dodawanie/edycja/usuwanie)

### 3.3. Zarządzanie zadaniami

1. Przeglądanie listy z paginacją
2. Filtrowanie według statusu
3. Inline editing dla szybkich zmian
4. Rozwijanie szczegółów dla pełnej edycji
5. Toggle statusu wykonania
6. Usuwanie zadań (bez potwierdzenia)

## 4. Układ i struktura nawigacji

### 4.1. Główna nawigacja

- Navbar (stały na górze):
  - Logo/Nazwa aplikacji (link do dashboard)
  - Filtr statusu zadań
  - Przycisk wylogowania
  - Wskaźnik użytkownika

### 4.2. Nawigacja kontekstowa

- Breadcrumbs w dashboard
- Przyciski akcji w TaskCard
- Paginacja na dole listy zadań

### 4.3. Routing

- Protected routes dla autentykowanych użytkowników
- Automatyczne przekierowanie do logowania
- Zachowanie stanu filtrów w URL
- Obsługa wygasania sesji

## 5. Kluczowe komponenty

### 5.1. Komponenty UI

- **TaskCard**: Karta zadania z podstawowymi informacjami i akcjami
- **TaskForm**: Formularz dodawania/edycji zadania
- **StatusBadge**: Wizualne oznaczenie statusu zadania
- **DeadlineDisplay**: Wyświetlanie deadline'u w formacie relative time
- **PaginationControls**: Kontrolki paginacji
- **LoadingSpinner**: Wskaźnik ładowania
- **ErrorBoundary**: Obsługa i wyświetlanie błędów
- **Toast**: Powiadomienia o sukcesie/błędzie

### 5.2. Komponenty logiki

- **AuthProvider**: Zarządzanie stanem autentykacji
- **TaskProvider**: Zarządzanie stanem zadań
- **QueryProvider**: Konfiguracja React Query
- **ErrorHandler**: Globalna obsługa błędów
- **SessionManager**: Zarządzanie sesją użytkownika
