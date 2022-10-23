import {useSignInWithEmailAndPassword, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import { auth } from "../firebase/firebaseClient";
import { Button, Icon} from "semantic-ui-react";
import { useState} from "react";

function SignIn() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    // they just don't get to use another sign in method sucks :)
    return (
        <div>
            <Button color='google plus' onClick={() => signInWithGoogle()}>
                <Icon name='google plus' /> Sign in with Google
            </Button>
        </div>
    );
}

export default SignIn