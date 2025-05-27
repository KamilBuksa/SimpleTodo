# API Endpoint Implementation Plan: Create Todo

## 1. Przegląd punktu końcowego

Endpoint służący do tworzenia nowych zadań (todos) dla zalogowanego użytkownika. Zadanie może zawierać tytuł, opcjonalny opis oraz opcjonalny termin wykonania. Po utworzeniu zadania, jego status jest automatycznie ustawiany jako nieukończony (completed: false).

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: `/api/todos`
- Headers:
  - `Authorization: Bearer <token>` - Token Supabase
  - `Content-Type: application/json`
- Request Body:
  ```typescript
  {
    title: string;
    description?: string | null;
    deadline?: string | null; // ISO 8601 format
  }
  ```

## 3. Wykorzystywane typy

```typescript
// Command Model
interface CreateTodoCommandDTO {
  title: string;
  description?: string | null;
  deadline?: string | null;
}

// Response Model
interface TodoItemDTO {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deadline: string | null;
  completed: boolean;
}

// Error Response
interface ErrorResponseDTO {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
```

## 4. Szczegóły odpowiedzi

- Status: 201 Created
- Body: TodoItemDTO
- Przykład:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Complete project documentation",
    "description": "Write technical documentation for the API",
    "created_at": "2024-03-20T12:00:00Z",
    "updated_at": "2024-03-20T12:00:00Z",
    "deadline": "2024-03-25T23:59:59Z",
    "completed": false
  }
  ```

## 5. Przepływ danych

1. Walidacja żądania przez middleware Astro
2. Ekstrakcja danych użytkownika z tokena Supabase
3. Walidacja danych wejściowych przez Zod
4. Przekazanie do TodoService
5. Utworzenie rekordu w bazie danych
6. Mapowanie odpowiedzi na DTO
7. Zwrócenie odpowiedzi

## 6. Względy bezpieczeństwa

1. Uwierzytelnianie:
   - Wymagany ważny token Supabase
   - Weryfikacja tokena przez middleware
2. Walidacja danych:
   - Sanityzacja wszystkich danych wejściowych
   - Sprawdzanie długości description (max 4000 znaków)
   - Walidacja formatu deadline
3. Autoryzacja:
   - Automatyczne powiązanie todo z zalogowanym użytkownikiem
   - Brak możliwości tworzenia zadań dla innych użytkowników

## 7. Obsługa błędów

1. 401 Unauthorized:

   - Brak tokena
   - Nieprawidłowy token
   - Token wygasł

2. 400 Bad Request:
   - Brak wymaganego pola title
   - Nieprawidłowy format deadline
3. 422 Unprocessable Entity:
   - Przekroczenie maksymalnej długości description
   - Deadline w przeszłości
4. 500 Internal Server Error:
   - Błąd połączenia z bazą danych
   - Nieoczekiwane błędy serwera

## 8. Rozważania dotyczące wydajności

1. Indeksowanie:
   - Indeks na kolumnie user_id w tabeli todos
2. Walidacja:
   - Wczesna walidacja przed operacjami bazodanowymi
3. Optymalizacja zapytań:
   - Pojedyncze zapytanie INSERT
   - Wykorzystanie przygotowanych zapytań Supabase

## 9. Etapy wdrożenia

### 1. Utworzenie schematu walidacji

```typescript
// src/lib/schemas/todo.schema.ts
export const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(4000).nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
});
```

### 2. Implementacja TodoService

```typescript
// src/lib/services/todo.service.ts
export class TodoService {
  async createTodo(userId: string, command: CreateTodoCommandDTO): Promise<TodoItemDTO> {
    // Implementation
  }
}
```

### 3. Utworzenie endpointu

```typescript
// src/pages/api/todos.ts
export const POST: APIRoute = async ({ request, locals }) => {
  // Implementation
};
```

### 4. Implementacja middleware

```typescript
// src/middleware/auth.ts
export const authenticate = async (context: APIContext) => {
  // Implementation
};
```

### 5. Testy

1. Testy jednostkowe:
   - TodoService
   - Walidacja schematu
2. Testy integracyjne:
   - Endpoint z różnymi scenariuszami
   - Autoryzacja
3. Testy wydajnościowe:
   - Czas odpowiedzi
   - Obciążenie bazy danych
