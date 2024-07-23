import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase';


interface User {
  id: string;
  email: string;
  password: string;
  role: string; 
}


export const getUserFromDb = async (email: string): Promise<User | null> => {
  try {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; 
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as User;

    return {
      id: userDoc.id,
      email: userData.email,
      password: userData.password,
      role: userData.role,

    } as User;
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    throw new Error('Error getting user from Firestore');
  }
};
