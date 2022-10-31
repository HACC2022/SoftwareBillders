import type {NextPage} from 'next';
import {initializeApp} from 'firebase/app';
import {
  collection,
  where,
  // connectFirestoreEmulator,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  query,
  getDoc,
  setDoc
} from "@firebase/firestore";
import hearings from './hearings.json';
import {useCollection, useDocumentOnce} from 'react-firebase-hooks/firestore';
import {Container, Segment, Header, Table, Menu, Label, Icon, Pagination, Grid, Loader, Dimmer, Search, Select, Button} from 'semantic-ui-react';
import {firestore} from "../firebase/firebaseClient";
import {useState, useEffect} from "react";
import SignIn from "./login";
import 'firebase/firestore';
import styles from '../styles/Home.module.css'
import { QuerySnapshot } from 'firebase/firestore';
import Link from 'next/link';

// If collection is empty, it will write 4000+ documents to the hearings collection
async function writeToHearingsCollection() {
  const querySnapshot = await getDocs(query(collection(firestore, 'hearings'), limit(1)));
  if (querySnapshot.size === 0) {
    console.log('empty collection was found, generating data. This will take a while (10 mins).');
    // @ts-ignore
    hearings.forEach((hearing: { measureNumber: String; }) => {
      const documentKey = doc(firestore, `hearings/${hearing.measureNumber}`);
      setDoc(documentKey, hearing);
    });
  }
  else {
    console.log('non-empty collection');
  }
}

async function loadMeasuresCollection() {
 // const docRef = doc(firestore, "measures");
  const measuresSnapshot = await getDocs(query(collection(firestore, 'measures')));

  if (measuresSnapshot.size === 0) {
    console.log("Measures loaded");
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function getMeasure(measureId: number) {
  const [value2, loading2, error2] = useCollection(
  query(
    collection(firestore, 'measures'),
    where("measureNumber", "==", measureId)
  ),
  {
    snapshotListenOptions: {includeMetadataChanges: true},
  }
  );
  return value2;
}

const HearingsList: NextPage = () => {

  const filterOptions = [
    { key: 'dt', value: 'dt', text: 'Date' },
    { key: 'tp', value: 'tp', text: 'Type' }
  ];

  // If measures collection is empty, hydrate database with measures.json
  writeToHearingsCollection();
  // This will query for 10 documents, increase this by changing the limit()
  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'hearings'),
      limit(10)
    ),
    {
      snapshotListenOptions: {includeMetadataChanges: true},
    });

  const [value2, loading2, error2]  = useCollection(
    query(
      collection(firestore, 'measures'),
      where("measureNumber", "in", [2345, 438, 1942, 2248, 2456, 2457])
    ),
    {
      snapshotListenOptions: {includeMetadataChanges: true},
    });

  return (
    <div>
      {loading &&
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      }
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

      <Grid container>
        <Grid.Row>
          <Grid.Column id='hearing-column'>
            <Header as='h2' block className={styles.mainHeader}>Hearings</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
        <Grid.Column floated='left' id='filter-column'>
            <Select placeholder='Select your country' options={filterOptions}/>
          </Grid.Column>
          <Grid.Column floated='left'>
            <Button href="/Hearings">Calendar</Button>
          </Grid.Column>
          <Grid.Column id='filter-column'>
            <Search
              loading={loading}
              placeholder='Search...'
            />
          </Grid.Column>

        </Grid.Row>

        <Grid.Row>
          <Grid.Column id='hearing-column'>
            <Table celled selectable unstackable striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                  <Table.HeaderCell>Room</Table.HeaderCell>
                  <Table.HeaderCell>Hearing Comittee</Table.HeaderCell>
                  <Table.HeaderCell>Bill #</Table.HeaderCell>
                  <Table.HeaderCell>Bill/Resolution</Table.HeaderCell>
                  <Table.HeaderCell>Office</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                  <Table.HeaderCell>Committee Referral</Table.HeaderCell>
                  <Table.HeaderCell>Hearing Notification</Table.HeaderCell>
                  <Table.HeaderCell>Last Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {value?.docs?.map((doc) => (

                  <Table.Row key={doc.id}>
                    <Table.Cell>{doc.data().datetime.substring(10,28)}</Table.Cell> {/*Date*/}
                    <Table.Cell>{doc.data().datetime.substring(doc.data().datetime.length - 7)}</Table.Cell> {/*Time*/}
                    <Table.Cell>{doc.data().room.substring(16,20)}</Table.Cell> {/*Room*/}
                    <Table.Cell>{doc.data().room.substring(0,10)}</Table.Cell> {/*Hearing Comittee*/}
                    <Table.Cell>{value2 && (
                      <span>
                        {value2.docs[0].data().code}
                       </span>
                    )}</Table.Cell> {/*Bill #*/}
                    <Table.Cell>{doc.data().description}</Table.Cell> {/*Bill/Resolution*/}
                    <Table.Cell>{doc.data().office}</Table.Cell> {/*Office*/}
                    <Table.Cell>{doc.data().action}</Table.Cell> {/*Action*/}
                    <Table.Cell>{value2 && (
                      <span>
                        {value2.docs[0].data().currentReferral}
                       </span>
                    )}</Table.Cell> {/*Committee Referral*/}
                    <Table.Cell>{doc.data().notification}</Table.Cell> {/*Hearing Notification*/}
                    <Table.Cell>{value2 && (
                      <span>
                        {value2.docs[0].data().status}
                       </span>
                    )}</Table.Cell> {/*Last Status*/}
                  </Table.Row>
                  ))}
              </Table.Body>

              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell colSpan='14'>
                    {/*TODO: Pagination*/}
                    <Pagination
                      boundaryRange={0}
                      defaultActivePage={1}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      siblingRange={1}
                      totalPages={10}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default HearingsList
