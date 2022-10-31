import type { NextPage } from 'next';
import { collection, doc, getDocs, limit, query, setDoc, where} from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { app, firestore } from '../firebase/firebaseClient';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import Link from "next/link";
import {Button, Form, Header, Icon, Menu} from "semantic-ui-react";
import {useState} from "react";
import Organization_Form from "../components/Organization_Form";
import SignIn from './login';

const auth = getAuth(app);

const Mangage_Org: NextPage = () => {

  const [user] = useAuthState(auth);

  const addToAdmin = async (documentPath: string, organizationName: string) => {
    const querySnapshot = await getDocs(query(collection(firestore, 'Organizations'), where("organizationName", "==", organizationName), limit(1)));
    if (querySnapshot.size === 0) {
      setDoc(doc(firestore, documentPath), {organizationName: organizationName, admin: [user?.email], user: []});
    }
    else {
      console.warn("ORGANIZATION ERROR ALREADY EXISTS");
    }
  }

  const addToUser = async (documentPath: string, organizationName: string) => {
    const querySnapshot = await getDocs(query(collection(firestore, 'Organizations'), where("organizationName", "==", organizationName), limit(1)));
    if (querySnapshot.size === 0) {
      setDoc(doc(firestore, documentPath), {organizationName: organizationName, admin: [user?.email], user: []});
    }
    else {
      console.warn("ORGANIZATION ERROR ALREADY EXISTS");
    }
  }

  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'Organizations'),
      where("admin", "array-contains", user ? user.email : "")
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('organizationName', organizationName);
    addToAdmin(`Organizations/${organizationName}-org`, organizationName)
  };

  return (
    <div>
      <Menu inverted borderless fluid id='hearing-menu'>
        <Menu.Item>
          <Header as='h1' inverted><Icon name='folder open outline'/> DOE Bill Tracker</Header>
        </Menu.Item>

        <Menu.Item></Menu.Item><Menu.Item></Menu.Item>
        <Menu.Item>
          <Header as='h2' inverted><Link href="/">Home</Link></Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/testimony_workflow">Testimony Workflow</Link> </Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/hearingsList">Hearings</Link> </Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/Create_Org">Create Organization</Link> </Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/Manage_Org">Manage Organization</Link> </Header>
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item>
            {SignIn()}
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <h1>Manage Organization</h1>
      {user ? <span>Logged in user: {user.email}</span> : <span>You are not signed in, please <Link href="/login">sign in</Link>.</span>}
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            {value.docs.map((doc) => (
              <div key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
                <Organization_Form organizationDocument={doc}/>
              </div>
            ))}
          </span>
        )}
      </p>
    </div>
  )
}

export default Mangage_Org;
