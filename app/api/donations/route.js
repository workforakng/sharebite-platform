import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET() {
  const donations = await prisma.donation.findMany({
    include: {
      donor: { select: { name: true, email: true } },
      claimer: { select: { name: true, email: true } }
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
  const { title, type, quantity, expires, pickupStart, pickupEnd, location, notes } = body;

  const donation = await prisma.donation.create({
    data: {
      title,
      type,
      quantity,
      expires: new Date(expires),
      pickupStart: pickupStart ? new Date(pickupStart) : null,
      pickupEnd: pickupEnd ? new Date(pickupEnd) : null,
      location,
      notes: notes || null,
      donorId: session.user.id
    }
  });

  return NextResponse.json(donation, { status: 201 });
}
