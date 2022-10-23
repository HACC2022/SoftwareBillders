import type { NextPage } from 'next';
import { collection, doc, getDocs, limit, query, setDoc, where} from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { app, firestore } from '../firebase/firebaseClient';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import Link from "next/link";
import {Button, Form} from "semantic-ui-react";
import {useState} from "react";

const auth = getAuth(app);

const Create_Org: NextPage = () => {

  const createOrganization = async (documentPath: string, organizationName: string) => {
    const querySnapshot = await getDocs(query(collection(firestore, 'Organizations'), where("organizationName", "==", organizationName), limit(1)));
    if (querySnapshot.size === 0) {
      setDoc(doc(firestore, documentPath), {organizationName: organizationName, admin: [user?.email], user: []});
      setOrganizationName('');
    }
    else {
      console.warn("ORGANIZATION ERROR ALREADY EXISTS");
    }
  }

  const [user] = useAuthState(auth);

  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'draft-testimony'),
      where("status", "==", user ? user.email : "")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('organizationName', organizationName);
    createOrganization(`Organizations/${organizationName}-org`, organizationName)
  };

  return (
    <div>
      <h1>Create Organization</h1>
      {user ? <span>Logged in user: {user.email}</span> : <span>You are not signed in, please <Link href="/login">sign in</Link>.</span>}
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <div>
            <br/>
            <Form onSubmit={handleSubmit}>
              <Form.Field>
                <label>Organization Name</label>
                <input
                  placeholder='Name'
                  itemID='org-name'
                  onChange={event => setOrganizationName(event.target.value)}
                  value={organizationName}
                />
              </Form.Field>
              <Button type='submit' itemID='submit-org'>Submit</Button>
            </Form>
          </div>
        )}
      </p>
    </div>
  )
}

export default Create_Org;
