import type {NextPage} from 'next';
import {initializeApp} from 'firebase/app';
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
import {useCollection} from 'react-firebase-hooks/firestore';
import {Container, Segment, Header, Table, Menu, Label, Icon, Pagination, Grid, Loader, Dimmer, Search, Select} from 'semantic-ui-react';
import {firestore} from "../firebase/firebaseClient";
import {useState, useEffect} from "react";
import SignIn from "./login";


const HearingsList: NextPage = () => {

  const filterOptions = [
    { key: 'dt', value: 'dt', text: 'Date' },
    { key: 'tp', value: 'tp', text: 'Type' }
  ];
  // This will query for 10 documents, increase this by changing the limit()
  const [value, loading, error] = useCollection(
    query(
      collection(firestore, 'measures'),
      limit(10)
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
          <Header as='h1' inverted><Icon name='folder open outline'/>DOE Bill Tracker</Header>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            <SignIn/>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Grid container>
        <Grid.Row>
          <Grid.Column id='hearing-column'>
            <Header as='h2' block centered>Hearings</Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column >
            <Select placeholder='Select your country' options={filterOptions} />
          </Grid.Column>
          <Grid.Column >
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
                  <Table.HeaderCell>L</Table.HeaderCell>
                  <Table.HeaderCell>Hearing Comittee</Table.HeaderCell>
                  <Table.HeaderCell>Bill #</Table.HeaderCell>
                  <Table.HeaderCell>Bill/Resolution</Table.HeaderCell>
                  <Table.HeaderCell>Hearing Type</Table.HeaderCell>
                  <Table.HeaderCell>Office</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                  <Table.HeaderCell>Committee Referral</Table.HeaderCell>
                  <Table.HeaderCell>Testifier</Table.HeaderCell>
                  <Table.HeaderCell>Hearing Notification</Table.HeaderCell>
                  <Table.HeaderCell>Last Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {value?.docs?.map((doc) => (
                  <Table.Row key={doc.id}>
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Date*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Time*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*L*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Hearing Comittee*/}
                    <Table.Cell> {JSON.stringify(doc.data().code)}</Table.Cell> {/*Bill #*/}
                    <Table.Cell> {JSON.stringify(doc.data().description)}</Table.Cell> {/*Bill/Resolution*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Hearing Type*/}
                    <Table.Cell> {JSON.stringify(doc.data().currentReferral)}</Table.Cell> {/*Office*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Action*/}
                    <Table.Cell> {JSON.stringify(doc.data().currentReferral)}</Table.Cell> {/*Committee Referral*/}
                    <Table.Cell> {JSON.stringify(doc.data().testifier)}</Table.Cell> {/*Testifier*/}
                    <Table.Cell> {JSON.stringify(doc.data().year)}</Table.Cell> {/*Hearing Notification*/}
                    <Table.Cell> {JSON.stringify(doc.data().status)}</Table.Cell> {/*Last Status*/}
                  </Table.Row>
                ))}
                  // Dummy data
                  <Table.Row>
                    <Table.Cell>01/10/2022</Table.Cell>
                    <Table.Cell>10:50 AM</Table.Cell>
                    <Table.Cell>329</Table.Cell>
                    <Table.Cell>Conference</Table.Cell>
                    <Table.Cell>HB 1596, HD1</Table.Cell>
                    <Table.Cell>Makes permanent the motor vehicle insurance requirements for transportation network companies and transportation network company drivers.</Table.Cell>
                    <Table.Cell>Conference</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Testimony</Table.Cell>
                    <Table.Cell>TRS, CPN/WAM</Table.Cell>
                    <Table.Cell>JOHANSON, KITAGAWA</Table.Cell>
                    <Table.Cell>02/23 2:00 PM</Table.Cell>
                    <Table.Cell>(S)3/11/2022-Referred to TRS, CPN/WAM.</Table.Cell>
                  </Table.Row>
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
