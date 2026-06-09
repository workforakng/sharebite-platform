import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await req.json();
  
  // Find donation and verify ownership
  const donation = await prisma.donation.findUnique({ where: { id } });
  if (!donation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  // Admin can edit everything, Donor can only edit their own
  const isAdmin = session.user.role === 'ADMIN';
  if (!isAdmin && donation.donorId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.donation.update({
    where: { id },
    data: {
      title: body.title,
      type: body.type,
      quantity: body.quantity,
      expires: new Date(body.expires),
      location: body.location,
      notes: body.notes
    }
  });

  return NextResponse.json(updated);
}
