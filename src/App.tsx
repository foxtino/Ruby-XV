import React, { useState } from 'react';
import { weddingData } from './data/weddingData';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { EnvelopeScreen } from './components/EnvelopeScreen';
import { MagicalParticles } from './components/MagicalParticles';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { OurStory } from './components/OurStory';
import { EventDetails } from './components/EventDetails';
import { DressCode } from './components/DressCode';
import { Gallery } from './components/Gallery';
import { GiftRegistry } from './components/GiftRegistry';
import { RsvpForm } from './components/RsvpForm';
import { Guestbook } from './components/Guestbook';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);

  return (
    <div className="min-h-screen bg-[#140407] text-[#FBF7F2] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#140407] relative">
      {/* Subtle Crimson Petals & Champagne Gold Shimmer */}
      <MagicalParticles />

      {/* Interactive 3D Crimson & Gold Animated Envelope Intro */}
      <EnvelopeScreen
        config={weddingData}
        onOpen={() => setIsInvitationOpened(true)}
      />

      {/* Top Navigation */}
      <Header />

      {/* Background Music Player (Ed Sheeran - Photograph) */}
      <AudioPlayer
        musicUrl={weddingData.bgMusicUrl}
        songTitle={weddingData.songTitle}
        autoPlayTrigger={isInvitationOpened}
      />

      {/* Hero Cover (DSC03311) & Mother Appreciation Tribute */}
      <Hero config={weddingData} />

      {/* Live Countdown to Sábado 12 de Diciembre de 2026 */}
      <Countdown
        targetDate={weddingData.weddingDate}
        formattedDate={weddingData.formattedDate}
        coupleNames={weddingData.quinceanera.fullName}
      />

      {/* Editorial Story Chapters */}
      <OurStory story={weddingData.story} />

      {/* Ceremonia Religiosa (5:30 PM) & Recepción Casino Romano (8:30 PM) */}
      <EventDetails
        ceremony={weddingData.ceremony}
        reception={weddingData.reception}
        itinerary={weddingData.itinerary}
      />

      {/* Dress Code: Negro Formal & Rojo Reservado para Ruby */}
      <DressCode
        dressCode={weddingData.dressCode}
        notes={weddingData.notes}
      />

      {/* 46-Photo Gallery with Slideshow & Fullscreen Lightbox */}
      <Gallery
        gallery={weddingData.gallery}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Gift Registry / Lluvia de Sobres y Regalos */}
      <GiftRegistry gifts={weddingData.gifts} />

      {/* RSVP Form integrated with Firebase Firestore */}
      <RsvpForm />

      {/* Real-Time Guestbook / Muro de Buenos Deseos */}
      <Guestbook />

      {/* Footer */}
      <Footer config={weddingData} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
