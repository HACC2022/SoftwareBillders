import type { NextPage } from 'next';
import { collection, query, where } from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { app, firestore } from '../firebase/firebaseClient';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import Testimony_Form from "../components/Testimony_Form";
import Link from "next/link";
import {Header, Icon, Menu } from 'semantic-ui-react';
import styles from '../styles/Home.module.css'
import SignIn from './login';

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

      <h1 className={styles.testimonyHeader}>Write and Manage Testimony Page </h1>
      {user ? <span>Logged in user: {user.email}</span> : <span>You are not signed in, please <Link href="/login">sign in</Link>.</span>}
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <div>
            <div>
                {value.docs.map((doc) => (
                  <div key={doc.id}>
                    <br/>
                    <h3>Bill: draft-testimony/{doc.data().bill}-testimony</h3>
                    <p>{JSON.stringify(doc.data())}</p>
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
