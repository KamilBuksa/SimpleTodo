-- Migration: Initial Schema for SimpleTodo
-- Description: Creates the initial database schema including users extension and todos table
-- with proper RLS policies and constraints.

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create todos table
-- Note: users table is already provided by Supabase auth
create table todos (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title varchar(255) not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deadline timestamptz,
    constraint description_length check (description is null or length(description) <= 4000)
);

-- Create indexes
create index todos_user_id_idx on todos(user_id);

-- Enable Row Level Security
alter table todos enable row level security;

-- Create RLS Policies for todos table
-- Policy for authenticated users to select their own todos
create policy "Users can view their own todos"
    on todos for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy for authenticated users to insert their own todos
create policy "Users can insert their own todos"
    on todos for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy for authenticated users to update their own todos
create policy "Users can update their own todos"
    on todos for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for authenticated users to delete their own todos
create policy "Users can delete their own todos"
    on todos for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for automatically updating updated_at
create trigger set_updated_at
    before update on todos
    for each row
    execute function handle_updated_at(); 