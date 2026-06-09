import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await req.json();
  if (!['COLLECTED', 'CANCELLED', 'AVAILABLE'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const donation = await prisma.donation.findUnique({ where: { id: params.id } });

  // Only the donor or admin can cancel/complete, or the claimer can mark collected
  if (donation.donorId !== session.user.id && donation.claimerId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized to change this status' }, { status: 403 });
  }

  const updated = await prisma.donation.update({
    where: { id: params.id },
    data: { status, claimerId: status === 'AVAILABLE' ? null : donation.claimerId }
  });

  return NextResponse.json(updated, { status: 200 });
}
