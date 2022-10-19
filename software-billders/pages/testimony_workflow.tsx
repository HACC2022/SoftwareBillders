import type { NextPage } from 'next';
import {
  collection,
  doc,
  query,
  setDoc,
  where
} from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import {app, firestore} from '../firebase/firebaseClient';
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "@firebase/auth";

const auth = getAuth(app);

const TestimonyWorkflow: NextPage = () => {

  const [user, authLoading, authError] = useAuthState(auth);

  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'draft-testimony'),
      where("status", "==", user ? user.email : "")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

  const assignBill = (name: String) => {
    setDoc(doc(firestore, 'draft-testimony/HB1520-testimony'), {status: name}, {merge: true})
  }

  const writeTestimony = (draftedTestimony: String, sendTo: String) => {
    setDoc(doc(firestore, 'draft-testimony/HB1520-testimony'), {status: sendTo, content: draftedTestimony}, {merge: true})
  }

  return (
    <div>
      <span>Logged in user: {user ? user.email : "None"}</span>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <div>
            <div>
              Collection:{' '}
                {value.docs.map((doc) => (
                  <div key={doc.id}>
                    <div>
                      {JSON.stringify(doc.data())},{' '}
                    </div>
                    <br/>
                    <div>Bill: {doc.data().bill}</div>
                    <button onClick={() => assignBill('John Smith')}>Secretary: Assign Bill to John Smith</button>
                    <button onClick={() => writeTestimony('This is example testimony','John Smith')}>Submit Testimony for Review</button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </p>
    </div>
  )
}

export default TestimonyWorkflow;
