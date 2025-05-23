-- Create properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price_per_night decimal(10,2) not null,
  location text not null,
  max_guests integer not null,
  bedrooms integer not null,
  bathrooms integer not null,
  images text[] default '{}',
  amenities text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for better query performance
create index properties_owner_id_idx on public.properties(owner_id);

-- Enable RLS
alter table public.properties enable row level security;

-- Create RLS policies
create policy "Properties are viewable by everyone"
  on public.properties for select
  using (true);

create policy "Users can insert their own properties"
  on public.properties for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their own properties"
  on public.properties for update
  using (auth.uid() = owner_id);

create policy "Users can delete their own properties"
  on public.properties for delete
  using (auth.uid() = owner_id);

-- Create trigger for updated_at
create trigger handle_properties_updated_at
  before update on public.properties
  for each row
  execute procedure public.handle_updated_at(); 