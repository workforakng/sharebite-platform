import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = parseInt(searchParams.get('limit')) || 50;
  const offset = parseInt(searchParams.get('offset')) || 0;

  const where = {
    userId: session.user.id,
    ...(unreadOnly && { read: false })
  };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false }
    })
  ]);

  return NextResponse.json({ notifications, unreadCount }, { status: 200 });
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { notificationId, markAllRead } = body;

  if (markAllRead) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true }
    });
    return NextResponse.json({ success: true });
  }

  if (!notificationId) {
    return NextResponse.json({ error: 'notificationId required' }, { status: 400 });
  }

  const notification = await prisma.notification.update({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true }
  });

  return NextResponse.json(notification, { status: 200 });
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get('id');

  if (!notificationId) {
    return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
  }

  await prisma.notification.delete({
    where: { id: notificationId, userId: session.user.id }
  });

  return NextResponse.json({ success: true }, { status: 200 });
}