import type { Apartment, Booking, Location } from '@/types';
import { whatsappLink } from '@/lib/utils';

interface TemplateContext {
  apartment: Apartment;
  booking: Booking;
  location: Location | null;
  nextBooking?: Booking | null;
}

export function buildImmediateCheckoutAlert({ apartment, location }: TemplateContext): string {
  const locationName = location?.name ?? '';
  const aptNo = apartment.apt_number ?? apartment.name;
  return `${locationName} (${aptNo}) تم خروج العميل ✅`;
}

export function buildCheckoutFollowup({ apartment, location }: TemplateContext): string {
  const locationApt = `${location?.name ?? ''} - ${apartment.name}`;
  return [
    'السلام عليكم ورحمة الله وبركاته',
    'كيف حالك 🌹',
    `بكلمك بخصوص الشقة ${locationApt}`,
    'هل تم مغادرة الشقة ؟',
  ].join('\n');
}

export function sendWhatsApp(phone: string, text: string) {
  const url = phone ? whatsappLink(phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = url;
}

export function sendWhatsAppText(text: string) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) window.location.href = url;
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
