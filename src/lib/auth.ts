import { auth } from "$lib/firebase";

import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";


export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    console.log(user)
}
