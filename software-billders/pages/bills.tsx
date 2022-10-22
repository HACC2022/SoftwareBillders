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
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../firebase/firebaseClient'

const Home: NextPage = () => {
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
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Bills:{' '}
            {value.docs.map((doc) => (
              <div key={doc.id}>
                {doc.data().code},{doc.data().measureTitle},{new Date(doc.data().lastUpdated * 1000).toString()}
              </div>
            ))}
          </span>
        )}
      </p>
    </div>
  )
}

export default Home
