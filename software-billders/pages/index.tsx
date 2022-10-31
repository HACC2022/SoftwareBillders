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
import { Header, Icon, Menu } from 'semantic-ui-react';
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
          <span>
            Collection:{' '}
            {value.docs.map((doc) => (
              <div key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
              </div>
            ))}
          </span>
        )}
      </p>
    </div>
  )
}

export default Home
