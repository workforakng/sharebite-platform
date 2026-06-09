import { prisma } from '../../../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { sendEmail } from '../../../../../lib/email';

export async function POST(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role === 'DONOR') return NextResponse.json({ error: 'Donors cannot claim food' }, { status: 403 });

  const donation = await prisma.donation.findUnique({ 
    where: { id: params.id },
    include: { donor: true } 
  });

  if (!donation) return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
  if (donation.status !== 'AVAILABLE') return NextResponse.json({ error: 'Donation no longer available' }, { status: 409 });

  const updated = await prisma.donation.update({
    where: { id: params.id },
    data: { status: 'CLAIMED', claimerId: session.user.id }
  });

  // Send Mock Emails
  await sendEmail({
    to: donation.donor.email,
    subject: `Your donation "${donation.title}" has been claimed!`,
    text: `Great news! ${session.user.name} has claimed your donation and will pick it up soon. Please have it ready at the agreed location: ${donation.location}.`
  });

  await sendEmail({
    to: session.user.email,
    subject: `Claim Confirmation: ${donation.title}`,
    text: `You successfully claimed "${donation.title}" from ${donation.donor.name}. Please collect it by ${new Date(donation.expires).toLocaleString()} at ${donation.location}.`
  });

  return NextResponse.json(updated, { status: 200 });
}
