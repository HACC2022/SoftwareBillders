import { useState } from "react";
import {collection, doc, getDoc, setDoc} from "@firebase/firestore";
import { firestore } from "../firebase/firebaseClient";
import {Button, Form} from "semantic-ui-react";

const Organization_Form = ({ organizationDocument }) => {

  const adminUserAdd = async (documentPath: string, addAdminUser: string) => {
    const mySnapshot = await getDoc(doc(firestore, documentPath));
    if(mySnapshot.exists()) {
      let newArr = mySnapshot.data().admin;
      newArr.push(addAdminUser);
      setDoc(doc(firestore, documentPath), {admin: newArr}, {merge: true})
    }
  }

  const regularUserAdd = async (documentPath: string, addRegularUser: string) => {
    const mySnapshot = await getDoc(doc(firestore, documentPath));
    if (mySnapshot.exists()) {
      let newArr = mySnapshot.data().user;
      newArr.push(addRegularUser);
      setDoc(doc(firestore, documentPath), {user: newArr}, {merge: true})
    }
  }

  const [addAdmin, setAddAdmin] = useState('');
  const [addUser, setaddUser] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('addAdmin', addAdmin);
    console.log('addUser', addUser);
    if(addAdmin != '') {
      adminUserAdd(`Organizations/${organizationDocument.data().organizationName}-org`, addAdmin);
    }
    if(addUser != '') {
      regularUserAdd(`Organizations/${organizationDocument.data().organizationName}-org`, addUser);
    }
    setAddAdmin('');
    setaddUser('');
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Add Admin Level User</label>
          <input
            placeholder='Email'
            itemID={`add-admin-${organizationDocument.id}`}
            onChange={event => setAddAdmin(event.target.value)}
            value={addAdmin}
          />
        </Form.Field>
        <Form.Field>
          <label>Add Regular Level User</label>
          <input
            placeholder='Email'
            itemID={`add-user-${organizationDocument.id}`}
            onChange={event => setaddUser(event.target.value)}
            value={addUser}
          />
        </Form.Field>
        <Button type='submit' itemID={`submit-${organizationDocument.id}`}>Submit</Button>
      </Form>
    </div>
  )
}

export default Organization_Form;
