import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !['DONOR', 'NGO', 'VOLUNTEER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user with role and authProvider
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        role,
        authProvider: 'google'
      }
    });

    return NextResponse.json({ 
      message: 'Profile completed successfully',
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }
    }, { status: 200 });

  } catch (error) {
    console.error('Complete profile error:', error);
    return NextResponse.json({ error: 'Failed to complete profile' }, { status: 500 });
  }
}