import type { NextPage } from 'next';
import { initializeApp } from 'firebase/app';
import {
  collection,
  // connectFirestoreEmulator,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc
} from "@firebase/firestore";
import measures from './measures.json';
import { useCollection } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrDUcny-LLnVHbJDzh_aWFCLgfuS56CDw",
  authDomain: "software-billders.firebaseapp.com",
  projectId: "software-billders",
  storageBucket: "software-billders.appspot.com",
  messagingSenderId: "605421709546",
  appId: "1:605421709546:web:aa098beface8250c764f93"
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

// TODO: Get emulator working, I could not figure out how to get it working
// connectFirestoreEmulator(db, 'localhost', 8080)

// If collection is empty, it will write 4000+ documents to the measures collection
async function writeToMeasuresCollection() {
  const querySnapshot = await getDocs(query(collection(db, 'measures'), limit(1)));
  if (querySnapshot.size === 0) {
    console.log('empty collection was found, generating data. This will take a while (10 mins).');
    measures.forEach((measure: { code: String; }) => {
      const documentKey = doc(db, `measures/${measure.code}`);
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
      collection(db, 'measures'),
      limit(10)
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true},
    });

  return (
    <div>
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
