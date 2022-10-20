import type { NextPage } from 'next';
import { collection, query, where } from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { app, firestore } from '../firebase/firebaseClient';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import Testimony_Form from "../components/Testimony_Form";

const auth = getAuth(app);

const TestimonyWorkflow: NextPage = () => {

  const [user] = useAuthState(auth);

  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'draft-testimony'),
      where("status", "==", user ? user.email : "")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

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
                    <br />
                    <div>
                      {JSON.stringify(doc.data())},{' '}
                    </div>
                    <br/>
                    <div>Bill: draft-testimony/{doc.data().bill}-testimony</div>
                    <Testimony_Form testimonyDocument={doc} />
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
