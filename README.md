# Salon Manager

Aplikacja do zarządzania salonem fryzjerskim/kosmetycznym.

## Funkcje

- Zarządzanie klientami
- Zarządzanie usługami
- Kalendarz wizyt
- Historia wizyt
- Status płatności
- Notatki do wizyt

## Konfiguracja Supabase

1. Utwórz konto na [Supabase](https://supabase.com)
2. Stwórz nowy projekt
3. W ustawieniach projektu znajdź następujące dane:
   - Project URL
   - Project API Key (anon, public)
4. Skopiuj plik `.env.example` do `.env` i uzupełnij zmienne:
   ```
   VITE_SUPABASE_URL=twój-url-projektu
   VITE_SUPABASE_ANON_KEY=twój-klucz-publiczny
   ```

### Struktura bazy danych

Wykonaj poniższe zapytania SQL w Supabase SQL Editor:

```sql
-- Tworzenie tabel
create table clients (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  email text
);

create table services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  duration integer not null,
  price decimal(10,2) not null
);

create table appointments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  client_id uuid references clients(id) on delete cascade not null,
  service_id uuid references services(id) on delete cascade not null,
  date date not null,
  time time not null,
  is_paid boolean default false,
  amount decimal(10,2) not null,
  notes text
);

-- Tworzenie polityk bezpieczeństwa (RLS)
alter table clients enable row level security;
alter table services enable row level security;
alter table appointments enable row level security;

create policy "Enable all operations for authenticated users" on clients
  for all using (auth.role() = 'authenticated');

create policy "Enable all operations for authenticated users" on services
  for all using (auth.role() = 'authenticated');

create policy "Enable all operations for authenticated users" on appointments
  for all using (auth.role() = 'authenticated');
```

## Deployment

### 1. Supabase (Backend)
1. Załóż konto na [Supabase](https://supabase.com)
2. Stwórz nowy projekt (darmowy plan zawiera):
   - Baza PostgreSQL
   - Auth & User Management
   - Real-time subscriptions
   - Storage
   - Unlimited API requests
   - Do 500MB bazy danych
   - Do 1GB transferu/miesiąc

### 2. Vercel (Frontend)
1. Załóż konto na [Vercel](https://vercel.com)
2. Połącz z repozytorium GitHub
3. Importuj projekt
4. Dodaj zmienne środowiskowe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

Zalety Vercel:
- Automatyczne deploye przy push do repozytorium
- Darmowy SSL
- Globalna sieć CDN
- Darmowe subdomeny (twoja-app.vercel.app)
- Analytics
- Świetna integracja z React i Vite

### Alternatywy dla Vercel

#### 1. Netlify
- Również darmowy hosting
- Podobne możliwości do Vercel
- Dobre dla prostszych aplikacji

#### 2. GitHub Pages
- Darmowy hosting dla projektów open source
- Wymaga dodatkowej konfiguracji dla SPA
- Dobry dla statycznych stron

## Uruchomienie lokalne

1. Sklonuj repozytorium:
```bash
git clone [adres-repo]
cd [nazwa-folderu]
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
```bash
cp .env.example .env
```
Uzupełnij plik .env danymi z Supabase.

4. Uruchom aplikację:
```bash
npm run dev
```

## Wsparcie

W razie problemów:
1. Sprawdź konfigurację Supabase
2. Sprawdź zmienne środowiskowe
3. Sprawdź logi w konsoli
4. Sprawdź status deploymentu w Vercel

## Limity darmowych planów

### Supabase
- 500MB bazy danych
- 1GB transfer/miesiąc
- 50MB storage
- 100K zapytań Edge Functions/dzień

### Vercel
- Unlimited personal projects
- Unlimited static sites
- 100GB bandwidth/miesiąc
- Serverless function execution: 100GB-Hrs/miesiąc
- Build execution: 100 min/dzień
