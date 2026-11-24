export interface EventLocation {
  title: string;
  subtitle: string;
  time: string;
  venue: string;
  address: string;
  city: string;
  description: string;
  googleMapsUrl: string;
  imageUrl: string;
}

export interface StoryTimelineItem {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  clabeOrCbu: string;
  aliasOrReference?: string;
}

export interface ExternalRegistry {
  storeName: string;
  logoUrl?: string;
  registryUrl: string;
}

export interface DecorativeAssets {
  separators: string[];
  backgrounds: string[];
  corners: string[];
  elements: string[];
}

export interface WeddingConfig {
  coupleNames: {
    bride: string;
    groom?: string;
    initials: string;
  };
  quinceanera: {
    fullName: string;
    firstName: string;
    shortName: string;
    initials: string;
    mother: string;
    motherTribute: string;
    godparents?: string;
    dressColor: string;
    interests?: string[];
    phone?: string;
  };
  weddingDate: string; // ISO date format for countdown: YYYY-MM-DDTHH:mm:ss
  formattedDate: string;
  tagline: string;
  hashtag: string;
  heroImage: string;
  bgMusicUrl: string;
  songTitle: string;
  ceremony?: EventLocation;
  reception: EventLocation;
  story: StoryTimelineItem[];
  itinerary: ScheduleItem[];
  gallery: { id: string; url: string; caption: string }[];
  decorativeAssets: DecorativeAssets;
  dressCode: {
    style: string;
    description: string;
    forbiddenColors: string[];
    suggestedPalette: string[];
  };
  gifts: {
    message: string;
    envelopeNote?: string;
    bankAccount?: BankAccount;
    externalRegistries?: ExternalRegistry[];
  };
  notes: {
    adultsOnly: boolean;
    transportAvailable: boolean;
    recommendations: string[];
  };
}
