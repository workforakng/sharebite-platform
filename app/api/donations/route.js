import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NGOMatchingAgent } from '../../../lib/ngo-matching-agent';
import { getCoordinatesFromLocation } from '../../../lib/geo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const donations = await prisma.donation.findMany({
    include: {
      donor: { select: { name: true, email: true } },
      matches: {
        include: {
          ngo: {
            include: {
              user: { select: { name: true, email: true } }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(donations, { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'DONOR') return NextResponse.json({ error: 'Only donors can create donations' }, { status: 403 });

  const body = await req.json();
  const { title, type, quantity, foodType, expires, pickupStart, pickupEnd, location, notes, latitude, longitude } = body;

  // Get coordinates from location if not provided
  let coords = { latitude, longitude };
  if (!latitude || !longitude) {
    coords = await getCoordinatesFromLocation(location);
  }

  const donation = await prisma.donation.create({
    data: {
      title,
      type,
      quantity: parseInt(quantity),
      foodType: foodType || 'NON_PERISHABLE',
      expiryDate: new Date(expires),
      pickupStart: pickupStart ? new Date(pickupStart) : null,
      pickupEnd: pickupEnd ? new Date(pickupEnd) : null,
      address: location,
      latitude: coords.latitude,
      longitude: coords.longitude,
      description: notes || null,
      donorId: session.user.id,
      status: 'PENDING'
    }
  });

  // Trigger AI matching and notification (async, don't wait)
  // Fire and forget - don't block the response
  NGOMatchingAgent.processNewDonation(donation).catch(err => {
    console.error('AI matching failed:', err);
  });

  return NextResponse.json(donation, { status: 201 });
}