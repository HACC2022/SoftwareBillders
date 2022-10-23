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
import styles from '../styles/Home.module.css'
import SignIn from './login'
import { Container } from 'semantic-ui-react';

const Bills: NextPage = () => {
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
    <Container>
        {SignIn()}
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
            <div>
                <h1 className={styles.title}>Bills</h1>
                <table>
                    <tr>
                        <th>Bills</th>
                        <th>title</th>
                        <th>Bills</th>
                        <th>Bills{' '}</th>
                        <th>Bills{' '}</th>
                    </tr>
                    {value.docs.map((doc) => (
                    <tr key={doc.id}>
                        <td>{doc.data().code}</td>
                        <td>{doc.data().measureTitle}</td>
                        <td>{new Date(doc.data().lastUpdated * 1000).toString()}</td>
                    </tr>
                    ))}
                </table>
            </div>
        )}
      </p>
    </Container>
  )
}

export default Bills
