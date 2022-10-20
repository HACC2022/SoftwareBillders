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
import {useState} from "react";

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

  const assignBill = (documentPath: string, name: string) => {
    setDoc(doc(firestore, documentPath), {status: name}, {merge: true})
  }

  const writeTestimony = (documentPath: string, testimonyContent: string, sendTo: string) => {
    setDoc(doc(firestore, documentPath), {status: sendTo, content: testimonyContent}, {merge: true})
  }

  const [assignedPerson, setAssignedPerson] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    console.log('assignedPerson', assignedPerson);
    console.log('testimonyContent', testimonyContent);
    writeTestimony('draft-testimony/HB1520-testimony',testimonyContent,assignedPerson);
    setAssignedPerson('');
    setTestimonyContent('');
  };

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
                    <div>Bill: draft-testimony/{doc.data().bill}-testimony</div>
                    <form onSubmit={handleSubmit}>
                      <span>Assign testimony to person (email currently but can be changed): </span>
                      <input
                        itemID={`assignedPerson-${doc.id}`}
                        type="text"
                        onChange={event => setAssignedPerson(event.target.value)}
                        value={assignedPerson}
                      />
                      <br/>
                      <span>Testimony content (any text can be put here): </span>
                      <input
                        itemID={`testimony-content-${doc.id}`}
                        type="text"
                        value={testimonyContent}
                        onChange={event => setTestimonyContent(event.target.value)}
                      />
                      {/*How does this input hidden behave, we want to get the document path for each form on the page*/}
                      <input
                        itemID={`hidden-${doc.id}`}
                        type="hidden"
                        value={`draft-testimony/${doc.data().bill}-testimony`}
                      />
                      <br/>
                      <button type="submit" itemID={`submit-${doc.id}`}>Submit form</button>
                    </form>
                    <button onClick={() => assignBill('draft-testimony/HB1520-testimony', 'John Smith')}>Secretary: Assign Bill to John Smith</button>
                    <button onClick={() => writeTestimony('draft-testimony/HB1520-testimony', 'This is example testimony','John Smith')}>Submit Testimony for Review</button>
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
