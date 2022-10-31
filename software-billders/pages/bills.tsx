import type { NextPage } from 'next';
import {
  collection,
  // connectFirestoreEmulator,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  startAfter,
  orderBy
} from "@firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase/firebaseClient'
import styles from '../styles/Home.module.css'
import SignIn from './login'
import { Container, Header, Icon, Menu, Table } from 'semantic-ui-react';
import Link from 'next/link';

const Bills: NextPage = () => {
  // This will query for 10 documents, increase this by changing the limit()
  const billsPerPage = 10;
  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'measures'),
      limit(billsPerPage),
      orderBy('code'),
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
          <Header as='h2' > <Link href="/Hearings">Hearings</Link> </Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/hearingsList">Hearings List</Link> </Header>
        </Menu.Item>

        <Menu.Item>
          <Header as='h2' > <Link href="/bills">Bills</Link> </Header>
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
      
      <p>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {value && (
        <div>
          <h1 className={styles.header}>Bills</h1>
          <Table>
            <thead>
            <tr>
              <th>Code</th>
              <th>Title/Resolution</th>
              <th>Description</th>
              <th>Committee</th>
              <th>Status</th>
              <th>Last Update</th>
            </tr>
            </thead>
            <tbody>
            {value.docs.map((doc) => (
              <tr key={doc.id}>
                <td><a href={(doc.data().measurePdfUrl)} target="_blank">{doc.data().code}</a></td>
                <td>{doc.data().reportTitle}</td>
                <td>{doc.data().measureTitle}</td>
                <td>{doc.data().currentReferral}</td>
                <td>{doc.data().status}</td>
                <td>{new Date(doc.data().lastUpdated * 1000).toDateString()}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
      )}
    </p>
    </div>
  )
}

export default Bills
