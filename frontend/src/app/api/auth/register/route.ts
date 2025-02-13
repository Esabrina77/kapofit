import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Appel à notre API backend
    const response = await fetch('http://localhost:3002/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        // Pas de firebaseId ici, il sera généré côté backend
        imageUrl: body.imageUrl
      })
    });

    if (!response.ok) {
      throw new Error('Erreur création utilisateur');
    }

    const user = await response.json();
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur route register:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
} 