import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const history = await prisma.donation.findMany({
    where: {
      status: 'COLLECTED'
    },
    include: {
      donor: { select: { name: true } },
      claimer: { select: { name: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });
  return NextResponse.json(history, { status: 200 });
}
