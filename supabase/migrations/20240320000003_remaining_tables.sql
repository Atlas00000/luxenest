-- Create bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  guest_id uuid references public.profiles(id) on delete cascade not null,
  check_in_date date not null,
  check_out_date date not null,
  total_price decimal(10,2) not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_dates check (check_in_date < check_out_date)
);

-- Create reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_review unique (property_id, reviewer_id)
);

-- Create messages table
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index bookings_property_id_idx on public.bookings(property_id);
create index bookings_guest_id_idx on public.bookings(guest_id);
create index reviews_property_id_idx on public.reviews(property_id);
create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);

-- Enable RLS
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

-- Create triggers for updated_at
create trigger handle_bookings_updated_at
  before update on public.bookings
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_reviews_updated_at
  before update on public.reviews
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_messages_updated_at
  before update on public.messages
  for each row
  execute procedure public.handle_updated_at(); 