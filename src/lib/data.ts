/* ------------------------------------------------------------------
   ENCORE — dummy data layer (no database; all content is static)
------------------------------------------------------------------- */

export interface Review {
  id: string;
  author: string;
  eventType: string;
  date: string;
  rating: number;
  text: string;
  verified: boolean;
  pending?: boolean;
}

export interface BandPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface Video {
  src: string;
  poster: string;
  title: string;
  duration: string;
}

export interface Band {
  id: string;
  name: string;
  tagline: string;
  genres: string[];
  vibes: string[];
  location: string;
  region: string;
  travelNote: string;
  priceFrom: number;
  rating: number;
  reviewCount: number;
  eventsPlayed: number;
  lineup: string;
  members: number;
  badge?: string;
  featured?: boolean;
  image: string;
  gallery: { src: string; alt: string }[];
  video: Video;
  bio: string[];
  setlist: string[];
  packages: BandPackage[];
  reviews: Review[];
}

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  src: string;
  poster?: string;
  title: string;
  band: string;
  bandId: string;
  category: "Weddings" | "Corporate" | "Private Parties" | "Venues & Clubs";
  genre: string;
  location: string;
  duration?: string;
}

/* ============================ BANDS ============================ */

const px = (id: number | string, extra = "", ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&${extra}`;

export const BANDS: Band[] = [
  {
    id: "the-velvet-hour",
    name: "The Velvet Hour",
    tagline: "Sophisticated jazz & swing for golden-hour moments",
    genres: ["Jazz & Swing"],
    vibes: ["Elegant", "Cocktail", "Dinner"],
    location: "Sydney",
    region: "NSW",
    travelNote: "Travels NSW-wide · no fee within 60km",
    priceFrom: 3200,
    rating: 4.9,
    reviewCount: 87,
    eventsPlayed: 240,
    lineup: "5-piece — vocals, sax, piano, double bass, drums",
    members: 5,
    badge: "Encore Choice",
    featured: true,
    image: px(9002789, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(11393078, "fit=crop&h=900&w=1400"), alt: "Saxophonist performing at an elegant indoor event" },
      { src: px(12193821, "fit=crop&h=900&w=1400"), alt: "Close-up of saxophone in black and white" },
      { src: px(37022354, "fit=crop&h=900&w=1400"), alt: "Two saxophonists performing on stage" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/29179781/12600174_3840_2160_25fps.mp4",
      poster: "https://images.pexels.com/videos/29179781/artist-tools-music-29179781.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "Live at The Calile Ballroom",
      duration: "0:18",
    },
    bio: [
      "Formed at the Sydney Conservatorium of Music in 2016, The Velvet Hour has become the quiet obsession of Australia's wedding planners and luxury hoteliers. Think candlelit standards, brushed drums and a vocalist who makes every first dance feel written for the couple.",
      "From black-tie galas at Bennelong to long-table dinners under festoon lights, the band reads a room instinctively — dialling from velvet-smooth dinner jazz to swinging late-night sets that fill any dancefloor.",
    ],
    setlist: ["Fly Me to the Moon", "La Vie En Rose", "The Way You Look Tonight", "At Last", "Sway", "Cheek to Cheek"],
    packages: [
      { id: "vh-essential", name: "Essential", tagline: "Ceremony & early evening", price: 3200, features: ["3-piece jazz trio", "2 × 45-minute sets", "Up to 3 hours on site", "Full PA & lighting included", "Curated dinner playlist between sets"] },
      { id: "vh-signature", name: "Signature", tagline: "The classic Velvet Hour", price: 4400, popular: true, features: ["Full 5-piece with vocals", "3 × 45-minute sets", "Up to 5 hours on site", "MC & announcements", "Your first dance, learned live", "Professional sound engineer"] },
      { id: "vh-encore", name: "Encore", tagline: "The full golden age", price: 5900, features: ["6-piece with horn section", "4 × 40-minute sets", "Ceremony through to last dance", "DJ fill-ins between sets", "Bespoke song arrangement", "Premium lighting design"] },
    ],
    reviews: [
      { id: "r1", author: "Charlotte & James W.", eventType: "Wedding — Centennial Parklands", date: "Nov 2025", rating: 5, text: "Our planner said they were the best in Sydney and she was underselling it. The first dance arrangement of 'At Last' had half the room in tears. Flawless from soundcheck to the final note.", verified: true },
      { id: "r2", author: "Marcus L.", eventType: "Corporate gala — Barangaroo", date: "Sep 2025", rating: 5, text: "600 guests, black tie, zero hiccups. The band read the room perfectly and the CEO is still talking about the sax solo during dessert. Booking and payment through Encore took ten minutes.", verified: true },
      { id: "r3", author: "Priya S.", eventType: "50th birthday — Private estate", date: "Jun 2025", rating: 4.5, text: "Elegant, punctual and genuinely lovely people. The cocktail-hour set elevated the entire evening. Only wish we'd booked the full five-piece instead of the trio!", verified: true },
    ],
  },
  {
    id: "honey-and-smoke",
    name: "Honey & Smoke",
    tagline: "Soul, Motown & funk with a horn section that means it",
    genres: ["Soul & Motown", "Funk"],
    vibes: ["High Energy", "Dancefloor", "Glamour"],
    location: "Melbourne",
    region: "VIC",
    travelNote: "Travels nationally · no fee within 80km",
    priceFrom: 3900,
    rating: 5.0,
    reviewCount: 62,
    eventsPlayed: 310,
    lineup: "8-piece — 2 vocalists, horns, keys, guitar, bass, drums",
    members: 8,
    badge: "Top Rated 2025",
    featured: true,
    image: px(8043850, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(8043852, "fit=crop&h=900&w=1400"), alt: "Lead singer in red performing into a vintage microphone" },
      { src: px(9010063, "fit=crop&h=900&w=1400"), alt: "Vocalist singing with eyes closed in passion" },
      { src: px(8044049, "fit=crop&h=900&w=1400"), alt: "Close-up of emotional live vocal performance" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/4264972/4264972-uhd_3840_2160_30fps.mp4",
      poster: "https://images.pexels.com/videos/4264972/pexels-photo-4264972.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "Horn section feature — Stones of the Yarra Valley",
      duration: "0:11",
    },
    bio: [
      "If your brief is 'a dancefloor that never empties', Honey & Smoke is the answer. Melbourne's most-booked soul revue pairs two powerhouse vocalists with a horn section lifted straight from the Stax records era.",
      "They've headlined New Year's Eve at Crown, closed product launches for national brands, and turned more than three hundred weddings into the party guests compare every party to afterwards.",
    ],
    setlist: ["Ain't No Mountain High Enough", "Signed, Sealed, Delivered", "Respect", "Proud Mary", "Superstition", "I Got You (I Feel Good)"],
    packages: [
      { id: "hs-supper", name: "Supper Club", tagline: "Compact, classy, soulful", price: 3900, features: ["6-piece with lead vocals", "2 × 45-minute sets", "Up to 4 hours on site", "Full production included", "Dinner music playlist service"] },
      { id: "hs-signature", name: "Signature Revue", tagline: "The full Honey & Smoke", price: 4800, popular: true, features: ["7-piece with dual vocalists", "2 × 60-minute sets", "Up to 5 hours on site", "MC & formalities support", "First dance performed live", "Sound engineer included"] },
      { id: "hs-encore", name: "Encore Horns", tagline: "Maximum impact", price: 6200, features: ["8-piece with full horn section", "3 × 45-minute sets", "Ceremony to last dance coverage", "Costume change & stage styling", "DJ service between sets", "Premium lighting package"] },
    ],
    reviews: [
      { id: "r4", author: "Sarah & Tom M.", eventType: "Wedding — Stones of the Yarra Valley", date: "Dec 2025", rating: 5, text: "I've never seen a dancefloor like it — my 70-year-old dad and my uni friends, shoulder to shoulder for three straight hours. Worth every cent. The deposit and balance payments were completely painless.", verified: true },
      { id: "r5", author: "Daniel K.", eventType: "Product launch — Crown Melbourne", date: "Oct 2025", rating: 5, text: "Third time booking them for our events calendar. Professional comms, airtight run sheet, and the horn section makes our brand look extremely good. Encore's invoicing makes finance happy too.", verified: true },
      { id: "r6", author: "Amelie R.", eventType: "40th birthday — Brighton", date: "Jul 2025", rating: 5, text: "Booked the Signature package. When the horns kicked in during 'Proud Mary' the whole street probably heard it. Absolute highlight of my year.", verified: true },
    ],
  },
  {
    id: "azure-coast",
    name: "Azure Coast",
    tagline: "Sun-warmed acoustic duo for ceremonies & slow afternoons",
    genres: ["Acoustic & Folk"],
    vibes: ["Relaxed", "Romantic", "Coastal"],
    location: "Byron Bay",
    region: "NSW",
    travelNote: "Byron to Brisbane · no fee within 100km",
    priceFrom: 1450,
    rating: 4.9,
    reviewCount: 143,
    eventsPlayed: 520,
    lineup: "Duo — vocals & guitar, with optional loop pedal",
    members: 2,
    badge: "Fast Responder",
    image: px(28540198, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(32666349, "fit=crop&h=900&w=1400"), alt: "Female guitarist performing outdoors in the sun" },
      { src: px(1835656, "fit=crop&h=900&w=1400"), alt: "Musician in a suit playing acoustic guitar on a bridge" },
      { src: px(35580969, "fit=crop&h=900&w=1400"), alt: "Guitarist performing at night in warm light" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/7502883/7502883-hd_1080_1920_30fps.mp4",
      poster: "https://images.pexels.com/videos/7502883/adult-band-bass-guitar-beach-7502883.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630",
      title: "Barefoot session — Wategos Beach",
      duration: "0:16",
    },
    bio: [
      "Azure Coast is the sound of a Byron afternoon — two voices, one guitar, and harmonies that make hush fall over a ceremony aisle. Maddy and Luca have played over five hundred weddings, vineyard lunches and coastal celebrations.",
      "Their signature is restraint: knowing exactly when to lift and when to let the moment breathe. Expect re-imagined classics, from Fleetwood Mac to The Paper Kites, arranged for two voices and golden light.",
    ],
    setlist: ["Better Together", "Landslide", "Ho Hey", "Riptide", "Bloom", "Home"],
    packages: [
      { id: "ac-ceremony", name: "Ceremony", tagline: "The walk down the aisle", price: 1450, features: ["90 minutes of live music", "3 songs learned for your ceremony", "Battery PA for beach & garden", "Pre-ceremony playlist as guests arrive"] },
      { id: "ac-afternoon", name: "Long Afternoon", tagline: "Canapés & golden hour", price: 2200, popular: true, features: ["3 hours of live sets", "Ceremony + canapés coverage", "Requests from guests welcome", "Compact footprint — sets up anywhere", "Travel within Byron–Brisbane included"] },
      { id: "ac-sunset", name: "Sunset to Stars", tagline: "The full celebration", price: 2850, features: ["Up to 5 hours on site", "Ceremony, canapés & reception entry", "First dance performed live", "Evening playlist DJ service", "Fairy-light performance styling"] },
    ],
    reviews: [
      { id: "r7", author: "Georgia & Liam H.", eventType: "Wedding — Fig Tree, Byron Bay", date: "Oct 2025", rating: 5, text: "Maddy sang our daughter down the aisle on her grandfather's arm and there wasn't a dry eye. They felt like friends by the end of the night. Booked in one afternoon through Encore.", verified: true },
      { id: "r8", author: "Rohan P.", eventType: "Vineyard long lunch — Hinterland", date: "Aug 2025", rating: 4.5, text: "Perfect volume, perfect vibe for 60 guests over a long lunch. Guests kept asking who they were. Only note: book the longer package, you'll want more of them.", verified: true },
      { id: "r9", author: "Isabella M.", eventType: "Engagement party — Burleigh Heads", date: "Mar 2025", rating: 5, text: "They learned our song in a week and nailed it. Communication was instant and the whole booking felt effortless.", verified: true },
    ],
  },
  {
    id: "midnight-parade",
    name: "Midnight Parade",
    tagline: "The singalong party band — 90s to now, all killer",
    genres: ["Party & Covers", "Rock & Pop"],
    vibes: ["High Energy", "Singalong", "Big Room"],
    location: "Melbourne",
    region: "VIC",
    travelNote: "Travels VIC & SA · no fee within 60km",
    priceFrom: 3900,
    rating: 4.8,
    reviewCount: 96,
    eventsPlayed: 280,
    lineup: "7-piece — 2 vocalists, guitar, keys, bass, drums, sax",
    members: 7,
    featured: true,
    image: px(8044071, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(17116018, "fit=crop&h=900&w=1400"), alt: "Band performing under dramatic concert lighting" },
      { src: px(16118368, "fit=crop&h=900&w=1400"), alt: "Live band on stage under red lights" },
      { src: px(8044081, "fit=crop&h=900&w=1400"), alt: "Female singer and guitarist performing together" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/8043148/8043148-uhd_4096_2160_25fps.mp4",
      poster: "https://images.pexels.com/videos/8043148/acoustic-adult-art-band-8043148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630",
      title: "Full set highlights — Forum Melbourne",
      duration: "0:13",
    },
    bio: [
      "Midnight Parade plays the songs your guests scream the words to. From The Killers to ABBA, their 300-song repertoire is engineered for one outcome: a heaving, joyous dancefloor from the first chorus.",
      "A fixture of Melbourne's corporate calendar and festival afterparties, the band brings arena energy with event professionalism — self-contained production, tight run sheets, and a front duo who can work any room.",
    ],
    setlist: ["Mr Brightside", "Shut Up and Dance", "Dancing Queen", "Valerie", "Uptown Funk", "Sweet Caroline"],
    packages: [
      { id: "mp-starter", name: "Party Starter", tagline: "Lean & loud", price: 3900, features: ["5-piece lineup", "2 × 60-minute sets", "Up to 4 hours on site", "Full PA & lighting rig", "Party playlist between sets"] },
      { id: "mp-main", name: "Main Event", tagline: "The full parade", price: 5200, popular: true, features: ["7-piece with dual vocalists", "3 × 45-minute sets", "Up to 6 hours on site", "DJ fills between sets", "Your anthem learned live", "Experienced sound engineer"] },
      { id: "mp-allnight", name: "All Night", tagline: "First pour to last dance", price: 6800, features: ["7-piece, 4 live sets", "Dinner through to close", "Full DJ service after midnight", "Custom stage lighting design", "MC & formalities support"] },
    ],
    reviews: [
      { id: "r10", author: "Westbrook Events", eventType: "Gala dinner — Palladium at Crown", date: "Nov 2025", rating: 5, text: "Our third year booking Midnight Parade for the industry awards. 900 people on the dancefloor by 9:30pm. They are simply the safest hands in the business.", verified: true },
      { id: "r11", author: "Kate & Declan O.", eventType: "Wedding — Yarra Ranges Estate", date: "Sep 2025", rating: 4.5, text: "The 'Mr Brightside' moment with both families in a circle is a core memory now. Soundcheck ran a touch long but the night itself was flawless.", verified: true },
      { id: "r12", author: "Hannah G.", eventType: "30th birthday — Warehouse, Collingwood", date: "May 2025", rating: 5, text: "Felt like a headline show at my own party. Booking, deposit and balance all handled online in minutes — no awkward band-manager emails.", verified: true },
    ],
  },
  {
    id: "solstice-strings",
    name: "Solstice Strings",
    tagline: "A string quartet for ceremonies that deserve cinema",
    genres: ["Classical & Strings"],
    vibes: ["Cinematic", "Elegant", "Ceremony"],
    location: "Brisbane",
    region: "QLD",
    travelNote: "SEQ & Northern Rivers · no fee within 70km",
    priceFrom: 1850,
    rating: 5.0,
    reviewCount: 54,
    eventsPlayed: 190,
    lineup: "Quartet — 2 violins, viola, cello",
    members: 4,
    image: px(7095834, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(7095031, "fit=crop&h=900&w=1400"), alt: "Close-up of hands playing violin" },
      { src: px(7097457, "fit=crop&h=900&w=1400"), alt: "Violinist performing on stage" },
      { src: px(7095044, "fit=crop&h=900&w=1400"), alt: "Violinist with sheet music in soft light" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/7095060/7095060-uhd_4096_2160_25fps.mp4",
      poster: "https://images.pexels.com/videos/7095060/pexels-photo-7095060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "'A Thousand Years' — ceremony recording",
      duration: "0:23",
    },
    bio: [
      "Four Queensland Conservatorium graduates with a shared belief: pop songs deserve the same reverence as Pachelbel. Solstice Strings arranges everything from Taylor Swift to Tame Impala for two violins, viola and cello.",
      "They are the quartet Brisbane's luxury wedding venues recommend first — immaculately presented, quietly brilliant, and capable of making 200 guests fall completely silent.",
    ],
    setlist: ["Canon in D", "A Thousand Years", "Wildest Dreams (arr.)", "Clair de Lune", "Viva la Vida", "Hallelujah"],
    packages: [
      { id: "ss-ceremony", name: "Ceremony", tagline: "The moment itself", price: 1850, features: ["1 hour of performance", "Processional, signing & recessional", "One bespoke arrangement included", "Elegant all-black presentation"] },
      { id: "ss-canapes", name: "Ceremony + Canapés", tagline: "Through golden hour", price: 2600, popular: true, features: ["2.5 hours of performance", "Ceremony + canapé hour", "Two bespoke arrangements", "Modern & classical repertoire mix", "Travel within SEQ included"] },
      { id: "ss-evening", name: "Long Evening", tagline: "A full soundtrack", price: 3400, features: ["4 hours across the evening", "Ceremony through to dinner", "Your story arranged as a suite", "Optional amplified performance", "Keepsake sheet music of your song"] },
    ],
    reviews: [
      { id: "r13", author: "Eleanor & Hugh B.", eventType: "Wedding — Mount Tamborine", date: "Oct 2025", rating: 5, text: "They arranged my late mother's favourite song for the signing. My father couldn't speak for ten minutes. Artistry aside, the booking and payments were the easiest vendor experience of our wedding.", verified: true },
      { id: "r14", author: "Sofia C.", eventType: "Museum gala — GOMA, Brisbane", date: "Aug 2025", rating: 5, text: "Impeccable. They moved between rooms without a sound, adapted the set to donors' tastes, and looked stunning doing it. Our board was very impressed.", verified: true },
    ],
  },
  {
    id: "wildflower",
    name: "Wildflower",
    tagline: "Indie-folk trio — barefoot hearts, festival polish",
    genres: ["Indie & Folk", "Acoustic & Folk"],
    vibes: ["Bohemian", "Warm", "Festival"],
    location: "Perth",
    region: "WA",
    travelNote: "WA-wide incl. Margaret River · no fee within 50km",
    priceFrom: 2100,
    rating: 4.9,
    reviewCount: 71,
    eventsPlayed: 210,
    lineup: "Trio — vocals, guitar/percussion, double bass/keys",
    members: 3,
    image: px(26835494, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(32666339, "fit=crop&h=900&w=1400"), alt: "Black and white portrait of a folk singer" },
      { src: px(9010063, "fit=crop&h=900&w=1400"), alt: "Singer lost in song under warm light" },
      { src: px(2990830, "fit=crop&h=900&w=1400"), alt: "Band performing on a festival stage with smoke" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/7502881/7502881-hd_1080_1920_30fps.mp4",
      poster: "https://images.pexels.com/videos/7502881/adult-band-bass-guitar-beautiful-sunset-7502881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630",
      title: "Rooftop sunset set — Fremantle",
      duration: "0:25",
    },
    bio: [
      "Wildflower began busking at Fremantle Markets and graduated to festival main stages without losing the campfire intimacy that made people stop in the first place. Three voices, stomp-box percussion, and harmonies with some dirt under their nails.",
      "They're the band for long-table weddings in Margaret River, brand activations that need soul, and backyards that turn into dancefloors at 10pm.",
    ],
    setlist: ["Ho Hey", "The Cave", "Dog Days Are Over", "First Day of My Life", "Riptide", "You Are the Best Thing"],
    packages: [
      { id: "wf-golden", name: "Golden Hour", tagline: "Ceremony & canapés", price: 2100, features: ["2 × 45-minute sets", "One request learned for you", "Battery rig for remote spots", "Arrival playlist included"] },
      { id: "wf-bloom", name: "Full Bloom", tagline: "The whole afternoon", price: 2950, popular: true, features: ["3 × 45-minute sets", "Ceremony + reception entry", "First dance performed live", "Evening playlist service", "Festoon-light styling kit"] },
      { id: "wf-wild", name: "Wild One", tagline: "Sunset to last dance", price: 3800, features: ["4 sets across the day", "Up to 7 hours on site", "Late stomp-along set", "DJ playlist until close", "Extra percussionist join-in"] },
    ],
    reviews: [
      { id: "r15", author: "Freya & Nate D.", eventType: "Wedding — Margaret River", date: "Apr 2025", rating: 5, text: "Our guests still talk about the stomp-along finale. Wildflower turned a paddock into a festival. Payments via Encore meant we weren't carrying cash on the day — huge relief.", verified: true },
      { id: "r16", author: "Oliver T.", eventType: "Brand event — Cottesloe Beach", date: "Feb 2025", rating: 4.5, text: "Stylish, easy to work with, and the sunset set was genuinely moving. Handled a tricky wind situation like pros.", verified: true },
    ],
  },
  {
    id: "neon-palms",
    name: "Neon Palms",
    tagline: "DJ & live sax — resort polish, club instinct",
    genres: ["DJ & Live Sax", "Dance"],
    vibes: ["Club", "Lux Party", "Poolside"],
    location: "Gold Coast",
    region: "QLD",
    travelNote: "Brisbane to Byron · no fee within 90km",
    priceFrom: 2600,
    rating: 4.8,
    reviewCount: 118,
    eventsPlayed: 340,
    lineup: "Duo — DJ/producer + saxophonist (percussion optional)",
    members: 2,
    badge: "Corporate Favourite",
    image: px(9005510, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(13146328, "fit=crop&h=900&w=1400"), alt: "Laser lights over a festival crowd" },
      { src: px(19923641, "fit=crop&h=900&w=1400"), alt: "Friends dancing under golden club lighting" },
      { src: px(7269208, "fit=crop&h=900&w=1400"), alt: "Nightclub scene in neon light" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/16510380/16510380-hd_1920_1080_60fps.mp4",
      poster: "https://images.pexels.com/videos/16510380/club-lights-dj-dj-mixer-dj-music-16510380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "Club set — W Hotel, Surfers Paradise",
      duration: "0:12",
    },
    bio: [
      "Neon Palms bottle the feeling of a beach club at midnight: deep grooves, live sax lines curling over the top, and a DJ who treats a wedding dancefloor with the same respect as a festival main stage.",
      "Resident act for the Gold Coast's five-star resorts and a fixture on corporate afterparty riders, they scale from poolside chill at 4pm to a confetti-worthy 11pm peak without missing a beat.",
    ],
    setlist: ["This Girl — Kungs", "Peanut Butter Jelly", "Flowers — Miley Cyrus", "Levitating", "Mr Saxobeat", "Crazy — Gnarls Barkley"],
    packages: [
      { id: "np-sunset", name: "Sunset", tagline: "Golden hour grooves", price: 2600, features: ["3-hour DJ set", "2 live sax features", "Full PA & dancefloor lighting", "Cocktail playlist to open"] },
      { id: "np-high-tide", name: "High Tide", tagline: "The signature night", price: 3400, popular: true, features: ["4-hour DJ set", "Live sax + percussion", "Wireless mic for speeches", "Custom intro track for entrances", "Premium moving-light rig"] },
      { id: "np-after-dark", name: "After Dark", tagline: "Full production", price: 4200, features: ["5 hours DJ + sax", "Intelligent lighting design", "CO2 & confetti moments", "Dedicated event producer", "Silent-disco upgrade available"] },
    ],
    reviews: [
      { id: "r17", author: "Meridian Group", eventType: "EOY party — The Star Grand Ballroom", date: "Dec 2025", rating: 5, text: "400 staff, three generations, one packed dancefloor. The sax player walking through the crowd during 'This Girl' was the moment of the night. Booking and progress payments were seamless.", verified: true },
      { id: "r18", author: "Jasmin K.", eventType: "Pool party — Private residence, Sanctuary Cove", date: "Nov 2025", rating: 4.5, text: "Exactly the Ibiza-at-lunch energy we wanted. Setup was invisible, and the transition from chill to dance was perfectly timed with the sunset.", verified: true },
      { id: "r19", author: "Cooper W.", eventType: "Wedding afterparty — Babalou", date: "Jun 2025", rating: 5, text: "Hired them for the afterparty after our band finished — best decision of the night. The dancefloor was four deep until close.", verified: true },
    ],
  },
  {
    id: "golden-age-big-band",
    name: "Golden Age Big Band",
    tagline: "Twelve players. One ballroom. Pure Gatsby electricity",
    genres: ["Big Band", "Jazz & Swing"],
    vibes: ["Black Tie", "Gatsby", "Showstopper"],
    location: "Sydney",
    region: "NSW",
    travelNote: "Travels nationally · staging requirements apply",
    priceFrom: 6500,
    rating: 5.0,
    reviewCount: 38,
    eventsPlayed: 150,
    lineup: "12-piece — brass, reeds, rhythm, male & female vocalists",
    members: 12,
    badge: "Encore Choice",
    image: px(442540, "fit=crop&h=900&w=1400"),
    gallery: [
      { src: px(613813, "fit=crop&h=900&w=1400"), alt: "Guitarist and saxophonist on a lit stage" },
      { src: px(9002889, "fit=crop&h=900&w=1400"), alt: "Close-up of saxophone gleaming under warm lights" },
      { src: px(7450654, "fit=crop&h=900&w=1400"), alt: "Suited musician performing under spotlights" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/4264958/4264958-uhd_3840_2160_30fps.mp4",
      poster: "https://images.pexels.com/videos/4264958/pexels-photo-4264958.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "'Sing, Sing, Sing' — The Ivy Ballroom",
      duration: "0:10",
    },
    bio: [
      "Some nights call for spectacle. Golden Age Big Band delivers twelve musicians in dinner jackets, a wall of brass, and vocalists who channel Basie-era swing with modern bite.",
      "The band of choice for Sydney's grandest charity balls and Gatsby-themed milestones, they bring full original charts, matching music stands, and a conductor who keeps 300-odd dancers on their toes all night.",
    ],
    setlist: ["Sing, Sing, Sing", "In the Mood", "Mack the Knife", "Moon River", "It Don't Mean a Thing", "New York, New York"],
    packages: [
      { id: "ga-ballroom", name: "Ballroom", tagline: "The classic big band", price: 6500, features: ["10-piece big band", "2 × 50-minute sets", "1 vocalist", "Full charts & staging", "Dinner playlist service"] },
      { id: "ga-grand", name: "Grand Spectacular", tagline: "The full twelve-piece", price: 8900, popular: true, features: ["12-piece with dual vocalists", "3 × 45-minute sets", "Costumed Gatsby entrance", "Dance lesson for guests (15 min)", "Professional sound engineer", "Premium stage lighting"] },
      { id: "ga-afterparty", name: "Late Show", tagline: "After-dinner intensity", price: 5400, features: ["8-piece lineup", "90-minute late show", "Post-9pm start", "DJ handover after set"] },
    ],
    reviews: [
      { id: "r20", author: "Starlight Foundation Ball", eventType: "Charity ball — ICC Sydney Grand Ballroom", date: "Sep 2025", rating: 5, text: "1,100 guests and the big band held the room like Sinatra at the Sands. Our most successful fundraising night on record. Flawless logistics through Encore.", verified: true },
      { id: "r21", author: "Beatrice & Alistair N.", eventType: "Wedding — The Great Synagogue & Doltone House", date: "Mar 2025", rating: 5, text: "A twelve-piece band at your wedding is an outrageous luxury and we regret nothing. Guests are still sending us videos.", verified: true },
    ],
  },
  {
    id: "true-north",
    name: "True North",
    tagline: "Country-folk party band — boots, banjo & barnstormers",
    genres: ["Country & Folk", "Party & Covers"],
    vibes: ["Barn Party", "Festival", "Singalong"],
    location: "Hunter Valley",
    region: "NSW",
    travelNote: "NSW wine country specialists · no fee within 120km",
    priceFrom: 2800,
    rating: 4.9,
    reviewCount: 83,
    eventsPlayed: 190,
    lineup: "6-piece — vocals, fiddle, banjo, guitar, bass, drums",
    members: 6,
    image: px(11963130, "fit=crop&h=900&w=1400", "png"),
    gallery: [
      { src: px(19943363, "fit=crop&h=900&w=1400"), alt: "Crowd clapping under warm concert light" },
      { src: px(342520, "fit=crop&h=900&w=1400"), alt: "Guests dancing at a packed night event" },
      { src: px(10360901, "fit=crop&h=900&w=1400"), alt: "Celebration under strings of lights" },
    ],
    video: {
      src: "https://videos.pexels.com/video-files/9481007/9481007-uhd_3840_2160_24fps.mp4",
      poster: "https://images.pexels.com/videos/9481007/pexels-photo-9481007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
      title: "Barn dance finale — Brokenwood Wines",
      duration: "0:16",
    },
    bio: [
      "True North was born in a Pokolbin shearing shed and it shows — fiddle breaks, four-part harmonies, and countryfied covers that turn sceptics into line-dancers by the second set.",
      "The house band of Hunter wine country: harvest festivals, long lunches, and weddings where the couple met at a rodeo. They bring the barn energy; you bring the boots.",
    ],
    setlist: ["Wagon Wheel", "Jolene", "Chicken Fried", "The Gambler", "Take Me Home, Country Roads", "Friends in Low Places"],
    packages: [
      { id: "tn-harvest", name: "Harvest", tagline: "Afternoon in the vines", price: 2800, features: ["2 × 45-minute sets", "Acoustic opening set", "PA suited to outdoor lawns", "Country playlist between sets"] },
      { id: "tn-barn", name: "Barnstormer", tagline: "The full hoedown", price: 3900, popular: true, features: ["3 × 45-minute sets", "Line-dance caller for one set", "Up to 6 hours on site", "Full production & lighting", "First dance, country-style"] },
      { id: "tn-festival", name: "Festival", tagline: "Main stage energy", price: 5200, features: ["4 sets across the day", "Festival-grade production", "Guest vocalist slots", "DJ service until late"] },
    ],
    reviews: [
      { id: "r22", author: "Jess & Rowan F.", eventType: "Wedding — Adams Peak, Hunter Valley", date: "Nov 2025", rating: 5, text: "Grandma did the line-dance set in her good shoes and has dined out on it ever since. True North made our wedding feel like the world's best pub night.", verified: true },
      { id: "r23", author: "Tyrrell's Events Team", eventType: "Harvest festival — Pokolbin", date: "Mar 2025", rating: 5, text: "Third vintage in a row with True North closing the festival. Crowd numbers grow every year and the band is a genuine part of that story.", verified: true },
    ],
  },
];

/* ============================ GALLERY ============================ */

export const GALLERY: GalleryItem[] = [
  { id: "g1", type: "video", src: "https://videos.pexels.com/video-files/29179781/12600174_3840_2160_25fps.mp4", poster: "https://images.pexels.com/videos/29179781/artist-tools-music-29179781.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Sax over dinner service", band: "The Velvet Hour", bandId: "the-velvet-hour", category: "Weddings", genre: "Jazz & Swing", location: "Sydney", duration: "0:18" },
  { id: "g2", type: "photo", src: px(10360899, "fit=crop&h=800&w=1200"), title: "First dance under festoon", band: "Azure Coast", bandId: "azure-coast", category: "Weddings", genre: "Acoustic & Folk", location: "Byron Bay" },
  { id: "g3", type: "video", src: "https://videos.pexels.com/video-files/8043148/8043148-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/8043148/acoustic-adult-art-band-8043148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630", title: "Full band highlights", band: "Midnight Parade", bandId: "midnight-parade", category: "Corporate", genre: "Party & Covers", location: "Melbourne", duration: "0:13" },
  { id: "g4", type: "photo", src: px(28123410, "fit=crop&h=800&w=1200"), title: "A first dance in bloom", band: "Wildflower", bandId: "wildflower", category: "Weddings", genre: "Indie & Folk", location: "Margaret River" },
  { id: "g5", type: "video", src: "https://videos.pexels.com/video-files/16510380/16510380-hd_1920_1080_60fps.mp4", poster: "https://images.pexels.com/videos/16510380/club-lights-dj-dj-mixer-dj-music-16510380.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Dancefloor at capacity", band: "Neon Palms", bandId: "neon-palms", category: "Venues & Clubs", genre: "DJ & Live Sax", location: "Gold Coast", duration: "0:12" },
  { id: "g6", type: "photo", src: px(19943363, "fit=crop&h=800&w=1200"), title: "Six hundred hands in the air", band: "True North", bandId: "true-north", category: "Corporate", genre: "Country & Folk", location: "Hunter Valley" },
  { id: "g7", type: "video", src: "https://videos.pexels.com/video-files/7095060/7095060-uhd_4096_2160_25fps.mp4", poster: "https://images.pexels.com/videos/7095060/pexels-photo-7095060.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Ceremony strings", band: "Solstice Strings", bandId: "solstice-strings", category: "Weddings", genre: "Classical & Strings", location: "Brisbane", duration: "0:23" },
  { id: "g8", type: "photo", src: px(13146328, "fit=crop&h=800&w=1200"), title: "Laser hour", band: "Neon Palms", bandId: "neon-palms", category: "Venues & Clubs", genre: "DJ & Live Sax", location: "Surfers Paradise" },
  { id: "g9", type: "photo", src: px(8044081, "fit=crop&h=1000&w=700"), title: "Studio session, vocal duo", band: "Honey & Smoke", bandId: "honey-and-smoke", category: "Corporate", genre: "Soul & Motown", location: "Melbourne" },
  { id: "g10", type: "video", src: "https://videos.pexels.com/video-files/7502881/7502881-hd_1080_1920_30fps.mp4", poster: "https://images.pexels.com/videos/7502881/adult-band-bass-guitar-beautiful-sunset-7502881.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630", title: "Rooftop sunset set", band: "Wildflower", bandId: "wildflower", category: "Private Parties", genre: "Indie & Folk", location: "Fremantle", duration: "0:25" },
  { id: "g11", type: "photo", src: px(9002889, "fit=crop&h=800&w=1200"), title: "Brass under warm light", band: "Golden Age Big Band", bandId: "golden-age-big-band", category: "Corporate", genre: "Big Band", location: "Sydney" },
  { id: "g12", type: "video", src: "https://videos.pexels.com/video-files/13847585/13847585-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/videos/13847585/guitar-13847585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Guitar feature, side of stage", band: "Midnight Parade", bandId: "midnight-parade", category: "Venues & Clubs", genre: "Party & Covers", location: "Melbourne", duration: "0:05" },
  { id: "g13", type: "photo", src: px(7097457, "fit=crop&h=800&w=1200"), title: "Violin in the spotlight", band: "Solstice Strings", bandId: "solstice-strings", category: "Weddings", genre: "Classical & Strings", location: "Mount Tamborine" },
  { id: "g14", type: "photo", src: px(342520, "fit=crop&h=800&w=1200"), title: "Past midnight", band: "True North", bandId: "true-north", category: "Private Parties", genre: "Country & Folk", location: "Pokolbin" },
  { id: "g15", type: "video", src: "https://videos.pexels.com/video-files/9006151/9006151-hd_1920_1080_25fps.mp4", poster: "https://images.pexels.com/videos/9006151/adult-band-bass-concert-9006151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Bass & vocals, close-up", band: "Honey & Smoke", bandId: "honey-and-smoke", category: "Venues & Clubs", genre: "Soul & Motown", location: "Melbourne", duration: "0:15" },
  { id: "g16", type: "photo", src: px(27379788, "fit=crop&h=800&w=1200"), title: "The grand first dance", band: "The Velvet Hour", bandId: "the-velvet-hour", category: "Weddings", genre: "Jazz & Swing", location: "Centennial Parklands" },
  { id: "g17", type: "video", src: "https://videos.pexels.com/video-files/38103133/16177830_1920_1080_50fps.mp4", poster: "https://images.pexels.com/videos/38103133/pexels-photo-38103133.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Club peak, hands up", band: "Neon Palms", bandId: "neon-palms", category: "Corporate", genre: "DJ & Live Sax", location: "Brisbane", duration: "0:17" },
  { id: "g18", type: "photo", src: px(1835656, "fit=crop&h=800&w=1200"), title: "Ceremony on the harbour", band: "Azure Coast", bandId: "azure-coast", category: "Weddings", genre: "Acoustic & Folk", location: "Sydney Harbour" },
  { id: "g19", type: "video", src: "https://videos.pexels.com/video-files/9481007/9481007-uhd_3840_2160_24fps.mp4", poster: "https://images.pexels.com/videos/9481007/pexels-photo-9481007.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200", title: "Drum breakdown, encore", band: "True North", bandId: "true-north", category: "Private Parties", genre: "Country & Folk", location: "Hunter Valley", duration: "0:16" },
  { id: "g20", type: "photo", src: px(8043988, "fit=crop&h=1000&w=700"), title: "The red dress set", band: "Honey & Smoke", bandId: "honey-and-smoke", category: "Corporate", genre: "Soul & Motown", location: "Crown Melbourne" },
  { id: "g21", type: "photo", src: px(27379787, "fit=crop&h=800&w=1200"), title: "Guests in full swing", band: "Golden Age Big Band", bandId: "golden-age-big-band", category: "Private Parties", genre: "Big Band", location: "The Ivy Ballroom" },
  { id: "g22", type: "video", src: "https://videos.pexels.com/video-files/7502883/7502883-hd_1080_1920_30fps.mp4", poster: "https://images.pexels.com/videos/7502883/adult-band-bass-guitar-beach-7502883.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=630", title: "Barefoot beach session", band: "Azure Coast", bandId: "azure-coast", category: "Private Parties", genre: "Acoustic & Folk", location: "Wategos Beach", duration: "0:16" },
  { id: "g23", type: "photo", src: px(17116018, "fit=crop&h=800&w=1200"), title: "Arena moment", band: "Midnight Parade", bandId: "midnight-parade", category: "Venues & Clubs", genre: "Party & Covers", location: "Forum Melbourne" },
  { id: "g24", type: "photo", src: px(10360901, "fit=crop&h=800&w=1200"), title: "Long-table celebration", band: "True North", bandId: "true-north", category: "Weddings", genre: "Country & Folk", location: "Adams Peak" },
];

/* ============================ SITE CONTENT ============================ */

export const GENRES = [
  "Jazz & Swing",
  "Soul & Motown",
  "Party & Covers",
  "Acoustic & Folk",
  "Classical & Strings",
  "Indie & Folk",
  "DJ & Live Sax",
  "Country & Folk",
  "Big Band",
];

export const REGIONS = ["NSW", "VIC", "QLD", "WA", "SA"];

export const EVENT_TYPES = ["Wedding", "Corporate event", "Private party", "Venue / residency"];

export const ADD_ONS = [
  { id: "ao-ceremony", name: "Ceremony performance", price: 420, desc: "A live acoustic set as guests arrive and you walk the aisle." },
  { id: "ao-extra", name: "Extra 60-minute set", price: 495, desc: "Keep the dancefloor open another full hour." },
  { id: "ao-mc", name: "MC & formalities", price: 290, desc: "A polished host for entrances, speeches and announcements." },
  { id: "ao-song", name: "Bespoke song arrangement", price: 150, desc: "Your special song, learned and arranged by the band." },
  { id: "ao-early", name: "Early bump-in", price: 180, desc: "Setup complete 3+ hours before guest arrival." },
];

export const TESTIMONIALS = [
  {
    quote: "Encore found us the band we didn't know existed. The booking flow was so smooth I did it between meetings, and Pearl & the band made our gala feel like the Met. The payment protection meant zero sleepless nights.",
    name: "Daniel Kim",
    role: "Head of Events, Meridian Group",
    event: "Corporate gala — Crown Melbourne",
    avatar: "https://images.pexels.com/photos/28589292/pexels-photo-28589292.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=160&w=160",
    rating: 5,
    band: "Honey & Smoke",
  },
  {
    quote: "I'd been quoted horror stories about hiring bands — vague contracts, cash on the night. This was the opposite: verified reviews, a clear deposit, balance auto-scheduled. And the band? Our guests are still talking about the horns.",
    name: "Charlotte Whitfield",
    role: "Bride, November 2025",
    event: "Wedding — Stones of the Yarra Valley",
    avatar: "https://images.pexels.com/photos/36093241/pexels-photo-36093241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=160&w=160",
    rating: 5,
    band: "Honey & Smoke",
  },
  {
    quote: "For my 70th I wanted proper jazz, not a playlist. The band learned my late husband's favourite song and played it as the sun set. I booked everything myself online — my grandchildren couldn't believe it.",
    name: "Margaret Hollis",
    role: "Birthday celebrant",
    event: "70th birthday — Private estate, Bowral",
    avatar: "https://images.pexels.com/photos/8727573/pexels-photo-8727573.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=160&w=160",
    rating: 5,
    band: "The Velvet Hour",
  },
];

export const FAQS = [
  {
    q: "How far in advance should I book a band?",
    a: "For Saturdays between September and April, Australia's best bands book out 9–14 months ahead — we recommend reserving your date as soon as your venue is confirmed. That said, our roster covers most weekends, and short-notice events (even 2–3 weeks out) are often possible. A 20% deposit officially locks your date; nothing is held without it.",
  },
  {
    q: "How do payments and deposits work?",
    a: "Every booking is secured with a 20% deposit paid by card through our PCI-DSS Level 1 payment partner. The remaining 80% balance is automatically scheduled for 14 days before your event — you can pay it early, split it, or pay in full upfront if you prefer. Funds are held in escrow and only released to the artist after your event, so your money is protected end-to-end. Tax invoices with GST are issued for every payment.",
  },
  {
    q: "Can the band learn our first dance or a special song?",
    a: "Yes — almost every band on the roster will learn one special request for Signature packages and above (it's included). Additional songs can be arranged for a small fee, typically $150 per song. We recommend locking requests in at least 4 weeks before the event so the band has time to arrange and rehearse properly.",
  },
  {
    q: "What happens if a band member gets sick?",
    a: "This is exactly why Encore exists. Every booking includes our Performance Guarantee: professional deputy ('dep') musicians on call for every lineup, and if an entire band were ever unable to perform, we would provide an equivalent or better act from the roster — or a full refund, immediately. In 2,400+ events, no client has ever been left without music.",
  },
  {
    q: "Do bands travel to regional venues?",
    a: "Absolutely — much of our calendar is regional. Each band lists a travel radius where transport is included; beyond that, travel is quoted transparently at booking (typically mileage plus accommodation for late finishes over 3 hours from home base). You'll always see the full, final price before you pay anything.",
  },
  {
    q: "What do bands need at the venue?",
    a: "Standard requirements are a level performance area (4×3m for a 5-piece), access to power, and cover if outdoors. Full production (PA and lighting) is included in every package — your band liaises with the venue directly on logistics, meals and load-in times, so you never have to play middle-person.",
  },
];

export const VENUES = [
  "The Calile Hotel",
  "Stones of the Yarra Valley",
  "Bennelong",
  "Crown Melbourne",
  "The Grounds of Alexandria",
  "Mount Lofty House",
  "Taronga Centre",
  "Brokenwood Wines",
  "Doltone House",
  "The Star Gold Coast",
  "COMO The Treasury",
  "Fig Tree Byron Bay",
];

/* ---------- helpers ---------- */

export const fmtAUD = (n: number) =>
  "$" + n.toLocaleString("en-AU", { maximumFractionDigits: 0 });

export const getBand = (id: string) => BANDS.find((b) => b.id === id);

export const HOME_HERO_IMAGES = {
  main: px(10360899, "fit=crop&h=1000&w=1500"),
  alt1: px(27379788, "fit=crop&h=700&w=1000"),
  alt2: px(8043988, "fit=crop&h=900&w=650"),
  trust: px(28123410, "fit=crop&h=900&w=1300"),
};
