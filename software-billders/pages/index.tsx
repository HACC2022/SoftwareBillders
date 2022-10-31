import type { NextPage } from 'next';
import {
  collection,
  // connectFirestoreEmulator,
  doc,
  getDocs,
  limit,
  query,
  setDoc
} from "@firebase/firestore";
import measures from './measures.json';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase/firebaseClient'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import AddToCalendar from "../components/AddToCalendar";
import {Container, Header, Icon, Menu, Table } from 'semantic-ui-react';
import SignIn from './login';
// TODO: Get emulator working, I could not figure out how to get it working
// connectFirestoreEmulator(db, 'localhost', 8080)

// If collection is empty, it will write 4000+ documents to the measures collection
async function writeToMeasuresCollection() {
  const querySnapshot = await getDocs(query(collection(firestore, 'measures'), limit(1)));
  if (querySnapshot.size === 0) {
    console.log('empty collection was found, generating data. This will take a while (10 mins).');
    // @ts-ignore
    measures.forEach((measure: { code: String; }) => {
      const documentKey = doc(firestore, `measures/${measure.code}`);
      setDoc(documentKey, measure);
    });
  }
  else {
    console.log('non-empty collection');
  }
}

const Home: NextPage = () => {
  // If measures collection is empty, hydrate database with measures.json
  writeToMeasuresCollection();
  // This will query for 10 documents, increase this by changing the limit()
  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'measures'),
      limit(10)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

    const [valueHearings, loadingHearings, errorHearings] = useCollection(
      query(
        collection(firestore, 'hearings'),
        limit(30)
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

      <Container>
        {error && errorHearings && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && loadingHearings && <span>Collection: Loading...</span>}
        {value && valueHearings && (
          <div>
            <h1 className={styles.mainHeader}>Bills</h1>
            <Table>
              <thead>
              <tr>
                <th>Code</th>
                <th>Title/Resolution</th>
                <th>Description</th>
                <th>Committee</th>
                <th>Status</th>
                <th>Last Update</th>
                <th>Calendar Integration</th>
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
                  <td><AddToCalendar document={doc} /></td>
                </tr>
              ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  )
}

export default Home
