import { useState } from "react";
import { doc, setDoc } from "@firebase/firestore";
import { firestore } from "../firebase/firebaseClient";
import {Button, Form} from "semantic-ui-react";

const Testimony_Form = ({ testimonyDocument }) => {

  const writeTestimony = (documentPath: string, testimonyContent: string, sendTo: string) => {
    setDoc(doc(firestore, documentPath), {status: sendTo, content: testimonyContent}, {merge: true})
  }

  const [assignedPerson, setAssignedPerson] = useState('');
  const [testimonyContent, setTestimonyContent] = useState(testimonyDocument.data().content);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('assignedPerson', assignedPerson);
    console.log('testimonyContent', testimonyContent);
    writeTestimony(`draft-testimony/${testimonyDocument.data().bill}-testimony`,testimonyContent,assignedPerson);
    setAssignedPerson('');
    setTestimonyContent('');
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Assign testimony to person (email currently but can be changed)</label>
          <input
            placeholder='Email'
            itemID={`assignedPerson-${testimonyDocument.id}`}
            onChange={event => setAssignedPerson(event.target.value)}
            value={assignedPerson}
          />
        </Form.Field>
        <Form.TextArea
          label='Testimony content (any text can be put here)'
          placeholder='Please enter testimony'
          itemID={`testimony-content-${testimonyDocument.id}`}
          value={testimonyContent}
          onChange={event => setTestimonyContent(event.target.value)}
        />
        <Button type='submit' itemID={`submit-${testimonyDocument.id}`}>Submit</Button>
      </Form>
    </div>
  )
}

export default Testimony_Form;
