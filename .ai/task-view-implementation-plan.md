# Plan implementacji widoku zadań (TaskView)

## 1. Przegląd

TaskView to główny widok aplikacji SimpleTodo, umożliwiający użytkownikom zarządzanie zadaniami poprzez ich tworzenie, edycję, oznaczanie jako wykonane oraz usuwanie. Widok zapewnia intuicyjny interfejs użytkownika z natychmiastową informacją zwrotną i płynną obsługą błędów.

## 2. Routing widoku

- Ścieżka główna: `/`
- Chroniona ścieżka wymagająca autentykacji
- Przekierowanie do `/auth` dla niezalogowanych użytkowników

## 3. Struktura komponentów

```
TaskView
├── TaskList
│   ├── TaskItem
│   │   ├── TaskActions
│   │   └── StatusToggle
├── TaskForm
│   ├── TitleInput
│   ├── DescriptionInput
│   └── FormActions
└── ErrorBoundary
```

## 4. Szczegóły komponentów

### TaskView

- Opis komponentu: Główny kontener widoku, zarządzający stanem listy zadań i formularzem
- Główne elementy: Container, ErrorBoundary, TaskList, TaskForm
- Obsługiwane interakcje: Przełączanie między trybami wyświetlania/edycji
- Typy: TaskViewModel[], TaskFormViewModel
- Propsy: brak (komponent najwyższego poziomu)

### TaskList

- Opis komponentu: Wyświetla listę zadań z możliwością interakcji
- Główne elementy: List container, TaskItem components
- Obsługiwane interakcje: Sortowanie, filtrowanie
- Typy: TaskViewModel[]
- Propsy:
  ```typescript
  interface TaskListProps {
    tasks: TaskViewModel[];
    onTaskUpdate: (task: TaskViewModel) => void;
    onTaskDelete: (taskId: string) => void;
    onTaskToggle: (taskId: string, completed: boolean) => void;
  }
  ```

### TaskItem

- Opis komponentu: Reprezentuje pojedyncze zadanie
- Główne elementy: Card, StatusToggle, TaskActions
- Obsługiwane interakcje: Edycja, usuwanie, zmiana statusu
- Obsługiwana walidacja: Status zadania
- Typy: TaskViewModel
- Propsy:
  ```typescript
  interface TaskItemProps {
    task: TaskViewModel;
    onUpdate: (task: TaskViewModel) => void;
    onDelete: (taskId: string) => void;
    onToggle: (completed: boolean) => void;
  }
  ```

### TaskForm

- Opis komponentu: Formularz do tworzenia/edycji zadań
- Główne elementy: Form, TitleInput, DescriptionInput, FormActions
- Obsługiwane interakcje: Submit, Cancel, walidacja w locie
- Obsługiwana walidacja:
  - Tytuł wymagany
  - Opis max 4000 znaków
- Typy: CreateTodoCommandDTO, TaskFormViewModel
- Propsy:
  ```typescript
  interface TaskFormProps {
    initialValues?: Partial<CreateTodoCommandDTO>;
    onSubmit: (values: CreateTodoCommandDTO) => Promise<void>;
    onCancel?: () => void;
  }
  ```

## 5. Typy

```typescript
interface TaskViewModel extends TodoItemDTO {
  isEditing: boolean;
  isSaving: boolean;
  validationErrors?: Record<string, string>;
}

interface TaskFormViewModel {
  initialValues?: Partial<CreateTodoCommandDTO>;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

interface TaskListViewModel {
  tasks: TaskViewModel[];
  isLoading: boolean;
  error?: string;
}
```

## 6. Zarządzanie stanem

```typescript
const useTasksState = () => {
  const [tasks, setTasks] = useState<TaskViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Implementacja metod CRUD
  const createTask = async (task: CreateTodoCommandDTO) => {
    /* ... */
  };
  const updateTask = async (id: string, task: UpdateTodoCommandDTO) => {
    /* ... */
  };
  const toggleTask = async (id: string, completed: boolean) => {
    /* ... */
  };
  const deleteTask = async (id: string) => {
    /* ... */
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
```

## 7. Integracja API

- Endpoints:
  - POST /api/todos (Create)
  - PUT /api/todos/:id (Update)
  - PATCH /api/todos/:id/status (Toggle)
  - DELETE /api/todos/:id (Delete)
- Obsługa błędów HTTP
- Optymistyczne aktualizacje UI
- Proper error handling

## 8. Interakcje użytkownika

1. Tworzenie zadania:

   - Kliknięcie "Dodaj zadanie"
   - Wypełnienie formularza
   - Walidacja w locie
   - Submit i feedback

2. Edycja zadania:

   - Kliknięcie "Edytuj"
   - Modyfikacja pól
   - Zapisanie zmian

3. Zmiana statusu:

   - Toggle przycisku statusu
   - Natychmiastowa aktualizacja UI
   - Synchronizacja z backendem

4. Usuwanie zadania:
   - Kliknięcie "Usuń"
   - Potwierdzenie akcji
   - Usunięcie z UI

## 9. Warunki i walidacja

1. Formularz zadania:

   - Tytuł: wymagany, niepusty string
   - Opis: opcjonalny, max 4000 znaków
   - Deadline: opcjonalny, poprawna data

2. Status zadania:

   - Boolean (completed/incomplete)
   - Walidacja stanu przed togglem

3. Akcje:
   - Sprawdzanie uprawnień użytkownika
   - Weryfikacja stanu przed akcją

## 10. Obsługa błędów

1. Błędy API:

   - Wyświetlanie komunikatów użytkownikowi
   - Retry mechanism dla failed requests
   - Fallback UI dla błędów krytycznych

2. Błędy walidacji:

   - Inline feedback w formularzu
   - Highlight niepoprawnych pól
   - Jasne komunikaty błędów

3. Błędy stanu:
   - Error boundary dla crash recovery
   - Logging błędów
   - Graceful degradation

## 11. Kroki implementacji

1. Setup projektu:

   - Konfiguracja routingu
   - Implementacja podstawowych typów
   - Setup error boundary

2. Implementacja komponentów:

   - TaskView container
   - TaskList z podstawową funkcjonalnością
   - TaskItem z akcjami
   - TaskForm z walidacją

3. Integracja z API:

   - Implementacja hooka useTasksState
   - Podłączenie endpointów
   - Obsługa błędów

4. Implementacja interakcji:

   - Walidacja formularzy
   - Obsługa akcji CRUD
   - Optymistyczne aktualizacje

5. Stylowanie i UX:

   - Aplikacja styli Tailwind
   - Implementacja komponentów Shadcn/ui
   - Animacje i przejścia

6. Testy i QA:

   - Unit testy komponentów
   - Testy integracyjne
   - Testy wydajnościowe

7. Finalizacja:
   - Code review
   - Dokumentacja
   - Deployment
