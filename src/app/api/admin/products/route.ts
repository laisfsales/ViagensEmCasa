import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/services/database/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const productsCollection = firestore.collection('products');
    const productsSnapshot = await productsCollection.get();

    const products = await Promise.all(productsSnapshot.docs.map(async (doc) => {
      const productData = doc.data();
      const userId = productData.userId;

      // Verifique se o userId está definido e não é vazio
      if (!userId) {
        console.warn(`Produto ${doc.id} não tem userId associado.`);
        return {
          id: doc.id,
          ...productData,  // Certifique-se que o productData inclua imageUrls
        };
      }

      console.log(`Fetching user with ID: ${userId}`);
      const userDoc = await firestore.collection('users').doc(userId).get();
      const username = userDoc.exists ? userDoc.data()?.username : 'Usuário desconhecido';

      console.log(`Fetching seller request for user ID: ${userId}`);
      const sellerRequestSnapshot = await firestore.collection('sellerRequests')
        .where('userId', '==', userId)
        .get();
      const companyName = sellerRequestSnapshot.empty ? 'N/A' : sellerRequestSnapshot.docs[0].data()?.companyName;

      // Garantir que o campo imageUrls esteja presente no retorno
      return {
        id: doc.id,
        ...productData,  // Aqui productData inclui imageUrls se estiver presente no Firestore
        username,
        companyName,
      };
    }));

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
