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
import { Container, Table } from 'semantic-ui-react';

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
    <Container>
        {SignIn()}
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
    </Container>
  )
}

export default Bills
